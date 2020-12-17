<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAuditForm">审 核</el-button>
            <el-button type="primary" icon="el-icon-close" :loading="btnLoading" @click="cancelAuditForm">反审核</el-button>
        </div>
        <el-divider><strong>供应商信息</strong></el-divider>
        <!-- <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddOrder">采购订单</el-button>
        </div> -->
        <el-form :model="supplierForm" ref="supplierForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="到货单号" prop="signNum">
                        <el-input v-model="supplierForm.signNum" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="supplierForm.orderNum" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单日期" prop="orderTime">
                        <el-date-picker v-model="supplierForm.orderTime" readonly style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商编码" prop="supplierNum">
                        <el-input v-model="supplierForm.supplierNum" maxlength="10" readonly show-word-limit size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="supplierForm.supplierName" clearable readonly size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系人" prop="leader">
                        <el-input v-model="supplierForm.leader" clearable size="small" readonly style="width: 155px;" />
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
                    <el-form-item label="到货日期" prop="signTime">
                        <el-date-picker v-model="supplierForm.signTime" style="width:155px;" readonly value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务员" prop="personnelName">
                        <el-input v-model="supplierForm.personnelName" size="small" suffix-icon="el-icon-search" readonly ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库编码" prop="warehouseNum">
                        <el-input v-model="supplierForm.warehouseNum" size="small" placeholder="选择出库仓库" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="supplierForm.warehouseName" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="入库日期" prop="storageTime">
                        <el-date-picker v-model="supplierForm.storageTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="supplierForm.remark" type="textarea" autosize style="width: 1000px" readonly size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>

        <el-form :model="formData" ref="formData" :rules="formRules">
            <el-table v-loading="loading" :data="formData.materielListData">
                <el-table-column prop="materielNum" label="产品编码" align="center" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="unitsName" label="单位" width="100" align="center"></el-table-column>
                <!-- <el-table-column prop="price" label="单价" align="center"></el-table-column> -->
                <el-table-column prop="number" label="采购数量" align="center"></el-table-column>
                <el-table-column prop="hasSignNum" label="已到货数量" align="center"></el-table-column>
                <el-table-column prop="signNum" label="到货数量" align="center"> </el-table-column>
                <el-table-column prop="storageNum" label="入库数量" align="center"> </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import { auditPurchaseStorage, getPurchaseStorage, listPurchaseSignSub } from '@/api/purchase/sign.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { validNumber } from '@/utils/validate';
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
            // 表单校验
            rules: {
                signNum: [{ required: true, message: '到货号不能为空', trigger: 'blur' }],
                orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                supplierNum: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
                supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                signTime: [{ required: true, message: '到货日期不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '业务人员不能为空', trigger: 'change' }],
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
                        trigger: ['blur', 'change']
                    }
                ]
            },
            formData: { materielListData: [] },
            formRules: {
                number: [{ required: true, message: '不能为空', trigger: 'blur' }],
                signNum: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { pattern: /^\+?[1-9][0-9]*$/, message: '请输入正整数', trigger: ['blur', 'change'] }
                ]
            },
            //表单参数
            supplierForm: {}, //主表信息
            materielListData: [], //子表信息
            // 添加采购订单
            supplierListData: [],
            radio: '',
            supplierQueryParams: {
                current: 1,
                size: 10,
                supplierName: undefined,
                supplierNum: undefined,
                orderNum: undefined
            },
            supplierTotal: 0,
            orderNum: undefined,
            orderId: undefined,
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
            delSubIds: [],
            isAudit: false,
            isShow: false,
            btnLoading: false
        };
    },
    created() {
        this.getPurchaseSignData();
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/purchase/storage/preview' && this.supplierForm.signId !== this.$route.query.id) {
                this.getPurchaseSignData();
            }
        }
    },
    methods: {
        submitAuditForm() {
            if (this.supplierForm.auditStatus === '3') {
                this.msgError('已审核');
                return;
            }
            let data = {
                id: this.supplierForm.signId,
                status: '3'
            };
            this.btnLoading = true;
            auditPurchaseStorage(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('审核成功');
                        this.getPurchaseSignData();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => (this.btnLoading = false));
        },
        cancelAuditForm() {
            if (this.supplierForm.auditStatus === '4') {
                this.msgError('已反审核');
                return;
            }
            let data = {
                id: this.supplierForm.signId,
                status: '4'
            };
            this.btnLoading = true;
            auditPurchaseStorage(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('反审核成功');
                        this.getPurchaseSignData();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => (this.btnLoading = false));
        },
        getPurchaseSignData() {
            this.isShow = JSON.parse(this.$route.query.isShow || false);
            this.isAudit = JSON.parse(this.$route.query.isAudit || false);
            let id = this.$route.query.id;
            getPurchaseStorage(id).then(res => {
                this.supplierForm = res.data;
                listPurchaseSignSub({ signId: id }).then(res => {
                    this.formData.materielListData = res.data;
                });
            });
        },
        getPurchaseOrderSubList() {
            this.materielListData = [];
            this.loading = true;
            let param = { orderId: this.supplierForm.orderId };
            listPurchaseOrderSub(param)
                .then(res => {
                    this.materielListData = res.data;
                    this.formData.materielListData = res.data;
                    this.loading = false;
                })
                .catch(e => {
                    this.loading = false;
                });
        },
        getPersonnelName() {
            this.supplierForm.personnelName = this.$store.getters.name;
            this.supplierForm.personnelId = this.$store.getters.userId;
            this.supplierForm.signTime = this.parseTime(new Date());
        },
        // 供应商分页导航
        handlePageChangeOrder(val) {
            this.$set(this.supplierQueryParams, 'current', val);
            this.handleQueryOrder();
        },
        handleSizeChange(val) {
            this.$set(this.supplierQueryParams, 'size', val);
            this.handleQueryOrder();
        },
        /** 新增按钮操作 */
        handleAddOrder() {
            this.handleQueryOrder();
            this.open = true;
            this.title = '采购订单';
        },
        handleQueryOrder() {
            listPurchaseOrderDialog(this.supplierQueryParams).then(res => {
                if (res.success) {
                    this.supplierListData = res.data.records;
                    this.supplierTotal = res.data.total;
                }
            });
        },
        getCurrentRow(row) {
            this.submitFormOrder(row);
        },
        handledbClick(row, event, column) {
            this.submitFormOrder(row);
        },
        submitFormOrder(row) {
            this.supplierForm = row;
            this.open = false;
            this.getPersonnelName();
            this.getPurchaseOrderSubList();
        },
        clearAddForm() {
            this.supplierForm = {};
            this.materielListData = [];
            this.resetForm('supplierForm');
            this.getPersonnelName();
        },
        submitAddForm() {
            let taht = this;
            taht.$refs.formData.validate((v, item) => {
                if (v) {
                    taht.$refs['supplierForm'].validate(valid => {
                        if (valid) {
                            if (taht.formData.materielListData.length == 0) {
                                taht.msgError('未添加产品');
                                return;
                            }
                            let data = {
                                delSubIds: taht.delSubIds,
                                header: taht.supplierForm,
                                bodys: taht.formData.materielListData
                            };
                            updatePurchaseSign(data).then(res => {
                                if (res.success) {
                                    taht.msgSuccess(res.message);
                                } else {
                                    taht.msgError(res.message);
                                }
                            });
                        }
                    });
                } else {
                    console.log(item);
                }
            });
        },

        getPersonnelList() {
            userListDialog(this.personnelQueryParams).then(res => {
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
        // 人员编码输入框获取焦点
        personnelFocus(event) {
            this.personnelOpen = true;
            this.title = '业务员';
            this.handlePersonnelQuery();
        },
        getPersonnelRow(row) {
            this.submitFormPersonnel(row);
        },
        submitFormPersonnel(row) {
            this.supplierForm.personnelId = row.userId;
            this.supplierForm.personnelName = row.nickname;
            this.personnelOpen = false;
            this.$refs.supplierForm.clearValidate('personnelName');
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.materielSelection = selection;
        },
        clickSelectionMateriel(row, event, column) {
            this.$refs['linkMaterielListData'].toggleRowSelection(row);
        },
        calculateInputPrice(row) {
            let signNumStr = row.signNum;
            if (!validNumber(signNumStr)) {
                return;
            }
            let signNum = parseInt(row.number || 0) - parseInt(row.hasSignNum || 0);
            let thisSignNum = parseInt(row.signNum || 0);
            if (thisSignNum > signNum) {
                row.signNum = signNum;
            }
        },
        calculateTotalPrice() {
            let total = 0;
            this.materielListData.forEach(item => {
                let price = parseFloat(item.price || 0) * parseInt(item.number || 0);
                item.totalPrice = price.toFixed(2);
                total = parseFloat(total) + price;
            });
            this.$set(this.supplierForm, 'totalPrice', total.toFixed(2));
        },
        handleDelete(index, row) {
            this.delSubIds.push(row.signSubId);
            this.formData.materielListData.splice(index, 1);
            this.calculateTotalPrice();
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
