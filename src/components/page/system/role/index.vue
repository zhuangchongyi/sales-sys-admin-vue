<template>
    <div>
        <div class="container">
            <el-form :model="queryRoleParams" ref="queryRoleParams" :inline="true">
                <el-form-item prop="roleNum">
                    <el-input v-model="queryRoleParams.roleNum" placeholder="角色编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="roleName">
                    <el-input v-model="queryRoleParams.roleName" placeholder="角色名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="status">
                    <el-select v-model="queryRoleParams.status" placeholder="状态" clearable size="small" style="width: 200px">
                        <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['system:role:add']" @click="handleAdd">新增</el-button>
            </div>
            <el-table v-loading="loading" :data="dataList" class="table" ref="dataList" header-cell-class-name="table-header" highlight-current-row>
                <el-table-column prop="roleNum" label="角色编码" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormatter"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="400">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-hasPermi="['system:role:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-circle-check" style="color:#67c23a" v-hasPermi="['system:role:permission']" @click="handleMenu(scope.row)">菜单权限</el-button>
                        <!-- <el-button type="text" icon="el-icon-circle-check" style="color:#e6a23c" @click="handleDataSource(scope.$index, scope.row)">数据权限</el-button> -->
                        <el-button type="text" icon="el-icon-s-data" style="color:#e6a23c" v-hasPermi="['system:role:user']" @click="handleLookUser(scope.row)">角色用户</el-button>
                        <el-button type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['system:role:detele']" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="queryRoleParams.current"
                    :page-size="queryRoleParams.size"
                    :total="total"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="roleOpen" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="角色编码" prop="roleNum">
                    <el-input v-model="form.roleNum" placeholder="请输入角色编码" maxlength="10" show-word-limit />
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="状态">
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
        <!-- 修改菜单权限对话框 -->
        <el-dialog :title="title" :visible.sync="menuOpen" width="500px" append-to-body>
            <el-form ref="form" v-loading="enableMenu" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="菜单权限">
                    <el-tree :data="menuOptions" show-checkbox ref="menu" node-key="id" empty-text="加载中，请稍后" :default-checked-keys="checkedKeys" :props="defaultProps"></el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormMenu">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 分配权限数据范围对话框 -->
        <el-dialog :title="title" :visible.sync="dataOpen" width="600px" append-to-body>
            <el-form :model="form" label-width="80px">
                <el-form-item label="权限范围">
                    <el-select v-model="form.dataScope">
                        <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据权限" v-show="form.dataScope == 2">
                    <el-tree :data="deptOptions" show-checkbox default-expand-all ref="dept" node-key="id" empty-text="加载中，请稍后" :props="defaultProps"></el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataScope">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 查看用户对话框 -->
        <el-dialog :title="title" :visible.sync="userOpen" width="600px" append-to-body>
            <el-table v-loading="loadingDialog" :data="roleUserListData">
                <el-table-column label="账号" align="center" prop="username" />
                <el-table-column label="用户昵称" align="center" prop="nickname" />
                <el-table-column label="员工编号" align="center" prop="userNum" />
                <el-table-column label="部门编码" align="center" prop="dept.deptNum" />
                <el-table-column label="部门" align="center" prop="dept.deptName" />
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.current" :page-size="query.size" :total="query.total" @current-change="handlePageChangeDialog">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { rolePageList, getRole, addRole, updateRole, deleteRole, roleUserList, addRoleMenu } from '@/api/system/role.js';
import { menuPermission } from '@/api/system/menu.js';
import { treeselect } from '@/api/system/dept.js';
export default {
    name: 'system-role',
    data() {
        return {
            loading: true,
            // 查询参数
            queryRoleParams: {
                current: 1,
                size: 10,
                roleName: undefined,
                roleNum: undefined,
                status: undefined
            },
            total: 0,
            dataList: [],
            form: {},
            // 表单校验
            rules: {
                roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
                roleNum: [
                    { required: true, message: '角色编码不能为空', trigger: 'blur' },
                    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
                ]
            },
            //表单参数
            title: '',
            isAdd: true,
            loadingDialog: true,
            roleOpen: false,
            menuOpen: false,
            dataOpen: false,
            userOpen: false,
            roleUserListData: undefined,
            // 非单个停用
            single: true,
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '停用' }
            ],
            // 菜单列表
            menuOptions: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            query: {
                current: 1,
                size: 10,
                roleId: undefined,
                total: 0
            },
            // 部门列表
            deptOptions: [],
            // 数据范围选项
            dataScopeOptions: [
                {
                    value: '1',
                    label: '全部数据权限'
                },
                {
                    value: '2',
                    label: '自定数据权限'
                },
                {
                    value: '3',
                    label: '本部门数据权限'
                },
                {
                    value: '4',
                    label: '本部门及以下数据权限'
                },
                {
                    value: '5',
                    label: '仅本人数据权限'
                }
            ],
            checkedKeys: [],
            enableMenu: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        statusFormatter(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 表单刷新
        reset() {
            this.form = {
                roleId: undefined,
                roleName: undefined,
                roleNum: undefined,
                status: '0',
                remark: undefined
            };
            this.loadingDialog = true;
            this.checkedKeys = [];
            this.menuOptions = [];
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryRoleParams.current = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryRoleParams');
            this.handleQuery();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryRoleParams, 'current', val);
            this.getList();
        },
        // 选择大小
        handleSizeChange(val) {
            this.$set(this.queryRoleParams, 'size', val);
            this.getList();
        },
        /** 查询角色列表 */
        getList() {
            rolePageList(this.queryRoleParams).then(res => {
                this.dataList = res.data.records;
                this.total = res.data.total || 0;
                this.loading = false;
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.isAdd = true;
            this.roleOpen = true;
            this.title = '新增角色';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            getRole(row.roleId).then(res => {
                this.form = res.data;
                this.roleOpen = true;
                this.isAdd = false;
                this.title = '修改角色';
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deleteRole(row.roleId).then(res => {
                    if (res.success) {
                        that.msgSuccess('删除成功');
                    } else {
                        that.msgError(res.message);
                    }
                    that.handleQuery();
                });
            });
        },
        // 新增修改提交
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.isAdd) {
                        addRole(this.form).then(res => {
                            if (res.success) {
                                this.msgSuccess(res.message);
                                this.roleOpen = false;
                                this.handleQuery();
                            } else {
                                this.msgError(res.message);
                            }
                        });
                    } else {
                        updateRole(this.form).then(res => {
                            if (res.success) {
                                this.msgSuccess(res.message);
                                this.roleOpen = false;
                                this.getList();
                            } else {
                                this.msgError(res.message);
                            }
                        });
                    }
                }
            });
        },
        // 取消按钮
        cancel() {
            this.roleOpen = false;
            this.menuOpen = false;
            this.dataOpen = false;
            this.reset();
        },
        // 分配菜单权限按钮
        handleMenu(row) {
            this.reset();
            menuPermission(row.roleId).then(res => {
                this.form.roleId = row.roleId;
                this.title = '分配菜单权限';
                this.menuOpen = true;
                if (res.success) {
                    this.menuOptions = res.data.menus;
                    this.checkedKeys = res.data.checkedKeys;
                }
            });
        },
        // 菜单提交按钮
        submitFormMenu() {
            this.enableMenu = true;
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRoleMenu(this.form).then(res => {
                this.enableMenu = false;
                if (res.success) {
                    this.menuOpen = false;
                    this.msgSuccess(res.message);
                } else {
                    this.msgError(res.message);
                }
            });
        },
        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        // 查看用户按钮
        handleLookUser(row) {
            this.query.roleId = row.roleId;
            this.userOpen = true;
            this.title = '查看用户';
            roleUserList(this.query).then(res => {
                this.loadingDialog = false;
                this.roleUserListData = res.data.records;
                this.query.total = res.data.total;
            });
        },
        handlePageChangeDialog(val) {
            this.$set(this.query, 'current', val);
            this.getData();
        },
        /** 查询部门树结构 */
        getDeptTreeselect() {
            treeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        handleDataSource(index, row) {
            this.title = '分配数据权限';
            this.dataOpen = true;
            this.form = row;
            this.getDeptTreeselect();
        },
        submitDataScope() {
            this.msgError('暂未开发');
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
