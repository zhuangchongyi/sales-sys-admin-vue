<template>
  <div class="container">
    <el-form :model="queryParams"
             ref="queryParams"
             :inline="true">
      <el-form-item label="报价单号"
                    prop="quotationNum">
        <el-input v-model="queryParams.quotationNum"
                  placeholder="请输入报价单号"
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
                   size="small"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="small"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="handle-box">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-plus"
                 class="handle-del mr10"
                 @click="handleAdd">新增</el-button>
      <!-- <el-button type="danger"
                 size="small"
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
                 size="small"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="multiple"
                 @click="handleSubmit">提交</el-button> -->
      <el-button type="primary"
                 size="small"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="single"
                 @click="handleAudit">审核</el-button>
      <el-button type="primary"
                 size="small"
                 icon="el-icon-printer"
                 class="handle-del mr10"
                 :disabled="single"
                 @click="handlePrint">打印</el-button>
      <!-- <el-button type="warning"
                 size="small"
                 icon="el-icon-finished"
                 class="handle-del mr10"
                 :disabled="multiple"
                 @click="handleSubmitOrder">生成订单</el-button> -->
    </div>
    <el-table v-loading="loading"
              :data="dataList"
              ref="dataList"
              @row-click="selectionRowClick"
              highlight-current-row
              @row-dblclick="handledblclickRow"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="50"
                       fixed="left"
                       align="center" />
      <el-table-column label="报价单号"
                       align="center"
                       prop="quotationNum"
                       fixed="left"
                       :show-overflow-tooltip="true"
                       width="200" />
      <el-table-column label="报价日期"
                       prop="quotationTime"
                       align="center"
                       :show-overflow-tooltip="true"
                       width="160"></el-table-column>
      <el-table-column label="客户编号"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="clienteleNum"
                       width="80" />
      <el-table-column label="客户名称"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true"
                       width="100" />
      <!-- <el-table-column label="客户类别"
                       align="center"
                       prop="categoryName"
                       :show-overflow-tooltip="true"
                       width="100" /> -->
      <el-table-column prop="leader"
                       label="客户联系人"
                       align="center"
                       width="100"></el-table-column>
      <el-table-column prop="phone"
                       label="联系人电话"
                       align="center"
                       width="150"></el-table-column>
      <el-table-column prop="mobilephone"
                       label="手机"
                       align="center"
                       width="150"></el-table-column>
      <el-table-column prop="personnelName"
                       label="报价人员"
                       align="center"
                       width="100"></el-table-column>
      <el-table-column prop="deptName"
                       label="所属部门"
                       align="center"
                       width="100"></el-table-column>
      <el-table-column label="总计金额"
                       align="center"
                       prop="totalPrice"
                       width="160"></el-table-column>
      <el-table-column label="付款条件"
                       align="center"
                       prop="payCondition"
                       width="160"></el-table-column>
      <el-table-column label="有效日期"
                       align="center"
                       prop="effectiveTime"
                       width="160"></el-table-column>
      <el-table-column prop="status"
                       label="审核状态"
                       :formatter='approvalStatusFormatter'
                       align="center"
                       width="120" />
      <el-table-column prop="createBy"
                       label="录入人"
                       align="center"
                       width="120" />
      <el-table-column prop="createTime"
                       label="录入时间"
                       align="center"
                       width="150" />
      <el-table-column label="审核人"
                       align="center"
                       prop="auditBy"
                       width="150" />
      <el-table-column label="审核时间"
                       align="center"
                       prop="auditTime"
                       width="120" />
      <el-table-column label="操作"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width"
                       fixed="right">
        <template slot-scope="scope">
          <el-button size="small"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="small"
                     type="text"
                     icon="el-icon-info"
                     @click="handlePreview(scope.row)">明细</el-button>
          <el-button size="small"
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

    <!-- 添加或修改参数配置对话框 -->
    <!-- <el-dialog :title="title"
               :visible.sync="open"
               width="800px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称"
                          prop="nickName">
              <el-input v-model="form.nickName"
                        placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门"
                          prop="deptId">
              <treeselect v-model="form.deptId"
                          :options="deptOptions"
                          :disable-branch-nodes="true"
                          :show-count="true"
                          placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码"
                          prop="phonenumber">
              <el-input v-model="form.phonenumber"
                        placeholder="请输入手机号码"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价"
                          prop="email">
              <el-input v-model="form.email"
                        placeholder="请输入邮箱"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined"
                          label="客户名称"
                          prop="clienteleName">
              <el-input v-model="form.clienteleName"
                        placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined"
                          label="联系方式"
                          prop="password">
              <el-input v-model="form.password"
                        placeholder="请输入联系方式"
                        type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark"
                        type="textarea"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listQuotation, deleteQuotation, submitQuotation } from '@/api/sales/quotation.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'sales-quotation',
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
      //报价单数据
      dataList: [],
      //总条数
      total: 0,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      //表单参数
      form: {},
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        quotationNum: undefined,
        clienteleNum: undefined,
        clienteleName: undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
      },
      selection: undefined
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
      listQuotation(this.queryParams).then(res => {
        this.dataList = res.data.records;
        this.total = res.data.total || 0;
        this.loading = false;
      });
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
      // console.log("handleSelectionChange", selection)
      this.ids = selection.map(item => item.quotationId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.selection = selection[0];
    },
    selectionRowClick (row) {
      // console.log("selectionRowClick")
      this.$refs.dataList.toggleRowSelection(row);
    },
    handledblclickRow (row, event, column) {
      // console.log("handledblclickRow")
      this.handlePreview(row);
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handlePrint (row) {
      let quotationId = row.quotationId || this.selection.quotationId;
      console.log(quotationId);
      this.msgSuccess('打印成功');
    },
    handleSubmitOrder () {
      this.msgSuccess('生成订单');
    },
    handleSubmit () {
      let quotationIds = this.ids || [];
      // console.log(quotationIds)
      submitQuotation("1", quotationIds).then(res => {
        if (res.success) {
          this.msgSuccess('提交成功');
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    handleNoSubmit () {
      let quotationIds = this.ids || [];
      // console.log(quotationIds)
      submitQuotation("2", quotationIds).then(res => {
        if (res.success) {
          this.msgSuccess('收回成功');
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    handleDelete (row) {
      let quotationId = row.quotationId || this.selection.quotationId;
      // console.log(quotationId);
      deleteQuotation(quotationId).then(res => {
        if (res.success) {
          this.msgSuccess(res.message)
          this.handleQuery();
        } else {
          this.msgError(res.message)
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.$router.push("/page/sales/quotation/add");
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.$router.push({ path: "/page/sales/quotation/edit", query: { id: row.quotationId } });
    },
    handlePreview (row) {
      this.$router.push({ path: "/page/sales/quotation/preview", query: { id: row.quotationId, isShow: false } });
    },
    handleAudit (row) {
      let quotationId = row.quotationId || this.selection.quotationId;
      this.$router.push({ path: "/page/sales/quotation/preview", query: { id: quotationId, isShow: false, isAudit: true } });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
          } else {
          }
        }
      });
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
