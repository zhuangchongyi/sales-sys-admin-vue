<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" size="small" @focus="handleAddClientele" placeholder="请选择客户" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" clearable size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="核销日期" prop="writeoffTime">
                        <el-date-picker v-model="clienteleForm.writeoffTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="累计核销金额" prop="writeoffPrice">
                        <el-input v-model="clienteleForm.writeoffPrice" clearable size="small" readonly />
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="累计收款金额" prop="totalReceiptPrice">
                        <el-input v-model="clienteleForm.totalReceiptPrice" clearable size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="累计应收金额" prop="totalReceivablePrice">
                        <el-input v-model="clienteleForm.totalReceivablePrice" clearable size="small" readonly />
                    </el-form-item>
                </el-col> -->
                <!-- <el-col :span="6">
                    <el-form-item label="业务人员" prop="personnelName">
                        <el-input v-model="clienteleForm.personnelName" size="small" placeholder="请选择业务人员 " @focus="personnelFocus" ref="personnelBlur"> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务部门" prop="deptName">
                        <el-input v-model="clienteleForm.deptName" size="small" readonly />
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div>
            <el-row>
                <el-col :span="10">
                    <el-divider><strong>收款明细</strong></el-divider>
                </el-col>
                <el-col :span="14">
                    <el-divider><strong>应收款明细</strong></el-divider>
                </el-col>
            </el-row>
            <el-row v-show="this.clienteleForm.clienteleId">
                <el-col>
                    <el-button type="primary" size="mini" icon="el-icon-aim" @click="selectionForm">一键选择</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9">
                    <el-table :data="receiptListData" ref="receiptListData" highlight-current-row @row-click="selectionRowReceipt" @selection-change="handleSelectionReceipt">
                        <el-table-column type="selection" width="50" align="center" fixed="left" />
                        <el-table-column label="收款单号" prop="receiptNum" align="center" :show-overflow-tooltip="true" width="180" />
                        <el-table-column label="收款日期" prop="receiptTime" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="收款金额" prop="receiptPrice" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="已核销金额" prop="hasVerificaPrice" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="未核销金额" prop="notVerificaPrice" :show-overflow-tooltip="true" align="center" width="100">
                            <template slot-scope="scope">{{ parseFloat(scope.row.receiptPrice || 0) - parseFloat(scope.row.hasVerificaPrice || 0) }}</template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="15">
                    <el-table :data="receivableListData" ref="receivableListData" highlight-current-row @row-click="selectionRowReceivable" @selection-change="handleSelectionReceivable">
                        <el-table-column type="selection" width="50" align="center" fixed="left" />
                        <el-table-column label="应收单号" prop="receivableNum" align="center" :show-overflow-tooltip="true" width="180" />
                        <el-table-column label="财务日期" prop="financeTime" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="订单号" prop="orderNum" :show-overflow-tooltip="true" align="center" width="180" />
                        <el-table-column label="订单日期" prop="orderTime" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="签回单号" prop="signbackNum" :show-overflow-tooltip="true" align="center" width="180" />
                        <el-table-column label="签回日期" prop="signbackTime" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="应收金额" prop="totalPrice" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="已核销金额" prop="hasVerificaPrice" :show-overflow-tooltip="true" align="center" width="100" />
                        <el-table-column label="本次核销金额" prop="verificaPrice" align="center" fixed="right" width="120">
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.verificaPrice"
                                    size="mini"
                                    oninput="if(isNaN(value)) { value = 0 } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                    maxLength="9"
                                    @input="calculateInputVerificaPrice(scope.row)"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
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
    </div>
</template>

