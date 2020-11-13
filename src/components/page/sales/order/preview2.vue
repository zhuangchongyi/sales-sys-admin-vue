<template>
    <div class="container">
        <el-row>
            <el-col>
                <el-divider><strong>客户订单</strong></el-divider>
            </el-col>
            <el-col>
                <el-form :model="orderForm" ref="orderForm" label-position="right" label-width="auto" :inline="true">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="orderForm.orderNum" size="small" readonly />
                    </el-form-item>
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="orderForm.clienteleNum" show-word-limit size="small" readonly />
                    </el-form-item>
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="orderForm.clienteleName" size="small" readonly />
                    </el-form-item>
                    <el-form-item label="订单金额" prop="totalPrice">
                        <el-input v-model="orderForm.totalPrice" size="small" readonly />
                    </el-form-item>
                    <el-form-item label="应收款" prop="receivablePrice">
                        <el-input v-model="orderForm.receivablePrice" size="small" readonly />
                    </el-form-item>
                    <el-form-item label="已收款" prop="hasReceiptPrice">
                        <el-input v-model="orderForm.hasReceiptPrice" size="small" readonly />
                    </el-form-item>
                    <el-form-item label="未收款" prop="notReceiptPrice">
                        <el-input v-model="orderForm.notReceiptPrice" size="small" readonly />
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-divider><strong>客户订单明细</strong></el-divider>
            </el-col>
            <el-col>
                <el-table :data="orderSubListData">
                    <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" />
                    <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
                    <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="unitsName" label="单位" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="price" label="单价" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="number" label="订购数量" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="totalPrice" label="金额" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="demand" label="技术要求" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="hasOutboundNum" label="已出库数量" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="hasSignbackNum" label="已签收数量" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="hasReturnNum" label="累计退货数量" align="center" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="9">
                <el-divider><strong>收款记录</strong></el-divider>
            </el-col>
            <el-col :span="15">
                <el-divider><strong>应收款记录</strong></el-divider>
            </el-col>
            <el-col :span="9">
                <el-table :data="receiptListData" ref="receiptListData">
                    <el-table-column label="收款单号" prop="receiptNum" align="center" :show-overflow-tooltip="true" width="180" />
                    <el-table-column label="收款日期" prop="receiptTime" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="收款金额" prop="receiptPrice" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="已核销金额" prop="hasVerificaPrice" :show-overflow-tooltip="true" align="center" />
                </el-table>
            </el-col>
            <el-col :span="15">
                <el-table :data="receivableListData" ref="receivableListData">
                    <el-table-column label="应收单号" prop="receivableNum" align="center" :show-overflow-tooltip="true" width="180" />
                    <el-table-column label="财务日期" prop="financeTime" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="签回单号" prop="signbackNum" :show-overflow-tooltip="true" align="center" width="180" />
                    <el-table-column label="签回日期" prop="signbackTime" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="应收金额" prop="totalPrice" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="已核销金额" prop="hasVerificaPrice" :show-overflow-tooltip="true" align="center" />
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getOrder, listOrderSub } from '@/api/sales/order.js';
import { getClienteleReceiptList } from '@/api/finance/receipt.js';
import { getClienteleReceivableList } from '@/api/finance/receivable.js';

export default {
    data() {
        return {
            orderForm: {},
            orderSubListData: [],
            receiptListData: [],
            receivableListData: []
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/sales/order/preview2' && this.orderForm.orderId !== this.$route.query.oid) {
                this.getOrderListData();
            }
        }
    },
    created() {
        this.getOrderListData();
    },
    methods: {
        getOrderListData() {
            let orderId = this.$route.query.oid;
            if (orderId) {
                getOrder(orderId).then(res => {
                    this.orderForm = res.data;
                    let data = { status: '3', clienteleId: this.orderForm.clienteleId, orderId: this.orderForm.orderId, orderNum: this.orderForm.orderNum };
                    // 订单明细
                    listOrderSub({ orderId: orderId }).then(res => {
                        this.orderSubListData = res.data;
                    });
                    // 收款
                    getClienteleReceiptList(data).then(res => {
                        this.receiptListData = res.data;
                    });
                    // 应收款
                    getClienteleReceivableList(data).then(res => {
                        this.receivableListData = res.data;
                        let receipt = 0; // 累计已收款
                        let receivable = 0; // 累计应收款
                        this.receivableListData.forEach(item => {
                            let price = parseFloat(item.totalPrice || 0);
                            receivable = receivable + price;
                            receipt = receipt + parseFloat(item.hasVerificaPrice || 0);
                        });
                        this.orderForm.receivablePrice = receivable.toFixed(2);
                        this.orderForm.hasReceiptPrice = receipt.toFixed(2);
                        this.orderForm.notReceiptPrice = this.orderForm.totalPrice - receivable;
                    });
                });
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
</style>
