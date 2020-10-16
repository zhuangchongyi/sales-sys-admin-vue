<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="shipmentsNum">
                <el-input v-model="queryParams.shipmentsNum" placeholder="发货单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="orderNum">
                <el-input v-model="queryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="客户编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['sales:shipments:add']" @click="handleAdd">新增</el-button>
            <el-dropdown trigger="click" style="margin: 0 10px;">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-edit" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" @click="handlePrint" :disabled="single">打印</el-button>
        </div>
        <el-table v-loading="loading" :data="listData" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handledblclickRow" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column prop="shipmentsNum" label="发货单号" align="center" width="180" :show-overflow-tooltip="true" />
            <el-table-column prop="shipmentsTime" label="发货日期" align="center" width="150" :show-overflow-tooltip="true" />
            <el-table-column prop="shipmentsStatus" label="发货状态" :formatter="shipmentsStatusFormatter" align="center" width="150" />
            <el-table-column label="客户编码" align="center" prop="clienteleNum" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" width="150" />
            <el-table-column prop="orderNum" label="客户订单号" align="center" width="180" :show-overflow-tooltip="true" />
            <el-table-column prop="status" label="审核状态" :formatter="auditStatusFormatter" align="center" width="150" />
            <el-table-column prop="personnelName" label="发货负责人" align="center" width="150" :show-overflow-tooltip="true" />
            <el-table-column prop="createBy" label="录单人" align="center" width="150" :show-overflow-tooltip="true" />
            <el-table-column prop="createTime" label="录单时间" align="center" width="180" :show-overflow-tooltip="true" />
            <el-table-column label="审核人" align="center" prop="auditBy" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="审核时间" align="center" prop="auditTime" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['sales:shipments:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-info" v-hasPermi="['sales:shipments:preview']" @click="handlePreview(scope.row)">明细</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['sales:shipments:delete']" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="queryParams.current"
                :page-size="queryParams.size"
                :total="pageTotal"
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { listShipments, deleteShipments, submitShipments } from '@/api/sales/shipments.js';
export default {
    name: 'sales-shipments',
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
            //列表数据
            listData: [],
            //总条数
            pageTotal: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                orderNum: undefined,
                status: undefined
            },
            selection: undefined,
            multipleSelection: [],
            shipmentsStatusOptions: [
                { dictValue: '0', dictLabel: '未发货' },
                { dictValue: '1', dictLabel: '已发货' }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        shipmentsStatusFormatter(row) {
            return this.selectDictLabel(this.shipmentsStatusOptions, row.shipmentsStatus);
        },
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        getList() {
            listShipments(this.queryParams)
                .then(res => {
                    this.listData = res.data.records;
                    this.pageTotal = res.data.tatol;
                    this.loading = false;
                })
                .catch(e => {
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
            this.ids = selection.map(item => item.shipmentsId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.multipleSelection = selection;
            this.selection = selection[0];
        },
        selectionRowClick(row) {
            this.$refs['listData'].toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },
        handlePrint() {
            if (this.verifyStatus('7', '已关闭') || !this.verifyStatus('3') || !this.verifyStatus('5')) {
                this.message('请先审核');
                return;
            }
            this.msgSuccess('打印成功');
        },
        handleDelete(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let shipmentsId = row.shipmentsId || this.selection.shipmentsId;
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deleteShipments(shipmentsId).then(res => {
                    if (res.success) {
                        that.msgSuccess('删除成功');
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/sales/shipments/add');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，不能修改');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能修改');
                return;
            }
            this.$router.push({ path: '/page/sales/shipments/edit', query: { id: row.shipmentsId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/sales/shipments/preview', query: { id: row.shipmentsId } });
        },
        handleAudit(row) {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            let shipmentsId = this.selection.shipmentsId;
            this.$router.push({ path: '/page/sales/shipments/preview', query: { id: shipmentsId, isAudit: true } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitShipments('1', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleNoSubmit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '已收回') || this.verifyStatus('3', '已审核，不能收回')) {
                return;
            }
            submitShipments('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
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
