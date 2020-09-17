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
                   :disabled="multiple"
                   @click="handleDalete">删除</el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-finished"
                   class="handle-del mr10"
                   :disabled="single"
                   @click="handleAudit">审核</el-button>
      </div>
      <el-table :data="tableData"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="warehouseId"
                         label="编号"
                         width="120"
                         align="center"></el-table-column>
        <el-table-column prop="warehouseName"
                         label="对应仓库"
                         align="center"></el-table-column>
        <el-table-column prop="warehouseNum"
                         label="来源类型"
                         align="center"></el-table-column>
        <el-table-column prop="deptName"
                         label="供应单位"
                         align="center"></el-table-column>
        <!-- <el-table-column prop="number"
                         label="入库数量"
                         align="center"></el-table-column> -->
        <el-table-column prop="createTime"
                         label="入库日期"
                         align="center"></el-table-column>
        <el-table-column prop="createTime"
                         label="录入人"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         width="300"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-info"
                       @click="handlePreview(scope.$index, scope.row)">明细</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       @click="handleDalete(scope.$index, scope.row)">删除</el-button>
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
               width="600px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称"
                          prop="nickName">
              <el-input v-model="form.nickName"
                        placeholder="请输入客户名称" />
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
            <el-form-item label="单位"
                          prop="phonenumber">
              <el-input v-model="form.phonenumber"
                        placeholder="请输入单位"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价"
                          prop="email">
              <el-input v-model="form.email"
                        placeholder="请输入单价"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称"
                          prop="phonenumber">
              <el-input v-model="form.phonenumber"
                        placeholder="请输入产品名称"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号"
                          prop="email">
              <el-input v-model="form.email"
                        placeholder="请输入规格型号"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量"
                          prop="phonenumber">
              <el-input v-model="form.phonenumber"
                        placeholder="请输入数量"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应单位"
                          prop="email">
              <el-input v-model="form.email"
                        placeholder="请输入供应单位"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined"
                          label="仓库名称"
                          prop="clienteleName">
              <el-input v-model="form.clienteleName"
                        placeholder="请输入仓库名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined"
                          label="入库日期"
                          prop="password">
              <el-input v-model="form.password"
                        type="date" />
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
    </el-dialog>
  </div>
</template>

<script>
import { listData, getWarehouse } from '@/api/basis/warehouse.js';
export default {
  name: 'warehouse-materialStorage',//商品入库
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
      //归属部门
      deptOptions: undefined,
      // 日期范围
      tableData: [],
      pageTotal: 0,
      //表单参数
      title: '',
      open: false,
      form: {},
      // 表单校验
      rules: {
        warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        warehouseNum: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '顺序不能为空', trigger: 'blur' }]
      }
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
    handleAdd () {
      this.$router.push('/page/warehouse/materialStorage/add');
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.$router.push({ name: '/page/warehouse/materialStorage/edit', params: { id: row.materielId } });
    },
    handlePreview (row) {
      this.$router.push({ name: '/page/warehouse/materialStorage/preview', params: { id: row.materielId, isShow: false } });
    },
    handleAudit (row) {
      this.$router.push({ name: '/page/warehouse/materialStorage/preview', params: { id: row.warehouseId, isShow: true } });
    },
    /** 删除按钮操作 */
    handleDalete () {
      this.$message.success('删除仓库');
    },
    submitForm () {
      this.$message.success('提交表单');
    },
    cancel () {
      this.open = false;
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
