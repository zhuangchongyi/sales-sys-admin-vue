<template>
  <div>
    <div class="container">
      <el-form :model="queryParams"
               ref="queryParams"
               :inline="true">
        <el-form-item label="仓库名称"
                      prop="warehouseName">
          <el-input v-model="queryParams.warehouseName"
                    placeholder="请输入仓库名称"
                    clearable
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="仓库编码"
                      prop="warehouseNum">
          <el-input v-model="queryParams.warehouseNum"
                    placeholder="请输入仓库编码"
                    clearable
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态"
                      prop="status">
          <el-select v-model="queryParams.status"
                     placeholder="选择状态"
                     clearable
                     size="small"
                     style="width: 200px">
            <el-option v-for="dict in statusOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh"
                     size="mini"
                     @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="handle-box">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-plus"
                   class="handle-del mr10"
                   @click="handleAdd">新增</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   class="handle-del mr10"
                   @click="handleDelete"
                   :disabled="multiple">删除</el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-finished"
                   class="handle-del mr10"
                   @click="handleAudit"
                   :disabled="single">审核</el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-printer"
                   class="handle-del mr10"
                   @click="handlePrint"
                   :disabled="single">打印</el-button>
      </div>
      <el-table :data="tableData"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center" />
        <el-table-column prop="warehouseId"
                         label="退货单号"
                         width="100"
                         align="center" />
        <el-table-column prop="warehouseName"
                         label="退入仓库"
                         width="100"
                         align="center" />
        <el-table-column prop="warehouseNum"
                         label="客户编码"
                         width="100"
                         align="center" />
        <el-table-column prop="warehouseNum"
                         label="客户名称"
                         width="100"
                         align="center" />
        <el-table-column prop="number"
                         label="退款金额"
                         width="100"
                         align="center" />
        <el-table-column prop="number"
                         label="退货原因"
                         width="200"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="createTime"
                         label="退货日期"
                         width="100"
                         align="center" />
        <el-table-column prop="number"
                         label="状态"
                         width="100"
                         align="center" />
        <el-table-column prop="name"
                         label="入库负责人"
                         width="100"
                         align="center" />
        <el-table-column prop="number"
                         label="审核人"
                         width="100"
                         align="center" />
        <el-table-column prop="createTime"
                         label="审核日期"
                         width="100"
                         align="center" />
        <el-table-column label="操作"
                         width="300"
                         fixed="right"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-info"
                       @click="handlePreview(scope.row)">查看</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="queryParams.pageIndex"
                       :page-size="queryParams.pageSize"
                       :total="pageTotal"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="800px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货单"
                          prop="orderNum">
              <el-input v-model="form.orderNum"
                        placeholder="请选择发货单"
                        @focus="orderFocus"
                        ref="orderBlur"
                        :disabled="editStatus"
                        suffix-icon="el-icon-search" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退入仓库"
                          prop="warehouseName">
              <el-input v-model="form.warehouseName"
                        placeholder="请选择仓库"
                        @focus="warehouseFocus"
                        :disabled="editStatus"
                        ref="warehouseBlur"
                        suffix-icon="el-icon-search" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="退款金额"
                          prop="warehouseName">
              <el-input v-model="form.warehouseName"
                        placeholder="请选择仓库"
                        :disabled="editStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库时间"
                          prop="warehouseName">
              <el-date-picker placeholder="请选择"
                              type="date"
                              style="width:160px"
                              :disabled="editStatus"
                              v-model="form.warehouseTime" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="materielListData"
                      class="table"
                      ref="multipleTable"
                      header-cell-class-name="table-header"
                      @selection-change="handleSelectionChange">
              <el-table-column prop="materielId"
                               label="订单号"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielNum"
                               label="产品编码"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielName"
                               label="产品名称"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielNum"
                               label="客户编码"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielName"
                               label="客户名称"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="gg"
                               label="规格"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="xh"
                               label="型号"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielPrice"
                               label="价格"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielNumber"
                               label="退货数量"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="inNumber"
                               label="入库数量"
                               :show-overflow-tooltip="true"
                               align="center">
                <template slot-scope="scope">
                  <el-input size="small"
                            :disabled="editStatus"
                            v-model="scope.row.inNumber" />
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background
                             layout="total, prev, pager, next"
                             :current-page="queryParams.pageIndex"
                             :page-size="queryParams.pageSize"
                             :total="pageTotal"
                             @current-change="handlePageChange"></el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择订单对话框 -->
    <el-dialog :title="titleOrder"
               :visible.sync="openOrder"
               width="400px"
               append-to-body>
      <el-form :model="query"
               ref="query"
               :inline="true">
        <el-form-item label=""
                      prop="orderName">
          <el-input v-model="query.orderName"
                    placeholder="请输入订单号"
                    clearable
                    size="small"
                    style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryOrder">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="orderListData"
                @selection-change="handleSelectionChangeOrder">
        <el-table-column type="selection"
                         width="50"
                         align="center" />
        <el-table-column label="订单号"
                         align="center"
                         prop="warehouseNum" />
        <el-table-column label="客户名称"
                         align="center"
                         prop="warehouseName" />
        <el-table-column label="部门名称"
                         align="center"
                         prop="deptName" />
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="query.pageNum"
                       :page-size="query.pageSize"
                       :total="query.total"
                       @current-change="handlePageChangeOrder"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="selectionOrderForm">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择仓库对话框 -->
    <el-dialog :title="titleWarehouse"
               :visible.sync="openWarehouse"
               width="400px"
               append-to-body>
      <el-form :model="queryWarehouse"
               ref="queryWarehouse"
               :inline="true">
        <el-form-item label=""
                      prop="warehouseName">
          <el-input v-model="queryWarehouse.warehouseName"
                    placeholder="请输入仓库编码"
                    clearable
                    size="small"
                    style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryWarehouse">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="warehouseListData"
                @selection-change="handleSelectionChangeWarehouse">
        <el-table-column type="selection"
                         width="50"
                         align="center" />
        <el-table-column label="订单号"
                         align="center"
                         prop="warehouseNum" />
        <el-table-column label="客户名称"
                         align="center"
                         prop="warehouseName" />
        <el-table-column label="部门名称"
                         align="center"
                         prop="deptName" />
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="queryWarehouse.pageNum"
                       :page-size="queryWarehouse.pageSize"
                       :total="queryWarehouse.total"
                       @current-change="handlePageChangeWarehouse"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="selectionWarehouseForm">确 定</el-button>
        <el-button @click="cancelWarehouseForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData, getWarehouse } from '@/api/basis/warehouse.js';
