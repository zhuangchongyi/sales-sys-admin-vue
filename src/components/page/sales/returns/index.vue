<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="returnsNum">
                <el-input v-model="queryParams.returnsNum" placeholder="退货单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
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
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
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
        <el-table v-loading="loading" :data="listData" @selection-change="handleSelectionChange" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handledblclickRow">
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column prop="returnsNum" label="退货单号" align="center" width="180" />
            <!-- <el-table-column prop="warehouseNum" label="退入仓库编码" align="center" width="120" />
            <el-table-column prop="warehouseName" label="退入仓库名称" align="center" width="120" /> -->
            <el-table-column prop="clienteleNum" label="客户编号" align="center" width="120" />
            <el-table-column prop="clienteleName" label="客户名称" align="center" :show-overflow-tooltip="true" width="120" />
            <el-table-column prop="totalPrice" label="退货金额" align="center" width="120" />
            <el-table-column prop="returnsTime" label="退货日期" align="center" width="120" />
            <el-table-column prop="remark" label="退货原因" align="desc" :show-overflow-tooltip="true" width="200" />
            <el-table-column prop="status" label="状态" :formatter="auditStatusFormatter" align="center" width="120" />
            <el-table-column prop="createBy" label="录入人" align="center" width="120" />
            <el-table-column prop="createTime" label="录入时间" align="center" width="160" />
            <el-table-column prop="auditBy" label="审核人" align="center" width="120" />
            <el-table-column prop="auditTime" label="审核时间" align="center" width="160" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDelete(scope.row)">删除</el-button>
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
import { listReturns, deleteReturns, submitReturns, auditReturns } from '@/api/sales/returns.js';
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
            listData: [],
            //总条数
            total: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                returnsNum: undefined,
                status: undefined
            },
            selection: undefined,
            multipleSelection: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        getList() {
            listReturns(this.queryParams).then(res => {
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
        selectionRowClick(row) {
            this.$refs['listData'].toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.returnsId);
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
            let returnsId = row.returnsId || this.selection.returnsId;
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deleteReturns(returnsId).then(res => {
                    if (res.success) {
                        this.msgSuccess('删除成功');
                        this.handleQuery();
                    } else {
                        this.msgError(res.message);
                    }
                });
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/sales/returns/add');
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
            this.$router.push({ path: '/page/sales/returns/edit', query: { rId: row.returnsId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/sales/returns/preview', query: { rId: row.returnsId } });
        },
        handleAudit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            this.$router.push({ path: '/page/sales/returns/preview', query: { rId: this.selection.returnsId, isAudit: true } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitReturns('1', this.ids).then(res => {
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
            submitReturns('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'returnsNum', status, msg);
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
