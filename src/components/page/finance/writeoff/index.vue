<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="客户编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">核销</el-button>
        </div>
        <el-table v-loading="loading" :data="listData" ref="listData" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handlePreview" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="客户编码" prop="clienteleNum" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="客户名称" prop="clienteleName" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="核销金额" prop="writeoffPrice" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="核销状态" prop="writeoffStatus" align="center" :formatter="writeoffStatusFormatter" />
            <el-table-column label="核销日期" prop="writeoffTime" align="center" :formatter="auditStatusFormatter" />
            <el-table-column label="录入人" prop="createBy" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="录入日期" prop="createTime" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="100" fixed="right" align="center">
                <template slot-scope="scope">
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
import { listWriteoff, deleteWriteoff } from '@/api/finance/writeoff';
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
            selection: undefined,
            writeoffStatusOptions: [
                { dictValue: '0', dictLabel: '未核销' },
                { dictValue: '1', dictLabel: '已核销' }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        writeoffStatusFormatter(row, column) {
            return this.selectDictLabel(this.writeoffStatusOptions, row.writeoffStatus);
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
            this.resetForm('queryParams');
            this.handleQuery();
        },
        // 多选操作
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.writeoffId);
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
            listWriteoff(this.queryParams)
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
            this.$router.push({ path: '/page/finance/writeoff/add' });
        },
        handleUpdate(row) {
            this.$router.push({ path: '/page/finance/writeoff/edit', query: { wId: row.writeoffId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/finance/writeoff/preview', query: { wId: row.writeoffId } });
        },
        handleAudit() {
            if (this.selection.writeoffStatus === '1') {
                this.msgError('已核销');
                return;
            }
            this.$router.push({ path: '/page/finance/writeoff/preview', query: { wId: this.selection.writeoffId, isAudit: true } });
        },
        handleDelete(row) {
            if (row.writeoffStatus === '1') {
                this.msgError('已核销');
                return;
            }
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteWriteoff(row.writeoffId).then(res => {
                    if (res.success) {
                        that.msgSuccess('删除成功');
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
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