<script>
import { addWriteoff } from '@/api/finance/writeoff.js';
import { getReceiptList } from '@/api/finance/receipt.js';
import { getReceivableList } from '@/api/finance/receivable.js';
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
                writeoffTime: [{ required: true, message: '核销时间不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                writeoffPrice: [
                    { required: true, message: '核销金额不能为空', trigger: 'blur' },
                    { validator: this.validateWriteoffPrice, trigger: ['blur', 'change'] }
                ],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }]
                // personnelName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                // deptName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
            },
            //表单参数
            clienteleForm: {}, //主表信息
            clienteleTypeOptions: [], //客户类别
            // 添加客户
            clienteleListData: [],
            clienteleQueryParams: {
                current: 1,
                pageSize: 10,
                categoryId: undefined,
                clienteleNum: undefined,
                clienteleName: undefined
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
            receiptListData: [],
            receivableListData: [],

            selectionReceipts: [],
            selectionReceivables: []
        };
    },
    created() {
        this.clearAddForm();
        this.getClienteleTreeselect();
    },
    methods: {
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
            this.open = true;
            this.handleQuery();
        },
        getCurrentRow(row) {
            this.open = false;
            this.clienteleForm = row;
            this.$set(this.clienteleForm, 'writeoffTime', this.parseTime(new Date()));
            this.$set(this.clienteleForm, 'writeoffPrice', '0');
            this.$set(this.clienteleForm, 'totalReceiptPrice', '0');
            this.$set(this.clienteleForm, 'totalReceivablePrice', '0');
            this.$refs.clienteleForm.clearValidate('clienteleName');
            this.$refs.clienteleForm.clearValidate('clienteleNum');
            this.getReceiptData();
            this.getReceivableData();
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
        // 查询客户收款信息
        getReceiptData() {
            getReceiptList({ clienteleId: this.clienteleForm.clienteleId, status: '3' }).then(res => {
                if (res.data) {
                    this.receiptListData = res.data;
                }
            });
        },
        //查询客户应收款信息
        getReceivableData() {
            getReceivableList({ clienteleId: this.clienteleForm.clienteleId, status: '3' }).then(res => {
                if (res.data) {
                    for (const item of res.data) {
                        let verificaPrice = parseFloat(item.totalPrice || 0) - parseFloat(item.hasVerificaPrice || 0);
                        this.$set(item, 'verificaPrice', verificaPrice.toFixed(2));
                    }
                    this.receivableListData = res.data;
                }
            });
        },
        // 一键选择
        selectionForm() {
            if (this.receiptListData.length === 0 || this.receivableListData.length === 0) {
                return;
            }
            this.selectionReceipts = [];
            this.selectionReceivables = [];
            this.$refs.receiptListData.clearSelection();
            this.$refs.receivableListData.clearSelection();
            let totalReceiptPrice = 0; //累计收款金额
            let totalReceivablePrice = 0; //累计应收款金额
            this.receivableListData.forEach(item => {
                totalReceivablePrice = totalReceivablePrice + parseFloat(item.verificaPrice || 0);
            });
            for (let i = 0; i < this.receiptListData.length; i++) {
                const item = this.receiptListData[i];
                this.selectionRowReceipt(item);
                totalReceiptPrice = totalReceiptPrice + parseFloat(item.receiptPrice || 0) - parseFloat(item.hasVerificaPrice || 0);
                if (totalReceiptPrice >= totalReceivablePrice) {
                    //收款大于应收款时,不在选择收款
                    break;
                }
            }
            if (totalReceiptPrice >= totalReceivablePrice) {
                //收款大于等于应收款时，应收款全选
                this.receivableListData.forEach(item => {
                    item.verificaPrice = (parseFloat(item.totalPrice || 0) - parseFloat(item.hasVerificaPrice || 0)).toFixed(2);
                    this.selectionRowReceivable(item);
                });
            } else {
                //收款小于于应收款时，收款全选，计算最后一个应收款的核销金额
                totalReceivablePrice = 0;
                for (let i = 0; i < this.receivableListData.length; i++) {
                    let item = this.receivableListData[i];
                    let verificaPrice = parseFloat(item.totalPrice || 0) - parseFloat(item.hasVerificaPrice || 0);
                    totalReceivablePrice = totalReceivablePrice + verificaPrice;
                    if (totalReceiptPrice < totalReceivablePrice) {
                        verificaPrice = totalReceiptPrice - parseFloat(totalReceivablePrice || 0) + parseFloat(verificaPrice || 0);
                        item.verificaPrice = verificaPrice.toFixed(2);
                        this.selectionRowReceivable(item);
                        break;
                    } else {
                        this.selectionRowReceivable(item);
                    }
                }
            }
        },
        //选择收款
        selectionRowReceipt(row) {
            this.$refs.receiptListData.toggleRowSelection(row);
        },
        handleSelectionReceipt(selection) {
            this.selectionReceipts = selection;
            this.calculateTotalReceiptPrice();
        },
        calculateTotalReceiptPrice() {
            let totalReceiptPrice = 0;
            this.selectionReceipts.forEach(item => {
                totalReceiptPrice = totalReceiptPrice + parseFloat(item.receiptPrice || 0) - parseFloat(item.hasVerificaPrice || 0);
            });
            this.$set(this.clienteleForm, 'totalReceiptPrice', totalReceiptPrice.toFixed(2));
            this.calculateVerificaPrice();
        },
        //选择应收款
        selectionRowReceivable(row) {
            this.$refs.receivableListData.toggleRowSelection(row);
        },
        handleSelectionReceivable(selection) {
            this.selectionReceivables = selection;
            this.calculateTotalReceivablePrice();
        },
        calculateTotalReceivablePrice() {
            let totalReceivablePrice = 0;
            this.selectionReceivables.forEach(item => {
                totalReceivablePrice = totalReceivablePrice + parseFloat(item.verificaPrice || 0);
            });
            this.$set(this.clienteleForm, 'totalReceivablePrice', totalReceivablePrice.toFixed(2));
            this.calculateVerificaPrice();
        },
        calculateInputVerificaPrice(row) {
            console.log(row.verificaPrice);
            let verificaPrice = parseFloat(row.totalPrice || 0) - parseFloat(row.hasVerificaPrice || 0);
            if (row.verificaPrice > verificaPrice) {
                row.verificaPrice = verificaPrice;
            }
            this.calculateTotalReceivablePrice();
        },
        // 计算核销金额
        calculateVerificaPrice() {
            let totalReceiptPrice = parseFloat(this.clienteleForm.totalReceiptPrice);
            let totalReceivablePrice = parseFloat(this.clienteleForm.totalReceivablePrice);
            if (!totalReceiptPrice || totalReceiptPrice <= 0) {
                this.$set(this.clienteleForm, 'writeoffPrice', 0);
            } else if (!totalReceivablePrice || totalReceivablePrice <= 0) {
                this.$set(this.clienteleForm, 'writeoffPrice', 0);
            } else if (totalReceiptPrice < totalReceivablePrice) {
                this.$set(this.clienteleForm, 'writeoffPrice', totalReceiptPrice);
            } else {
                this.$set(this.clienteleForm, 'writeoffPrice', totalReceivablePrice);
            }
        },
        // 保存
        submitAddForm() {
            this.$refs.clienteleForm.validate(valid => {
                if (valid) {
                    if (parseFloat(this.clienteleForm.writeoffPrice) > parseFloat(this.clienteleForm.totalReceiptPrice)) {
                        this.msgError('核销金额不允许超过收款金额');
                        return;
                    } else if (parseFloat(this.clienteleForm.totalReceivablePrice) > parseFloat(this.clienteleForm.totalReceiptPrice)) {
                        this.msgError('应收款金额不允许超过收款金额');
                        return;
                    } else if (this.selectionReceipts.length === 0) {
                        this.msgError('未选择收款单');
                        return;
                    } else if (this.selectionReceivables === 0) {
                        this.msgError('未选择应收款单');
                        return;
                    }
                    if (this.clienteleForm.writeoffPrice == 0) {
                        this.msgError('核销金额不能为零');
                        return;
                    }
                    let data = {
                        clienteleForm: JSON.stringify(this.clienteleForm),
                        selectionReceipts: JSON.stringify(this.selectionReceipts),
                        selectionReceivables: JSON.stringify(this.selectionReceivables)
                    };

                    addWriteoff(data).then(res => {
                        if (res.success) {
                            this.msgSuccess('保存成功');
                        } else {
                            this.msgError();
                        }
                    });
                }
            });
        },
        clearAddForm() {
            this.clienteleForm = {
                totalReceivablePrice: 0,
                totalReceiptPrice: 0,
                writeoffPrice: 0
            };
            this.receiptListData = [];
            this.receivableListData = [];
            this.selectionReceipts = [];
            this.selectionReceivables = [];
            this.resetForm('clienteleForm');
            this.getClienteleTreeselect();
        },
        validateWriteoffPrice(rule, value, callback) {
            if (value === '') {
                callback(new Error('累计核销金额不能为空'));
            } else if (parseFloat(value) > parseFloat(this.clienteleForm.totalReceiptPrice)) {
                callback(new Error('累计核销金额不能超过收款金额'));
            } else {
                callback();
            }
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
