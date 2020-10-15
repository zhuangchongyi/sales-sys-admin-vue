<template>
    <div class="container">
        <div>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
            <el-button icon="el-icon-close" @click="clearAddForm">清 空</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" @click="handleAddClientele">客户</el-button>
        </div>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="订单号" prop="orderNum">
                        <el-input v-model="orderNum" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" maxlength="10" show-word-limit size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户类别" prop="categoryId">
                        <treeselect v-model="clienteleForm.categoryId" :options="clienteleTypeOptions" :disable-branch-nodes="true" :show-count="true" style="width: 155px;" placeholder="选择类别" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系人" prop="leader">
                        <el-input v-model="clienteleForm.leader" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="clienteleForm.phone" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="手机" prop="mobilephone">
                        <el-input v-model="clienteleForm.mobilephone" clearable size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="clienteleForm.email" size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="法人" prop="legalPerson">
                        <el-input v-model="clienteleForm.legalPerson" size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="社会信用号" prop="certificateNum">
                        <el-input v-model="clienteleForm.certificateNum" size="small" style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="clienteleForm.address" size="small" style="width: 420px" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="总计金额" prop="totalPrice">
                        <el-input v-model="totalPrice" size="small" readonly style="width: 155px;" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="税率" prop="taxrate">
                        <el-input
                            v-model="clienteleForm.taxrate"
                            size="small"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+8)}"
                            maxLength="9"
                            style="width: 155px;"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="税额" prop="taxamount">
                        <el-input
                            v-model="clienteleForm.taxamount"
                            size="small"
                            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                            maxLength="9"
                            style="width: 155px;"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="交货日期" prop="deliveryTime">
                        <el-date-picker v-model="clienteleForm.deliveryTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="付款条件" prop="payCondition">
                        <el-input v-model="clienteleForm.payCondition" placeholder="请输入付款条件" size="small" style="width: 420px" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="订单日期" prop="orderTime">
                        <el-date-picker v-model="clienteleForm.orderTime" style="width:155px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务员" prop="personnelName">
                        <el-input v-model="clienteleForm.personnelName" size="small" suffix-icon="el-icon-search" @focus="personnelFocus" ref="personnelBlur" style="width: 155px;" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" autosize style="width: 1000px" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-paperclip" class="handle-del mr10" v-show="isShow" @click="handleAddLinkMateriel">产品</el-button>
        </div>
        <el-table v-loading="loading" :data="materielListData">
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column prop="materielNum" label="产品编码" align="center" width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="materielName" label="产品名称" align="center" width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="specification" label="规格" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="modelName" label="型号" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="needTorque" label="所需扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTorque" label="输出扭矩" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="unitsName" label="单位" width="100" align="center"></el-table-column>
            <el-table-column prop="price" label="单价" width="150" align="center">
                <template slot-scope="scope">
                    <el-input
                        size="small"
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        maxLength="9"
                        @input="calculateTotalPrice"
                        v-model="scope.row.price"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="number" width="150" label="数量" align="center">
                <template slot-scope="scope">
                    <el-input size="small" @input="calculateTotalPrice" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" v-model="scope.row.number" />
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="金额" width="200" align="center">
                <template slot-scope="scope">
                    <el-input size="small" readonly v-model="scope.row.totalPrice" />
                    <!-- <span :v-model="scope.row.totalPrice">{{(parseFloat(scope.row.price||0)*parseInt(scope.row.number||0)).toFixed(2)}}</span> -->
                </template>
            </el-table-column>
            <el-table-column prop="demand" label="技术要求" width="300" align="center">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.demand" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="260">
                <template slot-scope="scope">
                    <!-- <el-button size="small" type="text" icon="el-icon-edit" @click="handleUpdateMateriel(scope.$index, scope.row)">编辑</el-button> -->
                    <el-button size="small" type="text" icon="el-icon-upload" style="color:#e6a23c;" v-show="scope.row.subId" @click="handleUpload(scope.row)">图纸</el-button>
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#f56c6c;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  添加客户窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form :model="clienteleQueryParams" ref="clienteleQueryParams" :inline="true">
                <el-form-item label="客户类别" prop="categoryId">
                    <treeselect
                        v-model="clienteleQueryParams.categoryId"
                        :options="clienteleTypeOptions"
                        :disable-branch-nodes="true"
                        :show-count="true"
                        style="width: 160px"
                        placeholder="请选择类别"
                    />
                </el-form-item>
                <el-form-item label="客户" prop="clienteleName">
                    <el-input v-model="clienteleQueryParams.clienteleName" placeholder="请输入编码或名称" clearable size="small" style="width: 155px;" @keyup.enter.native="handleQueryClientele" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryClientele">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="clienteleListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="客户编码" align="center" prop="clienteleNum" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
                <el-table-column label="客户类别" align="center" prop="category.categoryName" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="clienteleQueryParams.current"
                    :page-size="clienteleQueryParams.size"
                    :total="clienteleTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChangeClientele"
                ></el-pagination>
            </div>
        </el-dialog>

        <!-- 引入产品 -->
        <el-dialog :title="title" :visible.sync="linkMaterielOpen" width="800px" append-to-body>
            <el-form :model="materielQueryParams" ref="materielQueryParams" :inline="true">
                <el-form-item label="产品类别" prop="categoryId">
                    <treeselect v-model="materielQueryParams.categoryId" :options="materileTypeOptions" :disable-branch-nodes="true" :show-count="true" style="width: 180px" placeholder="请选择类别" />
                </el-form-item>
                <el-form-item label="产品" prop="materielName">
                    <el-input v-model="materielQueryParams.materielName" placeholder="请输入产品名称或编码" clearable size="small" style="width: 180px" @keyup.enter.native="handleQueryMateriel" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryMateriel">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="linkMaterielLoading"
                :data="linkMaterielListData"
                ref="linkMaterielListData"
                highlight-current-row
                @row-click="clickSelectionMateriel"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column label="产品编码" align="center" prop="materielNum" :show-overflow-tooltip="true" width="100" />
                <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" width="120" />
                <el-table-column prop="specification" label="规格" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="modelName" label="型号" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="needTorque" label="所需扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="outTorque" label="输出扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="unitsName" label="单位" align="center" width="100"></el-table-column>
                <el-table-column prop="price" label="单价" align="center" width="100"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="materielQueryParams.current"
                    :page-size="materielQueryParams.size"
                    :total="materielTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeMateriel"
                    @current-change="handlePageChangeMateriel"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加修改产品 -->
        <el-dialog :title="title" :visible.sync="materielOpen" width="600px" append-to-body>
            <el-form :model="form" ref="form" :rules="formRules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="产品类别" prop="categoryId">
                            <treeselect v-model="form.categoryId" :options="materileTypeOptions" :disable-branch-nodes="true" :show-count="true" :disabled="true" placeholder="请选择产品类别" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编码" prop="materielNum">
                            <el-input v-model="form.materielNum" placeholder="请输入产品编码" maxlength="10" readonly show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入产品名称" readonly maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="规格" prop="specification">
                            <el-input v-model="form.specification" placeholder="请输入规格" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="型号" prop="modelName">
                            <el-input v-model="form.modelName" placeholder="请输入型号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所需扭矩" prop="needTorque">
                            <el-input v-model="form.needTorque" placeholder="请输入所需扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="输出扭矩" prop="outTorque">
                            <el-input v-model="form.outTorque" placeholder="请输入输出扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="unitsName">
                            <el-input v-model="form.unitsName" @focus="unitsFocus" ref="unitsBlur" placeholder="请输入单位" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="price">
                            <el-input
                                v-model="form.price"
                                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                maxLength="9"
                                placeholder="请输入单价"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="number">
                            <el-input v-model="form.number" oninput="value=value.replace(/[^\d]/g,'')" maxLength="9" placeholder="请输入数量"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="技术要求" prop="demand">
                            <el-input v-model="form.demand" placeholder="请输入技术要求" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormMateriel">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 上传图纸对话框 -->
        <el-dialog :title="title" :visible.sync="uploadOpen" width="600px" append-to-body>
            <el-table v-loading="imageLoading" :data="imageListData">
                <el-table-column label="名称" align="center" :show-overflow-tooltip="true" prop="name" />
                <el-table-column label="标注" align="center" :show-overflow-tooltip="true" prop="remark" />
                <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-info" @click="handlePreviewFile(scope.row)">查看</el-button>
                        <el-button size="mini" type="text" icon="el-icon-upload" style="color:#e6a23c" @click="handleDownloadFile(scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="fileQuery.current"
                    :page-size="fileQuery.size"
                    :total="fileTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeFileDialog"
                    @current-change="handlePageChangeFileDialog"
                >
                </el-pagination>
            </div>
            <el-dialog :title="imageName" :visible.sync="filePreviewOpen" append-to-body>
                <img :src="imageUrl" style="width:100%" />
            </el-dialog>
        </el-dialog>

        <!-- 业务人员弹窗 -->
        <el-dialog :title="title" :visible.sync="personnelOpen" width="550px" append-to-body>
            <el-form :model="personnelQueryParams" ref="personnelQueryParams" :inline="true">
                <el-form-item label="员工编码" prop="userNum">
                    <el-input v-model="personnelQueryParams.userNum" placeholder="请输入编码 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item label="员工名称" prop="nickname">
                    <el-input v-model="personnelQueryParams.nickname" placeholder="请输入名称 " clearable size="small" style="width: 120px" @keyup.enter.native="handlePersonnelQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handlePersonnelQuery">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="personnelLoading" :data="personnelListData" highlight-current-row @row-dblclick="submitFormPersonnel">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getPersonnelRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="员工编码" align="center" prop="userNum" />
                <el-table-column label="员工名称" align="center" prop="nickname" />
                <el-table-column label="部门编码" align="center" prop="dept.deptNum" />
                <el-table-column label="部门名称" align="center" prop="dept.deptName" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="personnelQueryParams.current"
                    :page-size="personnelQueryParams.size"
                    :total="personnelTotal"
                    layout="total, sizes, prev, pager, next"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangePersonnel"
                    @current-change="handlePageChangePersonnel"
                ></el-pagination>
            </div>
        </el-dialog>

        <!-- 基本单位弹窗 -->
        <el-dialog :title="title" :visible.sync="unitsOpen" width="550px" append-to-body>
            <el-form :model="unitsQueryParam" ref="unitsQueryParam" :inline="true">
                <el-form-item label="单位类型" prop="unitsType">
                    <el-select v-model="unitsQueryParam.unitsType" clearable size="small" style="width: 120px">
                        <el-option v-for="dict in unitsTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item label="编码" prop="unitsNum">
                    <el-input v-model="unitsQueryParam.unitsNum" clearable size="small" style="width: 100px" @keyup.enter.native="handleQueryUnits" />
                </el-form-item>
                <el-form-item label="名称" prop="unitsName">
                    <el-input v-model="unitsQueryParam.unitsName" clearable size="small" style="width: 100px" @keyup.enter.native="handleQueryUnits" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryUnits">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="unitsLoading" :data="unitsListData" highlight-current-row @row-dblclick="handleClickUnits">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getUnitsRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="单位编码" align="center" prop="unitsNum" />
                <el-table-column label="单位名称" align="center" prop="unitsName" />
                <el-table-column label="单位类型" align="center" :formatter="unitsTypeFormatter" prop="unitsType" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="unitsQueryParam.current"
                    :page-size="unitsQueryParam.size"
                    :total="unitsTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeUnits"
                    @current-change="handlePageChangeUnits"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { addOrder, getOrder, listOrderSub, deleteOrderSub } from '@/api/sales/order.js';
