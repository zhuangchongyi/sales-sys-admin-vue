<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="客户编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
        </div>
        <el-table v-loading="loading" :data="financeListData" @selection-change="handleSelectionChange" highlight-current-row @row-dblclick="handlePreview">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="客户编码" align="center" prop="clienteleNum" />
            <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
            <el-table-column label="应收金额" align="center" prop="receivePrice" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="创建人" align="center" prop="createBy" />
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
import { listFinanceInit, deleteFinanceInit } from '@/api/finance/financeInit.js';

export default {
    name: 'finance-accountInit',
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
            financeListData: [],
            //总条数
            pageTotal: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                status: undefined
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            listFinanceInit(this.queryParams).then(res => {
                this.loading = false;
                if (res.success) {
                    this.pageTotal = res.data.total;
                    this.financeListData = res.data.records;
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'current', val);
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.getList();
        },
        handleSelectionChange(selection) {
            console.log(selection);
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryParams');
            this.handleQuery();
        },
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFinanceInit(row.initId).then(res => {
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
            this.$router.push('/page/finance/init/add');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            if (parseFloat(row.hasVerificaPrice) > parseFloat(0)) {
            }
            this.$router.push({ path: '/page/finance/init/edit', query: { iid: row.initId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/finance/init/preview', query: { iid: row.initId } });
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
