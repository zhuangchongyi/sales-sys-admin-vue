<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAuditForm">审 核</el-button>
            <el-button type="primary" icon="el-icon-close" :loading="btnLoading" @click="cancelAuditForm">反审核</el-button>
        </div>
        <el-divider><strong>供应商信息</strong></el-divider>
        <el-form :model="supplierForm" ref="supplierForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="supplierForm.orderNum" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商编码" prop="supplierNum">
                        <el-input v-model="supplierForm.supplierNum" maxlength="10" show-word-limit readonly size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="supplierForm.supplierName" clearable readonly size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系人" prop="leader">
                        <el-input v-model="supplierForm.leader" clearable readonly size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="supplierForm.phone" clearable size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机" prop="mobilephone">
                        <el-input v-model="supplierForm.mobilephone" clearable size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="supplierForm.email" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="supplierForm.address" size="small" readonly style="width: 420px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="总计金额" prop="totalPrice">
                        <el-input v-model="supplierForm.totalPrice" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单日期" prop="orderTime">
                        <el-date-picker v-model="supplierForm.orderTime" style="width:155px;" value-format="yyyy-MM-dd" readonly format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务员" prop="personnelName">
                        <el-input v-model="supplierForm.personnelName" size="small" suffix-icon="el-icon-search" readonly ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="supplierForm.remark" type="textarea" autosize readonly style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column label="产品编码" align="center" :show-overflow-tooltip="true" prop="materielNum" />
            <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" align="center" :show-overflow-tooltip="true" prop="specification"></el-table-column>
            <el-table-column label="型号" align="center" :show-overflow-tooltip="true" prop="modelName"></el-table-column>
            <el-table-column label="所需扭矩" align="center" :show-overflow-tooltip="true" prop="needTorque"></el-table-column>
            <el-table-column label="输出扭矩" align="center" :show-overflow-tooltip="true" prop="outTorque"></el-table-column>
            <el-table-column prop="unitsName" label="单位" align="center"></el-table-column>
            <el-table-column prop="price" label="单价" align="center"> </el-table-column>
            <el-table-column prop="number" label="订购数量" align="center"> </el-table-column>
            <el-table-column prop="totalPrice" label="金额" align="center"> </el-table-column>
            <el-table-column prop="hasSignNum" label="通知到货数量" align="center"> </el-table-column>
            <el-table-column prop="hasStorageNum" label="已入库数量" align="center"> </el-table-column>
            <el-table-column prop="hasReturnNum" label="累计退货数量" align="center"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getPurchaseOrder, auditPurchaseOrder, listPurchaseOrderSub } from '@/api/purchase/order.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'purchase-price-add',
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            // 表单校验
            rules: {
                supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                orderTime: [{ required: true, message: '报价日期不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '业务人员不能为空', trigger: 'change' }]
            },
            formRules: {
                materielName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
                specification: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
                modelName: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
                unitsName: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
                number: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
            },
            btnLoading: false,
            //表单参数
            supplierForm: {}, //主表信息
            materielListData: [] //子表信息
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/purchase/order/preview' && this.supplierForm.orderId !== to.query.id) {
                this.isShow = JSON.parse(this.$route.query.isShow || false);
                this.isAudit = JSON.parse(this.$route.query.isAudit || false);
                this.getPurchaseOrder();
            }
        }
    },
    created() {
        this.isShow = JSON.parse(this.$route.query.isShow || false);
        this.isAudit = JSON.parse(this.$route.query.isAudit || false);
        this.getPurchaseOrder();
    },
    methods: {
        submitAuditForm() {
            if (this.supplierForm.status === '3') {
                this.msgError('已审核');
                return;
            }
            let data = {
                id: this.supplierForm.orderId,
                status: '3'
            };
            this.btnLoading = true;
            auditPurchaseOrder(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('审核成功');
                        this.getPurchaseOrder();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => (this.btnLoading = false));
        },
        cancelAuditForm() {
            if (this.supplierForm.status === '4') {
                this.msgError('已反审核');
                return;
            }
            let data = {
                id: this.supplierForm.orderId,
                status: '4'
            };
            this.btnLoading = true;
            auditPurchaseOrder(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('反审核成功');
                        this.getPurchaseOrder();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => (this.btnLoading = false));
        },
        getPurchaseOrder() {
            this.getPurchaseOrderList();
        },
        getPurchaseOrderList() {
            getPurchaseOrder(this.$route.query.id).then(res => {
                if (res.success) {
                    this.supplierForm = res.data;
                    this.getPurchaseOrderSubList();
                }
            });
        },
        getPurchaseOrderSubList() {
            let param = { orderId: this.$route.query.id };
            listPurchaseOrderSub(param).then(res => {
                this.materielListData = res.data;
            });
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
