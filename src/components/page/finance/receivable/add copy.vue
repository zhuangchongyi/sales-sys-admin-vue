<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddClientele">客户签回单</el-button>
        </div>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="100px" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="应收单号" prop="receivableNum">
                        <el-input v-model="clienteleForm.receivableNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="财务日期" prop="financeTime">
                        <el-date-picker v-model="clienteleForm.financeTime" size="small" style="width: 150px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
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
                        <el-input v-model="clienteleForm.invoice" size="small" style="width: 150px" />
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
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="应收金额" prop="totalPrice">
                        <el-input
                            v-model="clienteleForm.totalPrice"
                            size="small"
                            style="width: 150px"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                            maxLength="9"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
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
        </el-dialog>
    </div>
</template>

<script>
import { addReceivable } from '@/api/finance/receivable.js';
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
                totalPrice: [
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
            radio: ''
        };
    },
    created() {},
    methods: {
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
            this.clienteleForm.financeTime = this.parseTime(new Date());
            this.loading = true;
            financeSignbackSub({ signbackId: row.signbackId }).then(res => {
                this.loading = false;
                this.materielListData = res.data;
                let total = 0;
                this.materielListData.forEach(item => {
                    total = total + parseFloat(item.totalPrice || 0);
                });
                this.clienteleForm.totalPrice = total.toFixed(2);
                this.$set(this.clienteleForm, 'totalPrice', total.toFixed(2));
            });
        },
        submitAddForm() {
            this.$refs.clienteleForm.validate(valid => {
                if (valid) {
                    if (this.clienteleForm.receivableNum) {
                        this.msgError('已保存');
                        return;
                    }
                    this.clienteleForm.sourceType = '1';
                    let data = {
                        clienteleForm: JSON.stringify(this.clienteleForm)
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
