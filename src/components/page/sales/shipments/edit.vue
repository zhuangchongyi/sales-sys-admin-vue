<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <!-- <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button> -->
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <!-- <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddClientele"
                >客户订单</el-button
            >
        </div> -->
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
                        <el-input v-model="clienteleForm.address" size="small" maxlength="200" style="width: 420px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="发货日期" prop="shipmentsTime">
                        <el-date-picker v-model="clienteleForm.shipmentsTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="发货人员" prop="personnelName">
                        <el-input v-model="clienteleForm.personnelName" size="small" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" autosize style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <!-- <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-show="false" @click="handleAddMateriel"
                >新增产品</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddLinkMateriel"
                >产品</el-button
            >
        </div> -->
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="unitsName" label="单位" width="100" align="center"></el-table-column>
            <el-table-column prop="price" label="单价" width="150" align="center"> </el-table-column>
            <el-table-column prop="number" label="订购数量" width="150" align="center"> </el-table-column>
            <el-table-column prop="hasShipmentNum" label="已发货数量" width="150" align="center"> </el-table-column>
            <el-table-column prop="shipmentNum" width="150" label="本次发货数量" align="center">
                <template slot-scope="scope">
                    <el-input size="small" @input="calculateTotal(scope.row)" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.shipmentNum" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <!-- 引入产品 -->
        <el-dialog :title="title" :visible.sync="linkMaterielOpen" width="800px" append-to-body>
            <el-form :model="materielQueryParams" ref="materielQueryParams" :inline="true">
                <el-form-item label="产品类别" prop="deptId">
                    <treeselect v-model="form.deptId" :options="materileTypeOptions" :disable-branch-nodes="true" :show-count="true" style="width: 180px" placeholder="请选择类别" />
                </el-form-item>
                <el-form-item label="产品名称" prop="materielName">
                    <el-input v-model="materielQueryParams.materielName" placeholder="请输入产品名称或编码" clearable size="small" style="width: 180px" @keyup.enter.native="handleQueryMateriel" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryMateriel">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="linkMaterielLoading" :data="linkMaterielListData" highlight-current-row @row-dblclick="clickSelectionMateriel" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column label="产品编码" align="center" prop="materielNum" :show-overflow-tooltip="true" width="100" />
                <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" width="120" />
                <el-table-column prop="specification" label="规格" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="modelName" label="型号" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="needTorque" label="所需扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="outTorque" label="输出扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="unitsName" label="单位" align="center" width="100"></el-table-column>
                <el-table-column prop="price" label="单价" align="center" width="100"></el-table-column>
                <!-- <el-table-column prop="maxPrice"
                         label="最高价"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="minPrice"
                         label="最低价"
                         align="center"
                         width="100"></el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="materielQueryParams.current"
                    :page-size="materielQueryParams.size"
                    :total="materielTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeMateriel"
                    @current-change="handlePageChangeMateriel"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加修改产品 -->
        <el-dialog :title="title" :visible.sync="materielOpen" width="600px" append-to-body>
            <el-form :model="form" ref="form" :rules="formRules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="产品类别" prop="categoryId">
                            <treeselect v-model="form.categoryId" :options="materileTypeOptions" :disable-branch-nodes="true" :show-count="true" :disabled="true" placeholder="请选择产品类别" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编码" prop="materielNum">
                            <el-input v-model="form.materielNum" placeholder="请输入产品编码" maxlength="10" readonly show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入产品名称" readonly maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="规格" prop="specification">
                            <el-input v-model="form.specification" placeholder="请输入规格" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="型号" prop="modelName">
                            <el-input v-model="form.modelName" placeholder="请输入型号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所需扭矩" prop="needTorque">
                            <el-input v-model="form.needTorque" placeholder="请输入所需扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="输出扭矩" prop="outTorque">
                            <el-input v-model="form.outTorque" placeholder="请输入输出扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="unitsName">
                            <el-input v-model="form.unitsName" @focus="unitsFocus" ref="unitsBlur" placeholder="请输入单位" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="price">
                            <el-input
                                v-model="form.price"
                                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                maxLength="9"
                                placeholder="请输入单价"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="number">
                            <el-input v-model="form.number" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" placeholder="请输入数量"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="技术要求" prop="demand">
                            <el-input v-model="form.demand" placeholder="请输入技术要求" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormMateriel">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 上传图纸对话框 -->
        <el-dialog :title="title" :visible.sync="uploadOpen" width="600px" append-to-body> </el-dialog>

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

        <!-- 基本单位弹窗 -->
        <el-dialog :title="title" :visible.sync="unitsOpen" width="600px" append-to-body>
            <el-form :model="unitsQueryParam" ref="unitsQueryParam" :inline="true">
                <el-form-item label="单位类型" prop="unitsType">
                    <el-select v-model="unitsQueryParam.unitsType" clearable size="small" style="width: 120px">
                        <el-option v-for="dict in unitsTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item label="编码" prop="unitsNum">
                    <el-input v-model="unitsQueryParam.unitsNum" clearable size="small" style="width: 100px" @keyup.enter.native="handleQueryUnits" />
                </el-form-item>
                <el-form-item label="名称" prop="unitsName">
                    <el-input v-model="unitsQueryParam.unitsName" clearable size="small" style="width: 100px" @keyup.enter.native="handleQueryUnits" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryUnits">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="unitsLoading" :data="unitsListData" highlight-current-row @row-dblclick="handleClickUnits">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getUnitsRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="单位编码" align="center" prop="unitsNum" />
                <el-table-column label="单位名称" align="center" prop="unitsName" />
                <el-table-column label="单位类型" align="center" :formatter="unitsTypeFormatter" prop="unitsType" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="unitsQueryParam.current"
                    :page-size="unitsQueryParam.size"
                    :total="unitsTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeUnits"
                    @current-change="handlePageChangeUnits"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listOrderPage, getOrderSub } from '@/api/sales/order.js';
