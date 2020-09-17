<template>
  <div>
    <div class="container">
      <el-form :inline="true">
        <el-form-item label="部门编码">
          <el-input v-model="queryDeptParams.deptNum"
                    placeholder="请输入部门编码"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="queryDeptParams.deptName"
                    placeholder="请输入部门名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryDeptParams.status"
                     placeholder="状态"
                     clearable
                     size="small">
            <el-option v-for="dict in statusOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQuery">搜索</el-button>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-plus"
                     size="mini"
                     v-hasPermi="['system:dept:add']"
                     @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading"
                :data="deptListData"
                row-key="deptId"
                default-expand-all
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="deptNum"
                         label="部门编码"
                         width="200"></el-table-column>
        <el-table-column prop="deptName"
                         label="部门名称"
                         width="260"></el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="100"
                         :formatter="statusFormat"></el-table-column>
        <el-table-column label="创建人"
                         align="center"
                         prop="createBy"
                         width="200"></el-table-column>
        <el-table-column label="创建时间"
                         align="center"
                         prop="createTime"
                         width="200"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       v-hasPermi="['system:dept:edit']"
                       @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini"
                       type="text"
                       icon="el-icon-plus"
                       v-hasPermi="['system:dept:add']"
                       @click="handleAdd(scope.row)">新增</el-button>
            <el-button v-if="scope.row.deptType == 0"
                       size="mini"
                       type="text"
                       icon="el-icon-info"
                       v-hasPermi="['system:dept:user']"
                       @click="handlePersonnel(scope.row)">人员</el-button>
            <el-button v-if="scope.row.parentId != 0"
                       size="mini"
                       type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       v-hasPermi="['system:dept:delete']"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title"
                 :visible.sync="open"
                 width="600px"
                 append-to-body>
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px">
          <el-row>
            <el-col :span="24"
                    v-if="form.parentId !== 0">
              <el-form-item label="归属上级"
                            prop="parentId">
                <treeselect v-model="form.parentId"
                            :options="deptOptions"
                            :normalizer="normalizer"
                            placeholder="选择上级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门编码"
                            prop="deptNum">
                <el-input v-model="form.deptNum"
                          placeholder="请输入部门名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门名称"
                            prop="deptName">
                <el-input v-model="form.deptName"
                          placeholder="请输入部门名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人"
                            prop="leader">
                <el-input v-model="form.leader"
                          placeholder="请输入部门负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话"
                            prop="phone">
                <el-input v-model="form.phone"
                          placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱"
                            prop="email">
                <el-input v-model="form.email"
                          placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型"
                            prop="deptType">
                <el-radio-group v-model="form.deptType">
                  <el-radio v-for="dict in deptTypeOptions"
                            :key="dict.dictValue"
                            :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="状态"
                            prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="dict in statusOptions"
                            :key="dict.dictValue"
                            :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址"
                            prop="address">
                <el-input v-model="form.address"
                          placeholder="请输入地址" />
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

      <!-- 人员弹窗 -->
      <el-dialog :title="title"
                 :visible.sync="openPersonnel"
                 width="600px"
                 append-to-body>
        <el-table :data="personnelList">
          <el-table-column type="selection"
                           width="50"
                           align="center" />
          <el-table-column label="员工编号"
                           align="center"
                           prop="userNum" />
          <el-table-column label="员工名称"
                           align="center"
                           prop="nickname" />
          <el-table-column label="性别"
                           align="center"
                           :formatter="genderFormatter"
                           prop="gender" />
          <el-table-column label="联系方式"
                           align="center"
                           prop="phone" />
        </el-table>
        <div class="pagination">
          <el-pagination background
                         layout="total,sizes, prev, pager, next"
                         :current-page="personnelQueryParams.current"
                         :page-size="personnelQueryParams.size"
                         :total="total"
                         :page-sizes="[10, 50, 100, 200]"
                         @size-change="handleSizeChange"
                         @current-change="handlePageChange"></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deptListData, getDept, addDept, updateDept, deleteDept } from '@/api/system/dept.js';
import { userListPage } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'system-dept',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptListData: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isAdd: false,
      // 状态数据字典
      statusOptions: [{ dictValue: '0', dictLabel: '启用' }, { dictValue: '1', dictLabel: '停用' }],
      deptTypeOptions: [{ dictValue: '0', dictLabel: '部门' }, { dictValue: '1', dictLabel: '公司' }],
      // 查询参数
      queryDeptParams: {
        deptName: undefined,
        deptNum: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
        deptNum: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
        ],
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        deptType: [{ required: true, message: '未选择类型', trigger: 'change' }],
        status: [{ required: true, message: '未选择启用状态', trigger: 'change' }]
      },
      openPersonnel: false,
      personnelList: [],
      personnelQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 部门列表
    getList () {
      deptListData(this.queryDeptParams).then(res => {
        this.loading = false;
        this.deptListData = this.handleTree(res.data, 'deptId');
        this.deptOptions = this.handleTree(res.data, 'deptId');
      });
    },
    // 表单重置
    reset () {
      this.form = {
        deptType: '0',
        status: '0'
      };
      this.resetForm('form');
    },
    // 字典状态字典翻译
    statusFormat (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel () {
      this.open = false;
    },
    // 搜索按钮
    handleQuery () {
      this.getList();
    },
    /** 转换部门数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.isAdd = true;
      this.open = true;
      this.title = '添加部门';
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      getDept(row.deptId).then(res => {
        console.log("res", res.data)
        this.form = res.data;
        this.open = true;
        this.isAdd = false;
        this.title = '修改部门';
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this;
      this.$confirm('请确认是否删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteDept(row.deptId).then(res => that.callbackFun(res));
      })
    },
    // 查看员工按钮
    handlePersonnel (row) {
      this.personnelQueryParams.deptId = row.deptId;
      userListPage(this.personnelQueryParams).then(res => {
        this.openPersonnel = true;
        this.title = '人员列表'
        this.personnelList = res.data.records;
        this.total = res.data.total;
      })
    },
    handlePageChange (val) {
      this.$set(this.personnelQueryParams, 'current', val);
    },
    handleSizeChange (val) {
      this.$set(this.personnelQueryParams, 'size', val);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            addDept(this.form).then(res => this.callbackFun(res));
          } else {
            updateDept(this.form).then(res => this.callbackFun(res));
          }
        }
      });
    },
    callbackFun (res) {
      if (res.success) {
        this.msgSuccess(res.message)
        this.open = false
      } else {
        this.msgError(res.message)
      }
      this.getList();
      return true;
    }
  }
};
</script>

<style scoped>
.el-form .el-form-item__label {
    font-weight: bold;
}
.el-table--small {
    font-size: 14px;
}
.handle-box {
    margin-bottom: 8px;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>
