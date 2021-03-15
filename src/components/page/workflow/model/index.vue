<template>
    <div>
        <div class="container">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item prop="warehouseNum">
                    <el-input v-model="queryParams.warehouseNum" placeholder="模型编号" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="warehouseName">
                    <el-input v-model="queryParams.warehouseName" placeholder="模型名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" @click="handleUpdate">新增</el-button>
            </div>
            <el-table v-loading="loading" :data="warehouseListData" class="table" ref="warehouseListData" header-cell-class-name="table-header">
                <el-table-column prop="warehouseNum" label="模型编号" align="center"></el-table-column>
                <el-table-column prop="warehouseName" label="模型名称" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="修改人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
                        <!-- <el-button type="text" @click="handleCopy(scope.row)">复制</el-button> -->
                        <el-button type="text" @click="handleDesign(scope.row)">设计</el-button>
                        <!-- <el-button type="text" @click="handleUpdate(scope.row)">部署</el-button>
                        <el-button type="text" @click="handleUpdate(scope.row)">代码</el-button>
                        <el-button type="text" @click="handleUpdate(scope.row)">上传</el-button>
                        <el-button type="text" @click="handleUpdate(scope.row)">下载</el-button> -->
                        <el-button type="text" style="color:#fd5656" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total,sizes, prev, pager, next"
                    :current-page="queryParams.current"
                    :page-size="queryParams.size"
                    :total="total"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增或修改对话框 -->
        <edit ref="edit" @fetch-data="resetQuery"></edit>
        <design ref="design"></design>
    </div>
</template>

<script>
import { warehouseListPage, getWarehouse, deleteWarehouse } from '@/api/basis/warehouse.js';
import Edit from './components/edit';
import Design from './components/design';
export default {
    name: 'workflow-model',
    components: { Edit, Design },
    data() {
        return {
            loading: true,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined,
                status: undefined
            },
            total: 0,
            warehouseListData: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 重置按钮操作 */
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
        /** 查询仓库列表 */
        getList() {
            warehouseListPage(this.queryParams).then(res => {
                this.warehouseListData = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log('row', row);
            if (row.warehouseId) {
                this.$refs.edit.open(row);
            } else {
                this.$refs.edit.open();
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return true;
            });
        },
        /** 复制按钮操作 */
        handleCopy(row) {
            console.log('row', row);
            this.msgSuccess('复制成功');
        },
        /** 设计按钮操作 */
        handleDesign(row) {
            console.log('row', row);
            this.$refs.design.open(row);
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
