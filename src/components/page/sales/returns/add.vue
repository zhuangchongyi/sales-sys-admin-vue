<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm" :loading="btnLoading">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm" :loading="btnLoading">清 空</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddClientele">客户订单</el-button>
        </div>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="退货单号" prop="returnsNum">
                        <el-input v-model="clienteleForm.returnsNum" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="clienteleForm.orderNum" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" maxlength="10" show-word-limit size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系人" prop="leader">
                        <el-input v-model="clienteleForm.leader" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="clienteleForm.phone" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机" prop="mobilephone">
                        <el-input v-model="clienteleForm.mobilephone" clearable size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="clienteleForm.email" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="clienteleForm.address" size="small" maxlength="200" style="width: 420px" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="退货金额" prop="totalPrice">
                        <el-input v-model="clienteleForm.totalPrice" size="small" readonly style="width: 150px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="退货日期" prop="returnsTime">
                        <el-date-picker v-model="clienteleForm.returnsTime" placeholder="选择日期" size="small" style="width: 150px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="退货人员" prop="personnelName">
                        <el-input
                            v-model="clienteleForm.personnelName"
                            size="small"
                            placeholder="选择人员"
                            suffix-icon="el-icon-search"
                            @focus="personnelFocus"
                            ref="personnelBlur"
                            style="width: 155px;"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="退货原因" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" autosize style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" width="150" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" width="150" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true" width="150"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true" width="150"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
            <el-table-column prop="unitsName" label="单位" align="center" width="100"></el-table-column>
            <el-table-column prop="price" label="单价" align="center" width="100"> </el-table-column>
            <el-table-column prop="number" label="订购数量" align="center" width="100"></el-table-column>
            <el-table-column prop="hasOutboundNum" label="已发货数量" align="center" width="100"></el-table-column>
            <el-table-column prop="hasSignbackNum" label="已签收数量" align="center" width="100"></el-table-column>
            <el-table-column prop="hasReturnNum" label="累计退货数量" align="center" width="100"></el-table-column>
            <el-table-column prop="returnsNum" label="本次退货数量" align="center" width="120">
                <template slot-scope="scope">
                    <el-input size="mini" @input="calculateTotal(scope.row)" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.returnsNum" />
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="本次退货金额" align="center" width="120"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  添加客户窗口 -->
        <el-dialog title="客户订单" :visible.sync="open" width="800px" append-to-body>
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item label="订单号" prop="orderNum">
                    <el-input v-model="queryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item label="客户" prop="clienteleName">
                    <el-input v-model="queryParams.clienteleName" placeholder="请输入编码或名称" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryOrder" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryOrder">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="clienteleListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" />
                <el-table-column label="发货日期" align="center" prop="orderTime" :show-overflow-tooltip="true" />
                <el-table-column label="客户编码" align="center" prop="clienteleNum" :show-overflow-tooltip="true" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="queryParams.current"
                    :page-size="queryParams.size"
                    :total="clienteleTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChangeClientele"
                ></el-pagination>
            </div>
        </el-dialog>

        <!-- 业务人员弹窗 -->
        <el-dialog title="业务员" :visible.sync="personnelOpen" width="600px" append-to-body>
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
import { listReturnOrder, listSignOrderSub } from '@/api/sales/order.js';
import { addReturns } from '@/api/sales/returns.js';
import { treeselect } from '@/api/basis/category.js';
import { listClienteleDialog } from '@/api/basis/clientele.js';
import { userListDialog } from '@/api/system/user.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { listUnits } from '@/api/basis/units.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-returns-add',
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 表单校验
            rules: {
                orderNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                returnsTime: [{ required: true, message: '退货日期不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '业务人员不能为空', trigger: 'change' }],
                warehouseName: [{ required: true, message: '仓库不能为空', trigger: 'change' }]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            materielListData: [], //子表信息
            // 添加客户
            clienteleListData: [],
            clienteleSelected: undefined,
            radio: '',
            queryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                orderNum: undefined
            },
            clienteleTotal: 0,
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
            personnelSelection: undefined,
            btnLoading: false
        };
    },
    created() {
        this.getPersonnelName();
    },
    methods: {
        getPersonnelName() {
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.returnsTime = this.parseTime(new Date());
        },
        // 客户分页导航
        handlePageChangeClientele(val) {
            this.$set(this.queryParams, 'current', val);
            this.handleQueryOrder();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQueryOrder();
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.open = true;
            this.handleQueryOrder();
        },
        listOrderSubList() {
            let param = { orderId: this.clienteleForm.orderId };
            listSignOrderSub(param).then(res => {
                res.data.forEach(item => {
                    if (!item.orderSubId) {
                        item.orderSubId = item.subId;
                        item.subId = undefined;
                    }
                });
                this.materielListData = res.data;
                this.calculateTotalAll();
            });
        },
        handleQueryOrder() {
            this.queryParams.clienteleNum = this.queryParams.clienteleName;
            listReturnOrder(this.queryParams).then(res => {
                this.clienteleListData = res.data.records;
                this.clienteleTotal = res.data.total;
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
            this.open = false;
            this.getPersonnelName();
            this.listOrderSubList();
        },
        // 计算数量金额
        calculateTotalAll() {
            let totalPrice = 0;
            this.materielListData.forEach(item => {
                let total = parseInt(item.returnsNum || 0) * parseFloat(item.price || 0);
                item.totalPrice = total.toFixed(2);
                totalPrice = totalPrice + total;
            });
            this.$set(this.clienteleForm, 'totalPrice', totalPrice.toFixed(2));
        },
        calculateTotal(row) {
            // 最大可退货数量=已签收数量
            if (row.returnsNum > row.hasSignbackNum) {
                row.returnsNum = row.hasSignbackNum;
            }
            row.totalPrice = (parseInt(row.returnsNum || 0) * parseInt(row.price || 0)).toFixed(2);
            this.calculateTotalAll();
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.materielListData = [];
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.returnsTime = this.parseTime(new Date());
            this.resetForm('clienteleForm');
        },
        submitAddForm() {
            if (this.clienteleForm.returnsNum) {
                this.msgError('已保存');
                return;
            }
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('没有可退货的产品');
                        return;
                    }
                    let materielListData = this.materielListData.filter(item => {
                        if (!item.returnsId) {
                            item.subId = undefined;
                        }
                        return item.returnsNum > 0;
                    });
                    if (materielListData.length == 0) {
                        this.msgError('没有可退货的产品');
                        return;
                    }
                    let data = {
                        clientele: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(materielListData)
                    };
                    this.btnLoading = true;
                    addReturns(data)
                        .then(res => {
                            if (res.success) {
                                this.msgSuccess(res.message);
                                this.returnsNum = res.data;
                            } else {
                                this.msgError(res.message);
                            }
                            this.btnLoading = false;
                        })
                        .catch(e => {
                            this.btnLoading = false;
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
            this.personnelSelection = undefined;
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
            this.handlePersonnelQuery();
            // 失去焦点
            // this.$refs.personnelBlur.blur();
        },
        getPersonnelRow(row) {
            this.personnelSelection = row;
            this.submitFormPersonnel();
        },
        submitFormPersonnel(row) {
            if (row) {
                this.personnelSelection = row;
            }
            this.clienteleForm.personnelId = this.personnelSelection.userId;
            this.clienteleForm.personnelName = this.personnelSelection.nickname;
            this.personnelOpen = false;
            this.$refs.clienteleForm.clearValidate('personnelName');
        },

        // 删除产品
        handleDelete(index, row) {
            this.materielListData.splice(index, 1);
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
