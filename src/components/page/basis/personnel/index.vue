<template>
    <div class="container">
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <div class="head-container">
                    <el-input v-model="deptName" placeholder="部门名称筛选" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                </div>
                <div class="head-container">
                    <el-tree
                        :data="deptOptions"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        default-expand-all
                        :highlight-current="true"
                        @node-click="handleNodeClick"
                    />
                </div>
            </el-col>
            <!--员工数据-->
            <el-col :span="20" :xs="24">
                <el-form :model="queryParams" ref="queryParams" :inline="true">
                    <el-form-item label="" prop="userNum">
                        <el-input v-model="queryParams.userNum" placeholder="员工编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="nickname">
                        <el-input v-model="queryParams.nickname" placeholder="员工名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="jobStatus">
                        <el-select v-model="queryParams.jobStatus" placeholder="工作状态" clearable size="small" style="width: 200px">
                            <el-option v-for="dict in jobStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="系统用户"
                        prop="isUser">
            <el-select v-model="queryParams.isUser"
                       placeholder="是否为系统用户"
                       clearable
                       size="small"
                       style="width: 140px">
              <el-option v-for="dict in userTypeOptions"
                         :key="dict.dictValue"
                         :label="dict.dictLabel"
                         :value="dict.dictValue" />
            </el-select>
          </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
                    </el-form-item>
                </el-form>
                <div class="handle-box">
                    <el-button type="primary" size="mini" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['basis:personnel:add']" @click="handleAdd">新增</el-button>
                </div>
                <el-table v-loading="loading" :data="userListData">
                    <el-table-column type="index" width="50" fixed="left" align="center" />
                    <el-table-column label="员工编码" align="center" prop="userNum" width="160" :show-overflow-tooltip="true" />
                    <el-table-column label="员工名称" align="center" prop="nickname" width="160" :show-overflow-tooltip="true" />
                    <el-table-column label="部门名称" align="center" prop="dept.deptName" width="160" :show-overflow-tooltip="true" />
                    <el-table-column label="性别" align="center" prop="gender" width="160" :formatter="genderFormatter" :show-overflow-tooltip="true" />
                    <el-table-column label="出生日期" align="center" prop="birthday" width="160" :show-overflow-tooltip="true" />
                    <el-table-column label="手机号码" align="center" prop="phone" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="邮箱" align="center" prop="email" width="120" :show-overflow-tooltip="true" />
                    <el-table-column label="身份证号码" align="center" prop="identityNo" width="120" :show-overflow-tooltip="true" />
                    <el-table-column label="现住址" align="center" prop="nowAddress" width="200" :show-overflow-tooltip="true" />
                    <el-table-column label="家庭地址" align="center" prop="homeAddress" width="200" :show-overflow-tooltip="true" />
                    <el-table-column label="在职状态" prop="jobStatus" align="center" :formatter="jobStatusFormatter" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column label="系统用户" prop="userType" align="center" :formatter="userTypeFormatter" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column label="入职时间" align="center" prop="entryTime" width="160"></el-table-column>
                    <el-table-column label="离职时间" align="center" prop="resignationTime" width="160"></el-table-column>
                    <el-table-column label="创建人" align="center" width="160" prop="createBy"></el-table-column>
                    <el-table-column label="创建日期" align="center" width="160" prop="createTime"></el-table-column>
                    <el-table-column label="操作" align="center" width="180" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['basis:personnel:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                style="color:#fd5656"
                                v-if="scope.row.userId != 1"
                                v-hasPermi="['basis:personnel:delete']"
                                @click="handleDelete(scope.row)"
                                >删除</el-button
                            >
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
            </el-col>
        </el-row>

        <!-- 新增或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="归属部门" prop="deptId">
                            <treeselect v-model="form.deptId" :options="deptOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属部门" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="系统用户" prop="userType">
                            <el-radio-group v-model="form.userType">
                                <el-radio v-for="dict in userTypeOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录账号" v-show="form.userType == 1" prop="username">
                            <el-input v-model="form.username" placeholder="请输入登录账号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="员工编码" prop="userNum">
                            <el-input v-model="form.userNum" placeholder="请输入员工编码" maxlength="10" show-word-limit :readonly="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="员工名称" prop="nickname">
                            <el-input v-model="form.nickname" placeholder="请输入员工名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号码" prop="identityNo">
                            <el-input v-model="form.identityNo" placeholder="请输入身份证号码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-select v-model="form.gender" clearable placeholder="请选择性别">
                                <el-option v-for="dict in genderOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入职时间" prop="entryTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.entryTime" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作状态" prop="jobStatus">
                            <el-radio-group v-model="form.jobStatus">
                                <el-radio v-for="dict in jobStatusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="离职日期" v-if="form.jobStatus == 1" prop="resignationTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.resignationTime" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="现住址" prop="nowAddress">
                            <el-input v-model="form.nowAddress" placeholder="请输入现住址" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input v-model="form.homeAddress" placeholder="请输入家庭住址" />
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
import { userListPage, getUser, addUser, updateUser, deleteUser } from '@/api/system/user.js';
import { treeselect } from '@/api/system/dept.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'basis-personnel',
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            isEdit: true,
            // 弹窗标题
            title: '',
            // 选中数组
            ids: [],
            // 非单个停用
            single: true,
            // 非多个停用
            multiple: true,
            //员工数据
            userListData: [],
            //总条数
            total: 0,
            // 部门树选项
            deptOptions: [],
            //角色选项框
            roleOptions: [],
            //岗位选项框
            postOptions: [],
            // 部门名称
            deptName: undefined,
            deptId: undefined,
            //表单参数
            form: {},
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 在职状态数据字典
            jobStatusOptions: [
                { dictValue: '0', dictLabel: '在职' },
                { dictValue: '1', dictLabel: '离职' }
            ],
            //是否为系统员工
            userTypeOptions: [
                { dictValue: '0', dictLabel: '否' },
                { dictValue: '1', dictLabel: '是' }
            ],
            //性别选项框
            genderOptions: [
                { dictValue: '0', dictLabel: '男' },
                { dictValue: '1', dictLabel: '女' }
            ],
            // 查询参数
            queryParams: {
                userNum: undefined,
                nickname: undefined,
                jobStatus: undefined,
                deptId: undefined,
                pageNum: 1,
                pageSize: 10
            },
            // 表单校验
            rules: {
                userNum: [
                    { required: true, message: '员工编码不能为空', trigger: 'blur' },
                    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '员工名称不能为空', trigger: 'blur' },
                    { max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
                ],
                deptId: [{ required: true, message: '归属部门不能为空', trigger: 'blur' }],
                entryTime: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
                jobStatus: [{ required: true, message: '在职状态不能为空', trigger: 'blur' }],
                userType: [{ required: true, message: '系统用户不能为空', trigger: 'blur' }],
                email: [
                    {
                        type: 'email',
                        message: "'请输入正确的邮箱地址",
                        trigger: ['blur', 'change']
                    }
                ],
                phone: [
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
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        jobStatusFormatter(row, column) {
            return this.selectDictLabel(this.jobStatusOptions, row.jobStatus);
        }, // 用户类型
        userTypeFormatter(row, column) {
            return this.selectDictLabel(this.userTypeOptions, row.userType);
        },
        genderFormatter(row, column) {
            return this.selectDictLabel(this.genderOptions, row.gender);
        },
        // 查询用户列表
        getList() {
            this.getTreeselect();
            userListPage(this.queryParams).then(res => {
                this.userListData = res.data.records;
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
            treeselect().then(res => {
                this.deptOptions = this.handleTree(res.data, 'deptId');
            });
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.deptId = data.id;
            this.getList();
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单刷新
        reset() {
            this.form = {
                userId: undefined,
                deptId: undefined,
                userNum: undefined,
                nickname: undefined,
                phone: undefined,
                email: undefined,
                denger: undefined,
                jobStatus: '0',
                userType: '0',
                remark: undefined
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.queryParams = {
                userNum: undefined,
                nickname: undefined,
                jobStatus: undefined,
                deptId: undefined,
                pageNum: 1,
                pageSize: 10
            };
            this.resetForm('queryParams');
            this.handleQuery();
        },
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return deleteUser(row.userId).then(res => that.callbackFun(res));
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.form.deptId = this.deptId;
            this.open = true;
            this.isEdit = false;
            this.title = '新增员工';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getUser(row.userId).then(res => {
                this.form = res.data;
                this.open = true;
                this.isEdit = true;
                this.title = '修改员工';
            });
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.userId != undefined) {
                        updateUser(this.form).then(res => this.callbackFun(res));
                    } else {
                        addUser(this.form).then(res => this.callbackFun(res));
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
