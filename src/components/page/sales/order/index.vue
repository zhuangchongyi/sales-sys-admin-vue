<template>
  <div class="container">
    <el-form :model="queryParams"
             ref="queryParams"
             :inline="true">
      <el-form-item label="订单号"
                    prop="clienteleNum">
        <el-input v-model="queryParams.clienteleNum"
                  placeholder="请输入订单号"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户编码"
                    prop="clienteleNum">
        <el-input v-model="queryParams.clienteleNum"
                  placeholder="请输入客户编码"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户名称"
                    prop="clienteleName">
        <el-input v-model="queryParams.clienteleName"
                  placeholder="请输入客户名称"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="状态"
                    prop="status">
        <el-select v-model="queryParams.status"
                   placeholder="状态"
                   clearable
                   size="small"
                   style="width: 200px">
          <el-option v-for="dict in statusOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->
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
      <!-- <el-button type="danger"
                 size="mini"
                 icon="el-icon-delete"
                 class="handle-del mr10"
                 @click="handleDelete"
                 :disabled="multiple">删除</el-button> -->

      <el-dropdown trigger="click"
                   style="margin: 0 10px;">
        <el-button class="el-dropdown-link"
                   size="mini"
                   type="primary">
          提交<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-top"
                            @click.native="handleSubmit">提交</el-dropdown-item>
          <el-dropdown-item icon="el-icon-bottom"
                            @click.native="handleNoSubmit">收回</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-button type="primary"
                 size="mini"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="multiple"
                 @click="handleSubmit">提交</el-button> -->
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="single"
                 @click="handleAudit">审核</el-button>
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-printer"
                 class="handle-del mr10"
                 @click="handlePrint"
                 :disabled="single">打印</el-button>
      <el-button type="warning"
                 size="mini"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="single"
                 @click="handleCancel">关闭</el-button>
    </div>
    <el-table v-loading="loading"
              :data="orderListData"
              ref="orderListData"
              @row-click="selectionRowClick"
              highlight-current-row
              @row-dblclick="handledblclickRow"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="50"
                       fixed="left"
                       align="center" />
      <el-table-column label="订单号"
                       align="center"
                       prop="orderNum"
                       fixed="left"
                       :show-overflow-tooltip="true"
                       width="200" />
      <el-table-column label="订单日期"
                       align="center"
                       prop="orderTime"
                       :show-overflow-tooltip="true"
                       width="150"></el-table-column>
      <el-table-column label="客户编号"
                       align="center"
                       prop="clienteleNum"
                       :show-overflow-tooltip="true"
                       width="80" />
      <el-table-column label="客户名称"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true"
                       width="100" />
      <el-table-column label="客户联系人"
                       align="center"
                       prop="leader"
                       :show-overflow-tooltip="true"
                       width="100"></el-table-column>
      <el-table-column label="联系人电话"
                       align="center"
                       prop="phone"
                       :show-overflow-tooltip="true"
                       width="150"></el-table-column>
      <el-table-column label="手机"
                       align="center"
                       prop="mobilephone"
                       :show-overflow-tooltip="true"
                       width="150"></el-table-column>
      <el-table-column label="业务员"
                       prop="personnelName"
                       align="center"
                       width="100"></el-table-column>
      <el-table-column label="业务部门"
                       prop="deptName"
                       :show-overflow-tooltip="true"
                       align="center"
                       width="100"></el-table-column>
      <el-table-column label="交货日期"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="deliveryTime"
                       width="150"></el-table-column>
      <el-table-column label="总计金额"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="totalPrice"
                       width="160"></el-table-column>
      <el-table-column label="税率"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="taxrate"
                       width="160"></el-table-column>
      <el-table-column label="税额"
                       align="center"
                       prop="taxamount"
                       :show-overflow-tooltip="true"
                       width="160"></el-table-column>
      <el-table-column label="付款条件"
                       align="center"
                       prop="payCondition"
                       :show-overflow-tooltip="true"
                       width="160"></el-table-column>
      <el-table-column prop="status"
                       label="审核状态"
                       :formatter='approvalStatusFormatter'
                       align="center"
                       width="120" />
      <el-table-column prop="createBy"
                       label="录入人"
                       :show-overflow-tooltip="true"
                       align="center"
                       width="120" />
      <el-table-column prop="createTime"
                       label="录入时间"
                       :show-overflow-tooltip="true"
                       align="center"
                       width="160" />
      <el-table-column label="审核人"
                       align="center"
                       prop="auditBy"
                       :show-overflow-tooltip="true"
                       width="120" />
      <el-table-column label="审核时间"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="auditTime"
                       width="160" />
      <el-table-column label="操作"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-info"
                     @click="handlePreview(scope.row)">明细</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-info"
                     style="color:#e6a23c"
                     @click="handleDeliveryPlan(scope.row)">查看进度</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color:#fd5656"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background
                     :current-page="queryParams.current"
                     :page-size="queryParams.size"
                     :total="total"
                     layout="total, sizes, prev, pager, next"
                     :page-sizes="[10, 50, 100, 200]"
                     @size-change="handleSizeChange"
                     @current-change="handlePageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
