<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm">重 置</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="收款单号" prop="receiptNum">
                        <el-input v-model="clienteleForm.receiptNum" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收款日期" prop="receiptTime">
                        <el-date-picker v-model="clienteleForm.receiptTime" placeholder="选择日期" size="small" clearable value-format="yyyy-MM-dd" format="yyyy-MM-dd" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收款账号" prop="receiptAccount">
                        <el-input v-model="clienteleForm.receiptAccount" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收款金额" prop="receiptPrice">
                        <el-input
                            v-model="clienteleForm.receiptPrice"
                            size="small"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+8)}"
                            maxLength="9"
                            readonly
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="付款账号" prop="paymentAccount">
                        <el-input v-model="clienteleForm.paymentAccount" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="付款方式" prop="paymentType">
                        <el-select v-model="clienteleForm.status" clearable size="small" disabled>
                            <el-option v-for="dict in paymentTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="业务人员" prop="personnelName">
                        <el-input v-model="clienteleForm.personnelName" size="small" placeholder="请选择业务人员 " readonly> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务部门" prop="deptName">
                        <el-input v-model="clienteleForm.deptName" size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="核销金额" prop="verificaPrice">
                        <el-input v-model="clienteleForm.verificaPrice" size="small" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" style="width: 1000px" size="small" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>应收款信息</strong></el-divider>
        <div class="handle-box" v-show="this.clienteleForm.clienteleId">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleReceivable">应收单</el-button>
        </div>
        <el-table v-loading="loading" :data="receivableData" ref="receivableData">
            <el-table-column label="应收单号" prop="receivableNum" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="财务日期" prop="financeTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="应收金额" prop="receivePrice" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="订单号" prop="orderNum" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="订单日期" prop="orderTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="签回单号" prop="signbackNum" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="签回日期" prop="signbackTime" :show-overflow-tooltip="true" align="center" />
            <el-table-column label="操作" align="center" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-info" @click="handlePreview(scope.row)">明细</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  添加客户窗口 -->
        <el-dialog title="客户" :visible.sync="open" width="600px" append-to-body>
            <el-form :model="clienteleQueryParams" ref="clienteleQueryParams" :inline="true">
                <el-form-item label="客户类别" prop="categoryId">
                    <treeselect
                        v-model="clienteleQueryParams.categoryId"
                        :options="clienteleTypeOptions"
                        :disable-branch-nodes="true"
                        :show-count="true"
                        style="width: 160px"
                        placeholder="请选择类别"
                    />
                </el-form-item>
                <el-form-item prop="clienteleName">
                    <el-input v-model="clienteleQueryParams.clienteleName" placeholder="客户编码或名称" clearable size="small" style="width: 150px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="clienteleListData" @row-dblclick="getCurrentRow">
                <el-table-column label="选择" width="50">
                    <template slot-scope="scope">
                        <el-radio v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="客户类别" align="center" prop="category.categoryName" :show-overflow-tooltip="true" />
                <el-table-column label="客户编码" align="center" prop="clienteleNum" :show-overflow-tooltip="true" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="clienteleQueryParams.current"
                    :page-size="clienteleQueryParams.size"
                    :total="pageTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 业务人员弹窗 -->
        <el-dialog title="业务员" :visible.sync="personnelOpen" width="550px" append-to-body>
            <el-form :model="personnelQueryParams" ref="personnelQueryParams" :inline="true">
                <el-form-item prop="userNum">
                    <el-input v-model="personnelQueryParams.userNum" placeholder="员工编码 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input v-model="personnelQueryParams.nickname" placeholder="员工名称 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handlePersonnelQuery">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="personnelLoading" :data="personnelListData" highlight-current-row @row-dblclick="getPersonnelRow">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getPersonnelRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="员工编码" align="center" prop="userNum" />
                <el-table-column label="员工名称" align="center" prop="nickname" />
                <el-table-column label="部门编码" align="center" prop="dept.deptNum" />
                <el-table-column label="部门名称" align="center" prop="dept.deptName" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="personnelQueryParams.current"
                    :page-size="personnelQueryParams.size"
                    :total="personnelTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangePersonnel"
                    @current-change="handlePageChangePersonnel"
                ></el-pagination>
            </div>
        </el-dialog>
        <el-dialog title="应收单" :visible.sync="receivableOpen" width="1000px" append-to-body v-dialogDrag>
            <el-form :model="receivableQueryParams" ref="receivableQueryParams" :inline="true">
                <el-form-item prop="receivableNum">
                    <el-input v-model="clienteleQueryParams.receivableNum" placeholder="应收单号" clearable size="small" style="width: 150px" @keyup.enter.native="handleQueryReceivable" />
                </el-form-item>
                <el-form-item prop="signbackNum">
                    <el-input v-model="clienteleQueryParams.signbackNum" placeholder="签回单号" clearable size="small" style="width: 150px" @keyup.enter.native="handleQueryReceivable" />
                </el-form-item>
                <el-form-item prop="orderNum">
                    <el-input v-model="clienteleQueryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 150px" @keyup.enter.native="handleQueryReceivable" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryReceivable">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="loading"
                :data="receivableListData"
                ref="receivableListData"
                highlight-current-row
                @row-click="getCurrentRowReceivable"
                @row-dblclick="getDblClickReceivable"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="应收单号" align="center" prop="receivableNum" :show-overflow-tooltip="true" />
                <el-table-column label="财务日期" align="center" prop="financeTime" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="客户编码" align="center" prop="clienteleNum" :show-overflow-tooltip="true" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" /> -->
                <el-table-column label="应收金额" align="center" prop="receivePrice" :show-overflow-tooltip="true" />
                <el-table-column label="签回单号" align="center" prop="signbackNum" :show-overflow-tooltip="true" />
                <el-table-column label="签回日期" align="center" prop="signbackTime" :show-overflow-tooltip="true" />
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" />
                <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="receivableQueryParams.current"
                    :page-size="receivableQueryParams.size"
                    :total="receivableTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeReceivable"
                    @current-change="handlePageChangeReceivable"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确认</el-button>
                <el-button type="primary" @click="cancelForm">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getReceipt } from '@/api/finance/receipt.js';
