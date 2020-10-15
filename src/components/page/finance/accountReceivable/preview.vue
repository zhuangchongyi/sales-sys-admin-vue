<template>
    <div class="container">
        <div v-if="isAudit">
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">审 核</el-button>
            <el-button type="primary" icon="el-icon-close" @click="submitAddForm">反审核</el-button>
        </div>
        <div v-else>
            <el-button type="primary" icon="el-icon-check" @click="submitAddForm">保 存</el-button>
        </div>
        <div v-if="!isEdit">
            <el-divider><strong></strong></el-divider>
            <el-form :model="clienteleForm" ref="clienteleForm" label-position="right" label-width="auto" :inline="true">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="应收金额" prop="address">
                            <el-input v-model="clienteleForm.address" size="small" :disabled="true" style="width: 150px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="收款总额" prop="address">
                            <el-input v-model="clienteleForm.address" size="small" :disabled="true" style="width: 150px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收款账号" prop="skzh">
                            <el-input v-model="clienteleForm.skzh" style="width: 400px" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="付款账号" prop="fkzh">
                            <el-input v-model="clienteleForm.fkzh" style="width: 400px" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="业务人员" prop="fph">
                            <el-input v-model="clienteleForm.fph" style="width: 150px" :disabled="true" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="业务部门" prop="fph">
                            <el-input v-model="clienteleForm.fph" style="width: 150px" :disabled="true" size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="收款日期" prop="offerTime">
                            <el-date-picker v-model="clienteleForm.offerTime" placeholder="选择日期" size="small" clearable style="width: 150px;" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="收款说明" prop="remark">
                            <el-input v-model="clienteleForm.remark" type="textarea" style="width: 1000px" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider><strong></strong></el-divider>
        <el-table v-loading="loading" :data="materielList" :default-sort="{ prop: 'date', order: 'descending' }" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="签收时间" align="center" sortable prop="createTime" />
            <el-table-column label="签收单号" align="center" prop="clienteleId" />
            <el-table-column label="业务员" align="center" prop="ysje" />
            <el-table-column label="业务部门" align="center" prop="ysje" />
            <el-table-column label="审核人" align="center" prop="ysje" />
            <el-table-column label="审核日期" align="center" prop="createTime" />
            <el-table-column label="应收类型" align="center" prop="yslx" />
            <el-table-column label="应收金额" align="center" prop="ysje" />
            <el-table-column label="欠款" align="center" prop="ysje" />
            <el-table-column label="收款金额" align="center" prop="skje">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        :disabled="isEdit"
                        oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        maxLength="9"
                        v-model="scope.row.skje"
                    />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-info" @click="handlePreview(scope.row)">订单明细</el-button>
                    <el-button size="mini" type="text" icon="el-icon-info" @click="handlePreview(scope.row)">收款明细</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--  添加客户窗口 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form :model="clienteleQueryParams" ref="clienteleQueryParams" :inline="true">
                <el-form-item label="客户类别" prop="deptId">
                    <treeselect v-model="form.deptId" :options="clienteleTypeOptions" :disable-branch-nodes="true" :show-count="true" style="width: 160px" placeholder="请选择类别" />
                </el-form-item>
                <el-form-item label="" prop="clienteleName">
                    <el-input v-model="clienteleQueryParams.clienteleName" placeholder="请输入编码或名称" clearable size="small" style="width: 150px" @keyup.enter.native="handleQueryClientele" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryClientele">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="clienteleListData" @selection-change="handleSelectionChangeClientele">
                <el-table-column label="选择" width="65">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="客户编码" align="center" prop="clienteleNum" />
                <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" />
                <el-table-column label="客户类别" align="center" prop="clienteleType" :show-overflow-tooltip="true" />
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="clienteleQueryParams.pageNum"
                    :page-size="clienteleQueryParams.pageSize"
                    :total="clienteleQueryParams.total"
                    @current-change="handlePageChangeClientele"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 产品 -->
        <el-dialog :title="title" :visible.sync="linkMaterielOpen" width="800px" append-to-body>
            <el-form :model="materielQueryParams" ref="materielQueryParams" :inline="true">
                <el-form-item label="产品类别" prop="deptId">
                    <treeselect v-model="form.deptId" :options="materileOptions" :disable-branch-nodes="true" :show-count="true" style="width: 180px" placeholder="请选择类别" />
                </el-form-item>
                <el-form-item label="产品名称" prop="materielName">
                    <el-input v-model="materielQueryParams.materielName" placeholder="请输入产品名称或编码" size="small" style="width: 180px" @keyup.enter.native="handleQueryMateriel" />
                </el-form-item>
                <el-form-item label="签收单号" prop="materielName">
                    <el-input v-model="materielQueryParams.materielName" placeholder="请输入签收单号" size="small" style="width: 180px" @keyup.enter.native="handleQueryMateriel" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryMateriel">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="linkMaterielLoading" :data="linkMaterielListData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed="left" width="50" align="center" />
                <el-table-column label="签收单号" align="center" prop="materielId" width="80" />
                <el-table-column label="产品编码" align="center" prop="materielId" width="80" />
                <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" width="100" />
                <el-table-column label="所属类别" align="center" prop="materielTypeName" :show-overflow-tooltip="true" width="100" />
                <el-table-column prop="personnelName" label="规格" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="型号" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="所需扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="输出扭矩" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="单位" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="单价" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="最高价" align="center" width="100"></el-table-column>
                <el-table-column prop="personnelName" label="最低价" align="center" width="100"></el-table-column>

                <!-- <el-table-column prop="price"
                         label="售价"
                         align="center">
          <template slot-scope="scope">
            <el-input size="small"
                      v-model="scope.row.price" />
          </template>
        </el-table-column>
        <el-table-column prop="bjNumber"
                         label="数量"
                         align="center">
          <template slot-scope="scope">
            <el-input size="small"
                      v-model="scope.row.bjNumber" />
          </template>
        </el-table-column>
        <el-table-column prop="jsyq"
                         label="技术要求"
                         width="200"
                         align="center">
          <template slot-scope="scope">
            <el-input size="small"
                      v-model="scope.row.jsyq" />
          </template>
        </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="materielQueryParams.pageNum"
                    :page-size="materielQueryParams.pageSize"
                    :total="materielQueryParams.total"
                    @current-change="handlePageChangeMateriel"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加产品 -->
        <el-dialog :title="title" :visible.sync="materielOpen" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="产品类别" prop="deptId">
                            <treeselect v-model="form.deptId" :options="materileOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择产品类别" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编码" prop=" materielNum">
                            <el-input v-model="form.materielNum" placeholder="请输入产品编码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入产品名称" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="规格" prop="materielGenre">
                            <el-input v-model="form.materielName" placeholder="请输入规格" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="型号" prop="dynamicTag">
                            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="materielPrice">
                            <el-input v-model="form.materielPrice" placeholder="请输入产品价格" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入单位" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="最高价" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入最高价" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最低价" prop="materielPrice">
                            <el-input v-model="form.materielPrice" placeholder="请输入最低价" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所需扭矩" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入所需扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="输出扭矩" prop="materielPrice">
                            <el-input v-model="form.materielPrice" placeholder="请输入输出扭矩" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="售价" prop="price">
                            <el-input v-model="form.price" placeholder="请输入售价"> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="price">
                            <el-input v-model="form.price" placeholder="请输入数量"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="技术要求">
                            <el-input v-model="form.jsyq" placeholder="请输入技术要求"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 图纸对话框 -->
        <el-dialog :title="title" :visible.sync="uploadOpen" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :disabled="true"
                            list-type="picture"
                        >
                            <el-button size="small" :disabled="true" type="primary">点击上传</el-button>
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
    data() {
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
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            materielList: [], //子表信息
            clienteleTypeOptions: [], //客户类别
            materielSelection: [],
            // 支付类型数据字典
            paymentClauseOptions: [
                { dictValue: '0', dictLabel: '现金支付' },
                { dictValue: '1', dictLabel: '银行卡支付' },
                { dictValue: '2', dictLabel: '微信支付' },
                { dictValue: '3', dictLabel: '支付宝支付' }
            ],
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
                userName: undefined
            },
            // 添加客户
            clienteleListData: [],
            clienteleSelection: [],
            clienteleQueryParams: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                userNum: undefined,
                userName: undefined
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
                userName: undefined
            },
            radio: '',
            warehouseSelected: undefined,
            isAudit: false,
            isEdit: false
        };
    },
    watch: {
        $route(to, form) {
            this.isAudit = to.query.a == '1' || false;
            this.isEdit = to.query.e == '1' || false;
        }
    },
    created() {
        this.isAudit = this.$route.query.a == '1' || false;
        this.isEdit = this.$route.query.e == '1' || false;

        this.getTreeselectClienteleType();
        this.getTreeselectMateriel();
        this.getList();
    },
    methods: {
        getList() {
            listData(this.query).then(res => {
                console.log(res);
                this.materielList = res.data;
                this.pageTotal = res.pageTotal || 50;
                this.loading = false;
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.materielSelection = selection;
        },
        // 客户类别
        getTreeselectClienteleType() {
            treeselect().then(res => {
                console.log(res);
                this.clienteleTypeOptions = res.data;
            });
        },
        // 产品类别
        getTreeselectMateriel() {
            materielTreeselect().then(response => {
                console.log(response);
                this.materileOptions = response.data;
            });
        },
        // 分页导航
        handlePageChangeClientele(val) {
            this.$set(this.clienteleQueryParams, 'pageNum', val);
        },
        handlePageChangePersonnel(val) {
            this.$set(this.personnelQueryParams, 'pageNum', val);
        },
        handlePageChangeMateriel(val) {
            this.$set(this.materielQueryParams, 'pageNum', val);
        },
        cancelDialog() {
            this.personnelOpen = false;
        },
        handleSelectionChangePersonnel(selection) {
            console.log(selection);
            this.personnelSelection = selection;
        },
        handleSelectionChangeClientele(selection) {
            console.log(selection);
            this.clienteleSelection = selection;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.materielOpen = false;
            this.uploadOpen = false;
            this.linkMaterielOpen = false;
        },
        handleDelete() {
            this.msgSuccess('删除成功');
        },
        /** 新增按钮操作 */
        handleAddClientele() {
            this.open = true;
            this.title = '添加客户';
        },
        handleAddMateriel() {
            this.materielOpen = true;
            this.title = '添加产品';
        },
        handleAddLinkMateriel() {
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
        handleUpdateMateriel(row) {
            this.materielOpen = true;
            this.form = row;
            this.title = '修改产品';
        },
        handleUpload(row) {
            this.uploadOpen = true;
            this.form = row;
            this.title = '图纸';
        },
        submitForm() {
            this.msgSuccess('成功');
        },
        submitAddForm() {
            this.msgSuccess('新增成功');
        },

        clearAddForm() {
            this.msgSuccess('成功');
            this.clienteleForm = {
                userId: undefined,
                deptId: undefined,
                clienteleName: undefined,
                nickName: undefined,
                phonenumber: undefined,
                email: undefined,
                sex: undefined,
                remark: undefined
            };
            this.resetForm('clienteleForm');
        },
        personnelFocus(event) {
            console.log(event);
            this.personnelOpen = true;
            this.title = '添加业务员';
            listUser().then(res => {
                console.log(res);
                this.personnelLoading = false;
                this.personnelList = res.rows;
                this.personnelQueryParams.total = res.total;
            });
            // 失去焦点
            this.$refs.personnelBlur.blur();
        },
        getCurrentRow(row) {
            //获取选中数据this.templateSelection = row;
            this.warehouseSelected = row;
        },

        submitFormPersonnel() {
            if (this.personnelSelection.length != 1) {
                this.msgError('只能选择一个业务人员');
                return;
            }
            this.personnelOpen = false;
            this.clienteleForm = this.personnelSelection[0];
        },
        handlePersonnelQuery() {
            this.msgSuccess('搜索人员');
        },
        handleQueryClientele() {
            this.msgSuccess('搜索人员');
        },
        handleQueryMateriel() {
            this.msgSuccess('搜索产品');
        },
        // 添加标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 上传图片
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(row) {
            this.$router.push({ name: '/page/sales/salesSignBack/preview', params: { id: row.clienteleId, isShow: false } });
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
