<template>
  <div>
    <div class="container">
      <el-form :model="queryParams"
               ref="queryParams"
               :inline="true">
        <el-form-item label="客户名称"
                      prop="clienteleName">
          <el-input v-model="queryParams.clienteleName"
                    :disabled="true"
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQueryParams" />
        </el-form-item>
        <el-form-item label="客户编码"
                      prop="clienteleNum">
          <el-input v-model="queryParams.clienteleNum"
                    size="small"
                    :disabled="true"
                    style="width: 200px"
                    @keyup.enter.native="handleQueryParams" />
        </el-form-item>
        <el-form-item label="产品名称"
                      prop="materielName">
          <el-input v-model="queryParams.materielName"
                    placeholder="请输入产品名称"
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQueryParams" />
        </el-form-item>
        <el-form-item label="产品编码"
                      prop="materielNum">
          <el-input v-model="queryParams.materielNum"
                    placeholder="请输入产品编码"
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQueryParams" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryParams">搜索</el-button>
          <el-button icon="el-icon-refresh"
                     size="mini"
                     @click="resetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="handle-box">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-plus"
                   class="handle-del mr10"
                   v-show="queryParams.clienteleId!==0"
                   v-hasPermi="['basis:clienteleProduct:add']"
                   @click="handleAdd">新增</el-button>
      </div>
      <el-table v-loading="loading"
                :data="productListData"
                class="table"
                ref="productListData"
                header-cell-class-name="table-header">
        <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="materielNum"
                         label="产品编码"
                         :show-overflow-tooltip="true"
                         align="center"></el-table-column>
        <el-table-column prop="materielName"
                         label="产品名称"
                         :show-overflow-tooltip="true"
                         align="center"></el-table-column>
        <el-table-column prop="specification"
                         label="规格"
                         width="150"
                         :show-overflow-tooltip="true"
                         align="center"></el-table-column>
        <el-table-column prop="modelName"
                         label="型号"
                         width="150"
                         :show-overflow-tooltip="true"
                         align="center"></el-table-column>
        <el-table-column prop="needTorque"
                         label="所需扭矩"
                         :show-overflow-tooltip="true"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="outTorque"
                         label="输出扭矩"
                         :show-overflow-tooltip="true"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="unitsName"
                         label="单位"
                         align="center"></el-table-column>
        <el-table-column prop="price"
                         label="单价"
                         :show-overflow-tooltip="true"
                         align="center"></el-table-column>
        <el-table-column prop="updateTime"
                         label="调价时间"
                         width="150"
                         align="center"></el-table-column>
        <el-table-column prop="updateBy"
                         label="调价人"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         width="300"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       v-hasPermi="['basis:clienteleProduct:edit']"
                       @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       style="color:#fd5656"
                       v-hasPermi="['basis:clienteleProduct:delete']"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, sizes, prev, pager, next"
                       :current-page="queryParams.current"
                       :page-size="queryParams.size"
                       :total="total"
                       :page-sizes="[10, 50, 100, 200]"
                       @size-change="handleSizeChange"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <el-dialog :title="title"
               :visible.sync="addOpen"
               width="800px"
               append-to-body>
      <el-form :model="query"
               ref="query"
               :inline="true">
        <el-form-item label="产品类别"
                      prop="categoryId">
          <treeselect v-model="query.categoryId"
                      :options="categoryOptions"
                      :disable-branch-nodes="true"
                      :show-count="true"
                      style="width: 160px"
                      placeholder="请选择类别" />
        </el-form-item>
        <el-form-item label="产品名称"
                      prop="materielName">
          <el-input v-model="query.materielName"
                    placeholder="请输入产品名称或编码"
                    clearable
                    size="mini"
                    style="width: 170px"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading"
                :data="materielListData"
                @selection-change="handleSelectionChangeDialog">
        <el-table-column type="selection"
                         width="50"
                         fixed="left"
                         align="center" />
        <el-table-column label="产品编码"
                         align="center"
                         prop="materielNum"
                         width="100" />
        <el-table-column label="产品名称"
                         align="center"
                         prop="materielName"
                         :show-overflow-tooltip="true"
                         width="100" />
        <el-table-column prop="specification"
                         label="规格"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="120"></el-table-column>
        <el-table-column prop="modelName"
                         label="型号"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="120"></el-table-column>
        <el-table-column prop="needTorque"
                         label="所需扭矩"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="100"></el-table-column>
        <el-table-column prop="outTorque"
                         :show-overflow-tooltip="true"
                         label="输出扭矩"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="unitsName"
                         label="单位"
                         :show-overflow-tooltip="true"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="price"
                         label="单价"
                         align="center"
                         width="200">
          <template slot-scope="scope">
            <el-input size="mini"
                      oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      maxlength="10"
                      v-model="scope.row.price"
                      placeholder="请输入" />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, sizes, prev, pager, next"
                       :current-page="query.current"
                       :page-size="query.size"
                       :total="productTotal"
                       :page-sizes="[10, 50, 100, 200]"
                       @size-change="handleSizeChangeDialog"
                       @current-change="handlePageChangeDialog"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改产品价格 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码"
                          prop="materielNum">
              <el-input v-model="form.materielNum"
                        :disabled="true"
                        placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称"
                          prop="materielName">
              <el-input v-model="form.materielName"
                        :disabled="true"
                        placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格"
                          prop="specification">
              <el-input v-model="form.specification"
                        :disabled="true"
                        placeholder="请输入规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号"
                          prop="modelName">
              <el-input v-model="form.modelName"
                        :disabled="true"
                        placeholder="请输入型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位"
                          prop="unitsName">
              <el-input v-model="form.unitsName"
                        :disabled="true"
                        placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价"
                          prop="price">
              <el-input v-model="form.price"
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        maxlength="10"
                        placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="调价时间"
                          prop="updateTime">
              <el-date-picker v-model="form.updateTime"
                              :disabled="true"
                              style="width:150px"
                              placeholder="请输入调价时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调价人"
                          prop="updateBy">
              <el-input v-model="form.updateBy"
                        :disabled="true"
                        placeholder="请输入调价人" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark"
                        type="textarea"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
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
import { getProductClientele } from '@/api/basis/clientele.js';
import { listProduct, getProduct, deleteProduct, addProduct, updateProduct, listClienteleMateriel, getProductIds } from '@/api/basis/clienteleProduct.js';
import { treeselect } from '@/api/basis/category.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'basis-product-customer-price',
  components: { Treeselect },
  data () {
    return {
      loading: true,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        clienteleId: undefined,
        clienteleNum: undefined,
        clienteleName: undefined,
        materielNum: undefined,
        materielName: undefined,
      },
      total: 0,
      productListData: [],
      query: {
        current: 1,
        size: 10,
        categoryId: undefined,
        clienteleId: undefined,
        materielNum: undefined,
        materielName: undefined,
      },
      productTotal: 0,

      //表单参数
      title: '',
      open: false,
      addOpen: false,
      form: {},
      // 表单校验
      rules: {
        clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
      },
      // 产品类别树选项
      categoryOptions: [],
      materielListData: [],
      materielSelection: undefined,
      loading: true,
    };
  },
  watch: {
    $route (to, form) {
      this.queryParams.clienteleId = to.query.id;
    }
  },
  created () {
    this.queryParams.clienteleId = this.$route.query.id;
    this.getClienteleData();
  },
  methods: {
    /** 查询列表 */
    getList () {
      listProduct(this.queryParams).then(res => {
        if (res.success) {
          this.productListData = res.data.records;
          this.total = res.total || 0;
        }
        this.loading = false;
      });
    },
    // 查询客户信息
    getClienteleData () {
      getProductClientele(this.queryParams).then(res => {
        if (res.success) {
          this.queryParams.clienteleId = res.data.clienteleId;
          this.queryParams.clienteleNum = res.data.clienteleNum;
          this.queryParams.clienteleName = res.data.clienteleName;
          this.getList();
        }
      });
    },
    // 表单重置
    reset () {
      this.form = {
        materielName: undefined,
        materielNum: undefined,
      };
      this.resetForm('form');
    },
    /** 查询产品类别下拉树结构 */
    getTreeselect () {
      treeselect({ category: '0' }).then(res => {
        this.categoryOptions = res.data;
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
    /** 搜索按钮操作 */
    handleQueryParams () {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQueryParams () {
      this.queryParams.materielNum = undefined;
      this.queryParams.materielName = undefined;
      // this.resetForm('queryParams');
      this.handleQueryParams();
    },


    /** 搜索产品按钮操作 */
    handleQuery () {
      this.query.materielNum = this.query.materielName;
      this.query.clienteleId = this.queryParams.clienteleId;
      this.query.current = 1;
      this.getMaterielList();
    },
    resetQuery () {
      this.resetForm('query');
      this.handleQuery();
    },
    handleSelectionChangeDialog (selection) {
      console.log("selection", selection)
      this.materielSelection = selection;
    },
    handlePageChangeDialog (val) {
      this.$set(this.query, 'current', val);
      this.getMaterielList();
    },
    handleSizeChangeDialog (val) {
      this.$set(this.query, 'size', val);
      this.getMaterielList();
    },
    /** 查询产品列表 */
    async getMaterielList () {
      listClienteleMateriel(this.query).then(res => {
        console.log("materiel", res)
        this.materielListData = res.data.records;
        this.total = res.data.total || 0;
      });
    },
    /** 添加产品按钮操作 */
    handleAdd () {
      this.addOpen = true;
      this.title = '添加产品';
      this.getTreeselect();
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      getProduct(row.pkId).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = '修改产品';
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
        return deleteProduct(row.pkId).then(res => that.callbackFun(res));
      })
    },
    submitForm () {
      if (this.form.pkId != undefined) {
        updateProduct(this.form).then(res => this.callbackFun(res))
      } else {
        let products = JSON.parse(JSON.stringify(this.materielSelection));
        products.forEach(item => {
          item.clienteleId = this.queryParams.clienteleId;
        });
        console.log("新增产品", products)
        addProduct(products).then(res => {
          if (res.success) {
            this.msgSuccess("添加成功")
            this.getMaterielList();
            this.getList();
          }
        })

      }
    },
    cancel () {
      this.open = false;
      this.addOpen = false;
    },
    callbackFun (res) {
      if (res.success) {
        this.msgSuccess(res.message)
        this.handleQueryParams();
        this.cancel();
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

.handle-box {
    margin-bottom: 8px;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>
