<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="仓库编码" prop="warehouseNum">
                <el-input v-model="queryParams.warehouseNum" placeholder="请输入仓库编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="仓库名称" prop="warehouseName">
                <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="mini" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
        </div>
        <el-table v-loading="loading" @row-dblclick="handlePreview" :data="listData">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="仓库编码" :show-overflow-tooltip="true" align="center" prop="warehouseNum" />
            <el-table-column label="仓库名称" align="center" prop="warehouseName" :show-overflow-tooltip="true" />
            <el-table-column label="录入人" align="center" prop="createBy"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" style="color:#fd5656" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listInit, deleteInit } from '@/api/warehouse/init.js';
export default {
    name: 'warehouse-init',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            //仓库数据
            listData: [],
            //总条数
            total: 0,
            //表单参数
            form: {},
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                warehouseNum: undefined,
                warehouseName: undefined
            },
            // 表单校验
            rules: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            listInit(this.queryParams).then(res => {
                this.listData = res.data.records || [];
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
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单刷新
        reset() {
            this.form = {};
            this.resetForm('form');
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
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除?', '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deleteInit(row.warehouseId).then(res => {
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
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/warehouse/init/add');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$router.push({ path: '/page/warehouse/init/edit', query: { id: row.warehouseId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/warehouse/init/preview', query: { id: row.warehouseId } });
        },
        /** 提交按钮 */
        submitForm() {
            this.msgSuccess('成功');
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
