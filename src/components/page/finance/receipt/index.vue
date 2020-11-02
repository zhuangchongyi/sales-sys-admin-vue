<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="receiptNum">
                <el-input v-model="queryParams.receiptNum" placeholder="收款单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称或编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
            <el-dropdown trigger="click" style="margin: 0 10px;">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
        </div>
        <el-table v-loading="loading" :data="listData" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handlePreview" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="收款单号" prop="receiptNum" :show-overflow-tooltip="true" align="center" width="180" />
            <el-table-column label="客户编号" prop="clienteleNum" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="客户名称" prop="clienteleName" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="收款金额" prop="receiptPrice" :show-overflow-tooltip="true" align="center" width="100" />
            <el-table-column label="收款日期" prop="receiptTime" :show-overflow-tooltip="true" align="center" width="160" />
            <el-table-column label="状态" prop="status" :show-overflow-tooltip="true" align="center" :formatter="auditStatusFormatter" />
            <el-table-column label="已核销金额" prop="hasVerificaPrice" :show-overflow-tooltip="true" align="center" width="100" />
            <el-table-column label="未核销金额" prop="verificaPrice" :show-overflow-tooltip="true" align="center" width="100">
                <template slot-scope="scope"> {{ (parseFloat(scope.row.receiptPrice) - parseFloat(scope.row.hasVerificaPrice)).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="业务人员" prop="personnelName" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="业务部门" prop="deptName" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="录入人" prop="createBy" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="录入日期" prop="createTime" :show-overflow-tooltip="true" width="160" align="center" />
            <el-table-column label="审核人" prop="auditBy" align="center" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="审核日期" prop="auditTime" :show-overflow-tooltip="true" width="160" align="center" />
            <el-table-column label="操作" width="180" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
                    <!-- <el-button type="text" icon="el-icon-edit-outline" @click="handleVerifica(scope.row)">核销</el-button> -->
                    <el-button type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="queryParams.pageIndex"
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
import { listReceipt, deleteReceipt, submitReceipt } from '@/api/finance/receipt.js';
export default {
    name: 'finance-receipt', //应收款
    data() {
        return {
            loading: false,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                receiptNum: undefined,
                clienteleName: undefined,
                clienteleNum: undefined,
                status: undefined
            },
            pageTotal: 0,
            // 非单个禁用
            single: true,
            //非多个禁用
            multiple: true,
            listData: [],
            //表单参数
            title: '',
            open: false,
            form: {},
            // 表单校验
            rules: {
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }]
            },
            query: {
                current: 1,
                size: 10,
                total: 0,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            selection: undefined,
            ids: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            listReceipt(this.queryParams).then(res => {
                this.listData = res.data.records;
                this.pageTotal = res.data.total;
                this.loading = false;
            });
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
        // 多选操作
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.receiptId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.multipleSelection = selection;
            this.selection = selection[0];
        },
        selectionRowClick(row) {
            this.$refs.listData.toggleRowSelection(row);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'current', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQuery();
        },
        handleAdd() {
            this.$router.push('/page/finance/receipt/add');
        },
        handleUpdate(index, row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，不能修改');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能修改');
                return;
            }
            this.$router.push({ path: '/page/finance/receipt/edit', query: { rid: row.receiptId } });
        },
        handleVerifica(row) {
            this.$router.push({ path: '/page/finance/receipt/verifica', query: { rid: row.receiptId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/finance/receipt/preview', query: { rid: row.receiptId } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitReceipt('1', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                } else {
                    this.msgError(res.message);
                }
                this.handleQuery();
            });
        },
        handleNoSubmit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '已收回') || this.verifyStatus('3', '已审核，不能收回')) {
                return;
            }
            submitReceipt('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                } else {
                    this.msgError(res.message);
                }
                this.handleQuery();
            });
        },
        handleAudit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            this.$router.push({ path: '/page/finance/receipt/preview', query: { rid: this.selection.receiptId, isAudit: true } });
        },
        handleDelete(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteReceipt(row.receiptId).then(res => {
                    if (res.success) {
                        that.msgSuccess('删除成功');
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
        },

        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'receiptNum', status, msg);
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