import { listMaterielFile, downloadFile } from '@/api/basis/materielFile.js';
import { treeselect } from '@/api/basis/category.js';
import { listClientele } from '@/api/basis/clientele.js';
import { userListPage } from '@/api/system/user.js';
import { listProduct } from '@/api/basis/clienteleProduct.js';
import { listUnits } from '@/api/basis/units.js';

import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-price-add',
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: false,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            // 表单校验
            rules: {
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                orderTime: [{ required: true, message: '订单日期不能为空', trigger: 'blur' }],
                deliveryTime: [{ required: true, message: '交货日期不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '业务人员不能为空', trigger: 'change' }],
                email: [
                    {
                        type: 'email',
                        message: "'请输入正确的邮箱地址",
                        trigger: ['blur', 'change']
                    }
                ],
                mobilephone: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            formRules: {
                materielName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
                specification: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
                modelName: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
                unitsName: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
                number: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
            },
            //表单参数
            clienteleForm: {
                orderTime: null
            }, //主表信息
            materielListData: [], //子表信息
            // 添加客户
            clienteleListData: [],
            clienteleSelected: undefined,
            radio: '',
            clienteleQueryParams: {
                current: 1,
                size: 10,
                clienteleName: undefined,
                clienteleNum: undefined,
                categoryId: undefined,
                status: '0'
            },
            clienteleTotal: 0,
            clienteleTypeOptions: [], //客户类别
            totalPrice: 0,
            orderNum: undefined,
            orderId: undefined,
            //添加人员
            personnelLoading: true,
            personnelOpen: false,
            personnelListData: [],
            personnelTotal: 0,
            personnelQueryParams: {
                current: 1,
                size: 10,
                userNum: undefined,
                nickname: undefined,
                status: '0'
            },
            personnelSelection: undefined,

            // 添加产品
            materielSelection: [], //选中产品
            uploadOpen: false,
            fileList: [],
            materielOpen: false,
            linkMaterielOpen: false,
            linkMaterielListData: [],
            linkMaterielLoading: true,
            form: {},
            materileTypeOptions: [],
            materielQueryParams: {
                current: 1,
                size: 10,
                materielNum: undefined,
                materielName: undefined,
                clienteleId: undefined
            },
            materielTotal: 0,
            materielEdit: false,
            materielIndex: undefined,
            // 标签
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',

            // 基本单位
            unitsLoading: true,
            unitsOpen: false,
            unitsTotal: 0,
            unitsListData: [],
            unitsQueryParam: {
                current: 1,
                size: 10,
                unitsNum: undefined,
                unitsName: undefined,
                unitsType: undefined,
                status: '0'
            },
            unitsTypeOptions: [
                { dictValue: '0', dictLabel: '基本单位' },
                { dictValue: '1', dictLabel: '包装单位' }
            ],
            selectedUnits: undefined,
            delSubIds: [],
            isShow: false,

            //图片
            imageLoading: true,
            imageListData: [],
            fileQuery: {
                current: 1,
                size: 10,
                materielId: undefined
            },
            fileTotal: 0,
            filePreviewOpen: false,
            imageUrl: undefined,
            imageName: undefined
        };
    },
    created() {
        this.getTreeselectClienteleType();
        this.getPersonnelName();
    },
    methods: {
        getOrder() {
            this.getOrderData();
            this.getOrderSubList();
        },
        getOrderData() {
            getOrder(this.orderId).then(res => {
                console.log('getOrderData', res);
                if (res.success) {
                    this.clienteleForm = res.data;
                    this.orderId = res.data.orderId;
                    this.orderNum = res.data.orderNum;
                }
            });
        },
        getOrderSubList() {
            let param = { orderId: this.orderId };
            listOrderSub(param).then(res => {
                this.materielListData = res.data || [];
            });
        },
        getPersonnelName() {
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.orderTime = this.parseTime(new Date());
        },
        // 客户类别
        getTreeselectClienteleType() {
            treeselect({ category: '1' }).then(res => {
                this.clienteleTypeOptions = res.data;
            });
        },
        // 客户分页导航
        handlePageChangeClientele(val) {
            this.$set(this.clienteleQueryParams, 'current', val);
            this.handleQueryClientele();
        },
        handleSizeChange(val) {
            this.$set(this.clienteleQueryParams, 'size', val);
            this.handleQueryClientele();
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.handleQueryClientele();
            this.open = true;
            this.title = '添加客户';
        },
        handleQueryClientele() {
            this.clienteleQueryParams.clienteleNum = this.clienteleQueryParams.clienteleName;
            listClientele(this.clienteleQueryParams).then(res => {
                if (res.success) {
                    this.clienteleListData = res.data.records;
                    this.clienteleTotal = res.data.total;
                }
            });
        },
        getCurrentRow(row) {
            this.clienteleSelected = row;
            this.submitClienteleForm();
        },
        handledbClick(row, event, column) {
            this.getCurrentRow(row);
            this.submitClienteleForm();
        },
        submitClienteleForm() {
            this.clienteleForm = this.clienteleSelected;
            this.clienteleForm.remark = '';
            this.open = false;
            this.getPersonnelName();
            this.isShow = true;
        },
        clearAddForm() {
            this.clienteleForm = {};
            this.form = {};
            this.materielListData = [];
            this.orderId = undefined;
            this.orderNum = undefined;
            this.totalPrice = 0;
            this.delSubIds = [];
            this.isShow = false;
            this.clienteleForm.personnelName = this.$store.getters.name;
            this.clienteleForm.personnelId = this.$store.getters.userId;
            this.clienteleForm.orderTime = this.parseTime(new Date());
            this.resetForm('clienteleForm');
        },
        submitAddForm() {
            let taht = this;
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    if (this.materielListData.length == 0) {
                        this.msgError('未添加产品');
                        return;
                    }
                    this.clienteleForm.orderId = this.orderId;
                    this.clienteleForm.orderNum = this.orderNum;
                    let data = {
                        delSubIds: JSON.stringify(this.delSubIds),
                        clientele: JSON.stringify(this.clienteleForm),
                        materielList: JSON.stringify(this.materielListData)
                    };
                    addOrder(data).then(res => {
                        console.log('addOrder', res);
                        if (res.success) {
                            this.orderNum = res.data.orderNum;
                            this.orderId = res.data.orderId;
                            this.msgSuccess(res.message);
                            this.getOrder();
                        } else {
                            this.msgError(res.message);
                        }
                    });
                }
            });
        },

        getPersonnelList() {
            userListPage(this.personnelQueryParams).then(res => {
                this.personnelLoading = false;
                this.personnelListData = res.data.records;
                this.personnelTotal = res.data.total;
            });
        },
        handlePersonnelQuery() {
            this.personnelQueryParams.current = 1;
            this.personnelSelection = undefined;
            this.getPersonnelList();
        },
        handlePageChangePersonnel(val) {
            this.$set(this.personnelQueryParams, 'current', val);
            this.getPersonnelList();
        },
        handleSizeChangePersonnel(val) {
            this.$set(this.personnelQueryParams, 'size', val);
            this.handlePersonnelQuery();
        },
        // 人员编码输入框获取焦点
        personnelFocus(event) {
            this.personnelOpen = true;
            this.title = '业务员';
            this.handlePersonnelQuery();
            // 失去焦点
            // this.$refs.personnelBlur.blur();
        },
        getPersonnelRow(row) {
            this.personnelSelection = row;
            this.submitFormPersonnel();
        },
        submitFormPersonnel(row) {
            if (row) {
                this.personnelSelection = row;
            }
            this.clienteleForm.personnelId = this.personnelSelection.userId;
            this.clienteleForm.personnelName = this.personnelSelection.nickname;
            this.personnelOpen = false;
            this.$refs.clienteleForm.clearValidate('personnelName');
        },

        // 产品类别
        getTreeselectMateriel() {
            treeselect({ category: '0' }).then(res => {
                this.materileTypeOptions = res.data;
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.materielSelection = selection;
        },
        clickSelectionMateriel(row) {
            // this.materielSelection = [row];
            // this.submitForm();
            this.$refs['linkMaterielListData'].toggleRowSelection(row);
        },
        // 产品列表
        handleAddLinkMateriel() {
            this.linkMaterielOpen = true;
            this.title = '添加产品';
            this.materielQueryParams.clienteleId = this.clienteleForm.clienteleId;
            this.getTreeselectMateriel();
            this.getMaterielList();
        },
        getMaterielList() {
            this.linkMaterielListData = [];
            this.materielTotal = 0;
            listProduct(this.materielQueryParams).then(res => {
                this.linkMaterielListData = res.data.records;
                this.materielTotal = res.data.total;
                this.linkMaterielLoading = false;
            });
        },
        handlePageChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'current', val);
            this.getMaterielList();
        },
        handleSizeChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'size', val);
            this.handleQueryMateriel();
        },
        handleQueryMateriel() {
            this.materielQueryParams.materielNum = this.materielQueryParams.materielName;
            this.getMaterielList();
        },
        submitForm() {
            if (this.materielSelection.length !== 0) {
                this.materielListData = this.materielListData.concat(this.materielSelection);
            }
            this.linkMaterielOpen = false;
            this.calculateTotalPrice();
        },
        calculateTotalPrice() {
            let total = 0;
            this.materielListData.forEach(item => {
                let price = parseFloat(item.price || 0) * parseInt(item.number || 0);
                item.totalPrice = price.toFixed(2);
                total = parseFloat(total) + price;
            });
            this.totalPrice = total.toFixed(2);
        },
        handleDelete(index, row) {
            if (row.subId) {
                console.log('dellete', row);
                // deleteOrderSub(row.subId).then(res => {
                //     if (res.success) {
                //         this.msgSuccess(res.message);
                //     } else {
                //         this.msgError(res.message);
                //     }
                // });
                this.delSubIds.push(row.subId);
            }
            this.materielListData.splice(index, 1);
            this.calculateTotalPrice();
        },
        handleAddMateriel() {
            this.resetMaterielForm();
            this.getTreeselectMateriel();
            this.materielOpen = true;
            this.title = '添加产品';
            this.materielEdit = false;
        },
        /** 修改按钮操作 */
        handleUpdateMateriel(index, row) {
            this.resetMaterielForm();
            this.getTreeselectMateriel();
            this.materielOpen = true;
            this.title = '修改产品';
            this.materielEdit = true;
            this.materielIndex = index;
            this.form = JSON.parse(JSON.stringify(row));
        },
        resetMaterielForm() {
            this.form = {};
            this.resetForm('form');
        },
        submitFormMateriel() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let materiel = JSON.parse(JSON.stringify(this.form));
                    if (this.materielEdit) {
                        this.materielListData.splice(this.materielIndex, 1, materiel);
                    } else {
                        this.materielListData.push(materiel);
                    }
                    this.resetMaterielForm();
                    this.calculateTotalPrice();
                    this.materielOpen = false;
                }
            });
        },

        // 基本单位
        unitsFocus(event) {
            this.unitsOpen = true;
            this.title = '选择产品单位';
            this.selectedUnits = undefined;
            this.getUnitsList();
            // 失去焦点
            // this.$refs.unitsBlur.blur();
        },
        handleQueryUnits() {
            this.unitsQueryParam.current = 1;
            this.getUnitsList();
        },
        getUnitsList() {
            listUnits(this.unitsQueryParam).then(res => {
                this.unitsLoading = false;
                this.unitsListData = res.data.records;
                this.unitsTotal = res.data.total;
            });
        },
        handleClickUnits(row, event, column) {
            this.selectedUnits = row;
            this.submitFormUnits();
        },
        getUnitsRow(row) {
            this.selectedUnits = row;
            this.submitFormUnits();
        },
        handlePageChangeUnits(val) {
            this.$set(this.unitsQueryParam, 'current', val);
            this.handleQueryClientele();
        },
        handleSizeChangeUnits(val) {
            this.$set(this.unitsQueryParam, 'size', val);
        },
        submitFormUnits() {
            this.form.unitsId = this.selectedUnits.unitsId;
            this.form.unitsNum = this.selectedUnits.unitsNum;
            this.form.unitsName = this.selectedUnits.unitsName;
            this.unitsOpen = false;
            this.$refs.form.clearValidate('unitsName');
        },
        unitsTypeFormatter(row, column) {
            return this.selectDictLabel(this.unitsTypeOptions, row.unitsType);
        },

        cancelDialog() {
            this.personnelOpen = false;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.materielOpen = false;
            this.uploadOpen = false;
            this.linkMaterielOpen = false;
        },
        // 查看图片
        handleUpload(row) {
            this.uploadOpen = true;
            this.form = row;
            this.title = '图纸';
            this.fileQuery.materielId = row.materielId;
            this.imageLoading = true;

            this.getMaterielFile();
        },
        handlePageChangeFileDialog(val) {
            this.$set(this.fileQuery, 'current', val);
            this.getMaterielFile();
        },
        handleSizeChangeFileDialog(val) {
            this.$set(this.fileQuery, 'size', val);
            this.getMaterielFile();
        },
        getMaterielFile() {
            listMaterielFile(this.fileQuery).then(res => {
                this.imageListData = res.data.records;
                this.fileTotal = res.data.total;
                this.imageLoading = false;
            });
        },
        handleDownloadFile(row) {
            console.log('handleDownloadFile', row);
            this.imageLoading = true;
            downloadFile(row.pkId)
                .then(res => {
                    console.log('下载成功');
                    var filename = row.name;
                    this.download(res, filename);
                    this.imageLoading = false;
                })
                .catch(e => {
                    this.msgError('下载失败');
                });
        },
        handlePreviewFile(row) {
            this.filePreviewOpen = true;
            this.imageUrl = row.url;
            this.imageName = row.name;
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
