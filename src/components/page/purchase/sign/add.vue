<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
        </div>
        <el-divider><strong>供应商信息</strong></el-divider>
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
                        <el-date-picker v-model="supplierForm.orderTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商编码" prop="supplierNum">
                        <el-input v-model="supplierForm.supplierNum" maxlength="10" show-word-limit size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="supplierForm.supplierName" clearable size="small" style="width: 155px;" />
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
                    <el-form-item label="总计金额" prop="totalPrice">
                        <el-input v-model="supplierForm.totalPrice" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单日期" prop="orderTime">
                        <el-date-picker v-model="supplierForm.orderTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
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
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddLinkMateriel">产品</el-button>
        </div>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="unitsName" label="单位" width="100" align="center"></el-table-column>
            <el-table-column prop="price" label="单价" align="center"></el-table-column>
            <el-table-column prop="number" label="采购数量" align="center"></el-table-column>
            <el-table-column prop="signNum" label="到货数量" align="center">
                <template slot-scope="scope">
                    <el-input size="small" @input="calculateTotalPrice" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.signNum" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  添加采购订单窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form :model="supplierQueryParams" ref="supplierQueryParams" :inline="true">
                <el-form-item label="订单号" prop="orderNum">
                    <el-input v-model="supplierQueryParams.orderNum" placeholder="请输入订单号" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryClientele" />
                </el-form-item>
                <el-form-item label="供应商" prop="supplierName">
                    <el-input v-model="supplierQueryParams.supplierName" placeholder="请输入编码或名称" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryClientele" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryClientele">搜索</el-button>
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
                    @current-change="handlePageChangeClientele"
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
import { addPurchaseOrder, getPurchaseOrder, listPurchaseOrderSub } from '@/api/purchase/order.js';
import { treeselect } from '@/api/basis/category.js';
import { listSupplierDialog } from '@/api/purchase/supplier.js';
import { userListDialog } from '@/api/system/user.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { listUnits } from '@/api/basis/units.js';
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
            // 表单校验
            rules: {
                supplierNum: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
                supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                orderTime: [{ required: true, message: '订单日期不能为空', trigger: 'blur' }],
                deliveryTime: [{ required: true, message: '交货日期不能为空', trigger: 'blur' }],
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
            formRules: {
                materielName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
                specification: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
                modelName: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
                unitsName: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
                number: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
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
                categoryId: undefined,
                status: '0'
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

            // 添加产品
            materielSelection: [], //选中产品
            uploadOpen: false,
            fileList: [],
            materielOpen: false,
            linkMaterielOpen: false,
            linkMaterielListData: [],
            linkMaterielLoading: true,
            form: {},
            materileTypeOptions: [],
            materielQueryParams: {
                current: 1,
                size: 10,
                supplierId: undefined,
                materielNum: undefined,
                materielName: undefined
            },
            materielTotal: 0,
            materielEdit: false,
            materielIndex: undefined,
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',

            // 基本单位
            unitsLoading: true,
            unitsOpen: false,
            unitsTotal: 0,
            unitsListData: [],
            unitsQueryParam: {
                current: 1,
                size: 10,
                unitsNum: undefined,
                unitsName: undefined,
                unitsType: undefined,
                status: '0'
            },
            unitsTypeOptions: [
                { dictValue: '0', dictLabel: '基本单位' },
                { dictValue: '1', dictLabel: '包装单位' }
            ],
            delSubIds: [],

            //图片
            imageLoading: true,
            imageListData: [],
            fileQuery: {
                current: 1,
                size: 10,
                materielId: undefined
            },
            fileTotal: 0,
            filePreviewOpen: false,
            imageUrl: undefined,
            imageName: undefined
        };
    },
    methods: {
        getPurchaseOrderList() {
            getPurchaseOrder(this.orderId).then(res => {
                if (res.success) {
                    this.supplierForm = res.data;
                    this.orderId = res.data.orderId;
                    this.orderNum = res.data.orderNum;
                }
            });
        },
        getPurchaseOrderSubList() {
            let param = { orderId: this.orderId };
            listPurchaseOrderSub(param).then(res => {
                this.materielListData = res.data || [];
            });
        },
        getPersonnelName() {
            this.supplierForm.personnelName = this.$store.getters.name;
            this.supplierForm.personnelId = this.$store.getters.userId;
            this.supplierForm.orderTime = this.parseTime(new Date());
        },
        // 供应商分页导航
        handlePageChangeClientele(val) {
            this.$set(this.supplierQueryParams, 'current', val);
            this.handleQueryClientele();
        },
        handleSizeChange(val) {
            this.$set(this.supplierQueryParams, 'size', val);
            this.handleQueryClientele();
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.handleQueryClientele();
            this.open = true;
            this.title = '添加供应商';
        },
        handleQueryClientele() {
            this.supplierQueryParams.supplierNum = this.supplierQueryParams.supplierName;
            listSupplierDialog(this.supplierQueryParams).then(res => {
                if (res.success) {
                    this.supplierListData = res.data.records;
                    this.supplierTotal = res.data.total;
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
            this.supplierForm = row;
            this.open = false;
            this.getPersonnelName();
        },
        clearAddForm() {
            this.supplierForm = {};
            this.form = {};
            this.materielListData = [];
            this.delSubIds = [];
            this.supplierForm.personnelName = this.$store.getters.name;
            this.supplierForm.personnelId = this.$store.getters.userId;
            this.supplierForm.orderTime = this.parseTime(new Date());
            this.resetForm('supplierForm');
        },
        submitAddForm() {
            let taht = this;
            this.$refs['supplierForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('未添加产品');
                        return;
                    }
                    let data = {
                        delSubIds: this.delSubIds,
                        order: this.supplierForm,
                        orderSubs: this.materielListData
                    };
                    addPurchaseOrder(data).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
                            this.getPurchaseOrder();
                        } else {
                            this.msgError(res.message);
                        }
                    });
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

        // 产品类别
        getTreeselectMateriel() {
            treeselect({ category: '0' }).then(res => {
                this.materileTypeOptions = res.data;
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.materielSelection = selection;
        },
        clickSelectionMateriel(row, event, column) {
            this.$refs['linkMaterielListData'].toggleRowSelection(row);
        },
        // 产品列表
        handleAddLinkMateriel() {
            this.linkMaterielOpen = true;
            this.title = '添加产品';
            this.materielQueryParams.supplierId = this.supplierForm.supplierId;
            this.getTreeselectMateriel();
            this.getMaterielList();
        },
        getMaterielList() {
            this.linkMaterielListData = [];
            this.materielTotal = 0;
            listAllMateriel(this.materielQueryParams).then(res => {
                this.linkMaterielListData = res.data.records;
                this.materielTotal = res.data.total;
                this.linkMaterielLoading = false;
            });
        },
        handlePageChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'current', val);
            this.getMaterielList();
        },
        handleSizeChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'size', val);
            this.handleQueryMateriel();
        },
        handleQueryMateriel() {
            this.materielQueryParams.current = 1;
            this.getMaterielList();
        },
        submitForm() {
            if (this.materielSelection.length !== 0) {
                this.materielListData = this.materielListData.concat(this.materielSelection);
            }
            this.linkMaterielOpen = false;
            this.calculateTotalPrice();
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
            if (row.orderSubId) {
                this.delSubIds.push(row.orderSubId);
            }
            this.materielListData.splice(index, 1);
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
