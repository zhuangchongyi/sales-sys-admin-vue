<template>
  <div>
    <div class="container">
      <el-form :model="queryParams"
               ref="queryParams"
               :inline="true">
        <el-form-item label="客户名称"
                      prop="warehouseName">
          <el-input v-model="queryParams.warehouseName"
                    placeholder="请输入客户名称"
                    clearable
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="订单号"
                      prop="warehouseNum">
          <el-input v-model="queryParams.warehouseNum"
                    placeholder="请输入订单号"
                    clearable
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
                         label="收款单号"
                         width="120"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column label="客户编号"
                         align="center"
                         :show-overflow-tooltip="true"
                         prop="clienteleId"
                         width="80" />
        <el-table-column label="客户名称"
                         align="center"
                         prop="clienteleName"
                         :show-overflow-tooltip="true"
                         width="100" />
        <el-table-column prop="number"
                         label="收款金额"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="createTime"
                         label="收款日期"
                         width="160"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="number"
                         label="状态"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="number"
                         label="核销金额"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="number"
                         label="未核销金额"
                         width="100"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column label="业务人员"
                         align="center"
                         prop="payType"
                         :show-overflow-tooltip="true"
                         width="160" />
        <el-table-column label="业务部门"
                         align="center"
                         :show-overflow-tooltip="true"
                         prop="payType"
                         width="160" />
        <el-table-column label="审核人"
                         align="center"
                         prop="payType"
                         :show-overflow-tooltip="true"
                         width="160" />
        <el-table-column prop="createTime"
                         label="审核日期"
                         :show-overflow-tooltip="true"
                         width="160"
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
                       @click="handlePreview(scope.$index, scope.row)">查看</el-button>
            <el-button type="text"
                       icon="el-icon-edit-outline"
                       @click="handleHedge(scope.row)">核销</el-button>
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
               label-width="90px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="收款金额"
                          prop="clientelePhone">
              <el-input v-model="form.clientelePhone"
                        :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="核销金额"
                          prop="clientelePrice">
              <el-input v-model="form.clientelePrice"
                        :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="未核销金额"
                          prop="clientelePrice">
              <el-input v-model="form.clientelePrice"
                        :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款日期"
                          prop="createTime">
              <el-input v-model="form.clientelePrice"
                        :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="materielListData"
                      class="table"
                      :show-summary="true"
                      :summary-method="getSummaries"
                      header-cell-class-name="table-header"
                      @selection-change="handleSelectionChangeHedge">
              <el-table-column type="selection"
                               width="55"
                               align="center" />
              <el-table-column prop="materielId"
                               label="应收单号"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="createTime"
                               label="应收单日期"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="materielPrice"
                               label="应收款"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="whxje"
                               label="已核销金额"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="whxje"
                               label="未核销金额"
                               :show-overflow-tooltip="true"
                               align="center" />
              <el-table-column prop="hxje"
                               label="核销金额"
                               width="200"
                               :show-overflow-tooltip="true"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.hxje"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                            maxLength='9' />
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="pagination">
              <el-pagination background
                             layout="total, prev, pager, next"
                             :current-page="query.pageNum"
                             :page-size="query.pageSize"
                             :total="query.total"
                             @current-change="handlePageChange"></el-pagination>
            </div> -->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData } from '@/api/basis/clientele.js';
import { listData as materielListData } from '@/api/basis/materiel.js';

export default {
  name: 'warehouse-salesOutbound',//应收款
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
      tableData: [],
      pageTotal: 0,
      //表单参数
      title: '',
      open: false,
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
      },
      query: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        warehouseName: undefined,
        warehouseNum: undefined,
      },
      materielListData: [],
      orderListData: [],
      openOrder: false,
      titleOrder: undefined,
      materielListData: undefined,
      selectionOrder: [],

      receiptListData: [],
      receiptList: []
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
        orderNum: undefined,
        warehouseId: undefined,
        warehouseName: undefined,
        warehouseNum: undefined,
        status: '0',
        deptIds: [],
        remark: undefined
      };
      this.materielListData = [];
      this.orderListData = [];
      this.materielListData = undefined;
      this.selectionOrder = [];
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
    handleAdd () {
      this.$router.push('/page/finance/collection/add');
    },
    handleUpdate (index, row) {
      this.$router.push({ name: '/page/finance/collection/edit', params: { id: row.id } });
    },
    handlePreview (index, row) {
      this.$router.push({ name: '/page/finance/collection/preview', params: { id: row.id, isShow: false } });
    },
    handleAudit (row) {
      this.$router.push({ name: '/page/finance/collection/preview', params: { id: row.id, isShow: true } });
    },
    handleSelectionChangeHedge (selection) {
      this.receiptList = selection
    },
    handlePrint () {
      this.msgSuccess('打印成功');
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
    handleHedge (row) {
      this.reset()
      this.open = true;
      this.title = '核销应收款';
      materielListData(this.form).then(res => {
        console.log("res", res);
        this.materielListData = res.data;
        this.query.total = res.pageTotal;
      });
    },
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = '合计';
          return;
        }
        if (index == 1) {
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
