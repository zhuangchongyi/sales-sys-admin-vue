<template>
  <div class="container">
    <div>
      <el-button type="primary"
                 icon="el-icon-check"
                 @click="submitAddForm">签 收</el-button>
      <el-button icon="el-icon-close"
                 @click="clearAddForm">取 消</el-button>
    </div>
    <el-divider><strong>客户信息</strong></el-divider>
    <!-- <div class="handle-box">
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-paperclip"
                 class="handle-del mr10"
                 @click="handleAddClientele">客户</el-button>
    </div> -->
    <el-form :model="clienteleForm"
             ref="clienteleForm"
             label-position="right"
             label-width="100px"
             :inline="true">
      <el-row>
        <el-col :span="4">
          <el-form-item label="客户编码"
                        prop="clienteleNum">
            <el-input v-model="clienteleForm.clienteleNum"
                      placeholder="请输入客户编码"
                      size="small"
                      :disabled="true"
                      style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="客户名称"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入客户名称"
                      :disabled="true"
                      size="small"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="客户类别"
                        prop="deptId">
            <treeselect v-model="form.deptId"
                        :options="clienteleTypeOptions"
                        :disable-branch-nodes="true"
                        :show-count="true"
                        :disabled="true"
                        style="width: 150px"
                        placeholder="请选择客户类别" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="联系人"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入联系人"
                      :disabled="true"
                      size="small"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="联系电话"
                        prop="clienteleNum">
            <el-input v-model="clienteleForm.clienteleNum"
                      placeholder="请输入联系电话"
                      :disabled="true"
                      size="small"
                      style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="手机"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入手机"
                      :disabled="true"
                      size="small"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="邮箱"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入邮箱"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="传真"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入传真"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="法人"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入法人"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="税号"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      placeholder="请输入税号"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司地址"
                        prop="address">
            <el-input v-model="clienteleForm.address"
                      placeholder="请输入公司地址"
                      size="small"
                      :disabled="true"
                      style="width: 400px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="签收总数"
                        prop="sl">
            <el-input v-model="clienteleForm.sl"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="拒收总数"
                        prop="jszs">
            <el-input v-model="clienteleForm.jszs"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="签收日期"
                        prop="offerTime">
            <el-date-picker v-model="clienteleForm.offerTime"
                            placeholder="选择日期"
                            size="small"
                            :disabled="true"
                            style="width: 150px;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="签收人"
                        prop="clienteleName">
            <el-input v-model="clienteleForm.clienteleName"
                      size="small"
                      :disabled="true"
                      style="width: 150px" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="付款条件"
                        prop="paymentClause">
            <el-input v-model="clienteleForm.address"
                      placeholder="请输入付款条件"
                      size="small"
                      style="width: 400px" />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注"
                        prop="remark">
            <el-input v-model="clienteleForm.remark"
                      type="textarea"
                      style="width: 1000px"
                      :disabled="true"
                      size="small" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider><strong>产品信息</strong></el-divider>
    <!-- <div class="handle-box">
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-paperclip"
                 class="handle-del mr10"
                 @click="handleAddLinkMateriel">产品</el-button>
    </div> -->
    <el-table v-loading="loading"
              :data="materielList"
              @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection"
                       width="50"
                       align="center" /> -->
      <el-table-column label="出库单号"
                       align="center"
                       prop="orderNum"
                       width="80" />
      <el-table-column label="产品编码"
                       align="center"
                       prop="clienteleId" />
      <el-table-column label="产品名称"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true" />
      <!-- <el-table-column label="产品类别"
                       align="center"
                       prop="clienteleTypeName"
                       :show-overflow-tooltip="true" /> -->
      <el-table-column label="规格"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="type"></el-table-column>
      <el-table-column label="型号"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="type"></el-table-column>
      <el-table-column label="所需扭矩"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="price"></el-table-column>
      <el-table-column label="输出扭矩"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="price"></el-table-column>
      <el-table-column prop="number"
                       label="单位"
                       align="center"></el-table-column>
      <!-- <el-table-column label="单价"
                       align="center"
                       prop="price"></el-table-column>
      <el-table-column label="售价"
                       align="center"
                       prop="price"></el-table-column> -->
      <el-table-column label="数量"
                       align="center"
                       prop="bjNumber"></el-table-column>
      <el-table-column label="技术要求"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="jsyq"></el-table-column>
      <el-table-column label="出库数"
                       align="center"
                       prop="bjNumber"></el-table-column>
      <!-- <el-table-column label="已签收数"
                       align="center"
                       prop="bjNumber"></el-table-column>
      <el-table-column label="未签收数"
                       align="center"
                       prop="bjNumber"></el-table-column>
      <el-table-column label="拒收数"
                       align="center"
                       prop="bjNumber"></el-table-column> -->
      <el-table-column prop="bcqss"
                       label="签收数"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    oninput="if(isNaN(value)) { value = null }"
                    maxLength='9'
                    v-model="scope.row.bcqss" />
        </template>
      </el-table-column>
      <el-table-column prop="bcjss"
                       label="拒收数"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    oninput="if(isNaN(value)) { value = null }"
                    maxLength='9'
                    v-model="scope.row.bcjss" />
        </template>
      </el-table-column>
      <el-table-column prop="jscl"
                       label="拒收处理"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <el-input size="mini"
                    v-model="scope.row.jscl" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="300">
        <template slot-scope="scope">
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdateMateriel(scope.row)">编辑</el-button> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-upload"
                     style="color:#e6a23c;"
                     @click="handleUpload(scope.row)">图纸</el-button>
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     style="color:#f56c6c;"
                     @click="handleDelete(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!--  添加客户窗口 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px"
               append-to-body>
      <el-form :model="clienteleQueryParams"
               ref="clienteleQueryParams"
               :inline="true">
        <el-form-item label="客户类别"
                      prop="deptId">
          <treeselect v-model="form.deptId"
                      :options="clienteleTypeOptions"
                      :disable-branch-nodes="true"
                      :show-count="true"
                      style="width: 160px"
                      placeholder="请选择类别" />
        </el-form-item>
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
                @selection-change="handleSelectionChangeClientele">
        <el-table-column type="selection"
                         fixed="left"
                         width="50"
                         align="center" />
        <el-table-column label="客户编码"
                         align="center"
                         prop="clienteleNum" />
        <el-table-column label="客户名称"
                         align="center"
                         prop="clienteleName"
                         :show-overflow-tooltip="true" />
        <el-table-column label="客户类别"
                         align="center"
                         prop="clienteleType"
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

    <!-- 产品 -->
    <el-dialog :title="title"
               :visible.sync="linkMaterielOpen"
               width="800px"
               append-to-body>
      <el-form :model="materielQueryParams"
               ref="materielQueryParams"
               :inline="true">
        <el-form-item label="出库单号"
                      prop="orderNum">
          <el-input v-model="materielQueryParams.orderNum"
                    placeholder="请输入出库单号"
                    size="small"
                    style="width: 150px"
                    @keyup.enter.native="handleQueryMateriel" />
        </el-form-item>
        <el-form-item label="产品类别"
                      prop="deptId">
          <treeselect v-model="form.deptId"
                      :options="materileOptions"
                      :disable-branch-nodes="true"
                      :show-count="true"
                      style="width: 200px"
                      placeholder="请选择类别" />
        </el-form-item>
        <el-form-item label="产品名称"
                      prop="materielName">
          <el-input v-model="materielQueryParams.materielName"
                    placeholder="请输入产品名称或编码"
                    size="small"
                    style="width: 180px"
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
                         fixed="left"
                         width="50"
                         align="center" />
        <el-table-column label="出库单号"
                         align="center"
                         prop="orderNum"
                         width="80" />
        <el-table-column label="产品编码"
                         align="center"
                         prop="materielId"
                         width="80" />
        <el-table-column label="产品名称"
                         align="center"
                         prop="materielName"
                         :show-overflow-tooltip="true"
                         width="100" />
        <el-table-column label="所属类别"
                         align="center"
                         prop="materielTypeName"
                         :show-overflow-tooltip="true"
                         width="100" />
        <el-table-column prop="personnelName"
                         label="规格"
                         :show-overflow-tooltip="true"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="personnelName"
                         label="型号"
                         :show-overflow-tooltip="true"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="personnelName"
                         label="所需扭矩"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="100"></el-table-column>
        <el-table-column prop="personnelName"
                         label="输出扭矩"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="100"></el-table-column>
        <el-table-column prop="personnelName"
                         label="单位"
                         align="center"
                         width="100"></el-table-column>
        <!-- <el-table-column prop="personnelName"
                         label="单价"
                         align="center"
                         width="100"></el-table-column>
        <el-table-column prop="price"
                         label="售价"
                         align="center" /> -->
        <el-table-column prop="bjNumber"
                         label="数量"
                         align="center" />
        <el-table-column prop="jsyq"
                         label="技术要求"
                         width="200"
                         :show-overflow-tooltip="true"
                         align="center" />
        <el-table-column prop="cks"
                         label="出库数"
                         align="center" />
        <el-table-column prop="yqss"
                         label="已签收数"
                         align="center">
        </el-table-column>
        <el-table-column prop="wqss"
                         label="未签收数"
                         align="center">
        </el-table-column>
        <el-table-column prop="jss"
                         label="拒收数"
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
                          :disabled="true"
                          :options="materileOptions"
                          :disable-branch-nodes="true"
                          :show-count="true"
                          placeholder="请选择产品类别" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码"
                          prop=" materielNum">
              <el-input v-model="form.materielNum"
                        placeholder="请输入产品编码"
                        :disabled="true"
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
                         size="small"
                         :disabled="true"
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
            <el-form-item label="售价"
                          prop="price">
              <el-input v-model="form.price"
                        :disabled="true"
                        placeholder="请输入售价">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量"
                          prop="price">
              <el-input v-model="form.price"
                        :disabled="true"
                        placeholder="请输入数量">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="技术要求">
              <el-input v-model="form.jsyq"
                        :disabled="true"
                        placeholder="请输入技术要求"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库数">
              <el-input v-model="form.jsyq"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签收数">
              <el-input v-model="form.jsyq"
                        placeholder="请输入签收数"></el-input>
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
                       :disabled="true"
                       :file-list="fileList"
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
  // name: 'sales-order-add',
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: false,
      // 是否显示弹出层
      open: false,
      // 弹窗标题
      title: '',
      form: {},
      // 表单校验
      rules: {
        clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
      },
      //表单参数
      clienteleForm: {},//主表信息
      materielList: [],//子表信息
      clienteleTypeOptions: [],//客户类别
      materielSelection: [],
      // 支付类型数据字典
      warehouseOptions: [{ dictValue: '0', dictLabel: '仓库1' }, { dictValue: '1', dictLabel: '仓库2' }, { dictValue: '2', dictLabel: '仓库4' }, { dictValue: '3', dictLabel: '仓库4' }],
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
      // 添加客户
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
      linkMaterielOpen: false,
      linkMaterielListData: [],
      linkMaterielLoading: true,
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
    // 客户类别
    getTreeselectClienteleType () {
      treeselect().then(res => {
        console.log(res);
        this.clienteleTypeOptions = res.data;
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
      this.linkMaterielOpen = false;
    },
    handleDelete () {
      this.msgSuccess('删除成功');
    },
    /** 新增按钮操作 */
    handleAddClientele () {
      this.open = true;
      this.title = '添加客户';
    },
    handleAddMateriel () {
      this.materielOpen = true;
      this.title = '添加产品';
    },
    handleAddLinkMateriel () {
      this.linkMaterielOpen = true;
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
    handleUpload (row) {
      this.uploadOpen = true;
      this.form = row;
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
