<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAddForm">保 存</el-button>
            <!-- <el-button icon="el-icon-refresh" :loading="btnLoading" @click="getShipmentsData">重 置</el-button> -->
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
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
                    <el-form-item label="客户类别" prop="categoryId">
                        <treeselect
                            :disabled="true"
                            v-model="clienteleForm.categoryId"
                            :options="clienteleTypeOptions"
                            :disable-branch-nodes="true"
                            :show-count="true"
                            style="width: 155px;"
                            placeholder="选择类别"
                        />
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
            </el-row>
            <el-row>
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
                <el-col :span="4">
                    <el-form-item label="仓库编码" prop="warehouseNum">
                        <el-input v-model="clienteleForm.warehouseNum" size="small" placeholder="选择出库仓库" @focus="warehouseListDialog" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="clienteleForm.warehouseName" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="出库日期" prop="outboundTime">
                        <el-date-picker v-model="clienteleForm.outboundTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" autosize style="width: 1000px" size="small" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="unitsName" label="单位" align="center"></el-table-column>
            <el-table-column prop="price" label="单价" align="center"> </el-table-column>
            <el-table-column prop="number" label="订购数量" align="center"> </el-table-column>
            <el-table-column prop="shipmentNum" label="发货数量" align="center"> </el-table-column>
            <el-table-column prop="outboundNum" label="本次出库数量" align="center">
                <template slot-scope="scope">
                    <el-input size="small" @input="calculateTotal(scope.row)" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.outboundNum" />
                </template>
            </el-table-column>
        </el-table>

        <!--  添加客户窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
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
                <el-table-column label="订单号" align="center" prop="orderNum" :show-overflow-tooltip="true" />
                <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" />
                <el-table-column label="客户编码" align="center" prop="clienteleNum" :show-overflow-tooltip="true" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="clienteleQueryParams.current"
                    :page-size="clienteleQueryParams.size"
                    :total="clienteleTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChangeClientele"
                ></el-pagination>
            </div>
        </el-dialog>

        <!-- 业务人员弹窗 -->
        <el-dialog :title="title" :visible.sync="personnelOpen" width="600px" append-to-body>
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

        <el-dialog :title="title" :visible.sync="warehouseOpen" width="500px" append-to-body>
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
import { listOrderPage, getOrderSub } from '@/api/sales/order.js';
import { updateOutbound, getShipments, listShipmentsSub } from '@/api/sales/shipments.js';
import { warehouseListDialog } from '@/api/basis/warehouse.js';
import { treeselect } from '@/api/basis/category.js';
import { listClienteleDialog } from '@/api/basis/clientele.js';
import { userListDialog } from '@/api/system/user.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { listUnits } from '@/api/basis/units.js';

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-price-add',
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
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                outboundTime: [{ required: true, message: '出库日期不能为空', trigger: 'blur' }],
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'change' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'change' }],
                personnelName: [{ required: true, message: '业务人员不能为空', trigger: 'blur' }]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            materielListData: [], //子表信息
            // 添加客户
            clienteleListData: [],
            clienteleSelected: undefined,
            radio: '',
            clienteleQueryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                categoryId: undefined,
                status: '0'
            },
            clienteleTotal: 0,
            clienteleTypeOptions: [], //客户类别
            orderNum: undefined,
            shipmentsId: undefined,
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

            delSubIds: [],
            isAudit: false,
            btnLoading: false,
            warehouseParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            warehouseSelection: undefined,
            warehouseListData: [],
            warehouseTotal: 0,
            warehouseOpen: false
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/warehouse/outbound/edit' && this.shipmentsId !== this.$route.query.id) {
                this.shipmentsId = this.$route.query.id;
                this.isAudit = JSON.parse(this.$route.query.isAudit || false);
                this.getShipmentsData();
            }
        }
    },
    created() {
        this.shipmentsId = this.$route.query.id;
        this.isAudit = JSON.parse(this.$route.query.isAudit || false);
        this.getTreeselectClienteleType();
        this.getShipmentsData();
    },
    methods: {
        getShipmentsData() {
            if (this.shipmentsId) {
                getShipments(this.shipmentsId).then(res => {
                    if (res.success) {
                        this.clienteleForm = res.data;
                        listShipmentsSub({ shipmentsId: this.clienteleForm.shipmentsId }).then(res => {
                            this.materielListData = res.data;
                        });
                    }
                });
            }
        },
        getPersonnelName() {
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.outboundTime = this.parseTime(new Date());
        },
        // 客户类别
        getTreeselectClienteleType() {
            treeselect({ category: '1' }).then(res => {
                this.clienteleTypeOptions = res.data;
            });
        },
        // 客户分页导航
        handlePageChangeClientele(val) {
            this.$set(this.clienteleQueryParams, 'current', val);
            this.handleQueryClientele();
        },
        handleSizeChange(val) {
            this.$set(this.clienteleQueryParams, 'size', val);
            this.handleQueryClientele();
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.open = true;
            this.title = '添加客户订单';
            this.getOrderData();
        },
        handleQueryClientele() {
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
            this.open = false;
            this.clienteleForm.remark = '';
            this.getPersonnelName();
            this.getOrderSubList();
        },
        calculateTotal(row) {
            if (row.outboundNum > row.shipmentNum) {
                row.outboundNum = row.shipmentNum;
            }
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.form = {};
            this.materielListData = [];
            this.shipmentsId = undefined;
            this.orderNum = undefined;
            this.resetForm('clienteleForm');
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
        },
        submitAddForm() {
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('未添加产品');
                        return;
                    }
                    let data = {
                        clientele: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(this.materielListData)
                    };
                    console.log(data);
                    updateOutbound(data).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
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
            this.title = '业务员';
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

        warehouseListDialog() {
            this.warehouseOpen = true;
            this.title = '仓库';
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
            this.clienteleForm.warehouseNum = row.warehouseNum;
            this.clienteleForm.warehouseName = row.warehouseName;
            this.clienteleForm.warehouseId = row.warehouseId;
            this.warehouseOpen = false;
            this.$refs.clienteleForm.clearValidate('warehouseNum');
            this.$refs.clienteleForm.clearValidate('warehouseName');
            this.$set(this.clienteleForm, 'outboundTime', this.parseTime(new Date()));
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
