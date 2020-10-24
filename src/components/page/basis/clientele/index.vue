<template>
    <div class="container">
        <el-row :gutter="20">
            <!--客户类别数据-->
            <el-col :span="4" :xs="24">
                <div class="head-container">
                    <el-input v-model="categoryName" placeholder="客户类别名称筛选" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                </div>
                <div class="head-container">
                    <el-tree
                        :data="categoryOptions"
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
            <!--客户数据-->
            <el-col :span="20" :xs="24">
                <el-form :model="queryParams" ref="queryParams" :inline="true">
                    <el-form-item label="" prop="clienteleNum">
                        <el-input v-model="queryParams.clienteleNum" placeholder="客户编码" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="clienteleName">
                        <el-input v-model="queryParams.clienteleName" placeholder="客户名称" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="status">
                        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
                            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
                    </el-form-item>
                </el-form>
                <div class="handle-box">
                    <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['basis:clientele:add']" @click="handleAdd">新增</el-button>
                </div>
                <el-table v-loading="loading" :data="clienteleListData">
                    <el-table-column type="index" width="50" fixed="left" align="center" />
                    <el-table-column label="客户编码" align="center" prop="clienteleNum" width="80" />
                    <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" width="100" />
                    <el-table-column label="所属类别" align="center" prop="category.categoryName" :show-overflow-tooltip="true" width="100" />
                    <el-table-column label="合作时间" align="center" prop="corporationTime" :show-overflow-tooltip="true" width="100" />
                    <el-table-column label="法人" align="center" prop="legalPerson" :show-overflow-tooltip="true" width="100" />
                    <el-table-column label="简称" align="center" prop="abbreviation" :show-overflow-tooltip="true" width="100" />
                    <el-table-column label="联系人" align="center" prop="leader" width="100"></el-table-column>
                    <el-table-column label="联系电话" align="center" prop="phone" width="150"></el-table-column>
                    <el-table-column label="手机" align="center" prop="mobilephone" width="150"></el-table-column>
                    <el-table-column label="邮箱" align="center" prop="email" width="150"></el-table-column>
                    <el-table-column label="统一社会信用证号" align="center" prop="certificateNum" width="150"></el-table-column>
                    <el-table-column label="业务员名称" align="center" prop="personnel.nickname" width="100"></el-table-column>
                    <el-table-column label="部门名称" align="center" prop="personnel.dept.deptName" width="100"></el-table-column>
                    <el-table-column label="地址" prop="address" align="center" width="300"></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="statusFormatter" width="160" align="center"> </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" width="160"></el-table-column>
                    <el-table-column label="创建人" align="center" prop="createBy" width="160"></el-table-column>
                    <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['basis:clientele:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" style="color:#e6a23c;" v-hasPermi="['basis:clienteleProduct:list']" @click="handleAddMateriel(scope.row)"
                                >产品客户价</el-button
                            >
                            <el-button size="mini" type="text" style="color:#fd5656" v-hasPermi="['basis:clientele:delete']" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="归属类别" prop="categoryId">
                            <treeselect v-model="form.categoryId" :options="categoryOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择归属客户类别" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户编码" prop="clienteleNum">
                            <el-input v-model="form.clienteleNum" placeholder="请输入客户编码" maxlength="10" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="clienteleName">
                            <el-input v-model="form.clienteleName" placeholder="请输入客户名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法人" prop="legalPerson">
                            <el-input v-model="form.legalPerson" placeholder="请输入法人" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="leader">
                            <el-input v-model="form.leader" placeholder="请输入联系人" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="简称" prop="abbreviation">
                            <el-input v-model="form.abbreviation" placeholder="请输入简称" />
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
                    <el-col :span="12">
                        <el-form-item label="统一社会信用证号" prop="certificateNum">
                            <el-input v-model="form.certificateNum" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作时间" prop="corporationTime">
                            <el-date-picker v-model="form.corporationTime" style="width:200px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户等级">
                            <el-select v-model="form.level" clearable placeholder="请选择">
                                <el-option v-for="dict in levelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                            </el-select>
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
                        <el-form-item label="业务员编码" prop="userNum">
                            <el-input v-model="form.personnel.userNum" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" placeholder="请选择业务员" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务员名称" prop="nickname">
                            <el-input v-model="form.personnel.nickname" placeholder="请输入业务员名称" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门编码" prop="deptNum">
                            <el-input v-model="form.personnel.dept.deptNum" placeholder="请输入部门编码" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门名称" prop="deptName">
                            <el-input v-model="form.personnel.dept.deptName" placeholder="请输入部门名称" :disabled="true" />
                        </el-form-item>
                    </el-col>
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
        <!-- 业务人员弹窗 -->
        <el-dialog title="业务员" :visible.sync="personnelOpen" width="550px" append-to-body>
            <el-form :model="personnelQuery" ref="personnelQuery" :inline="true">
                <el-form-item label="员工编码" prop="userNum">
                    <el-input v-model="personnelQuery.userNum" placeholder="请输入编码 " clearable size="small" style="width: 120px" @keyup.enter.native="handleQueryDialog" />
                </el-form-item>
                <el-form-item label="员工名称" prop="nickname">
                    <el-input v-model="personnelQuery.nickname" placeholder="请输入名称 " clearable size="small" style="width: 120px" @keyup.enter.native="handleQueryDialog" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryDialog">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="personnelLoading" :data="personnelListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="员工编号" align="center" prop="userNum" :show-overflow-tooltip="true" />
                <el-table-column label="员工名称" align="center" prop="nickname" :show-overflow-tooltip="true" />
                <el-table-column label="部门编码" align="center" prop="dept.deptNum" :show-overflow-tooltip="true" />
                <el-table-column label="部门名称" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="personnelQuery.current"
                    :page-size="personnelQuery.size"
                    :total="personnelTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeDialog"
                    @current-change="handlePageChangeDialog"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormDialog">确 定</el-button>
                <el-button @click="cancelDialog">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listClientele, addClientele, updateClientele, deleteClientele, getClientele } from '@/api/basis/clientele.js';
