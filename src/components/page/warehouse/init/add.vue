<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitForm" :loading="btnLoading">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearForm" :loading="btnLoading">清 空</el-button>
        </div>

        <el-divider><strong>仓库信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="mini" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddWarehouse">仓库</el-button>
        </div>
        <el-form :model="warehouseForm" ref="warehouseForm" label-position="right" label-width="auto" :inline="true">
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
            </el-row>
        </el-form>

        <el-divider><strong>产品信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="mini" icon="el-icon-paperclip" class="handle-del mr10" v-show="isShow" @click="handleAddMateriel">产品</el-button>
        </div>
        <el-table :data="materielListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="modelName" label="型号" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="unitsName" label="单位" align="center" />
            <!-- <el-table-column prop="price"
                       label="单价"
                       align="center" /> -->
            <el-table-column prop="price" label="单价" width="120" align="center">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        maxLength="9"
                        @input="calculateTotalPrice(scope.row)"
                        v-model="scope.row.price"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="number" label="现存量" width="120" align="center">
                <template slot-scope="scope">
                    <el-input size="mini" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" @input="calculateTotalPrice(scope.row)" v-model="scope.row.number" />
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="金额" width="120" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
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
    </div>
</template>

<script>
import { initWarehouseList } from '@/api/basis/warehouse.js';
import { listAllMateriel } from '@/api/basis/materiel.js';
import { treeselect } from '@/api/basis/category.js';
import { getInit, addAndUpdateInit, listInitSub } from '@/api/warehouse/init.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-shipments-add',
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
            isShow: false,
            btnLoading: false
        };
    },
    created() {},
    methods: {
        // ===================仓库============
        handleAddWarehouse() {
            this.open = true;
            this.title = '仓库';
            this.clearForm();
            this.handleQueryWarehouse();
        },
        getWarehouseListData() {
            initWarehouseList(this.warehouseParams).then(res => {
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
            this.warehouseSelected = row;
            this.submitWarehouseForm();
        },
        dbclickWarehouse(row, column, event) {
            this.warehouseSelected = row;
            this.submitWarehouseForm();
        },
        submitWarehouseForm() {
            this.warehouseForm.warehouseNum = this.warehouseSelected.warehouseNum;
            this.warehouseForm.warehouseName = this.warehouseSelected.warehouseName;
            this.warehouseForm.warehouseId = this.warehouseSelected.warehouseId;
            this.open = false;
            this.isShow = true;
            this.getWarehouseInitSubListData();
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

        getWarehouseInitSubListData() {
            listInitSub(this.warehouseForm).then(res => {
                this.materielListData = res.data;
            });
        },
        cancel() {
            this.open = false;
            this.openMateriel = false;
        },
        submitForm() {
            this.$refs['warehouseForm'].validate(valid => {
                if (valid) {
                    let data = {
                        init: JSON.stringify(this.warehouseForm),
                        initSub: JSON.stringify(this.materielListData),
                        delSubIds: JSON.stringify(this.delSubIds)
                    };
                    this.btnLoading = true;
                    addAndUpdateInit(data)
                        .then(res => {
                            this.btnLoading = false;
                            if (res.success) {
                                this.msgSuccess(res.message);
                                this.clearForm();
                            } else {
                                this.msgError(res.message);
                            }
                        })
                        .catch(e => {
                            this.btnLoading = false;
                            console.log(e);
                        });
                }
            });
        },
        clearForm() {
            this.warehouseForm = {};
            this.radio = '';
            this.delSubIds = [];
            this.warehouseSelected = [];
            this.materielListData = [];
            this.materielListPageData = [];
            this.isShow = false;
            this.resetForm('materielParams');
            this.resetForm('warehouseForm');
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
