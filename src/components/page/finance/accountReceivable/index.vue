<template>
    <div>
        <div class="container">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item label="客户名称" prop="warehouseName">
                    <el-input v-model="queryParams.warehouseName" placeholder="请输入客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">刷新</el-button>
                </el-form-item>
            </el-form>
            <div class="handle-box">
                <el-button type="primary" size="mini" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
                <!-- <el-button type="primary"
                   size="mini"
                   icon="el-icon-finished"
                   class="handle-del mr10"
                   @click="handleCollection">收款</el-button> -->
                <!-- <el-button type="primary"
                   size="mini"
                   icon="el-icon-printer"
                   class="handle-del mr10"
                   :disabled="single"
                   @click="handleAdd">打印</el-button> -->
            </div>
            <el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="客户编码" align="center" :show-overflow-tooltip="true" prop="clienteleId" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
                <el-table-column prop="clientelePhone" label="应收金额" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="clientelePrice" label="欠款" :show-overflow-tooltip="true" align="center" />
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                        <el-button type="text" icon="el-icon-edit-outline" @click="handleCollection(scope.row)">收款</el-button>
                        <el-button type="text" icon="el-icon-info" @click="handlePreview(scope.row)">明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="queryParams.pageIndex"
                    :page-size="queryParams.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 添加或修改配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item prop="materielNum" label="客户编码" align="center">
                            <el-input v-model="form.materielNum" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="materielName" label="客户名称" align="center">
                            <el-input v-model="form.materielName" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收金额" prop="clientelePhone">
                            <el-input v-model="form.clientelePhone" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="已收金额" prop="clientelePrice">
                            <el-input v-model="form.clientelePrice" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款金额" prop="skje">
                            <el-input v-model="form.skje" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="handleQueryWarehouse">刷新</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="materielListData" class="table" ref="multipleTable" header-cell-class-name="table-header" height="200px" @selection-change="handleSelectionChangeHedge">
                            <el-table-column type="selection" width="55" align="center" />
                            <el-table-column prop="materielId" label="收款单号" :show-overflow-tooltip="true" align="center" />
                            <el-table-column prop="createTime" label="收款日期" :show-overflow-tooltip="true" align="center" />
                            <el-table-column prop="materielPrice" label="收款金额" :show-overflow-tooltip="true" align="center" />
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                background
                                layout="total, prev, pager, next"
                                :current-page="queryParams.pageIndex"
                                :page-size="queryParams.pageSize"
                                :total="pageTotal"
                                @current-change="handlePageChange"
                            ></el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="receiptListData" class="table" ref="multipleTable" header-cell-class-name="table-header" height="150px" @selection-change="handleSelectionChangeHedge">
                            <el-table-column type="selection" width="55" align="center" />
                            <el-table-column prop="materielId" label="收款单号" :show-overflow-tooltip="true" align="center" />
                            <el-table-column prop="createTime" label="收款日期" :show-overflow-tooltip="true" align="center" />
                            <el-table-column prop="materielPrice" label="收款金额" :show-overflow-tooltip="true" align="center" />
                            <el-table-column label="操作" fixed="right" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleDeleteHedge(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectionForm">确 定</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listData } from '@/api/basis/clientele.js';
import { listData as materielListData } from '@/api/basis/materiel.js';

export default {
    name: 'warehouse-salesOutbound', //应收款
    data() {
        return {
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                warehouseName: undefined,
                warehouseNum: undefined,
                status: undefined
            },
            // 非单个禁用
            single: true,
            //非多个禁用
            multiple: true,
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '禁用' }
            ],
            tableData: [],
            pageTotal: 0,
            //表单参数
            title: '',
            open: false,
            form: {},
            // 表单校验
            rules: {
                warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
                warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }]
            },
            query: {
                pageNum: 1,
                pageSize: 10,
                warehouseName: undefined,
                warehouseNum: undefined
            },
            materielListData: [],
            orderListData: [],
            openOrder: false,
            titleOrder: undefined,
            materielListData: undefined,
            selectionOrder: [],

            receiptList: [],
            receiptListData: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 表单刷新
        reset() {
            this.form = {};
            this.receiptList = [];
            this.receiptListData = [];
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm('queryParams');
            this.handleQuery();
        },
        // 多选操作
        handleSelectionChange(selection) {
            this.multipleSelection = selection;
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getData();
        },
        /** 查询列表 */
        getList() {
            listData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        handleAdd() {
            this.$router.push('/page/finance/accountReceivable/add');
        },
        handleUpdate(row) {
            this.$router.push({ name: '/page/finance/accountReceivable/edit', params: { id: row.clienteleId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/finance/accountReceivable/preview', query: { id: row.clienteleId, a: 0, e: 1 } });
        },
        handleAudit(row) {
            this.$router.push({ path: '/page/finance/accountReceivable/preview', query: { id: row.clienteleId, a: 1, e: 1 } });
        },
        handleCollection(row) {
            this.$router.push({ path: '/page/finance/accountReceivable/preview', query: { id: row.clienteleId, a: 0, e: 0 } });
        },
        handlePrint() {
            this.msgSuccess('打印成功');
        },
        handleDelete() {
            this.msgSuccess('操作成功');
        },
        handleHedge(row) {
            this.reset();
            this.open = true;
            this.title = '应收款对冲';
            this.form = row;
            materielListData(this.form).then(res => {
                console.log(res);
                this.materielListData = res.data;
                this.query.total = res.pageTotal;
            });
        },
        handleSelectionChangeHedge(selection) {
            this.receiptList = selection;
        },
        selectionForm() {
            console.log(this.receiptList);
            if (this.receiptListData.length == 0) {
                this.receiptListData = this.receiptList;
            } else {
                this.receiptList.forEach(receipt => {});
            }
            this.countHedgePrice();
        },
        countHedgePrice() {
            let skje = 0;
            this.receiptListData.forEach(receipt => {
                skje += parseFloat(receipt.materielPrice || 0);
            });
            this.form.skje = skje.toFixed(2);
        },
        handleDeleteHedge(index) {
            this.receiptListData.splice(index, 1);
            this.countHedgePrice();
        },
        submitForm() {
            this.$message.success('提交表单');
            this.open = false;
        },
        cancel() {
            this.open = false;
        },
        cancelForm() {
            this.openOrder = false;
        },
        handleQueryWarehouse() {
            this.query.pageNum = 1;
            this.getList();
        },
        handlePageChangeOrder(val) {
            this.$set(this.query, 'pageNum', val);
            this.getData();
        },
        handleSelectionChangeOrder(selection) {
            this.selectionOrder = selection;
        },
        /** 提交按钮 */
        selectionOrderForm() {
            if (this.selectionOrder.length != 1) {
                this.msgError('只能选择一个仓库');
                return;
            }
            this.openOrder = false;
            this.form.orderNum = this.selectionOrder[0].warehouseId;
            this.form.warehouseId = this.selectionOrder[0].warehouseId;
            this.form.warehouseName = this.selectionOrder[0].warehouseName;
            this.form.warehouseNum = this.selectionOrder[0].warehouseNum;
            //搜索该仓库的商品
            materielListData(this.form).then(res => {
                console.log(res);
                this.materielListData = res.data;
                this.query.total = res.pageTotal;
            });
        },
        // 获取焦点
        orderFocus(event) {
            this.openOrder = true;
            this.titleOrder = '选择订单';
            listData(this.query).then(res => {
                console.log(res);
                this.orderListData = res.data;
                this.query.total = res.pageTotal;
            });
            // 失去焦点
            this.$refs.orderBlur.blur();
        }
    }
};
</script>

<style scoped>
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
