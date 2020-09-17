<template>
  <div class="container">
    <div>
      <el-button type="primary"
                 icon="el-icon-check"
                 @click="submitAddForm">保 存</el-button>
      <el-button icon="el-icon-close"
                 @click="clearAddForm">清 空</el-button>
    </div>

    <el-divider><strong>仓库信息</strong></el-divider>
    <div class="handle-box">
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-paperclip"
                 class="handle-del mr10"
                 @click="handleAddClientele">仓库</el-button>
    </div>
    <el-form :model="clienteleForm"
             ref="clienteleForm"
             label-position="right"
             label-width="100px"
             :inline="true">
      <el-row>
        <el-col :span="4">
          <el-form-item label="仓库编码"
                        prop="clienteleNum">
            <el-input v-model="clienteleForm.clienteleNum"
                      placeholder="请输入仓库编码"
                      size="small"
                      style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="仓库名称"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入仓库名称"
                      size="small"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="录单人"
                        prop="clienteleNum">
            <el-input v-model="clienteleForm.clienteleNum"
                      placeholder="请输入录单人"
                      size="small"
                      style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="报废日期"
                        prop="crateTime">
            <el-date-picker v-model="clienteleForm.crateTime"
                            type="date"
                            placeholder="选择日期"
                            size="small"
                            style="width: 150px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="报废金额"
                        prop="clienteleNum">
            <el-input v-model="clienteleForm.clienteleNum"
                      :disabled="true"
                      size="small"
                      style="width: 150px;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider><strong>产品信息</strong></el-divider>
    <div class="handle-box">
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-paperclip"
                 class="handle-del mr10"
                 @click="handleAddSalesOrder">产品</el-button>
    </div>
    <el-table :data="materielList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="50"
                       align="center" />
      <el-table-column label="产品编码"
                       align="center"
                       prop="clienteleId" />
      <el-table-column label="产品名称"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="clienteleId" />
      <el-table-column prop="personnelName"
                       label="规格"
                       :show-overflow-tooltip="true"
                       align="center" />
      <el-table-column prop="deptName"
                       label="型号"
                       :show-overflow-tooltip="true"
                       align="center" />
      <el-table-column label="所需扭矩"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="price" />
      <el-table-column label="输出扭矩"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="price" />
      <el-table-column label="单位"
                       align="center"
                       prop="price" />
      <el-table-column label="单价"
                       align="center"
                       prop="clientelePrice" />
      <el-table-column prop="sps"
                       label="报废数"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    focus="bfsFocus"
                    oninput="if(isNaN(value)) { value = null }"
                    maxLength='9'
                    v-model="scope.row.sps" />
        </template>
      </el-table-column>
      <el-table-column label="报废金额"
                       align="center"
                       width="200"
                       prop="bfPrice">
        <template slot-scope="scope">
          <span :v-model="scope.row.bfPrice">{{(parseInt(scope.row.clientelePrice||0)*parseInt(scope.row.sps||0)).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bfyy"
                       label="报废原因"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    v-model="scope.row.bfyy" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="300">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-info"
                     @click="handleUpload(scope.row)">图纸</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color:#f56c6c;"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  添加仓库窗口 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px"
               append-to-body>
      <el-form :model="clienteleQueryParams"
               ref="clienteleQueryParams"
               :inline="true">
        <el-form-item label=""
                      prop="clienteleName">
          <el-input v-model="clienteleQueryParams.clienteleName"
                    placeholder="请输入编码或名称"
                    clearable
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="handleQueryClientele" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryClientele">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading"
                :data="clienteleListData"
                highlight-current-row
                @selection-change="handleSelectionChangeClientele">
        <el-table-column label="选择"
                         width="65">
          <template slot-scope="scope">
            <el-radio :label="scope.$index"
                      v-model="radio"
                      @change.native="getCurrentRow(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="仓库编码"
                         align="center"
                         prop="clienteleNum" />
        <el-table-column label="仓库名称"
                         align="center"
                         prop="clienteleName"
                         :show-overflow-tooltip="true" />
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="clienteleQueryParams.pageNum"
                       :page-size="clienteleQueryParams.pageSize"
                       :total="clienteleQueryParams.total"
                       @current-change="handlePageChangeClientele"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 引入产品 -->
    <el-dialog :title="title"
               :visible.sync="addSalesOrderOpen"
               width="800px"
               append-to-body>
      <el-form :model="materielQueryParams"
               ref="materielQueryParams"
               :inline="true">
        <el-form-item label="商品类别"
                      prop="deptId">
          <treeselect v-model="form.deptId"
                      :options="deptOptions"
                      :disable-branch-nodes="true"
                      style="width: 200px"
                      :show-count="true"
                      placeholder="请选择商品类别" />
        </el-form-item>
        <el-form-item label="产品编号"
                      prop="materielName">
          <el-input v-model="materielQueryParams.materielName"
                    placeholder="请输入产品编号"
                    clearable
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQueryMateriel" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryMateriel">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="linkMaterielLoading"
                :data="linkMaterielListData"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="50"
                         align="center" />
        <el-table-column label="产品编码"
                         align="center"
                         prop="clienteleId" />
        <el-table-column label="产品名称"
                         align="center"
                         :show-overflow-tooltip="true"
                         prop="clienteleId" />
        <el-table-column prop="personnelName"
                         label="产品类型"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="personnelName"
                         label="规格"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="deptName"
                         label="型号"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column label="所需扭矩"
                         align="center"
                         :show-overflow-tooltip="true"
                         prop="price" />
        <el-table-column label="输出扭矩"
                         align="center"
                         :show-overflow-tooltip="true"
                         prop="price" />
        <el-table-column label="单位"
                         align="center"
                         prop="price" />
        <el-table-column label="单价"
                         align="center"
                         prop="clientelePrice" />
        <el-table-column prop="xcl"
                         label="现存量"
                         align="center">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="materielQueryParams.pageNum"
                       :page-size="materielQueryParams.pageSize"
                       :total="materielQueryParams.total"
                       @current-change="handlePageChangeMateriel"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加产品 -->
    <el-dialog :title="title"
               :visible.sync="materielOpen"
               width="600px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品类别"
                          prop="deptId">
              <treeselect v-model="form.deptId"
                          :options="materileOptions"
                          :disable-branch-nodes="true"
                          :show-count="true"
                          :disabled="true"
                          placeholder="请选择产品类别" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码"
                          prop=" materielNum">
              <el-input v-model="form.materielNum"
                        :disabled="true"
                        placeholder="请输入产品编码"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称"
                          prop="materielName">
              <el-input v-model="form.materielName"
                        placeholder="请输入产品名称"
                        :disabled="true"
                        maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="规格"
                          prop="materielGenre">
              <el-input v-model="form.materielName"
                        :disabled="true"
                        placeholder="请输入规格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="型号"
                          prop="dynamicTag">
              <el-tag :key="tag"
                      v-for="tag in dynamicTags"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         :disabled="true"
                         size="small"
                         @click="showInput">+ 添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单价"
                          prop="materielPrice">
              <el-input v-model="form.materielPrice"
                        :disabled="true"
                        placeholder="请输入产品价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位"
                          prop="materielName">
              <el-input v-model="form.materielName"
                        :disabled="true"
                        placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高价"
                          prop="materielName">
              <el-input v-model="form.materielName"
                        :disabled="true"
                        placeholder="请输入最高价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低价"
                          prop="materielPrice">
              <el-input v-model="form.materielPrice"
                        :disabled="true"
                        placeholder="请输入最低价" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所需扭矩"
                          prop="materielName">
              <el-input v-model="form.materielName"
                        :disabled="true"
                        placeholder="请输入所需扭矩" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输出扭矩"
                          prop="materielPrice">
              <el-input v-model="form.materielPrice"
                        :disabled="true"
                        placeholder="请输入输出扭矩" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量"
                          prop="price">
              <el-input v-model="form.price"
                        :disabled="true"
                        placeholder="请输入数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现存量"
                          prop="price">
              <el-input v-model="form.price"
                        placeholder="请输入现存量">
              </el-input>
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
    <!-- 图纸对话框 -->
    <el-dialog :title="title"
               :visible.sync="uploadOpen"
               width="600px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-upload class="upload-demo"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :file-list="fileList"
                       :disabled="true"
                       list-type="picture">
              <el-button size="small"
                         :disabled="true"
                         type="primary">点击上传</el-button>
              <!-- <div slot="tip"
                     class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listData, treeselect, materielData } from '@/api/basis/clientele.js';
import { listData as materielListData, treeselect as materielTreeselect } from '@/api/basis/materiel.js';
import { listUser } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'sales-shipments-add',
  components: { Treeselect },
  data () {
    return {
      radio: '',
      warehouseSelected: undefined,
      // 遮罩层
      loading: false,
      // 是否显示弹出层
      open: false,
      // 弹窗标题
      title: '',
      form: {},
      // 表单校验
      rules: {
        clienteleName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
      },
      //表单参数
      clienteleForm: {},//主表信息
      materielList: [],//子表信息
      clienteleTypeOptions: [],//仓库类别
      materielSelection: [],
      // 支付类型数据字典
      paymentClauseOptions: [{ dictValue: '0', dictLabel: '现金支付' }, { dictValue: '1', dictLabel: '银行卡支付' }, { dictValue: '2', dictLabel: '微信支付' }, { dictValue: '3', dictLabel: '支付宝支付' }],
      deptOptions: [],
      //添加人员
      personnelLoading: true,
      personnelOpen: false,
      personnelSelection: [],
      personnelList: [],
      personnelQueryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userNum: undefined,
        userName: undefined,
      },
      // 添加仓库
      clienteleListData: [],
      clienteleSelection: [],
      clienteleQueryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userNum: undefined,
        userName: undefined,
      },
      // 添加产品
      uploadOpen: false,
      fileList: [],
      materielOpen: false,
      addSalesOrderOpen: false,
      linkMaterielListData: [],
      linkMaterielLoading: true,
      openOrderMateriel: false,
      // 标签
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      materileOptions: [],
      materielQueryParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userNum: undefined,
        userName: undefined,
      },

    };
  },
  created () {
    this.getTreeselectClienteleType();
    this.getTreeselectMateriel();
    this.getList();
  },
  methods: {
    getCurrentRow (row) { //获取选中数据this.templateSelection = row;
      this.warehouseSelected = row;
    },
    getList () {
      listData(this.query).then(res => {
        console.log(res);
        this.materielList = res.data;
        this.pageTotal = res.pageTotal || 50;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.materielSelection = selection;
    },
    // 仓库类别
    getTreeselectClienteleType () {
      treeselect().then(res => {
        console.log(res);
        this.clienteleTypeOptions = res.data;
        this.deptOptions = res.data;
      });
    },
    // 产品类别
    getTreeselectMateriel () {
      materielTreeselect().then(response => {
        console.log(response);
        this.materileOptions = response.data;
      });
    },
    // 分页导航
    handlePageChangeClientele (val) {
      this.$set(this.clienteleQueryParams, 'pageNum', val);
    },
    handlePageChangePersonnel (val) {
      this.$set(this.personnelQueryParams, 'pageNum', val);
    },
    handlePageChangeMateriel (val) {
      this.$set(this.materielQueryParams, 'pageNum', val);
    },
    cancelDialog () {
      this.personnelOpen = false;
    },
    handleSelectionChangePersonnel (selection) {
      console.log(selection)
      this.personnelSelection = selection
    },
    handleSelectionChangeClientele (selection) {
      console.log(selection)
      this.clienteleSelection = selection;
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.materielOpen = false;
      this.uploadOpen = false;
      this.addSalesOrderOpen = false;
      this.openOrderMateriel = false;
    },
    handleDelete () {
      this.msgSuccess('删除成功');
    },
    /** 新增按钮操作 */
    handleAddClientele () {
      this.open = true;
      this.title = '添加仓库';
    },
    handleAddMateriel () {
      this.materielOpen = true;
      this.title = '添加产品';
    },
    handleAddSalesOrder () {
      this.addSalesOrderOpen = true;
      this.title = '添加产品';
      materielListData(this.materielQueryParams).then(res => {
        console.log(res);
        this.linkMaterielListData = res.data;
        this.materielQueryParams.total = res.pageTotal;
        this.linkMaterielLoading = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdateMateriel (row) {
      this.materielOpen = true;
      this.form = row;
      this.title = '修改产品';
    },
    handleLookMateriel (row) {
      this.openOrderMateriel = true;
      this.form = row;
      this.title = '查看产品产品';
    },
    handleUpload (row) {
      this.uploadOpen = true;
      this.title = '图纸';
    },
    submitForm () {
      this.msgSuccess('成功');
    },
    submitAddForm () {
      this.msgSuccess('新增成功');
    },

    clearAddForm () {
      this.msgSuccess('成功');
      this.clienteleForm = {
        userId: undefined,
        deptId: undefined,
        clienteleName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        remark: undefined,
      };
      this.resetForm('clienteleForm');
    },
    personnelFocus (event) {
      console.log(event)
      this.personnelOpen = true;
      this.title = '添加业务员';
      listUser().then(res => {
        console.log(res);
        this.personnelLoading = false;
        this.personnelList = res.rows;
        this.personnelQueryParams.total = res.total;
      })
      // 失去焦点
      this.$refs.personnelBlur.blur();
    },


    submitFormPersonnel () {
      if (this.personnelSelection.length != 1) {
        this.msgError('只能选择一个业务人员');
        return;
      }
      this.personnelOpen = false;
      this.clienteleForm = this.personnelSelection[0];

    },
    handlePersonnelQuery () {
      this.msgSuccess('搜索人员');

    },
    handleQueryClientele () {
      this.msgSuccess('搜索人员');
    },
    handleQueryMateriel () {
      this.msgSuccess('搜索产品');
    },
    // 添加标签
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm () {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 上传图片
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
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

/* 标签 */
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
