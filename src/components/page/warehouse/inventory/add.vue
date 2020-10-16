<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearForm">清 空</el-button>
        </div>

        <el-divider><strong>仓库信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="mini" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddWarehouse">仓库</el-button>
        </div>
        <el-form :model="warehouseForm" ref="warehouseForm" label-position="right" label-width="auto" :rules="rules" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="仓库编码" prop="warehouseNum">
                        <el-input v-model="warehouseForm.warehouseNum" size="small" readonly style="width: 150px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="仓库名称" prop="warehouseName">
                        <el-input v-model="warehouseForm.warehouseName" size="small" readonly style="width: 150px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="盘点时间" prop="inventoryTime">
                        <el-date-picker v-model="warehouseForm.inventoryTime" placeholder="请选择日期" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 150px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="盘点负责人" prop="personnelName">
                        <el-input v-model="warehouseForm.personnelName" size="small" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" style="width: 150px" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="warehouseForm.remark" type="textarea" style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-divider><strong>产品信息</strong></el-divider>
        <!-- <div class="handle-box">
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-paperclip"
                 class="handle-del mr10"
                 @click="handleAddMateriel">产品</el-button>
    </div> -->
        <el-table v-loading="loading" :data="materielListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="modelName" label="型号" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="unitsName" label="单位" align="center" />
            <el-table-column prop="number" label="现存量" align="center" />
            <!-- <el-table-column prop="realityNum"
                       label="实盘数"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    maxLength='9'
                    @input="calculateTotalPrice(scope.row)"
                    v-model="scope.row.number" />
        </template>
      </el-table-column>
      <el-table-column prop="differenceNum"
                       label="差异数"
                       width="120"
                       align="center">
      </el-table-column> -->
            <!-- <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color:#f56c6c;"
                     @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
        </el-table>

        <!--  添加仓库窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
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
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
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

        <!-- 引入产品 -->
        <el-dialog :title="title" :visible.sync="openMateriel" width="800px" append-to-body>
            <el-form :model="materielParams" ref="materielParams" :inline="true">
                <el-form-item label="产品类别" prop="categoryId">
                    <treeselect v-model="materielParams.categoryId" :options="categoryOptions" :disable-branch-nodes="true" style="width: 200px" :show-count="true" placeholder="请选择类别" />
                </el-form-item>
                <el-form-item label="产品" prop="materielName">
                    <el-input v-model="materielParams.materielName" clearable placeholder="请输入名称或编码" size="small" style="width: 200px" @keyup.enter.native="handleQueryMateriel" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryMateriel">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="materielListPageData" ref="materielListPageData" highlight-current-row @row-click="selectionRowClick" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column prop="materielNum" label="产品编码" align="center" />
                <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="specification" label="规格" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="modelName" label="型号" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="unitsName" label="单位" align="center" />
                <el-table-column label="单价" align="center" prop="price" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="materielParams.currrent"
                    :page-size="materielParams.size"
                    :total="materielTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeMateriel"
                    @current-change="handlePageChangeMateriel"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitMaterielForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
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
                <el-table-column label="员工编码" align="center" :show-overflow-tooltip="true" prop="userNum" />
                <el-table-column label="员工名称" align="center" :show-overflow-tooltip="true" prop="nickname" />
                <el-table-column label="部门编码" align="center" :show-overflow-tooltip="true" prop="dept.deptNum" />
                <el-table-column label="部门名称" align="center" :show-overflow-tooltip="true" prop="dept.deptName" />
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
import { warehouseListPage } from '@/api/basis/warehouse.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { treeselect } from '@/api/basis/category.js';
import { getInventory, addAndUpdateInventory, listInventorySub } from '@/api/warehouse/inventory.js';
import { userListPage } from '@/api/system/user.js';
import { listRepertoryData } from '@/api/warehouse/repertory.js';

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'inventory-add',
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
            // 表单校验
            rules: {
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }]
            },
            warehouseForm: {},
            materielListData: [],
            delSubIds: [],
            // 添加仓库
            radio: '',
            warehouseSelection: undefined,
            warehouseListData: [],
            warehouseTotal: 0,
            warehouseParams: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            // 产品
            selectionMateriel: [],
            categoryOptions: [],
            openMateriel: false,
            materielParams: {
                current: 1,
                size: 10,
                materielName: undefined,
                materielNum: undefined,
                categoryId: undefined
            },
            materielTotal: 0,
            materielListPageData: [],

            // 人员
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
            personnelSelection: undefined
        };
    },
    created() {
        this.getPersonnelName();
    },
    methods: {
        getPersonnelName() {
            this.warehouseForm.personnelName = this.$store.getters.name;
            this.warehouseForm.personnelId = this.$store.getters.userId;
            this.warehouseForm.inventoryTime = this.parseTime(new Date());
        },
        // ===================仓库============
        handleAddWarehouse() {
            this.open = true;
            this.title = '仓库';
            this.clearForm();
            this.handleQueryWarehouse();
        },
        getWarehouseListData() {
            warehouseListPage(this.warehouseParams).then(res => {
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
        getCurrentRow(row) {
            this.submitWarehouseForm(row);
        },
        dbclickWarehouse(row, column, event) {
            this.submitWarehouseForm(row);
        },
        submitWarehouseForm(row) {
            this.warehouseForm.warehouseNum = row.warehouseNum;
            this.warehouseForm.warehouseName = row.warehouseName;
            this.warehouseForm.warehouseId = row.warehouseId;
            this.open = false;
            // 查询该仓库的所有产品（现存量）
            this.loading = true;
            listRepertoryData(this.warehouseForm).then(res => {
                this.materielListData = res.data;
                this.loading = false;
            });
        },

        // ==================产品==============
        handleAddMateriel() {
            this.getTreeselectMateriel();
            this.getMaterielListData();
            this.title = '添加产品';
            this.openMateriel = true;
        },
        handleSelectionChange(selection) {
            this.selectionMateriel = selection;
        },
        selectionRowClick(row) {
            this.$refs['materielListPageData'].toggleRowSelection(row);
        },
        // 产品类别
        getTreeselectMateriel() {
            treeselect({ category: '0' }).then(res => {
                this.categoryOptions = res.data;
            });
        },
        getMaterielListData() {
            listAllMateriel(this.materielParams).then(res => {
                this.materielListPageData = res.data.records;
                this.materielTotal = res.data.total;
            });
        },
        handlePageChangeMateriel(val) {
            this.$set(this.materielParams, 'current', val);
            this.getMaterielListData();
        },
        handleSizeChangeMateriel(val) {
            this.$set(this.materielParams, 'size', val);
            this.handleQueryMateriel();
        },
        handleQueryMateriel() {
            this.materielParams.current = 1;
            this.getMaterielListData();
        },
        handleDelete(index, row) {
            this.materielListData.splice(index, 1);
            if (row.subId) {
                this.delSubIds.push(row.subId);
            }
        },
        calculateTotalPrice(row) {
            row.totalPrice = (parseFloat(row.price) * parseInt(row.number)).toFixed(2);
        },
        submitMaterielForm() {
            this.materielListData = this.materielListData.concat(this.selectionMateriel);
            this.openMateriel = false;
        },
        cancel() {
            this.open = false;
            this.openMateriel = false;
        },
        submitForm() {
            this.$refs['warehouseForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('未添加产品');
                        return;
                    }
                    let data = {
                        inventory: JSON.stringify(this.warehouseForm),
                        inventorySub: JSON.stringify(this.materielListData),
                        delSubIds: JSON.stringify(this.delSubIds)
                    };
                    addAndUpdateInventory(data).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
                            // this.clearForm();
                        } else {
                            this.msgError(res.message);
                        }
                    });
                }
            });
        },
        clearForm() {
            this.warehouseForm = {};
            this.radio = '';
            this.delSubIds = [];
            this.materielListData = [];
            this.resetForm('warehouseForm');
            this.getPersonnelName();
        },
        // ===========人员================
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
            this.warehouseForm.personnelId = this.personnelSelection.userId;
            this.warehouseForm.personnelName = this.personnelSelection.nickname;
            this.personnelOpen = false;
            this.$refs.warehouseForm.clearValidate('personnelName');
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
