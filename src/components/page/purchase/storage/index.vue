<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="signNum">
                <el-input v-model="queryParams.signNum" placeholder="到货单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="orderNum">
                <el-input v-model="queryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="supplierNum">
                <el-input v-model="queryParams.supplierNum" placeholder="供应商编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="supplierName">
                <el-input v-model="queryParams.supplierName" placeholder="供应商名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit" v-hasPermi="['purchase:sign:audit']">审核</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" @click="handlePrint" :disabled="single" v-hasPermi="['purchase:sign:print']">打印</el-button> -->
        </div>
        <el-table
            v-loading="loading"
            :data="orderListData"
            ref="orderListData"
            @row-click="selectionRowClick"
            highlight-current-row
            @row-dblclick="handledblclickRow"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column label="入库仓库编码" align="center" prop="warehouseNum" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="入库仓库名称" align="center" prop="warehouseName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="入库日期" align="center" prop="storageTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="入库状态" prop="storageStatus" :formatter="storageStatusFormatter" align="center" width="100" />
            <el-table-column label="到货单号" align="center" prop="signNum" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="到货日期" align="center" prop="signTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="审核状态" prop="auditStatus" :formatter="auditStatusFormatter" align="center" width="100" />
            <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="供应商编号" align="center" prop="supplierNum" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="供应商名称" align="center" prop="supplierName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="联系人" align="center" prop="leader" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="联系人电话" align="center" prop="phone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="手机" align="center" prop="mobilephone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="录入人" prop="createBy" :show-overflow-tooltip="true" align="center" width="120" />
            <el-table-column label="录入时间" prop="createTime" :show-overflow-tooltip="true" align="center" width="160" />
            <el-table-column label="审核人" align="center" prop="auditBy" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="auditTime" width="160" />
            <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['purchase:sign:edit']" @click="handleUpdate(scope.row)">入库</el-button>
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
import { listPurchaseStorage } from '@/api/purchase/sign.js';
export default {
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            //用户数据
            orderListData: [],
            //表单参数
            form: {},
            // 状态数据字典
            statusOptions: [],
            selection: undefined,
            multipleSelection: [],
            //总条数
            total: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                orderNum: undefined,
                supplierNum: undefined,
                supplierName: undefined,
                status: undefined
            },
            storageStatusOptions: [
                { dictValue: '0', dictLabel: '未入库' },
                { dictValue: '1', dictLabel: '已入库' }
            ]
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    methods: {
        storageStatusFormatter(row) {
            return this.selectDictLabel(this.storageStatusOptions, row.storageStatus);
        },
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.auditStatus);
        },
        getList() {
            listPurchaseStorage(this.queryParams).then(res => {
                if (res.success) {
                    this.orderListData = res.data.records;
                    this.total = res.data.total;
                }
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
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
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selection = selection[0];
            this.multipleSelection = selection;
        },
        selectionRowClick(row) {
            this.$refs.orderListData.clearSelection();
            this.$refs.orderListData.toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },

        // 校验状态
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'signNum', status, msg);
        },
        // 打印
        handlePrint() {
            if (this.verifyStatus('7', '已关闭')) return;
            if (!this.verifyStatus('3') && !this.verifyStatus('5')) {
                this.msgError('请先审核');
                return;
            }
            this.msgSuccess('打印成功');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            if (row.auditStatus === '3') {
                this.msgError('已审核不允许修改');
                return;
            }
            this.$router.push({ path: '/page/purchase/storage/edit', query: { id: row.signId } });
        },
        /** 明细按钮操作 */
        handlePreview(row) {
            this.$router.push({ path: '/page/purchase/storage/preview', query: { id: row.signId, isShow: false } });
        },
        handleAudit() {
            if (this.selection.storageStatus === 0) {
                this.msgError('请先入库');
                return;
            }
            this.$router.push({ path: '/page/purchase/storage/preview', query: { id: this.selection.signId, isShow: false, isAudit: true } });
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