import { listData as materielListData } from '@/api/basis/materiel.js';
export default {
  name: 'warehouse-returnsStorage',
  data () {
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
      statusOptions: [{ dictValue: '0', dictLabel: '启用' }, { dictValue: '1', dictLabel: '禁用' }],
      //退入仓库
      deptOptions: undefined,
      // 日期范围
      tableData: [],
      pageTotal: 0,
      //表单参数
      title: '',
      open: false,
      form: {},
      editStatus: false,
      // 表单校验
      rules: {
        // warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        // warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
        // orderNum: [{ required: true, message: '订单不能为空', trigger: 'blur' }],
      },
      query: {
        pageNum: 1,
        pageSize: 10,
        warehouseName: undefined,
        warehouseNum: undefined,
      },
      materielListData: [],
      orderListData: [],
      openOrder: false,
      titleOrder: undefined,
      materielListData: undefined,
      selectionOrder: [],

      queryWarehouse: {
        pageNum: 1,
        pageSize: 10,
        warehouseName: undefined,
        warehouseNum: undefined,
      },
      warehouseListData: [],
      openWarehouse: false,
      titleWarehouse: undefined,
      materielListData: undefined,
      selectionWarehouse: [],
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 表单重置
    reset () {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        warehouseId: undefined,
        warehouseName: undefined,
        warehouseNum: undefined,
        status: '0',
        deptIds: [],
        remark: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = [];
      this.resetForm('queryParams');
      this.handleQuery();
    },
    // 多选操作
    handleSelectionChange (selection) {
      this.multipleSelection = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    /** 查询列表 */
    getList () {
      listData(this.query).then(res => {
        console.log(res);
        this.tableData = res.data;
        this.pageTotal = res.pageTotal || 50;
      });
    },
    /** 添加按钮操作 */
    handleAdd () {
      this.$router.push('/page/warehouse/returnsStorage/add');
    },
    /** 修改按钮操作 */
    handleUpdate (index, row) {
      this.$router.push({ name: '/page/warehouse/returnsStorage/edit', params: { id: row.id } });
    },
    handlePreview (row) {
      this.$router.push({ name: '/page/warehouse/returnsStorage/preview', params: { id: row.id, isShow: false } });
    },
    handlePrint () {
      this.msgSuccess('打印成功');
    },
    handleAudit (row) {
      this.$router.push({ name: '/page/warehouse/returnsStorage/preview', params: { id: row.id, isShow: true } });
    },
    handleDelete () {
      this.msgSuccess('操作成功');
    },
    submitForm () {
      this.$message.success('提交表单');
      this.open = false;
    },
    cancel () {
      this.open = false;
    },
    cancelForm () {
      this.openOrder = false;
    },
    handleQueryOrder () {
      this.query.pageNum = 1;
      this.getList();
    },
    handlePageChangeOrder (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    handleSelectionChangeOrder (selection) {
      this.selectionOrder = selection;
    },
    /** 提交按钮 */
    selectionOrderForm () {
      if (this.selectionOrder.length != 1) {
        this.msgError('只能选择一个订单');
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
    orderFocus (event) {
      this.openOrder = true;
      this.titleOrder = '选择订单';
      listData(this.query).then(res => {
        console.log(res);
        this.orderListData = res.data;
        this.query.total = res.pageTotal;
      })
      // 失去焦点
      this.$refs.orderBlur.blur();
    },

    cancelWarehouseForm () {
      this.openWarehouse = false;
    },
    handleQueryWarehouse () {
      this.query.pageNum = 1;
      this.getList();
    },
    handlePageChangeWarehouse (val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    handleSelectionChangeWarehouse (selection) {
      this.selectionWarehouse = selection;
    },
    /** 提交按钮 */
    selectionWarehouseForm () {
      if (this.selectionWarehouse.length != 1) {
        this.msgError('只能选择一个仓库');
        return;
      }
      this.openWarehouse = false;
      this.form.warehouseId = this.selectionWarehouse[0].warehouseId;
      this.form.warehouseName = this.selectionWarehouse[0].warehouseName;
      this.form.warehouseNum = this.selectionWarehouse[0].warehouseNum;
      //搜索该仓库的商品
      materielListData(this.form).then(res => {
        console.log(res);
        this.materielListData = res.data;
        this.query.total = res.pageTotal;
      });
    },
    // 获取焦点
    warehouseFocus (event) {
      this.openWarehouse = true;
      this.titleWarehouse = '选择订单';
      listData(this.query).then(res => {
        console.log(res);
        this.warehouseListData = res.data;
        this.queryWarehouse.total = res.pageTotal;
      })
      // 失去焦点
      this.$refs.warehouseBlur.blur();
    },
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