import { addAndUpdateShipments, getShipments, listShipmentsSub } from '@/api/sales/shipments.js';
import { treeselect } from '@/api/basis/category.js';
import { listClientele } from '@/api/basis/clientele.js';
import { userListPage } from '@/api/system/user.js';
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
                orderTime: [{ required: true, message: '订单日期不能为空', trigger: 'blur' }],
                shipmentsTime: [{ required: true, message: '发货日期不能为空', trigger: 'blur' }],
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
            //表单参数
            clienteleForm: {
                orderTime: null
            }, //主表信息
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
            totalPrice: 0,
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
            selectedUnits: undefined,
            delSubIds: []
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/sales/shipments/edit' && this.shipmentsId !== this.$route.query.id) {
                this.shipmentsId = this.$route.query.id || 0;
                this.getShipmentsData();
            }
        }
    },
    created() {
        this.clienteleForm.shipmentsId = this.$route.query.id || 0;
        this.getTreeselectClienteleType();
        this.getShipmentsData();
    },
    methods: {
        getShipmentsData() {
            getShipments(this.clienteleForm.shipmentsId).then(res => {
                if (res.success) {
                    this.clienteleForm = res.data;
                    listShipmentsSub({ shipmentsId: this.clienteleForm.shipmentsId }).then(res => {
                        this.materielListData = res.data;
                    });
                }
            });
        },
        getOrderData() {
            this.clienteleListData = [];
            this.clienteleTotal = 0;
            listOrderPage().then(res => {
                console.log('getOrderData', res);
                this.clienteleListData = res.data.records || [];
                this.clienteleTotal = res.data.total || 0;
            });
        },
        getOrderSubList() {
            let param = { orderId: this.clienteleForm.orderId };
            getOrderSub(param).then(res => {
                this.materielListData = res.data || [];
                this.calculateTotalAll();
            });
        },
        getPersonnelName() {
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.shipmentsTime = this.parseTime(new Date());
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
            // this.handleQueryClientele();
            this.open = true;
            this.title = '添加客户订单';
            this.getOrderData();
        },
        handleQueryClientele() {
            this.clienteleQueryParams.clienteleNum = this.clienteleQueryParams.clienteleName;
            listClientele(this.clienteleQueryParams).then(res => {
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
        // 计算数量
        calculateTotalAll() {
            // console.log('calculateTotalAll', this.materielListData);
            this.materielListData.forEach(item => {
                item.shipmentNum = parseInt(item.number || 0) - parseInt(item.hasShipmentNum || 0);
            });
        },
        calculateTotal(row) {
            // console.log('calculateTotal', row);
            let shipmentNum = parseInt(row.number || 0) - parseInt(row.hasShipmentNum || 0);
            let newShipmentNum = parseInt(row.shipmentNum || 0);
            if (newShipmentNum > shipmentNum) {
                row.shipmentNum = shipmentNum;
            }
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.form = {};
            this.materielListData = [];
            this.orderId = undefined;
            this.orderNum = undefined;
            this.totalPrice = 0;
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.orderTime = this.parseTime(new Date());
            this.resetForm('clienteleForm');
        },
        submitAddForm() {
            let taht = this;
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('没有可发货的产品');
                        return;
                    }
                    let materielListData = this.materielListData.filter(item => {
                        if (!item.orderSubId) {
                            item.orderSubId = item.subId;
                            item.subId = undefined;
                        }
                        return item.shipmentNum > 0;
                    });
                    if (materielListData.length == 0) {
                        this.msgError('没有可发货的产品');
                        return;
                    }
                    let data = {
                        clientele: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(materielListData),
                        delSubIds: JSON.stringify(this.delSubIds)
                    };
                    addAndUpdateShipments(data).then(res => {
                        console.log('addAndUpdateShipments', res);
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
            this.clienteleForm.personnelId = this.personnelSelection.userId;
            this.clienteleForm.personnelName = this.personnelSelection.nickname;
            this.personnelOpen = false;
            this.$refs.clienteleForm.clearValidate('personnelName');
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
        // 添加标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 上传图片
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
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