import { listReceivable } from '@/api/finance/receivable.js';
import { treeselect } from '@/api/basis/category.js';
import { listClientele } from '@/api/basis/clientele.js';
import { userListPage } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 表单校验
            rules: {
                receiptTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
                receiptPrice: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                deptName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                verificaPrice: [{ required: true, message: '核销金额不能为空', trigger: 'blur' }],
                paymentType: [{ required: true, message: '付款方式不能为空', trigger: 'blur' }]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            clienteleTypeOptions: [], //客户类别
            // 支付类型数据字典
            paymentTypeOptions: [
                { dictValue: '0', dictLabel: '现金支付' },
                { dictValue: '1', dictLabel: '转账支付' }
            ],
            // 添加客户
            clienteleListData: [],
            clienteleQueryParams: {
                current: 1,
                pageSize: 10,
                categoryId: undefined,
                orderNum: undefined,
                signbackNum: undefined
            },
            pageTotal: 0,
            radio: '',
            //添加人员
            personnelLoading: true,
            personnelOpen: false,
            personnelListData: [],
            personnelTotal: 0,
            personnelQueryParams: {
                current: 1,
                size: 10,
                userNum: undefined,
                nickname: undefined,
                status: '0'
            },
            // 应收单
            receivableData: [],
            receivableOpen: false,
            receivableListData: [],
            receivableQueryParams: {
                current: 1,
                pageSize: 10,
                categoryId: undefined,
                clienteleNum: undefined,
                clienteleName: undefined
            },
            receivableTotal: 0,
            receivableSelection: [],
            delSubs: []
        };
    },
    created() {
        this.getReceiptData();
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/finance/receipt/verifica' && this.clienteleForm.receiptId !== this.$route.query.rid) {
                this.getReceiptData();
            }
        }
    },
    methods: {
        getReceiptData() {
            let id = this.$route.query.rid;
            if (id) {
                getReceipt(id).then(res => {
                    this.clienteleForm = res.data;
                });
            }
        },
        handleQuery() {
            this.clienteleQueryParams.clienteleNum = this.clienteleQueryParams.clienteleName;
            listClientele(this.clienteleQueryParams).then(res => {
                if (res.success) {
                    this.clienteleListData = res.data.records;
                    this.clienteleTotal = res.data.total;
                }
            });
        },
        // 客户类别
        getClienteleTreeselect() {
            treeselect({ category: '1' }).then(res => {
                this.clienteleTypeOptions = res.data;
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.clienteleQueryParams, 'current', val);
            this.handleQuery();
        },
        handleSizeChange(val) {
            this.$set(this.clienteleQueryParams, 'current', 1);
            this.$set(this.clienteleQueryParams, 'size', val);
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.getClienteleTreeselect();
            this.open = true;
            this.handleQuery();
        },
        submitAddForm() {
            this.$refs.clienteleForm.validate(valid => {
                if (valid) {
                    if (this.receiptNum) {
                        this.msgError('已保存');
                        return;
                    }
                }
            });
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.resetForm('clienteleForm');
            this.receivableListData = [];
            this.receivableSelection = [];
            this.getReceiptData();
        },
        getCurrentRow(row) {
            this.open = false;
            this.clienteleForm = row;
            this.$set(this.clienteleForm, 'receiptTime', this.parseTime(new Date()));
            this.$set(this.clienteleForm, 'paymentType', '0');
            this.$refs.clienteleForm.clearValidate('clienteleName');
            this.$refs.clienteleForm.clearValidate('clienteleNum');
        },
        // 人员编码输入框获取焦点
        getPersonnelList() {
            userListPage(this.personnelQueryParams).then(res => {
                this.personnelLoading = false;
                this.personnelListData = res.data.records;
                this.personnelTotal = res.data.total;
            });
        },
        handlePersonnelQuery() {
            this.personnelQueryParams.current = 1;
            this.getPersonnelList();
        },
        handlePageChangePersonnel(val) {
            this.$set(this.personnelQueryParams, 'current', val);
            this.getPersonnelList();
        },
        handleSizeChangePersonnel(val) {
            this.$set(this.personnelQueryParams, 'size', val);
            this.handlePersonnelQuery();
        },
        personnelFocus(event) {
            this.personnelOpen = true;
            this.handlePersonnelQuery();
            // 失去焦点
            // this.$refs.personnelBlur.blur();
        },
        getPersonnelRow(row) {
            this.personnelOpen = false;
            this.clienteleForm.personnelId = row.userId;
            this.clienteleForm.personnelNum = row.userNum;
            this.$set(this.clienteleForm, 'personnelName', row.nickname);
            this.clienteleForm.deptId = row.dept.deptId;
            this.clienteleForm.deptNum = row.dept.deptNum;
            this.$set(this.clienteleForm, 'deptName', row.dept.deptName);
            this.$refs.clienteleForm.clearValidate('personnelName');
            this.$refs.clienteleForm.clearValidate('deptName');
        },
        // 应收单
        handlePreview(row) {
            this.msgSuccess('打开应收单明细');
        },
        handleDelete(index, row) {
            this.delSubs.push(row);
            this.receivableData.splice(index, 1);
            this.computeTotalPrice();
        },
        handleReceivable() {
            this.receivableOpen = true;
            this.handleQueryReceivable();
        },
        handleSelectionChange(selection) {
            this.receivableSelection = selection;
        },
        getCurrentRowReceivable(row) {
            this.$refs.receivableListData.toggleRowSelection(row);
        },
        getDblClickReceivable(row) {
            this.receivableData.push(row);
            this.receivableOpen = false;
            this.computeTotalPrice();
        },
        handleSizeChangeReceivable(val) {
            this.$set(this.receivableQueryParams, 'current', 1);
            this.$set(this.receivableQueryParams, 'size', val);
        },
        handlePageChangeReceivable(val) {
            this.$set(this.receivableQueryParams, 'current', val);
        },
        handleQueryReceivable() {
            this.receivableQueryParams.clienteleId = this.clienteleForm.clienteleId;
            listReceivable(this.receivableQueryParams).then(res => {
                this.receivableTotal = res.data.total;
                this.receivableListData = res.data.records;
            });
        },
        cancelForm() {
            this.receivableOpen = false;
        },
        submitForm() {
            this.receivableData = this.receivableData.concat(this.receivableSelection);
            this.computeTotalPrice();
            this.receivableOpen = false;
        },
        computeTotalPrice() {
            let totalPrice = 0;
            this.receivableData.forEach(item => {
                totalPrice = totalPrice + parseFloat(item.receivePrice || 0);
            });
            console.log(totalPrice);
            this.clienteleForm.verificaPrice = totalPrice.toFixed(2);
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

/* 标签 */
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
