<template>
    <div class="container">
        <!--供应商数据-->
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="供应商编码" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="供应商名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['purchase:supplier:add']" @click="handleAdd">新增</el-button>
        </div>
        <el-table v-loading="loading" :data="clienteleListData">
            <el-table-column label="供应商编码" align="center" prop="clienteleNum" width="150" />
            <el-table-column label="供应商名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="联系人" align="center" prop="leader" width="150"></el-table-column>
            <el-table-column label="联系电话" align="center" prop="phone" width="150"></el-table-column>
            <el-table-column label="手机号码" align="center" prop="mobilephone" width="150"></el-table-column>
            <el-table-column label="邮箱" align="center" prop="email" width="150"></el-table-column>
            <el-table-column label="地址" prop="address" align="center" width="300"></el-table-column>
            <el-table-column label="状态" prop="status" :formatter="statusFormatter" width="150" align="center"> </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="160"></el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" width="160"></el-table-column>
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['purchase:supplier:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" style="color:#fd5656" v-hasPermi="['purchase:supplier:delete']" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next"
                :current-page="queryParams.pageNum"
                :page-size="queryParams.pageSize"
                :total="total"
                :page-sizes="[10, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 新增或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="auto">
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="归属类别" prop="categoryId">
                            <treeselect v-model="form.categoryId" :options="categoryOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属供应商类别" />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商编码" prop="clienteleNum">
                            <el-input v-model="form.clienteleNum" placeholder="请输入供应商编码" maxlength="10" show-word-limit :readonly="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商名称" prop="clienteleName">
                            <el-input v-model="form.clienteleName" placeholder="请输入供应商名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="leader">
                            <el-input v-model="form.leader" placeholder="请输入联系人" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="20" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="mobilephone">
                            <el-input v-model="form.mobilephone" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入地址" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否启用" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listClientele, addClientele, updateClientele, deleteClientele, getClientele } from '@/api/basis/clientele.js';
import { treeselect } from '@/api/basis/category.js';
import { userListDialog } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                clienteleNum: undefined,
                clienteleName: undefined,
                status: undefined,
                categoryId: undefined
            },
            //总条数
            total: 0,
            // 弹窗标题
            title: '',
            clienteleListData: [],
            // 是否显示弹出层
            open: false,
            isEdit: false,
            // 供应商类别树选项
            categoryOptions: [],
            // 供应商类别名称
            categoryName: undefined,
            categoryId: undefined,
            //表单参数
            form: {
                clienteleId: undefined,
                clienteleName: undefined,
                clienteleNum: undefined,
                categoryId: undefined,
                userId: undefined,
                status: '0',
                remark: undefined
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '停用' }
            ],
            // 表单校验
            rules: {
                status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                categoryId: [{ required: true, message: '请选择供应商类别', trigger: 'blur' }],
                corporationTime: [{ required: true, message: '请选择合作时间', trigger: 'blur' }],
                email: [
                    {
                        type: 'email',
                        message: "'请输入正确的邮箱地址",
                        trigger: ['blur', 'change']
                    }
                ],
                mobilephone: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {
        this.getList();
    },
    watch: {
        // 根据名称筛选部门树
        categoryName(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        // 启用状态类型
        statusFormatter(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 查询供应商列表
        getList() {
            this.getTreeselect();
            listClientele(this.queryParams).then(res => {
                this.clienteleListData = res.data.records;
                this.total = res.data.total || 0;
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
            this.getList();
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect({ category: '1' }).then(res => {
                this.categoryOptions = res.data;
            });
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.categoryId = data.id;
            this.categoryId = data.id;
            this.getList();
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
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
        // 取消按钮
        cancel() {
            this.open = false;
            this.materielOpen = false;
        },
        // 表单刷新
        reset() {
            this.form = {
                clienteleId: undefined,
                clienteleName: undefined,
                clienteleNum: undefined,
                categoryId: undefined,
                userId: undefined,
                status: '0',
                remark: undefined
            };

            this.resetForm('form');
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.form.categoryId = this.categoryId;
            this.open = true;
            this.isEdit = false;
            this.title = '新增供应商';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getClientele(row.clienteleId).then(res => {
                this.form = res.data;
                this.open = true;
                this.isEdit = true;
                this.title = '修改供应商';
            });
        },
        // 删除供应商
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return deleteClientele(row.clienteleId).then(res => that.callbackFun(res));
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.clienteleId != undefined) {
                        updateClientele(this.form).then(res => this.callbackFun(res));
                    } else {
                        addClientele(this.form).then(res => this.callbackFun(res));
                    }
                }
            });
        },
        callbackFun(res) {
            if (res.success) {
                this.msgSuccess(res.message);
                this.handleQuery();
                this.open = false;
            } else {
                this.msgError(res.message);
            }
            return true;
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
