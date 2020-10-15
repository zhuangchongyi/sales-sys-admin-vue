<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="客户编码" prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="请输入客户编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="客户名称" prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="请输入客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="mini" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" class="handle-del mr10" @click="handleDelete" :disabled="multiple">删除</el-button>
        </div>
        <el-table v-loading="loading" :data="clienteleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="客户编号" align="center" prop="clienteleId" />
            <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
            <el-table-column label="应收金额" align="center" prop="price" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="queryParams.pageNum"
                :page-size="queryParams.pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户编码" prop="clienteleNum">
                            <el-input v-model="form.clienteleNum" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" placeholder="请输入客户编码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="clienteleName">
                            <el-input v-model="form.clienteleName" :disabled="true" placeholder="请输入客户名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="应收金额" prop="ysprice">
                            <el-input v-model="form.ysprice" placeholder="请输入应收金额" />
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
                <el-button @click="cancelForm">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 业务人员弹窗 -->
        <el-dialog :title="title" :visible.sync="openClientele" width="400px" append-to-body>
            <el-form :model="query" ref="query" :inline="true">
                <el-form-item label="人员编码" prop="clienteleNum">
                    <el-input v-model="query.clienteleNum" placeholder="请输入编码或名称" clearable size="small" style="width: 150px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="clienteleListData" @selection-change="handleSelectionChangePersonnel">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column label="员工编号" align="center" prop="userName" />
                <el-table-column label="员工名称" align="center" prop="nickName" />
                <el-table-column label="部门名称" align="center" prop="dept.deptName" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :total="query.total"
                    @current-change="handlePageChangePersonnel"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormPersonnel">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listData } from '@/api/basis/clientele.js';
import { listUser } from '@/api/system/user.js';

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
            //用户数据
            clienteleList: [],
            //总条数
            pageTotal: 0,
            //表单参数
            form: {},
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '禁用' }
            ],
            //是否为系统用户
            isUserOptions: [
                { dictValue: '0', dictLabel: '是' },
                { dictValue: '1', dictLabel: '否' }
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                status: undefined
            },
            // 表单校验
            rules: {
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }]
            },
            query: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                personnelName: undefined
            },
            clienteleListData: [],
            openClientele: false,
            selectionClientele: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            listData(this.query).then(res => {
                console.log(res);
                this.clienteleList = res.data;
                this.pageTotal = res.pageTotal || 50;
                this.loading = false;
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'pageNum', val);
            this.getList();
        },
        handlePageChangePersonnel(val) {
            this.$set(this.query, 'pageNum', val);
            this.getList();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        handleSelectionChangePersonnel(selection) {
            this.selectionClientele = selection;
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 取消按钮
        cancelForm() {
            this.open = false;
        },
        // 表单刷新
        reset() {
            this.form = {
                userId: undefined,
                deptId: undefined,
                clienteleName: undefined,
                nickName: undefined,
                phonenumber: undefined,
                email: undefined
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
            this.dateRange = [];
            this.resetForm('queryForm');
            this.handleQuery();
        },
        handleDelete() {
            this.msgSuccess('操作成功');
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open = true;
            this.title = '添加客户财务信息';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.open = true;
            this.title = '修改客户财务信息';
        },
        /** 提交按钮 */
        submitForm() {
            this.msgSuccess('操作成功');
        },
        submitFormPersonnel() {
            if (this.selectionClientele.length != 1) {
                this.msgError('只能选择一个业务人员');
                return;
            }
            this.openClientele = false;
            this.form = this.selectionClientele[0];
        },
        personnelFocus(event) {
            this.openClientele = true;
            this.title = '客户档案';
            listUser().then(res => {
                console.log(res);
                this.clienteleListData = res.rows;
                this.query.total = res.total;
            });

            // 失去焦点
            this.$refs.personnelBlur.blur();
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
