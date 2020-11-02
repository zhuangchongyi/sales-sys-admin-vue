<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="orderNum">
                <el-input v-model="queryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="shipmentsNum">
                <el-input v-model="queryParams.shipmentsNum" placeholder="发货单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称或编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-edit" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" :disabled="single" @click="handlePrint">打印</el-button>
        </div>
        <el-table v-loading="loading" :data="listData" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handledblclickRow" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column label="签收单号" prop="shipmentsNum" align="center" width="200" />
            <el-table-column label="发货单号" prop="shipmentsNum" align="center" width="200" />
            <el-table-column label="客户编码" prop="clienteleNum" align="center" width="120" />
            <el-table-column label="客户名称" prop="clienteleName" align="center" width="120" :show-overflow-tooltip="true" />
            <el-table-column label="签收数" prop="signNum" align="center" width="120" />
            <el-table-column label="拒收数" prop="rejectionNum" align="center" width="120" />
            <el-table-column label="拒收处理方式" prop="processMode" align="center" width="120" :formatter="processModeFormatter" />
            <el-table-column label="签收日期" prop="signbackTime" align="center" width="160" />
            <el-table-column label="签收人" prop="personnelName" align="center" width="120" />
            <el-table-column label="状态" prop="status" align="center" width="120" :formatter="auditStatusFormatter" />
            <el-table-column label="审核人" align="center" prop="auditBy" width="120" />
            <el-table-column label="审核时间" align="center" prop="auditTime" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">签收</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="queryParams.current"
                :page-size="queryParams.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { pageSignback } from '@/api/sales/signback.js';
export default {
    name: 'sales-signback',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            //用户数据
            listData: [],
            //总条数
            total: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                orderNum: undefined,
                signbackNum: undefined,
                shipmentsNum: undefined,
                clienteleNum: undefined,
                clienteleName: undefined
            },
            multipleSelection: [],
            selection: undefined,
            processModeOptions: [
                { dictValue: '0', dictLabel: '报废' },
                { dictValue: '1', dictLabel: '退回' },
                { dictValue: '2', dictLabel: '赠送' },
                { dictValue: '3', dictLabel: '无' }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.queryParams.clienteleNum = this.queryParams.clienteleName;
            pageSignback(this.queryParams).then(res => {
                this.listData = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'current', val);
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.signbackId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.multipleSelection = selection;
            this.selection = selection[0];
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryParams');
            this.handleQuery();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            if (row.signbackStatus !== '1') {
                this.$router.push({ path: '/page/sales/signBack/edit', query: { signId: row.signbackId } });
            } else {
                this.msgError('已签收');
            }
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/sales/signBack/preview', query: { signId: row.signbackId } });
        },
        handleAudit() {
            if (this.selection.signbackStatus == '1') {
                this.$router.push({ path: '/page/sales/signBack/preview', query: { signId: this.selection.signbackId, isAudit: true } });
            } else {
                this.msgError('请签收');
            }
        },
        handlePrint() {
            this.msgSuccess('打印成功');
        },
        selectionRowClick(row) {
            this.$refs.listData.clearSelection();
            this.$refs.listData.toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },
        processModeFormatter(row) {
            return this.selectDictLabel(this.processModeOptions, row.processMode);
        },
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'shipmentsNum', status, msg);
        }
    }
};
</script>

<style scoped>
.el-table--mini,
.el-table--small,
.el-table__expand-icon {
    font-size: 14px;
}
.el-form .el-form-item__label {
    font-weight: bold;
}

.handle-box {
    margin-bottom: 8px;
}

.table {
    width: 100%;
    font-size: 14px;
}
</style>