import { listOrder, deleteOrder, submitOrder, auditOrder } from '@/api/sales/order.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'sales-order',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      // 弹窗标题
      title: '',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //用户数据
      orderListData: [],
      //表单参数
      form: {},
      // 状态数据字典
      statusOptions: [],
      selection: undefined,
      selectionList: [],
      //总条数
      total: 0,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        orderNum: undefined,
        clienteleNum: undefined,
        clienteleName: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created () {
    this.statusOptions = this.aduitStatusOptions;
    this.getList();
  },
  activated () {
    this.getList()
  },
  methods: {
    getList () {
      listOrder(this.queryParams).then(res => {
        if (res.success) {
          this.orderListData = res.data.records;
          this.total = res.data.total || 0;
        }
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.queryParams, 'current', val);
      this.getList();
    },
    handleSizeChange (val) {
      this.$set(this.queryParams, 'size', val);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.orderId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.selection = selection[0];
      this.selectionList = selection;
    },
    selectionRowClick (row) {
      this.$refs['orderListData'].toggleRowSelection(row);
    },
    handledblclickRow (row, event, column) {
      this.handlePreview(row);
    },
    handlePrint () {
      this.msgSuccess('打印成功');
    },
    handleDelete (row) {
      let orderId = row.orderId || this.selection.orderId;
      if (row.status == "1" || row.status == "3" || row.status == "4" || row.status == "5" || row.status == "6") {
        this.msgError("请收回再进行删除");
        return;
      }
      deleteOrder(orderId).then(res => {
        if (res.success) {
          this.msgSuccess(res.message)
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    // 校验状态
    verifyStatus (status, msg) {
      let data = this.selectionList;
      if (data.length === 0) {
        this.msgError("未选择数据")
        return true;
      }
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (status === item.status) {
          this.msgError(item.orderNum + msg);
          return true
        }
      }
      return false;
    },
    /** 提交按钮 */
    handleSubmit () {
      if (this.verifyStatus("1", "已提交")) return;
      let ids = this.ids || [];
      submitOrder("1", ids).then(res => {
        if (res.success) {
          this.msgSuccess('提交成功');
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    handleNoSubmit () {
      if (this.verifyStatus("2", "已收回")) return;
      let ids = this.ids || [];
      submitOrder("2", ids).then(res => {
        if (res.success) {
          this.msgSuccess('收回成功');
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push("/page/sales/order/add");
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.$router.push({ path: "/page/sales/order/edit", query: { id: row.orderId } });
    },
    /** 明细按钮操作 */
    handlePreview (row) {
      this.$router.push({ path: "/page/sales/order/preview", query: { id: row.orderId, isShow: false } });
    },
    handleAudit (row) {
      let orderId = row.orderId || this.selection.orderId;
      let status = row.status || this.selection.status;
      if (status == '0' || status == '2') {
        this.msgError("请先提交")
        return;
      }
      this.$router.push({ path: "/page/sales/order/preview", query: { id: orderId, isShow: false, isAudit: true } });
    },
    handleCancel () {
      if (this.verifyStatus("7", "已关闭")) return;
      let data = {
        orderId: this.selection.orderId,
        status: '7'
      }
      auditOrder(data).then(res => {
        if (res.success) {
          this.msgSuccess(res.message)
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    handleDeliveryPlan (row) {
      this.$router.push({ path: "/page/sales/order/schedule", query: { id: row.orderId } });
    },
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
