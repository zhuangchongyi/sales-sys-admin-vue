<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAuditForm">审 核</el-button>
            <el-button type="primary" icon="el-icon-close" :loading="btnLoading" @click="cancelAuditForm">反审核</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" clearable size="small" style="width: 150px" readonly />
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
                    <el-form-item label="财务日期" prop="financeTime">
                        <el-date-picker v-model="clienteleForm.financeTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" clearable style="width: 150px;" readonly />
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

        <!--  客户 -->
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
                <el-form-item label="客户" prop="clienteleName">
                    <el-input v-model="clienteleQueryParams.clienteleName" placeholder="请输入编码或名称" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryClientele" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryClientele">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="clienteleListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="客户编码" align="center" prop="clienteleNum" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
                <el-table-column label="客户类别" align="center" prop="category.categoryName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="clienteleQueryParams.current"
                    :page-size="clienteleQueryParams.size"
                    :total="clienteleTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeClientele"
                    @current-change="handlePageChangeClientele"
                ></el-pagination>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="openOrder" width="600px" append-to-body>
            <el-form :model="orderForm" ref="orderForm" :rules="orderFormRules" :inline="true" label-width="auto">
                <el-form-item label="订单号" prop="orderNum">
                    <el-input v-model="orderForm.orderNum" clearable style="width: 180px;" />
                </el-form-item>
                <el-form-item label="订单日期" prop="orderTime">
                    <el-date-picker v-model="orderForm.orderTime" clearable value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
                <el-form-item label="签回单号" prop="signbackNum">
                    <el-input v-model="orderForm.signbackNum" clearable style="width: 180px;" />
                </el-form-item>
                <el-form-item label="签回日期" prop="signbackTime">
                    <el-date-picker v-model="orderForm.signbackTime" clearable value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
                <el-form-item label="原始单号" prop="originNum">
                    <el-input v-model="orderForm.originNum" clearable style="width: 180px;" />
                </el-form-item>
                <el-form-item label="原始日期" prop="originTime">
                    <el-date-picker v-model="orderForm.originTime" clearable value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="订单" :visible.sync="openSign" width="800px" append-to-body>
            <el-form :model="orderQueryParams" ref="orderQueryParams" :inline="true">
                <el-form-item label="订单号" prop="orderNum">
                    <el-input v-model="orderQueryParams.orderNum" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item label="签回单号" prop="signbackNum">
                    <el-input v-model="orderQueryParams.signbackNum" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryOrder">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="shipmentsListData" highlight-current-row @row-dblclick="handledbClickOrder">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="handledbClickOrder(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" />
                <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" />
                <el-table-column label="签回单号" align="center" prop="signbackNum" :show-overflow-tooltip="true" />
                <el-table-column label="签回日期" align="center" prop="signbackTime" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="orderQueryParams.current"
                    :page-size="orderQueryParams.size"
                    :total="orderTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeOrder"
                    @current-change="handlePageChangeOrder"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { clienteleSignback } from '@/api/sales/signback.js';
import { addFinanceInit, getFinanceInit, listFinanceInitSub } from '@/api/finance/financeInit.js';
import { treeselect } from '@/api/basis/category.js';
import { listClienteleDialog } from '@/api/basis/clientele.js';
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
            // 弹窗标题
            title: '',
            form: {},
            //表单参数
            clienteleForm: {}, //主表信息
            rules: {
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                financeTime: [{ required: true, message: '财务日期不能为空', trigger: 'blur' }],
                receivePrice: [{ required: true, message: '金额不能为空', trigger: 'blur' }]
            },
            orderListData: [], //子表信息
            // 添加客户
            clienteleTypeOptions: [],
            clienteleListData: [],
            clienteleQueryParams: {
                current: 1,
                size: 10,
                clienteleNum: undefined,
                clienteleName: undefined
            },
            clienteleTotal: 0,
            radio: '',
            // 编辑
            openOrder: false,
            orderForm: {},
            orderFormRules: {},
            // 订单
            shipmentsListData: [],
            orderQueryParams: { current: 0, size: 10, signNum: undefined, orderNum: undefined },
            openSign: false,
            orderTotal: 0,

            delSubIds: [],
            btnLoading: false,
            isAudit: false
        };
    },
    watch: {
        $router(to, form) {
            if (to.path === '/page/finance/init/preview' && this.clienteleForm.initId !== this.$route.query.iid) {
                this.getInitData(this.$route.query.iid);
                this.isAudit = Boolean(this.$route.query.isAudit || false);
            }
        }
    },
    created() {
        this.isAudit = Boolean(this.$route.query.isAudit || false);
        this.getInitData(this.$route.query.iid);
    },
    methods: {
        submitAuditForm() {},
        cancelAuditForm() {},
        getInitData(id) {
            if (id) {
                getFinanceInit(id).then(res => {
                    if (res.success) {
                        this.clienteleForm = res.data;
                    }
                });
            }
        },
        submitAllForm() {
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    let data = {
                        clienteleForm: JSON.stringify(this.clienteleForm)
                    };
                    addFinanceInit(data).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
                        } else {
                            this.msgError(res.message);
                        }
                    });
                }
            });
        },
        clearAllForm() {
            this.clienteleForm = {};
            this.clienteleQueryParams = {};
            this.orderListData = [];
            this.resetForm('clienteleForm');
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.openOrder = false;
        },
        /*************客户**********/
        // 分页导航
        handlePageChangeClientele(val) {
            this.$set(this.clienteleQueryParams, 'current', val);
        },
        handleSizeChangeClientele(val) {
            this.$set(this.clienteleQueryParams, 'size', val);
        },
        // 客户类别
        getClienteleTreeselect() {
            treeselect({ category: '1' }).then(res => {
                this.clienteleTypeOptions = res.data;
            });
        },
        handleQueryClientele() {
            this.getClienteleTreeselect();
            this.clienteleQueryParams.clienteleNum = this.clienteleQueryParams.clienteleName;
            listClienteleDialog(this.clienteleQueryParams).then(res => {
                if (res.success) {
                    this.clienteleListData = res.data.records;
                    this.clienteleTotal = res.data.total;
                }
            });
        },
        getCurrentRow(row) {
            this.submitClienteleForm(row);
        },
        handledbClick(row, event, column) {
            this.submitClienteleForm(row);
        },
        submitClienteleForm(row) {
            this.clienteleForm = row;
            this.clienteleForm.remark = '';
            this.open = false;
        },
        handleAddClientele() {
            this.open = true;
            this.title = '添加客户';
            this.handleQueryClientele();
        },

        handleUpdate(index, row) {
            this.openOrder = true;
            this.orderForm = JSON.parse(JSON.stringify(row));
            this.orderForm.index = index;
        },
        handleDelete(index, row) {
            this.orderListData.splice(index, 1);
            this.delSubIds.push(row.initSubId);
        },
        handleAdd() {
            this.resetForm('orderForm');
            let form = { orderNum: undefined, orderTime: undefined, shipmentsNum: undefined, signTime: undefined, originTime: undefined, originNum: undefined };
            this.orderListData.push(form);
        },
        /** 修改按钮操作 */
        submitForm() {
            this.orderListData.splice(this.orderForm.index, 1, this.orderForm);
            this.openOrder = false;
        },
        handleAddOrder() {
            this.openSign = true;
            this.handleQueryOrder();
        },
        /***********订单*********/
        handlePageChangeOrder(val) {
            this.$set(this.orderQueryParams, 'current', val);
        },
        handleSizeChangeOrder(val) {
            this.$set(this.orderQueryParams, 'size', val);
        },
        handleQueryOrder() {
            this.orderQueryParams.clienteleId = this.clienteleForm.clienteleId;
            clienteleSignback(this.orderQueryParams).then(res => {
                this.shipmentsListData = res.data.records;
                this.orderTotal = res.data.total;
            });
        },
        handledbClickOrder(row) {
            this.orderListData.push(row);
            this.openSign = false;
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
