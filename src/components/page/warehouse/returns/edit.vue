<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm" :loading="btnLoading">保 存</el-button>
            <!-- <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button> -->
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <!-- <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddClientele">客户发货单</el-button>
        </div> -->
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="退货单号" prop="returnsNum">
                        <el-input v-model="clienteleForm.returnsNum" size="small" style="width: 155px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="退入仓库" prop="warehouseName">
                        <el-input v-model="clienteleForm.warehouseName" size="small" placeholder="选择仓库" suffix-icon="el-icon-search" @focus="warehouseFocus" style="width: 150px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="入库日期" prop="storageTime">
                        <el-date-picker v-model="clienteleForm.storageTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" size="small" style="width: 150px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="入库人员" prop="storageBy">
                        <el-input v-model="clienteleForm.storageBy" size="small" placeholder="请选择" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="unitsName" label="单位" width="100" align="center"></el-table-column>
            <el-table-column prop="returnsNum" label="退货数量" width="150" align="center"></el-table-column>
            <el-table-column prop="realityNum" width="150" label="入库数量" align="center">
                <template slot-scope="scope">
                    <el-input size="small" @input="calculateTotal(scope.row)" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.realityNum" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <!--  添加客户窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form :model="clienteleQueryParams" ref="clienteleQueryParams" :inline="true">
                <el-form-item label="发货单号" prop="shipmentsNum">
                    <el-input v-model="clienteleQueryParams.shipmentsNum" placeholder="发货单号" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryClientele" />
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
                <el-table-column label="发货单号" align="center" prop="shipmentsNum" :show-overflow-tooltip="true" />
                <el-table-column label="发货日期" align="center" prop="shipmentsTime" :show-overflow-tooltip="true" />
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

        <!-- 仓库弹窗 -->
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
import { listShipments, listShipmentsSub } from '@/api/sales/shipments.js';
import { editReturns, getReturns, listReturnsSub } from '@/api/sales/returns.js';
import { treeselect } from '@/api/basis/category.js';
import { listClientele } from '@/api/basis/clientele.js';
import { userListPage } from '@/api/system/user.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { listUnits } from '@/api/basis/units.js';
import { warehouseListPage } from '@/api/basis/warehouse.js';
export default {
    name: 'sales-returns-edit',
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
                shipmentsNum: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                storageTime: [{ required: true, message: '退货日期不能为空', trigger: 'blur' }],
                storageBy: [{ required: true, message: '业务人员不能为空', trigger: 'change' }],
                warehouseName: [{ required: true, message: '仓库不能为空', trigger: 'change' }]
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
                shipmentsStatus: '1',
                outboundStatus: '1',
                shipmentsNum: undefined
            },
            clienteleTotal: 0,
            clienteleTypeOptions: [], //客户类别
            totalPrice: 0,
            returnsNum: undefined,
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
                materielNum: undefined,
                materielName: undefined
            },
            materielTotal: 0,
            materielEdit: false,
            materielIndex: undefined,

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
            selectedUnits: undefined,
            delSubIds: [],

            warehouseParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            warehouseSelection: undefined,
            warehouseListData: [],
            warehouseTotal: 0,
            warehouseOpen: false,

            returnsId: undefined,
            btnLoading: false
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/sales/returns/edit' && this.returnsId !== this.$route.query.rId) {
                this.returnsId = this.$route.query.rId;
                this.getReturnsData();
            }
        }
    },
    created() {
        this.returnsId = this.$route.query.rId;
        this.getReturnsData();
    },
    methods: {
        getReturnsData() {
            if (this.returnsId) {
                getReturns(this.returnsId).then(res => {
                    if (res.success) {
                        this.clienteleForm = res.data;
                        // this.getPersonnelName();
                        listReturnsSub({ returnsId: this.returnsId }).then(res => {
                            this.materielListData = res.data;
                            this.calculateTotalAll();
                        });
                    }
                });
            }
        },
        listShipmentsSubList() {
            let param = { shipmentsId: this.clienteleForm.shipmentsId };
            listShipmentsSub(param).then(res => {
                this.materielListData = res.data || [];
                this.calculateTotalAll();
            });
        },
        getPersonnelName() {
            this.clienteleForm.storageBy = this.$store.getters.name;
            this.clienteleForm.storageId = this.clienteleForm.storageId;
            this.clienteleForm.storageTime = this.parseTime(new Date());
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
            this.handleQueryClientele();
        },
        handleQueryClientele() {
            this.clienteleQueryParams.clienteleNum = this.clienteleQueryParams.clienteleName;
            listShipments(this.clienteleQueryParams).then(res => {
                this.clienteleListData = res.data.records || [];
                this.clienteleTotal = res.data.total || 0;
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
            this.listShipmentsSubList();
        },
        // 计算数量金额
        calculateTotalAll() {
            this.materielListData.forEach(item => {
                item.realityNum = item.returnsNum;
            });
        },
        calculateTotal(row) {
            if (row.realityNum > row.returnsNum) {
                row.realityNum = row.returnsNum;
            }
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.form = {};
            this.materielListData = [];
            this.shipmentsId = undefined;
            this.returnsNum = undefined;
            this.totalPrice = 0;
            this.clienteleForm.storageBy = this.$store.getters.name;
            this.clienteleForm.storageId = this.$store.getters.userId;
            this.clienteleForm.storageTime = this.parseTime(new Date());
            this.resetForm('clienteleForm');
        },
        submitAddForm() {
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('没有可入库的产品');
                        return;
                    }
                    let materielListData = this.materielListData.filter(item => {
                        if (!item.returnsId) {
                            item.subId = undefined;
                        }
                        return item.returnsNum > 0;
                    });
                    if (materielListData.length == 0) {
                        this.msgError('入库的产品数量不能为0');
                        return;
                    }
                    let data = {
                        clientele: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(materielListData),
                        delSubIds: JSON.stringify(this.delSubIds)
                    };
                    this.btnLoading = true;
                    editReturns(data)
                        .then(res => {
                            if (res.success) {
                                this.msgSuccess(res.message);
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
            userListPage(this.personnelQueryParams).then(res => {
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
            this.clienteleForm.storageId = this.personnelSelection.userId;
            this.clienteleForm.storageBy = this.personnelSelection.nickname;
            this.personnelOpen = false;
            this.$refs.clienteleForm.clearValidate('storageBy');
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
            this.materielSelection = [row];
            this.submitForm();
        },
        // 产品列表
        handleAddLinkMateriel() {
            this.linkMaterielOpen = true;
            this.title = '添加产品';
            this.getTreeselectMateriel();
            this.getMaterielList();
        },
        getMaterielList() {
            listAllMateriel(this.materielQueryParams).then(res => {
                this.linkMaterielListData = res.data.records;
                this.materielTotal = res.data.total;
                this.linkMaterielLoading = false;
            });
        },
        handlePageChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'current', val);
        },
        handleSizeChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'size', val);
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
            this.totalPrice = total.toFixed(2);
        },
        // 删除产品
        handleDelete(index, row) {
            if (row.subId) {
                console.log('dellete', row);
                this.delSubIds.push(row.subId);
            } else {
                this.calculateTotalPrice();
            }
            this.materielListData.splice(index, 1);
        },
        handleAddMateriel() {
            this.resetMaterielForm();
            this.getTreeselectMateriel();
            this.materielOpen = true;
            this.title = '添加产品';
            this.materielEdit = false;
        },
        /** 修改按钮操作 */
        handleUpdateMateriel(index, row) {
            this.resetMaterielForm();
            this.getTreeselectMateriel();
            this.materielOpen = true;
            this.title = '修改产品';
            this.materielEdit = true;
            this.materielIndex = index;
            this.form = JSON.parse(JSON.stringify(row));
        },
        resetMaterielForm() {
            this.form = {};
            this.resetForm('form');
        },
        submitFormMateriel() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let materiel = JSON.parse(JSON.stringify(this.form));
                    if (this.materielEdit) {
                        this.materielListData.splice(this.materielIndex, 1, materiel);
                    } else {
                        this.materielListData.push(materiel);
                    }
                    this.resetMaterielForm();
                    this.calculateTotalPrice();
                    this.materielOpen = false;
                }
            });
        },

        // 基本单位
        unitsFocus(event) {
            this.unitsOpen = true;
            this.title = '选择产品单位';
            this.selectedUnits = undefined;
            this.getUnitsList();
            // 失去焦点
            // this.$refs.unitsBlur.blur();
        },
        handleQueryUnits() {
            this.unitsQueryParam.current = 1;
            this.getUnitsList();
        },
        getUnitsList() {
            listUnits(this.unitsQueryParam).then(res => {
                this.unitsLoading = false;
                this.unitsListData = res.data.records;
                this.unitsTotal = res.data.total;
            });
        },
        handleClickUnits(row, event, column) {
            this.selectedUnits = row;
            this.submitFormUnits();
        },
        getUnitsRow(row) {
            this.selectedUnits = row;
            this.submitFormUnits();
        },
        handlePageChangeUnits(val) {
            this.$set(this.unitsQueryParam, 'current', val);
            this.handleQueryClientele();
        },
        handleSizeChangeUnits(val) {
            this.$set(this.unitsQueryParam, 'size', val);
        },
        submitFormUnits() {
            this.form.unitsId = this.selectedUnits.unitsId;
            this.form.unitsNum = this.selectedUnits.unitsNum;
            this.form.unitsName = this.selectedUnits.unitsName;
            this.unitsOpen = false;
            this.$refs.form.clearValidate('unitsName');
        },
        unitsTypeFormatter(row, column) {
            return this.selectDictLabel(this.unitsTypeOptions, row.unitsType);
        },

        cancelDialog() {
            this.personnelOpen = false;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.materielOpen = false;
            this.uploadOpen = false;
            this.linkMaterielOpen = false;
        },
        handleUpload(row) {
            this.uploadOpen = true;
            this.form = row;
            this.title = '图纸';
        },

        handleDeleteItem(index, row) {
            this.msgSuccess('成功');
        },

        // 仓库
        warehouseFocus(event) {
            this.warehouseOpen = true;
            this.title = '仓库';
            this.handleQueryWarehouse();
        },
        getWarehouseListData() {
            warehouseListPage(this.warehouseParams).then(res => {
                console.log(res);
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
            this.$refs.clienteleForm.clearValidate('warehouseNum');
            this.$refs.clienteleForm.clearValidate('warehouseName');
            this.warehouseOpen = false;
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
