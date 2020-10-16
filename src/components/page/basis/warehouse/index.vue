<template>
    <div>
        <div class="container">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item label="" prop="warehouseNum">
                    <el-input v-model="queryParams.warehouseNum" placeholder="仓库编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="" prop="warehouseName">
                    <el-input v-model="queryParams.warehouseName" placeholder="仓库名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="" prop="status">
                    <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 200px">
                        <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['basis:warehouse:add']" @click="handleAdd">新增</el-button>
            </div>
            <el-table v-loading="loading" :data="warehouseListData" class="table" ref="warehouseListData" header-cell-class-name="table-header">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="warehouseNum" label="仓库编码" align="center"></el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="dept.deptName" label="归属部门" align="center"></el-table-column>
                <el-table-column label="状态" prop="status" :formatter="statusFormatter" align="center"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-hasPermi="['basis:warehouse:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['basis:warehouse:delete']" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <!-- 新增或修改仓库配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="仓库编码" prop="warehouseNum">
                    <el-input v-model="form.warehouseNum" placeholder="请输入仓库编码" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
                </el-form-item>
                <el-form-item label="归属部门" prop="deptId">
                    <treeselect v-model="form.deptId" :options="deptOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属部门" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { warehouseListPage, getWarehouse, addWarehouse, updateWarehouse, deleteWarehouse } from '@/api/basis/warehouse.js';
import { treeselect } from '@/api/system/dept.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'basis-warehouse',
    components: { Treeselect },
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
            warehouseListData: [],
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '停用' }
            ],
            //归属部门
            deptOptions: undefined,
            //表单参数
            title: '',
            open: false,
            form: {},
            // 表单校验
            rules: {
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                warehouseNum: [
                    { required: true, message: '仓库编码不能为空', trigger: 'blur' },
                    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 启用状态
        statusFormatter(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 表单刷新
        reset() {
            this.form = {
                warehouseId: undefined,
                warehouseName: undefined,
                warehouseNum: undefined,
                status: '0',
                deptId: undefined,
                remark: undefined
            };
            this.resetForm('form');
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
        /** 查询仓库列表 */
        getList() {
            warehouseListPage(this.queryParams).then(res => {
                this.warehouseListData = res.data.records;
                this.total = res.data.total || 0;
                this.loading = false;
            });
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '新增仓库';
            this.getTreeselect();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getWarehouse(row.warehouseId).then(res => {
                this.form = res.data;
                this.open = true;
                this.title = '修改仓库';
            });
        },
        /** 删除按钮操作 */
        handleDelete() {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return deleteWarehouse(row.warehouseId).then(res => that.callbackFun(res));
            });
        },
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.warehouseId == undefined) {
                        addWarehouse(this.form).then(res => this.callbackFun(res));
                    } else {
                        updateWarehouse(this.form).then(res => this.callbackFun(res));
                    }
                }
            });
        },
        callbackFun(res) {
            if (res.success) {
                this.msgSuccess(res.message);
                this.open = false;
            } else {
                this.msgError(res.message);
            }
            this.getList();
            return true;
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
