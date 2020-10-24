<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAuditForm">审 核</el-button>
            <el-button type="primary" icon="el-icon-close" :loading="btnLoading" @click="cancelAuditForm">反审核</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="100px" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="应收单号" prop="receivableNum">
                        <el-input v-model="clienteleForm.receivableNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="财务日期" prop="financeTime">
                        <el-date-picker v-model="clienteleForm.financeTime" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="签回单号" prop="signbackNum">
                        <el-input v-model="clienteleForm.signbackNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="签回日期" prop="signbackTime">
                        <el-date-picker v-model="clienteleForm.signbackTime" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="clienteleForm.orderNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单日期" prop="orderTime">
                        <el-date-picker v-model="clienteleForm.orderTime" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="发票号" prop="invoice">
                        <el-input v-model="clienteleForm.invoice" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="税率" prop="taxrate">
                        <el-input
                            v-model="clienteleForm.taxrate"
                            size="small"
                            style="width: 150px"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+8)}"
                            maxLength="9"
                            readonly
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="税额" prop="taxamount">
                        <el-input
                            v-model="clienteleForm.taxamount"
                            size="small"
                            style="width: 150px"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                            maxLength="9"
                            readonly
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="应收金额" prop="receivePrice">
                        <el-input
                            v-model="clienteleForm.receivePrice"
                            size="small"
                            style="width: 150px"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                            maxLength="9"
                            readonly
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="累计金额" prop="totalPrice">
                        <el-input v-model="clienteleForm.totalPrice" size="small" style="width: 150px" readonly />
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
        <!-- <el-divider><strong>签回产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column label="产品编码" align="center" prop="materielNum" />
            <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" align="center" prop="specification" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="型号" align="center" prop="modelName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="所需扭矩" align="center" prop="needTorque" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="输出扭矩" align="center" prop="outTorque" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="单位" prop="unitsName" align="center"></el-table-column>
            <el-table-column label="单价" align="center" prop="price"></el-table-column>
            <el-table-column label="订购数量" align="center" prop="number"></el-table-column>
            <el-table-column label="发货数量" align="center" prop="shipmentNum"></el-table-column>
            <el-table-column label="签回数量" align="center" prop="signNum"></el-table-column>
            <el-table-column label="应收金额" prop="totalPrice" align="center"> </el-table-column>
        </el-table> -->

        <!--  添加客户窗口 -->
        <el-dialog title="客戶签回单" :visible.sync="open" width="60%" append-to-body>
            <el-form :model="clienteleQueryParams" ref="clienteleQueryParams" :inline="true">
                <el-form-item prop="signbackNum">
                    <el-input v-model="clienteleQueryParams.signbackNum" placeholder="签回单号" clearable size="small" style="width: 150px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="orderNum">
                    <el-input v-model="clienteleQueryParams.signbackNum" placeholder="订单号" clearable size="small" style="width: 150px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="clienteleName">
                    <el-input v-model="clienteleQueryParams.clienteleName" placeholder="客户编码或名称" clearable size="small" style="width: 150px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="clienteleListData" highlight-current-row @row-dblclick="getCurrentRow">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="签回单号" align="center" prop="signbackNum" :show-overflow-tooltip="true" width="180px" />
                <el-table-column label="签回日期" align="center" prop="signbackTime" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.signbackTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" width="180px" />
                <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户编码" align="center" prop="clienteleNum" :show-overflow-tooltip="true" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="应付金额" align="center" prop="totalPrice" :show-overflow-tooltip="true" /> -->
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="clienteleQueryParams.current"
                    :page-size="clienteleQueryParams.size"
                    :total="clienteleQueryParams.total"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { auditReceivable, getReceivable, listReceivableSub } from '@/api/finance/receivable.js';
