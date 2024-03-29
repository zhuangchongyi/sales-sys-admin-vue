<template>
    <div>
        <div class="container">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item prop="warehouseNum">
                    <el-input v-model="queryParams.warehouseNum" placeholder="仓库编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="warehouseName">
                    <el-input v-model="queryParams.warehouseName" placeholder="仓库名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd" v-hasPermi="['warehouse:otherOutbound:add']">新增</el-button>
                <el-dropdown trigger="click" style="margin: 0 10px;" v-hasPermi="['warehouse:otherOutbound:submit']">
                    <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit" v-hasPermi="['warehouse:otherOutbound:audit']"
                    >审核</el-button
                >
            </div>
            <el-table
                :data="listData"
                class="table"
                ref="listData"
                @row-click="selectionRowClick"
                highlight-current-row
                @row-dblclick="handlePreview"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="storageId" label="编号" width="120" align="center" />
                <el-table-column prop="warehouseNum" label="仓库编码" width="120" align="center"></el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="outboundType" label="出库类型" :formatter="sourceTypeFormatter" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="auditStatusFormatter" align="center"></el-table-column>
                <el-table-column prop="outboundTime" label="出库日期" align="center"></el-table-column>
                <el-table-column prop="personnelName" label="出库负责人" align="center"></el-table-column>
                <el-table-column prop="auditName" label="审核人" align="center" />
                <el-table-column prop="auditTime" label="审核日期" align="center" width="160" />
                <el-table-column prop="createBy" label="录入人" align="center" />
                <el-table-column prop="createTime" label="录入日期" align="center" width="160" />
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['warehouse:otherOutbound:edit']">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDalete(scope.row)" v-hasPermi="['warehouse:otherOutbound:delete']">删除</el-button>
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
    </div>
</template>

<script>
import { listStorage, deleteStorage, submitStorage } from '@/api/warehouse/storage.js';
export default {
    name: 'warehouse-materialStorage', //商品出库
    data() {
        return {
            // 非单个禁用
            single: true,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined,
                inoutType: '1'
            },
            pageTotal: 0,
            listData: [],
            selection: undefined,
            multipleSelection: [],
            sourceOptions: [
                { dictValue: '0', dictLabel: '报废' },
                { dictValue: '1', dictLabel: '退回' },
                { dictValue: '2', dictLabel: '赠送' },
                { dictValue: '3', dictLabel: '其他' }
            ],
            ids: []
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
        sourceTypeFormatter(row) {
            return this.selectDictLabel(this.sourceOptions, row.sourceType);
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
            this.$refs.listData.toggleRowSelection(row);
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.storageId);
            this.single = selection.length != 1;
            this.selection = selection[0];
            this.multipleSelection = selection;
        },
        /** 查询列表 */
        getList() {
            listStorage(this.queryParams).then(res => {
                this.listData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        handleAdd() {
            this.$router.push('/page/warehouse/otherOutbound/add');
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
            this.$router.push({ path: '/page/warehouse/otherOutbound/edit', query: { id: row.storageId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/warehouse/otherOutbound/preview', query: { id: row.storageId } });
        },
        handleAudit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            this.$router.push({ path: '/page/warehouse/otherOutbound/preview', query: { id: this.selection.storageId, isAudit: true } });
        },
        /** 删除按钮操作 */
        handleDalete(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let that = this;
            this.$confirm('请确认是否删除?', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deleteStorage(row.storageId).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
                            that.getList();
                        } else {
                            this.msgError(res.message);
                        }
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitStorage('1', this.ids).then(res => {
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
            submitStorage('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('收回成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'storageId', status, msg);
        }
    }
};
</script>

<style scoped>
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
