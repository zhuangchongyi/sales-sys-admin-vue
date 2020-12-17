<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button>
        </div>
        <el-divider><strong>供应商信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddOrder">采购订单</el-button>
        </div>
        <el-form :model="supplierForm" ref="supplierForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="退货单号" prop="returnsNum">
                        <el-input v-model="supplierForm.returnsNum" size="small" readonly style="width: 155px;" />
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
                        <el-input v-model="supplierForm.leader" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="supplierForm.phone" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机" prop="mobilephone">
                        <el-input v-model="supplierForm.mobilephone" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="supplierForm.email" size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="supplierForm.address" size="small" style="width: 420px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="退货日期" prop="returnsTime">
                        <el-date-picker v-model="supplierForm.returnsTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务员" prop="personnelName">
                        <el-input v-model="supplierForm.personnelName" size="small" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="supplierForm.remark" type="textarea" autosize style="width: 1000px" size="small" />
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
                <!-- <el-table-column prop="hasReturnsNum" label="已退货入库数量" align="center"></el-table-column> -->
                <el-table-column prop="returnsNum" label="退货数量" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materielListData.' + scope.$index + '.returnsNum'" :rules="formRules.returnsNum">
                            <el-input size="small" @input="calculateInputPrice(scope.row)" maxLength="9" v-model="scope.row.returnsNum" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>

        <!--  添加采购订单窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body v-dialogDrag>
            <el-form :model="supplierQueryParams" ref="supplierQueryParams" :inline="true">
                <el-form-item label="订单号" prop="orderNum">
                    <el-input v-model="supplierQueryParams.orderNum" placeholder="请输入订单号" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item label="供应商" prop="supplierName">
                    <el-input v-model="supplierQueryParams.supplierName" placeholder="请输入编码或名称" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryOrder">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="supplierListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" />
                <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" />
                <el-table-column label="供应商编码" align="center" prop="supplierNum" :show-overflow-tooltip="true" />
                <el-table-column label="供应商名称" align="center" prop="supplierName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="supplierQueryParams.current"
                    :page-size="supplierQueryParams.size"
                    :total="supplierTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChangeOrder"
                ></el-pagination>
            </div>
        </el-dialog>

        <!-- 业务人员弹窗 -->
        <el-dialog :title="title" :visible.sync="personnelOpen" width="550px" append-to-body>
            <el-form :model="personnelQueryParams" ref="personnelQueryParams" :inline="true">
                <el-form-item label="员工编码" prop="userNum">
                    <el-input v-model="personnelQueryParams.userNum" placeholder="请输入编码 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item label="员工名称" prop="nickname">
                    <el-input v-model="personnelQueryParams.nickname" placeholder="请输入名称 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handlePersonnelQuery">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="personnelLoading" :data="personnelListData" highlight-current-row @row-dblclick="submitFormPersonnel">
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
import { listPurchaseOrderDialog, listPurchaseOrderSub } from '@/api/purchase/order.js';
import { addPurchaseReturns } from '@/api/purchase/returns.js';
import { treeselect } from '@/api/basis/category.js';
import { listSupplierDialog } from '@/api/purchase/supplier.js';
import { userListDialog } from '@/api/system/user.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { listUnits } from '@/api/basis/units.js';
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
                orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                supplierNum: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
                supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                returnsTime: [{ required: true, message: '退货日期不能为空', trigger: 'blur' }],
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
                returnsNum: [
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
            }
        };
    },
    created() {
        this.getPersonnelName();
    },
    methods: {
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
            this.supplierForm.returnsTime = this.parseTime(new Date());
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
                                header: taht.supplierForm,
                                bodys: taht.formData.materielListData
                            };
                            addPurchaseReturns(data).then(res => {
                                if (res.success) {
                                    taht.msgSuccess(res.message);
                                    taht.$set(taht.supplierForm, 'returnsNum', res.data);
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
            let returnsNumStr = row.returnsNum;
            if (!validNumber(returnsNumStr)) {
                return;
            }
            let returnsNum = parseInt(row.number || 0) - parseInt(row.hasReturnsNum || 0);
            let thisReturnsNum = parseInt(row.returnsNum || 0);
            if (thisReturnsNum > returnsNum) {
                row.returnsNum = returnsNum;
            }
        },
        calculateTotalPrice() {
            this.formData.materielListData.forEach(item => {});
        },
        handleDelete(index, row) {
            this.formData.materielListData.splice(index, 1);
            // this.calculateTotalPrice();
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
