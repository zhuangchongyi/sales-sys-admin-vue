<template>
    <div>
        <div class="container">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item label="仓库编码" prop="warehouseNum">
                    <el-input v-model="queryParams.warehouseNum" placeholder="请输入仓库编码" size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="mini" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
                <el-dropdown trigger="click" style="margin: 0 10px;">
                    <el-button class="el-dropdown-link" size="mini" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="mini" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
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
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="inventoryId" label="编号" align="center" />
                <el-table-column prop="warehouseNum" label="仓库编码" align="center" />
                <el-table-column prop="warehouseName" label="仓库名称" align="center" />
                <el-table-column prop="personnelName" label="盘点人" align="center" />
                <el-table-column prop="inventoryTime" label="盘点日期" align="center" />
                <el-table-column prop="remark" label="盘点说明" width="300" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="status" label="状态" :formatter="auditStatusFormatter" align="center" />
                <el-table-column prop="auditBy" label="审核人" align="center" />
                <el-table-column prop="auditTime" label="审核日期" align="center" width="160" />
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                        <!-- <el-button type="text"
                       icon="el-icon-info"
                       @click="handlePreview(scope.row)">明细</el-button> -->
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
    </div>
</template>

<script>
import { listInventory, deleteInventory, submitInventory, auditInventory } from '@/api/warehouse/inventory.js';

export default {
    name: 'warehouse-inventory', //盘点单
    data() {
        return {
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined,
                status: undefined
            },
            // 非单个禁用
            single: true,
            //非多个禁用
            multiple: true,
            listData: [],
            pageTotal: 0,
            multipleSelection: [],
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
            this.ids = selection.map(item => item.inventoryId);
            this.multipleSelection = selection;
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selection = selection[0];
        },
        selectionRowClick(row) {
            this.$refs.listData.toggleRowSelection(row);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'current', val);
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'current', val);
            this.handleQuery();
        },
        /** 查询列表 */
        getList() {
            listInventory(this.queryParams).then(res => {
                this.listData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/warehouse/inventory/add');
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
            this.$router.push({ path: '/page/warehouse/inventory/edit', query: { id: row.inventoryId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/warehouse/inventory/preview', query: { id: row.inventoryId, isAudit: false } });
        },
        handleAudit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            let inventoryId = this.selection.inventoryId;
            this.$router.push({ path: '/page/warehouse/inventory/preview', query: { id: inventoryId, isAudit: true } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitInventory('1', this.ids).then(res => {
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
            submitInventory('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('收回成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
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
            this.$confirm('请确认是否删除?', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deleteInventory(row.inventoryId).then(res => {
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
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'inventoryId', status, msg);
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
