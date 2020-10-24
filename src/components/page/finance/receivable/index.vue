<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="receivableNum">
                <el-input v-model="queryParams.receivableNum" placeholder="应收单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
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
            <el-dropdown trigger="click" style="margin:0 10px;">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
            <el-button type="warning" size="small" icon="el-icon-edit-outline" class="handle-del mr10" :disabled="single" @click="handleCollection">收款</el-button>
        </div>
        <el-table v-loading="loading" :data="listData" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handlePreview" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="应收单号" prop="receivableNum" align="center" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="客户编码" prop="clienteleNum" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="客户名称" prop="clienteleName" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="应收金额" prop="receivePrice" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="财务日期" prop="financeTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="录入人" prop="createBy" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="录入日期" prop="createTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="状态" prop="status" align="center" width="120" :formatter="auditStatusFormatter" />
            <el-table-column label="审核人" prop="auditBy" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="审核日期" prop="auditTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="操作" width="200" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <!-- <el-button type="text" icon="el-icon-edit-outline" @click="handleCollection(scope.row)">收款</el-button> -->
                    <el-button type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDelete(scope.row)">删除</el-button>
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
import { listReceivable, deleteReceivable, submitReceivable } from '@/api/finance/receivable';
export default {
    data() {
        return {
            loading: false,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNUm: undefined,
                receivableNum: undefined,
                status: undefined
            },
            listData: [],
            pageTotal: 0,
            // 非单个禁用
            single: true,
            //非多个禁用
            multiple: true,
            ids: [],
            multipleSelection: [],
            selection: undefined
        };
    },
    created() {
        this.getList();
    },
    methods: {
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
            this.resetForm('queryParams');
            this.handleQuery();
        },
        // 多选操作
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.receivableId);
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
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQuery();
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            listReceivable(this.queryParams)
                .then(res => {
                    this.loading = false;
                    this.listData = res.data.records;
                    this.pageTotal = res.data.total;
                })
                .catch(e => {
                    this.loading = false;
                });
        },
        handleAdd(row) {
            this.$router.push({ path: '/page/finance/receivable/add' });
        },
        handleUpdate(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，不能修改');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能修改');
                return;
            }
            this.$router.push({ path: '/page/finance/receivable/edit', query: { rid: row.receivableId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/finance/receivable/preview', query: { rid: row.receivableId } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitReceivable('1', this.ids).then(res => {
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
            submitReceivable('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleAudit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            this.$router.push({ path: '/page/finance/receivable/preview', query: { rid: this.selection.receivableId, isAudit: true } });
        },
        handleCollection(row) {
            if (this.selection.status != '3') {
                this.msgError(this.selection.receivableNum + '请先审核');
                return;
            }
            this.$router.push({ path: '/page/finance/receivable/receipt', query: { rid: this.selection.receivableId } });
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
                deleteReceivable(row.receivableId).then(res => {
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
            return this.checkAuditStatus(this.multipleSelection, 'receivableNum', status, msg);
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
