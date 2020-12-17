<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="returnsNum">
                <el-input v-model="queryParams.returnsNum" placeholder="退货单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
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
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['purchase:returns:add']" @click="handleAdd">新增</el-button>
            <el-dropdown trigger="click" style="margin: 0 10px;" v-hasPermi="['purchase:returns:submit']">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit" v-hasPermi="['purchase:returns:audit']">审核</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" @click="handlePrint" :disabled="single" v-hasPermi="['purchase:returns:print']">打印</el-button> -->
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
            <el-table-column label="退货单号" align="center" prop="returnsNum" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="退货日期" align="center" prop="returnsTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="状态" prop="status" :formatter="auditStatusFormatter" align="center" width="100" />
            <el-table-column label="供应商编号" align="center" prop="supplierNum" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="供应商名称" align="center" prop="supplierName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="联系人" align="center" prop="leader" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="联系人电话" align="center" prop="phone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="手机" align="center" prop="mobilephone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="录入人" prop="createBy" :show-overflow-tooltip="true" align="center" width="120" />
            <el-table-column label="录入时间" prop="createTime" :show-overflow-tooltip="true" align="center" width="160" />
            <el-table-column label="审核人" align="center" prop="auditBy" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="auditTime" width="160" />
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['purchase:returns:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['purchase:returns:delete']" @click="handleDelete(scope.row)">删除</el-button>
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
import { listPurchaseReturns, deletePurchaseReturns, submitPurchaseReturns } from '@/api/purchase/returns.js';
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
                returnsNum: undefined,
                orderNum: undefined,
                supplierNum: undefined,
                supplierName: undefined,
                status: undefined
            }
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    methods: {
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        getList() {
            listPurchaseReturns(this.queryParams).then(res => {
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
            this.ids = selection.map(item => item.returnsId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selection = selection[0];
            this.multipleSelection = selection;
        },
        selectionRowClick(row) {
            this.$refs['orderListData'].toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },

        // 校验状态
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'returnsNum', status, msg);
        },
        /** 提交按钮 */
        handleSubmit() {
            if (this.verifyStatus('7', '已提交') || this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            let data = {
                status: '1',
                ids: this.ids
            };
            submitPurchaseReturns(data).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        // 收回按钮
        handleNoSubmit() {
            if (this.verifyStatus('7', '已提交') || this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '已收回') || this.verifyStatus('3', '已审核')) {
                return;
            }
            let data = {
                status: '2',
                ids: this.ids
            };
            submitPurchaseReturns(data).then(res => {
                if (res.success) {
                    this.msgSuccess('收回成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/purchase/returns/add');
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
        // 删除按钮
        handleDelete(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let that = this;
            let returnsId = row.returnsId;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deletePurchaseReturns(returnsId).then(res => {
                    if (res.success) {
                        that.msgSuccess(res.message);
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            let status = parseInt(row.status || 0);
            if (status == 1 || status > 2) {
                this.msgError('已提交不允许修改');
                return;
            }
            this.$router.push({ path: '/page/purchase/returns/edit', query: { id: row.returnsId } });
        },
        /** 明细按钮操作 */
        handlePreview(row) {
            this.$router.push({ path: '/page/purchase/returns/preview', query: { id: row.returnsId, isShow: false } });
        },
        handleAudit() {
            if (this.verifyStatus('7', '已关闭')) return;
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            this.$router.push({ path: '/page/purchase/returns/preview', query: { id: this.selection.returnsId, isShow: false, isAudit: true } });
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