import { financeSignback, financeSignbackSub } from '@/api/sales/signback.js';
export default {
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            form: {},
            // 表单校验
            rules: {
                orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                signbackNum: [{ required: true, message: '签回单号不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                financeTime: [{ required: true, message: '财务日期不能为空', trigger: 'blur' }],
                receivePrice: [
                    { required: true, message: '应收金额不能为空', trigger: 'blur' },
                    { validator: this.validateReceivePrice, trigger: ['blur', 'change'] }
                ]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            materielListData: [], //子表信息
            clienteleTypeOptions: [], //客户类别
            // 添加客户
            clienteleListData: [],
            clienteleQueryParams: {
                current: 1,
                size: 10,
                signbackNum: undefined,
                orderNum: undefined,
                clienteleNum: undefined,
                clienteleName: undefined
            },
            pageTotal: 0,
            radio: '',
            isAudit: false,
            btnLoading: false
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/finance/receivable/preview' && this.clienteleForm.receivableId !== this.$route.query.rid) {
                this.isAudit = Boolean(this.$route.query.isAudit || false);
                this.getListData();
            }
        }
    },
    created() {
        this.isAudit = Boolean(this.$route.query.isAudit || false);
        this.getListData();
    },
    methods: {
        submitAuditForm() {
            if (this.clienteleForm.status === '3') {
                this.msgError('已审核');
                return;
            }
            let data = {
                receivableId: this.clienteleForm.receivableId,
                status: '3'
            };
            this.btnLoading = true;
            auditReceivable(data).then(res => {
                this.btnLoading = false;
                if (res.success) {
                    this.msgSuccess('审核成功');
                    this.getListData();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        cancelAuditForm() {
            if (this.clienteleForm.status === '4') {
                this.msgError('已反审核');
                return;
            }
            let data = {
                receivableId: this.clienteleForm.receivableId,
                status: '4'
            };
            this.btnLoading = true;
            auditReceivable(data).then(res => {
                this.btnLoading = false;
                if (res.success) {
                    this.msgSuccess(res.message);
                    this.getListData();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        getListData() {
            let id = this.$route.query.rid;
            if (id) {
                getReceivable(id).then(res => {
                    if (res.success) {
                        this.clienteleForm = res.data;
                        listReceivableSub({ receivableId: id }).then(res => {
                            this.materielListData = res.data;
                        });
                    }
                });
            }
        },
        submitAuditForm() {
            if (this.clienteleForm.status === '3') {
                this.msgError('已审核');
                return;
            }
            let data = {
                receivableId: this.clienteleForm.receivableId,
                status: '3'
            };
            this.btnLoading = true;
            auditReceivable(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('审核成功');
                        this.getListData();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.btnLoading = false;
                });
        },
        cancelAuditForm() {
            if (this.clienteleForm.status === '4') {
                this.msgError('已反审核');
                return;
            }
            let data = {
                receivableId: this.clienteleForm.receivableId,
                status: '4'
            };
            this.btnLoading = true;
            auditReceivable(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('反审核成功');
                        this.getListData();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.btnLoading = false;
                });
        },
        validateReceivePrice(rule, value, callback) {
            if (parseFloat(value) > parseFloat(this.clienteleForm.totalPrice)) {
                callback(new Error('应收金额超过累计金额'));
            } else {
                callback();
            }
        },
        handleAddClientele() {
            this.open = true;
            this.handleQuery();
        },
        getFinanceSignbackList() {
            financeSignback(this.clienteleQueryParams).then(res => {
                this.clienteleListData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        handleQuery() {
            this.clienteleQueryParams.current = 1;
            this.getFinanceSignbackList();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.clienteleQueryParams, 'current', val);
            this.getFinanceSignbackList();
        },
        handleSizeChange(val) {
            this.$set(this.clienteleQueryParams, 'size', val);
            this.handleQuery();
        },
        getCurrentRow(row) {
            this.open = false;
            this.clienteleForm = row;
            this.clienteleForm.financeTime = new Date();
            this.loading = true;
            financeSignbackSub({ signbackId: row.signbackId }).then(res => {
                this.loading = false;
                this.materielListData = res.data;
                let total = 0;
                this.materielListData.forEach(item => {
                    total = total + parseFloat(item.totalPrice || 0);
                });
                this.clienteleForm.totalPrice = total.toFixed(2);
                this.$set(this.clienteleForm, 'receivePrice', total.toFixed(2));
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        submitForm() {
            this.msgSuccess('成功');
        },
        submitAddForm() {
            this.$refs.clienteleForm.validate(valid => {
                if (valid) {
                    if (parseFloat(this.clienteleForm.totalPrice) < parseFloat(this.clienteleForm.receivePrice)) {
                        this.msgError('应收金额超过累计金额');
                        return;
                    }
                    let data = {
                        clienteleForm: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(this.materielListData)
                    };
                    addReceivable(data).then(res => {
                        if (res.success) {
                            this.msgSuccess('保存成功');
                            this.$set(this.clienteleForm, 'receivableNum', res.data);
                        } else {
                            this.msgError(res.massage);
                        }
                    });
                }
            });
        },
        clearAddForm() {
            this.materielListData = [];
            this.clienteleForm = {};
            this.resetForm('clienteleForm');
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
