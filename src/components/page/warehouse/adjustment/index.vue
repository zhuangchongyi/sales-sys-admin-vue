<template>
  <div>
    <div class="container">
      <el-form :model="queryParams"
               ref="queryParams"
               :inline="true">
        <el-form-item label="仓库编码"
                      prop="warehouseNum">
          <el-input v-model="queryParams.warehouseNum"
                    placeholder="请输入仓库编码"
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="仓库名称"
                      prop="warehouseName">
          <el-input v-model="queryParams.warehouseName"
                    placeholder="请输入仓库名称"
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery" />
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
                   :disabled="multiple"
                   @click="handleAudit">审核</el-button>
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
                         label="编号"
                         width="120"
                         align="center" />
        <el-table-column prop="warehouseNum"
                         label="仓库编码"
                         align="center" />
        <el-table-column prop="warehouseName"
                         label="仓库名称"
                         align="center" />
        <el-table-column prop="createby"
                         label="调整来源"
                         :formatter="adjustmentTypeFormatter"
                         align="center" />
        <el-table-column prop="createby"
                         label="调整人员"
                         align="center" />
        <el-table-column prop="createTime"
                         label="调整日期"
                         align="center" />
        <el-table-column prop="deptName"
                         label="部门名称"
                         align="center" />
        <el-table-column prop="status"
                         label="审核状态"
                         :formatter="approvalStatusFormatter"
                         align="center" />
        <el-table-column prop="createby"
                         label="审核人"
                         align="center" />
        <el-table-column prop="createTime"
                         label="审核日期"
                         align="center" />
        <el-table-column label="操作"
                         width="300"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-info"
                       @click="handleExamine(scope.$index, scope.row)">明细</el-button>
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

    <!-- 新增和修改配置对话框 -->
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
            <el-form-item label="调整单号"
                          prop="warehouseNum">
              <el-input v-model="form.warehouseNum"
                        placeholder="请选择调整单"
                        @focus="warehouseFocus"
                        ref="warehouseBlur"
                        suffix-icon="el-icon-search"
                        :disabled="disabledEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库编码"
                          prop="warehouseNum">
              <el-input v-model="form.warehouseNum"
                        :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称"
                          prop="warehouseName">
              <el-input v-model="form.warehouseName"
                        :disabled="true" />
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
              <el-table-column prop="materielNum"
                               label="产品编码"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielName"
                               label="产品名称"
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
                               label="账存数"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="updateNumber"
                               label="实盘数"
                               align="center">
                <!-- <template slot-scope="scope">
                  <el-input size="small"
                            :disabled="examineStatue"
                            v-model="scope.row.updateNumber" />
                </template> -->
              </el-table-column>
              <el-table-column prop="differenceNumber"
                               label="调整数"
                               align="center">
                <!-- <template slot-scope="scope">
                  <span v-if="parseInt(scope.row.updateNumber||0)==0"></span>
                  <span v-else>{{parseInt(scope.row.updateNumber||0) - parseInt(scope.row.materielNumber||0)}}</span>
                </template> -->
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

    <!-- 选择仓库对话框 -->
    <el-dialog :title="titleWarehouse"
               :visible.sync="openWarehouse"
               width="500px"
               append-to-body>
      <el-form :model="query"
               ref="query"
               :inline="true">
        <el-form-item label=""
                      prop="warehouseName">
          <el-input v-model="query.warehouseName"
                    placeholder="请输入调整单号"
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
        <el-table-column label="调整单号"
                         align="center"
                         width="120"
                         prop="warehouseId" />
        <el-table-column label="仓库编码"
                         align="center"
                         width="120"
                         prop="warehouseNum" />
        <el-table-column label="仓库名称"
                         align="center"
                         width="120"
                         prop="warehouseName" />
        <el-table-column label="部门名称"
                         align="center"
                         width="120"
                         prop="deptName" />
        <el-table-column label="调整人"
                         align="center"
                         width="120"
                         prop="userName" />
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="query.pageNum"
                       :page-size="query.pageSize"
                       :total="query.total"
                       @current-change="handlePageChangeWarehouse"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="selectionWarehouseForm">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData, getWarehouse } from '@/api/basis/warehouse.js';
import { listData as materielListData } from '@/api/basis/materiel.js';

export default {
  name: 'warehouse-scrap',//调整单
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
      tableData: [],
      pageTotal: 0,
      //表单参数
      title: '',
      open: false,
      examineStatue: true,
      form: {},
      // 表单校验
      rules: {
      },
      disabledEdit: true,
      openWarehouse: false,
      titleWarehouse: undefined,
      query: {
        pageNum: 1,
        pageSize: 10,
        warehouseName: undefined,
      },
      selectionWarehouse: [],
      warehouseListData: [],
      materielListData: [],
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
      this.materielListData = []
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
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
    handlePageChangeWarehouse (val) {
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
      this.$router.push('/page/warehouse/adjustment/add');
    },
    /** 修改按钮操作 */
    handleUpdate (index, row) {
      this.$router.push({ name: '/page/warehouse/adjustment/edit', params: { id: row.id } });
    },
    handleAudit (row) {
      this.$router.push({ name: '/page/warehouse/adjustment/preview', params: { id: row.id, isShow: true } });
    },
    /** 查看按钮操作 */
    handleExamine (index, row) {
      this.$router.push({ name: '/page/warehouse/adjustment/preview', params: { id: row.id, isShow: false } });
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
      this.openWarehouse = false;
    },
    handleQueryWarehouse () {
      this.query.pageNum = 1;
      this.getList();
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
      this.titleWarehouse = '选择仓库';
      listData(this.query).then(res => {
        console.log(res);
        this.warehouseListData = res.data;
        this.query.total = res.pageTotal;
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