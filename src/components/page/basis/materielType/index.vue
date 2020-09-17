<template>
  <div>
    <div class="container">
      <el-form :inline="true">
        <el-form-item label="产品类别名称">
          <el-input v-model="queryParams.categoryName"
                    placeholder="请输入产品类别名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="产品类别编码">
          <el-input v-model="queryParams.categoryNum"
                    placeholder="请输入产品类别编码"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status"
                     placeholder="产品类别状态"
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
                     v-hasPermi="['basis:materielType:add']"
                     @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table style="width: 100%"
                v-loading="loading"
                :data="categoryListData"
                row-key="categoryId"
                default-expand-all
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="categoryNum"
                         label="产品类别编码"
                         width="200"></el-table-column>
        <el-table-column prop="categoryName"
                         label="产品类别名称"
                         width="260"></el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="100"
                         :formatter="statusFormat"></el-table-column>
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
                       v-hasPermi="['basis:materielType:edit']"
                       @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini"
                       type="text"
                       icon="el-icon-plus"
                       v-hasPermi="['basis:materielType:add']"
                       @click="handleAdd(scope.row)">新增</el-button>
            <el-button v-if="scope.row.parentId != 0"
                       size="mini"
                       type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       v-hasPermi="['basis:materielType:delete']"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改产品类别对话框 -->
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
              <el-form-item label="上级类别"
                            prop="parentId">
                <treeselect v-model="form.parentId"
                            :options="categoryOptions"
                            :normalizer="normalizer"
                            placeholder="选择上级产品类别" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别编码"
                            prop="categoryNum">
                <el-input v-model="form.categoryNum"
                          placeholder="请输入产品类别名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别名称"
                            prop="categoryName">
                <el-input v-model="form.categoryName"
                          placeholder="请输入产品类别名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别状态">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="dict in statusOptions"
                            :key="dict.dictValue"
                            :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
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
  </div>
</template>

<script>
import { listCategory, getCategory, addCategory, deleteCategory, updateCategory } from '@/api/basis/category.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'basis-materiel-type',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      categoryListData: [],
      // 产品类别树选项
      categoryOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [{ dictValue: '0', dictLabel: '启用' }, { dictValue: '1', dictLabel: '停用' }],
      // 查询参数
      queryParams: {
        categoryNum: undefined,
        categoryName: undefined,
        category: '0',
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [{ required: true, message: '上级产品类别不能为空', trigger: 'blur' }],
        categoryName: [{ required: true, message: '产品类别名称不能为空', trigger: 'blur' }],
        categoryNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 查询产品类别列表
    getList () {
      listCategory(this.queryParams).then(res => {
        if (res.success) {
          this.categoryListData = this.handleTree(res.data, 'categoryId');
          this.categoryOptions = this.handleTree(res.data, 'categoryId');
        }
        this.loading = false;
      });
    },
    // 表单重置
    reset () {
      this.form = {
        categoryId: undefined,
        parentId: undefined,
        categoryName: undefined,
        categoryNum: undefined,
        category: '0',
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
      this.reset();
    },
    // 搜索按钮
    handleQuery () {
      this.getList();
    },
    /** 转换产品类别数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.categoryId,
        label: node.categoryName,
        children: node.children
      };
    },
    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.categoryId;
      }
      this.open = true;
      this.title = '添加产品类别';
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      getCategory(row.categoryId).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = '修改产品类别';
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      let that = this;
      this.$confirm('请确认是否删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteCategory(row.categoryId).then(res => that.callbackFun(res));
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.categoryId != undefined) {
            updateCategory(this.form).then(res => this.callbackFun(res))
          } else {
            addCategory(this.form).then(res => this.callbackFun(res))
          }
        }
      });
    },
    callbackFun (res) {
      if (res.success) {
        this.msgSuccess(res.message)
        this.open = false
        this.handleQuery();
      } else {
        this.msgError(res.message)
      }
      return true;
    },
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
