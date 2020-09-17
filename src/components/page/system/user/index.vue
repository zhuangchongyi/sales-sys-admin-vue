<template>
  <div class="container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4"
              :xs="24">
        <div class="head-container">
          <el-input v-model="deptName"
                    placeholder="请输入部门名称"
                    clearable
                    size="small"
                    prefix-icon="el-icon-search"
                    style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions"
                   :props="defaultProps"
                   :expand-on-click-node="false"
                   :filter-node-method="filterNode"
                   ref="tree"
                   default-expand-all
                   :highlight-current="true"
                   @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20"
              :xs="24">
        <el-form :model="queryParams"
                 ref="queryParams"
                 :inline="true">
          <el-form-item label="用户编码"
                        prop="userNum">
            <el-input v-model="queryParams.userNum"
                      placeholder="请输入用户编码"
                      clearable
                      size="small"
                      style="width: 200px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="用户名称"
                        prop="nickname">
            <el-input v-model="queryParams.nickname"
                      placeholder="请输入用户名称"
                      clearable
                      size="small"
                      style="width: 200px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态"
                        prop="startStatus">
            <el-select v-model="queryParams.startStatus"
                       placeholder="用户状态"
                       clearable
                       size="small"
                       style="width: 200px">
              <el-option v-for="dict in startStatusOptions"
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
        <el-table v-loading="loading"
                  :data="dataList">
          <el-table-column type="index"
                           width="50"
                           align="center" />
          <el-table-column label="登录账号"
                           align="center"
                           prop="username" />
          <el-table-column label="员工编码"
                           align="center"
                           prop="userNum" />
          <el-table-column label="员工名称"
                           align="center"
                           prop="nickname" />
          <el-table-column label="部门编码"
                           align="center"
                           prop="dept.deptNum" />
          <el-table-column label="部门名称"
                           align="center"
                           prop="dept.deptName" />
          <el-table-column label="状态"
                           align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.startStatus"
                         active-value="0"
                         inactive-value="1"
                         v-show="scope.row.userId!=1"
                         :disabled="scope.row.userId==1"
                         @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           width="300"
                           fixed="right"
                           class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         icon="el-icon-edit"
                         v-if="scope.row.userId != 1"
                         v-hasPermi="['system:user:role']"
                         @click="handleRole(scope.row)">分配角色</el-button>
              <el-button size="mini"
                         type="text"
                         icon="el-icon-circle-check"
                         style="color:#67c23a"
                         v-if="scope.row.userId != 1"
                         v-hasPermi="['system:user:permission']"
                         @click="handleLookMenu(scope.row)">查看权限</el-button>
              <el-button size="mini"
                         type="text"
                         icon="el-icon-key"
                         style="color:#e6a23c"
                         v-if="scope.row.userId != 1"
                         v-hasPermi="['system:user:reset']"
                         @click="handleResetPassword(scope.row)">重置密码</el-button>
              <el-button size="mini"
                         type="text"
                         icon="el-icon-delete"
                         style="color:#fd5656"
                         v-if="scope.row.userId != 1"
                         v-hasPermi="['system:user:edit']"
                         @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background
                         layout="total, sizes, prev, pager, next"
                         :current-page="queryParams.pageNum"
                         :page-size="queryParams.pageSize"
                         :total="total"
                         :page-sizes="[10, 50, 100, 200]"
                         @size-change="handleSizeChange"
                         @current-change="handlePageChange"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title"
               :visible.sync="openRole"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               label-width="auto">
        <el-form-item label="角色">
          <el-select v-model="form.roleIds"
                     multiple
                     placeholder="请选择">
            <el-option v-for="item in roleOptions"
                       :key="item.roleId"
                       :label="item.roleName"
                       :value="item.roleId"
                       :disabled="item.status == 1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看菜单权限对话框 -->
    <el-dialog :title="title"
               :visible.sync="menuOpen"
               width="600px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :disabled="true"
               label-width="100px">
        <el-form-item label="菜单权限">
          <el-tree :data="menuOptions"
                   show-checkbox
                   ref="menu"
                   node-key="id"
                   empty-text="加载中，请稍后"
                   :default-checked-keys="checkedKeys"
                   :props="defaultProps"></el-tree>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { userListPage, updateUserStatus, resetPassword, userRoleList, userRoleMenuList, addUserRole } from '@/api/system/user.js';