import { treeselect } from '@/api/basis/category.js';
import { userListPage } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'basis-personnel',
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
            // 客户类别树选项
            categoryOptions: [],
            // 客户类别名称
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
                remark: undefined,
                personnel: {
                    userNum: undefined,
                    nickname: undefined,
                    dept: {
                        deptNum: undefined,
                        deptName: undefined
                    }
                }
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
            levelOptions: [
                { dictValue: '0', dictLabel: 'A客户' },
                { dictValue: '1', dictLabel: 'B客户' },
                { dictValue: '2', dictLabel: 'C客户' },
                { dictValue: '3', dictLabel: 'D客户' },
                { dictValue: '4', dictLabel: 'E客户' }
            ],

            //业务员数据
            personnelLoading: true,
            personnelOpen: false,
            personnelListData: [],
            personnelQuery: {
                current: 1,
                size: 10,
                userNum: undefined,
                nickname: undefined,
                jobStatus: '0'
            },
            personnelTotal: 0,
            radio: '',
            selectedPersonnel: undefined,
            // 表单校验
            rules: {
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                categoryId: [{ required: true, message: '请选择客户类别', trigger: 'blur' }],
                // userNum: [{ required: true, message: '业务员编码不能为空', trigger: 'change' }],
                // nickname: [{ required: true, message: '业务员名称不能为空', trigger: 'change' }],
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
        this.getTreeselect();
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
        // 查询客户列表
        getList() {
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
                remark: undefined,
                personnel: {
                    userNum: undefined,
                    nickname: undefined,
                    dept: {
                        deptNum: undefined,
                        deptName: undefined
                    }
                }
            };

            this.resetForm('form');
        },
        handleQuotationAdd() {},

        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.form.categoryId = this.categoryId;
            this.open = true;
            this.title = '新增客户';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getClientele(row.clienteleId).then(res => {
                this.form = res.data;
                this.open = true;
                this.title = '修改客户';
            });
        },
        // 删除客户
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
        /** 新增产品客户价操作 */
        handleAddMateriel(row) {
            // 跳转产品客户价界面
            this.$router.push({ path: '/page/basis/clienteleProduct', query: { id: row.clienteleId } });
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
        },

        // 人员编码输入框获取焦点
        personnelFocus(event) {
            this.personnelOpen = true;
            this.selectedPersonnel = undefined;
            this.getPersonnelList();
            // 失去焦点
            // this.$refs.personnelBlur.blur();
        },
        getPersonnelList() {
            userListPage(this.personnelQuery).then(res => {
                this.personnelLoading = false;
                this.personnelListData = res.data.records;
                this.personnelTotal = res.data.total;
            });
        },
        getCurrentRow(row) {
            // console.log('选中行', row);
            this.selectedPersonnel = row;
        },
        handlePageChangeDialog(val) {
            this.$set(this.personnelQuery, 'current', val);
            this.getPersonnelList();
        },
        handleSizeChangeDialog(val) {
            this.$set(this.personnelQuery, 'size', val);
            this.handleQueryDialog();
        },
        handleQueryDialog() {
            this.personnelQuery.current = 1;
            this.getPersonnelList();
        },
        handledbClick(row, event, column) {
            this.getCurrentRow(row);
            this.submitFormDialog();
        },
        submitFormDialog() {
            this.form.userId = this.selectedPersonnel.userId;
            this.form.personnel.userNum = this.selectedPersonnel.userNum;
            this.form.personnel.nickname = this.selectedPersonnel.nickname;
            this.form.personnel.dept.deptNum = this.selectedPersonnel.dept.deptNum;
            this.form.personnel.dept.deptName = this.selectedPersonnel.dept.deptName;
            this.personnelOpen = false;
            this.$refs.form.clearValidate('userNum');
            this.$refs.form.clearValidate('nickname');
        },
        cancelDialog() {
            this.personnelOpen = false;
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
