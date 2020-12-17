<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="getPurchaseOutboundData">重 置</el-button>
        </div>
        <el-divider><strong>供应商信息</strong></el-divider>
        <!-- <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddOrder">采购订单</el-button>
        </div> -->
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
                        <el-input v-model="supplierForm.leader" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="supplierForm.phone" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机" prop="mobilephone">
                        <el-input v-model="supplierForm.mobilephone" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="supplierForm.email" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="supplierForm.address" size="small" style="width: 420px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="退货日期" prop="returnsTime">
                        <el-date-picker v-model="supplierForm.returnsTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务员" prop="personnelName">
                        <el-input v-model="supplierForm.personnelName" size="small" suffix-icon="el-icon-search" readonly ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库编码" prop="warehouseNum">
                        <el-input v-model="supplierForm.warehouseNum" size="small" placeholder="选择出库仓库" @focus="warehouseListDialog" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="supplierForm.warehouseName" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="出库日期" prop="outboundTime">
                        <el-date-picker v-model="supplierForm.outboundTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="supplierForm.remark" type="textarea" autosize style="width: 1000px" size="small" readonly />
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
                <!-- <el-table-column prop="hasReturnsNum" label="已退货数量" align="center"></el-table-column> -->
                <el-table-column prop="returnsNum" label="退货数量" align="center"></el-table-column>
                <el-table-column prop="outboundNum" label="出库数量" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'materielListData.' + scope.$index + '.outboundNum'" :rules="formRules.outboundNum">
                            <el-input size="small" @input="calculateInput(scope.row)" maxLength="9" v-model="scope.row.outboundNum" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-form>

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

        <!--  添加仓库窗口 -->
        <el-dialog title="仓库" :visible.sync="open" width="500px" append-to-body>
            <el-form :model="warehouseParams" ref="warehouseParams" :inline="true">
                <el-form-item label="仓库" prop="warehouseName">
                    <el-input v-model="warehouseParams.warehouseName" placeholder="请输入名称或编码" clearable size="small" style="width: 150px" @keyup.enter.native="handleQueryWarehouse" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryWarehouse">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="warehouseListData" @row-dblclick="dbclickWarehouse" highlight-current-row>
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentWarehouseRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="仓库编码" align="center" :show-overflow-tooltip="true" prop="warehouseNum" />
                <el-table-column label="仓库名称" align="center" prop="warehouseName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="warehouseParams.current"
                    :page-size="warehouseParams.size"
                    :total="warehouseTotal"
                    @current-change="handlePageChangeWarehouse"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { updatePurchaseOutbound, getPurchaseOutbound, listPurchaseReturnsSub } from '@/api/purchase/returns.js';
import { userListDialog } from '@/api/system/user.js';
import { warehouseListDialog } from '@/api/basis/warehouse.js';

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
                returnsNum: [{ required: true, message: '退货号不能为空', trigger: 'blur' }],
                orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                supplierNum: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
                supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
                outboundTime: [{ required: true, message: '退货日期不能为空', trigger: 'blur' }],
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
                outboundNum: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: ['blur', 'change'] }
                ]
            },
            //表单参数
            supplierForm: {}, //主表信息
            materielListData: [], //子表信息
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
            // 仓库
            radio: '',
            warehouseListData: [],
            warehouseTotal: 0,
            warehouseParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            }
        };
    },
    created() {
        this.getPurchaseOutboundData();
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/purchase/outbound/edit' && this.supplierForm.returnsId !== this.$route.query.id) {
                this.getPurchaseOutboundData();
            }
        }
    },
    methods: {
        getPurchaseOutboundData() {
            let id = this.$route.query.id;
            getPurchaseOutbound(id).then(res => {
                this.supplierForm = res.data;
                this.$set(this.supplierForm, 'outboundTime', this.parseTime(new Date()));
                listPurchaseReturnsSub({ returnsId: id }).then(res => {
                    this.formData.materielListData = res.data;
                });
            });
        },
        getPersonnelName() {
            this.supplierForm.personnelName = this.$store.getters.name;
            this.supplierForm.personnelId = this.$store.getters.userId;
            this.supplierForm.returnsTime = this.parseTime(new Date());
        },
        // 供应商分页导航
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
                            taht.supplierForm.outboundStatus = '1';
                            taht.supplierForm.auditStatus = '1';
                            let data = {
                                header: taht.supplierForm,
                                bodys: taht.formData.materielListData
                            };
                            updatePurchaseOutbound(data).then(res => {
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
        calculateInput(row) {
            let outboundNumStr = row.outboundNum;
            if (!validNumber(outboundNumStr)) {
                return;
            }
            let returnsNum = parseInt(row.returnsNum || 0);
            let outboundNum = parseInt(outboundNumStr || 0);
            if (outboundNum > returnsNum) {
                row.outboundNum = returnsNum;
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
            this.delSubIds.push(row.returnsSubId);
            this.formData.materielListData.splice(index, 1);
            this.calculateTotalPrice();
        },
        // ===================仓库===================
        warehouseListDialog() {
            this.open = true;
            this.handleQueryWarehouse();
        },
        getWarehouseListData() {
            warehouseListDialog(this.warehouseParams).then(res => {
                this.warehouseListData = res.data.records;
                this.warehouseTotal = res.data.total;
            });
        },
        handlePageChangeWarehouse(val) {
            this.$set(this.warehouseParams, 'current', val);
            this.getWarehouseListData();
        },
        handleQueryWarehouse() {
            this.warehouseParams.current = 1;
            this.getWarehouseListData();
        },
        getCurrentWarehouseRow(row) {
            this.submitWarehouseForm(row);
        },
        dbclickWarehouse(row, column, event) {
            this.submitWarehouseForm(row);
        },
        submitWarehouseForm(row) {
            this.open = false;
            this.$set(this.supplierForm, 'warehouseId', row.warehouseId);
            this.$set(this.supplierForm, 'warehouseNum', row.warehouseNum);
            this.$set(this.supplierForm, 'warehouseName', row.warehouseName);
            this.$refs.supplierForm.clearValidate('warehouseNum');
            this.$refs.supplierForm.clearValidate('warehouseName');
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