import { treeselect } from '@/api/system/dept.js';
import { menuTreeselect } from '@/api/system/menu.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'system-user',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      menuOpen: false,
      openRole: false,
      // 弹窗标题
      title: '',
      // 选中数组
      ids: [],
      // 非单个停用
      single: true,
      // 非多个停用
      multiple: true,
      //用户数据
      dataList: [],
      //总条数
      total: 0,
      // 部门树选项
      deptOptions: undefined,
      // 菜单列表
      menuOptions: [],
      checkedKeys: [],
      // 启用状态数据字典
      startStatusOptions: [{ dictValue: '0', dictLabel: '启用' }, { dictValue: '1', dictLabel: '停用' }],
      //是否为系统用户
      userTypeOptions: [{ dictValue: '0', dictLabel: '否' }, { dictValue: '1', dictLabel: '是' }],
      //角色选项框
      roleOptions: [],
      // 部门名称
      deptName: undefined,
      //表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        userNum: undefined,
        nickname: undefined,
        deptId: undefined,
        userType: '1',
      },
    };
  },
  created () {
    this.getList();
    this.getTreeselect();
  },
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 查询用户列表
    getList () {
      userListPage(this.queryParams).then(res => {
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
      this.getList();
    },
    /** 查询部门下拉树结构 */
    getTreeselect () {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    handleNodeClick (data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.menuOpen = false;
      this.openRole = false;
    },
    // 表单重置
    reset () {
      this.form = {
        roleIds: []
      };
      this.checkedKeys = [];
      this.menuOptions = [];
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        userNum: undefined,
        nickname: undefined,
        deptId: undefined,
        userType: '1',
      };
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 刪除用户
    handleDelete (row) {
      let that = this;
      this.$confirm('请确认是否删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        let user = {
          userId: row.userId,
          userType: '0'
        }
        return updateUserStatus(user).then(res => that.callbackFun(res));
      })
    },
    // 查看用户权限
    handleLookMenu (row) {
      this.reset();
      userRoleMenuList(row.userId).then(res => {
        console.log("menu", res)
        this.menuOpen = true;
        this.title = '查看用户权限';
        if (res.success) {
          this.menuOptions = res.data.menus;
          this.checkedKeys = res.data.checkedKeys;
        }
      })
    },
    /** 分配角色按钮操作 */
    handleRole (row) {
      this.reset();
      userRoleList(row.userId).then(res => {
        console.log("role", res)
        if (res.success) {
          this.form.userId = row.userId;
          this.form.roleIds = res.data.roleIds;
          this.roleOptions = res.data.roles;
          this.openRole = true;
          this.title = '分配角色';
        }
      })
    },
    /** 提交按钮 */
    submitForm () {
      addUserRole(this.form).then(res => this.callbackFun(res));
    },
    // 重置密码
    handleResetPassword (row) {
      let that = this;
      this.$confirm('确认是否重置 <strong><i>' + row.username + '</i></strong> 的密码?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(row.userId).then(res => {
          console.log("reset", res)
          if (res.success) {
            that.$alert('<strong><i font-size: large;">' + res.data + '</i></strong>', '重置成功', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
              center: true
            });
          } else {
            that.msgError(res.message);
          }
        })
      })
    },
    // 修改状态
    handleStatusChange (row) {
      console.log("handleStatusChange", row)
      let text = row.startStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要' + text + '' + row.username + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return updateUserStatus({ userId: row.userId, startStatus: row.startStatus });
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.startStatus = row.startStatus === "0" ? "1" : "0";
      });
    },
    callbackFun (res) {
      if (res.success) {
        this.msgSuccess(res.message)
        this.handleQuery();
        this.openRole = false;
      } else {
        this.msgError(res.message)
      }
      this.handleQuery();
      return true;
    },
  },

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
