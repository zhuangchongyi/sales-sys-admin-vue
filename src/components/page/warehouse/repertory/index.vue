<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="仓库编码" prop="warehouseNum">
                <el-input v-model="queryParams.warehouseNum" placeholder="请选择仓库" prefix-icon="el-icon-search" size="small" @focus="warehouseFocus" ref="warehouseBlur" style="width: 200px" />
            </el-form-item>
            <el-form-item label="仓库名称" prop="warehouseName">
                <el-input v-model="queryParams.warehouseName" readonly size="small" style="width: 200px" />
            </el-form-item>
            <el-form-item label="产品" prop="materielName">
                <el-input v-model="queryParams.materielName" size="small" style="width: 200px" placeholder="搜索产品" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box"></div>
        <el-table v-loading="loading" :data="repertoryListData">
            <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="unitsName" label="单位" :show-overflow-tooltip="true" align="center" />
            <el-table-column prop="price" label="单价" align="center" />
            <el-table-column prop="number" label="现存量" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="totalPrice" label="金额" align="center" :show-overflow-tooltip="true" width="200" />
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="queryParams.current"
                :page-size="queryParams.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 仓库弹框 -->
        <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
            <el-form :model="query" ref="query" :inline="true">
                <el-form-item label="仓库" prop="warehouseName">
                    <el-input v-model="query.warehouseName" placeholder="请输入编码或名称" size="small" clearable style="width: 200px" />
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
                <el-table-column label="仓库编码" align="center" prop="warehouseNum" />
                <el-table-column label="仓库名称" align="center" prop="warehouseName" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :total="query.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listRepertoryPage } from '@/api/warehouse/repertory.js';
import { warehouseListDialog } from '@/api/basis/warehouse.js';
export default {
    name: 'warehouse-repertory', //现存量
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            //产品数据
            repertoryListData: [],
            //总条数
            total: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                warehouseId: undefined,
                warehouseName: undefined,
                warehouseNum: undefined,
                materielNum: undefined,
                materielName: undefined,
                specification: undefined,
                modelName: undefined,
                needTorque: undefined,
                outTorque: undefined
            },
            //表单参数
            form: {},
            query: {
                current: 1,
                size: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            pageTotal: 0,
            radio: '',
            warehouseListData: []
        };
    },
    created() {},
    methods: {
        getList() {
            if (this.queryParams.warehouseId) {
                this.queryParams.materielNum = this.queryParams.materielName;
                this.queryParams.specification = this.queryParams.materielName;
                this.queryParams.modelName = this.queryParams.materielName;
                this.queryParams.needTorque = this.queryParams.materielName;
                this.queryParams.outTorque = this.queryParams.materielName;
                listRepertoryPage(this.queryParams).then(res => {
                    this.repertoryListData = res.data.records;
                    this.total = res.data.total;
                    this.loading = false;
                });
            } else {
                this.msgError('请选择仓库');
            }
        },
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'current', val);
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQuery();
        },

        // =====================仓库=====================
        getWarehouseList() {
            warehouseListDialog(this.query).then(res => {
                this.warehouseListData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        dbclickWarehouse(row, column, event) {
            this.submitForm(row);
        },
        getCurrentRow(row) {
            this.submitForm(row);
        },
        handleQueryWarehouse() {
            this.query.current = 1;
            this.query.warehouseNum = this.query.warehouseName;
            this.getWarehouseList();
        },
        /** 提交按钮 */
        submitForm(row) {
            this.queryParams.warehouseId = row.warehouseId;
            this.queryParams.warehouseName = row.warehouseName;
            this.queryParams.warehouseNum = row.warehouseNum;
            this.open = false;
            this.loading = true;
            this.getList();
        },
        // 获取焦点
        warehouseFocus(event) {
            this.open = true;
            this.title = '选择仓库';
            this.getWarehouseList();
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
</style>
