<template>
  <div>
    <div class="container">
      <el-form :model="queryParams"
               ref="queryParams"
               :inline="true">
        <el-form-item label="单位编码"
                      prop="unitsNum">
          <el-input v-model="queryParams.unitsNum"
                    placeholder="请输入单位编码"
                    clearable
                    size="small"
                    style="width: 140px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="单位名称"
                      prop="unitsName">
          <el-input v-model="queryParams.unitsName"
                    placeholder="请输入单位名称"
                    clearable
                    size="small"
                    style="width: 140px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="单位类型"
                      prop="unitsType">
          <el-select v-model="queryParams.unitsType"
                     placeholder="选择单位类型"
                     clearable
                     size="small"
                     style="width: 120px">
            <el-option v-for="dict in unitsTypeOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态"
                      prop="status">
          <el-select v-model="queryParams.status"
                     placeholder="选择状态"
                     clearable
                     size="small"
                     style="width: 120px">
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
                   v-hasPermi="['basis:units:add']"
                   @click=" handleAdd">新增</el-button>
      </div>
      <el-table v-loading="loading"
                :data="unitsListData"
                class="table"
                ref="unitsListData"
                header-cell-class-name="table-header">
        <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="unitsNum"
                         label="单位编码"
                         align="center"></el-table-column>
        <el-table-column prop="unitsName"
                         label="单位名称"
                         align="center"></el-table-column>
        <el-table-column label="单位类型"
                         prop="status"
                         :formatter="unitsTypeFormatter"
                         align="center">
        </el-table-column>
        <el-table-column label="状态"
                         prop="status"
                         :formatter="statusFormatter"
                         align="center">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间"
                         align="center"></el-table-column>
        <el-table-column prop="createBy"
                         label="创建人"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         width="300"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       v-hasPermi="['basis:units:edit']"
                       @click=" handleUpdate(scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       v-hasPermi="['basis:units:delete']"
                       @click=" handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total,sizes, prev, pager, next"
                       :current-page="queryParams.current"
                       :page-size="queryParams.size"
                       :total="total"
                       :page-sizes="[10, 50, 100, 200]"
                       @size-change="handleSizeChange"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 添加或修改单位配置对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="单位编码"
                      prop="unitsNum">
          <el-input v-model="form.unitsNum"
                    placeholder="请输入单位编码" />
        </el-form-item>
        <el-form-item label="单位名称"
                      prop="unitsName">
          <el-input v-model="form.unitsName"
                    placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="单位类型"
                      prop="unitsType">
          <el-radio-group v-model="form.unitsType">
            <el-radio v-for="dict in unitsTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态"
                      prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"
                    type="textarea"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
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
import { listUnits, getUnits, addUnits, updateUnits, deleteUnits } from '@/api/basis/units.js';
export default {
  name: 'basis-units',
  data () {
    return {
      loading: true,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        unitsName: undefined,
        unitsNum: undefined,
        unitsType: undefined,
        status: undefined
      },
      total: 0,
      unitsListData: [],
      // 状态数据字典
      statusOptions: [{ dictValue: '0', dictLabel: '启用' }, { dictValue: '1', dictLabel: '停用' }],
      unitsTypeOptions: [{ dictValue: '0', dictLabel: '基本单位' }, { dictValue: '1', dictLabel: '包装单位' }],
      //表单参数
      title: '',
      open: false,
      form: {},
      // 表单校验
      rules: {
        unitsNum: [{ required: true, message: '单位编码不能为空', trigger: 'blur' }, { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }],
        unitsName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 启用状态
    statusFormatter (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    unitsTypeFormatter (row, column) {
      return this.selectDictLabel(this.unitsTypeOptions, row.unitsType);
    },
    // 表单重置
    reset () {
      this.form = {
        unitsId: undefined,
        unitsName: undefined,
        unitsNum: undefined,
        status: '0',
        unitsType: '0',
        remark: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryParams');
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
    /** 查询单位列表 */
    getList () {
      listUnits(this.queryParams).then(res => {
        this.unitsListData = res.data.records;
        this.total = res.data.total || 0;
        this.loading = false;
      });
    },
    /** 添加按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = '添加单位';
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      getUnits(row.unitsId).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = '修改单位';
      })
    },
    /** 删除按钮操作 */
    handleDelete () {
      let that = this;
      this.$confirm('请确认是否删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return deleteUnits(row.unitsId).then(res => that.callbackFun(res));
      })
    },
    cancel () {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.unitsId == undefined) {
            addUnits(this.form).then(res => this.callbackFun(res));
          } else {
            updateUnits(this.form).then(res => this.callbackFun(res));
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

.handle-box {
    margin-bottom: 8px;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>