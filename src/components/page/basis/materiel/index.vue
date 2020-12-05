<template>
    <div class="container">
        <el-row :gutter="20">
            <!--产品类别数据-->
            <el-col :span="4" :xs="24">
                <div class="head-container">
                    <el-input v-model="categoryName" placeholder="产品类别名称筛选" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                </div>
                <div class="head-container">
                    <el-tree
                        :data="categoryOptions"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        default-expand-all
                        :highlight-current="true"
                        @node-click="handleNodeClick"
                    />
                </div>
            </el-col>
            <!--产品数据-->
            <el-col :span="20" :xs="24">
                <el-form :model="queryParams" ref="queryParams" :inline="true">
                    <el-form-item label="" prop="materielNum">
                        <el-input v-model="queryParams.materielNum" placeholder="产品编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="materielName">
                        <el-input v-model="queryParams.materielName" placeholder="产品名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="" prop="status">
                        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 200px">
                            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
                    </el-form-item>
                </el-form>
                <div class="handle-box">
                    <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['basis:materiel:add']" @click="handleAdd">新增</el-button>
                    <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['basis:materiel:add']" @click="handleQuotationAdd">报价产品录入</el-button>
                </div>
                <el-table v-loading="loading" :data="materielListData">
                    <el-table-column label="产品编码" align="center" prop="materielNum" width="100" />
                    <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="产品类别" align="center" prop="categoryName" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true" width="200"></el-table-column>
                    <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true" width="200"></el-table-column>
                    <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
                    <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
                    <el-table-column prop="unitsName" label="单位名称" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
                    <el-table-column prop="price" label="单价" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
                    <el-table-column prop="maxPrice" label="最高价" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
                    <el-table-column prop="minPrice" label="最低价" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
                    <el-table-column label="状态" prop="status" :formatter="statusFormatter" align="center"> </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" width="150"></el-table-column>
                    <el-table-column label="创建人" prop="createBy" align="center" width="100"></el-table-column>
                    <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['basis:materiel:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['basis:materiel:edit']" @click="handleUpdateModels(scope.row)">型号价格</el-button>
                            <el-button size="mini" type="text" icon="el-icon-lx-upload" style="color:#e6a23c" v-hasPermi="['basis:materiel:upload']" @click="handleUpload(scope.row)">图纸</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['basis:materiel:delete']" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next"
                        :current-page="queryParams.current"
                        :page-size="queryParams.size"
                        :total="total"
                        :page-sizes="[10, 50, 100, 200]"
                        @size-change="handleSizeChange"
                        @current-change="handlePageChange"
                    ></el-pagination>
                </div>
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="产品类别" prop="categoryId">
                            <treeselect v-model="form.categoryId" :options="categoryOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择产品类别" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编码" prop="materielNum">
                            <el-input v-model="form.materielNum" placeholder="请输入产品编码" maxlength="10" show-word-limit :readonly="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="materielName">
                            <el-input v-model="form.materielName" placeholder="请输入产品名称" maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="规格" prop="specification">
                            <el-input v-model="form.specification" placeholder="请输入规格" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="型号" prop="modelNames">
                            <el-tag :key="tag" v-for="tag in modelNames" closable :disable-transitions="false" @close="handleClose(tag)">
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
                        <el-form-item label="所需扭矩" prop="needTorque">
                            <el-input v-model="form.needTorque" placeholder="请输入所需扭矩" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="输出扭矩" prop="outTorque">
                            <el-input v-model="form.outTorque" placeholder="请输入输出扭矩" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="unitsName">
                            <el-input v-model="form.unitsName" @focus="unitsFocus" ref="unitsBlur" placeholder="请选择单位" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价" prop="price">
                            <el-input
                                v-model="form.price"
                                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                maxlength="10"
                                placeholder="请输入单价"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="最高价" prop="maxPrice">
                            <el-input
                                v-model="form.maxPrice"
                                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                maxlength="10"
                                placeholder="请输入最高价"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最低价" prop="minPrice">
                            <el-input
                                v-model="form.minPrice"
                                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                maxlength="10"
                                placeholder="请输入最低价"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否启用" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                            </el-radio-group>
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

        <!-- 基本单位弹窗 -->
        <el-dialog :title="title" :visible.sync="unitsOpen" width="550px" append-to-body>
            <el-form :model="unitsQuery" ref="unitsQuery" :inline="true">
                <el-form-item label="" prop="unitsNum">
                    <el-input v-model="unitsQuery.unitsNum" placeholder="编码 " clearable size="small" style="width: 120px" @keyup.enter.native="handleQueryDialog" />
                </el-form-item>
                <el-form-item label="" prop="unitsName">
                    <el-input v-model="unitsQuery.unitsName" placeholder="名称 " clearable size="small" style="width: 120px" @keyup.enter.native="handleQueryDialog" />
                </el-form-item>
                <el-form-item label="" prop="unitsType">
                    <el-select v-model="unitsQuery.unitsType" placeholder="单位类型" clearable size="small" style="width: 150px">
                        <el-option v-for="dict in unitsTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryDialog">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="unitsLoading" :data="unitsListData" highlight-current-row @row-dblclick="handledbClick">
                <el-table-column label="选择" width="60">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index + 1" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
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
                    :current-page="unitsQuery.current"
                    :page-size="unitsQuery.size"
                    :total="unitsTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeDialog"
                    @current-change="handlePageChangeDialog"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormDialog">确 定</el-button>
                <el-button @click="cancelDialog">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 上传图纸对话框 -->
        <el-dialog :title="title" :visible.sync="uploadOpen" width="800px" append-to-body>
            <el-form>
                <el-form-item>
                    <el-upload
                        class="avatar-uploader"
                        :action="actionUrl"
                        :headers="headers"
                        list-type="picture"
                        :show-file-list="false"
                        multiple
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-progress="uploadProgress"
                        :auto-upload="true"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span style="color:red">(只允许上传jpeg、png、jpg、gif格式的图片)</span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-table v-loading="imageLoading" :data="imageListData">
                <el-table-column label="名称" align="center" :show-overflow-tooltip="true" prop="name" />
                <el-table-column label="上传时间" align="center" :show-overflow-tooltip="true" prop="createTime" />
                <el-table-column label="标注" align="center" :show-overflow-tooltip="true" prop="remark" />
                <el-table-column label="操作" width="250" align="center" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdateFile(scope.row)">标注</el-button>
                        <el-button size="mini" type="text" icon="el-icon-info" @click="handlePreviewFile(scope.row)">查看</el-button>
                        <el-button size="mini" type="text" icon="el-icon-upload" style="color:#e6a23c" @click="handleDownloadFile(scope.row)">下载</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" @click="handleRemoveFile(scope.row)">删除</el-button>
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
                ></el-pagination>
            </div>
            <el-dialog :title="imageName" :visible.sync="filePreviewOpen" append-to-body>
                <img :src="imageUrl" style="width:100%" />
            </el-dialog>
            <el-dialog title="标注" width="400px" :visible.sync="remarkOpen" append-to-body>
                <el-form :model="remarkForm" ref="remarkForm" :inline="true">
                    <el-form-item label="" prop="remark">
                        <el-input v-model="remarkForm.remark" style="width:350px" type="textarea" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitRemarkForm">确 定</el-button>
                </div>
            </el-dialog>
        </el-dialog>

        <!-- 报价产品录入 -->
        <el-dialog :title="title" :visible.sync="quotaionOpen" width="1000px" append-to-body v-dialogDrag>
            <el-form :model="quotationForm" ref="quotationForm" :inline="true">
                <el-form-item prop="quotationNum">
                    <el-input v-model="quotationForm.quotationNum" placeholder="报价单号 " clearable size="small" @keyup.enter.native="handleQueryQuotation" />
                </el-form-item>
                <el-form-item prop="materielName">
                    <el-input v-model="quotationForm.materielName" placeholder="产品关键字 " clearable size="small" @keyup.enter.native="handleQueryQuotation" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryQuotation">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loadingQuotation" :data="quotaionMaterielList">
                <el-table-column prop="quotationNum" label="报价单号" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="quotationTime" label="报价日期" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="materielNum" label="产品编码" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="materielName" label="产品名称" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="needTorque" label="所需扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="outTorque" label="输出扭矩" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="unitsName" label="单位" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="price" label="单价" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" v-hasPermi="['basis:materiel:edit']" @click="handleAddQuotationMateriel(scope.row)">产品</el-button>
                        <!-- <el-button size="mini" type="text" icon="el-icon-plus" v-hasPermi="['basis:materiel:edit']" @click="handleAddQuotationModelName(scope.row)">型号</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="quotationForm.current"
                    :page-size="quotationForm.size"
                    :total="pageTotal"
                    :page-sizes="[10, 50, 100, 200]"
                    @size-change="handleSizeChangeQuotation"
                    @current-change="handlePageChangeQuotation"
                ></el-pagination>
            </div>

            <el-dialog title="添加新产品" :visible.sync="materielOpen" width="600px" append-to-body>
                <el-form ref="materielForm" :model="materielForm" :rules="rules" label-width="100px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="产品类别" prop="categoryId">
                                <treeselect v-model="materielForm.categoryId" :options="categoryOptions" :disable-branch-nodes="true" :show-count="true" placeholder="请选择产品类别" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品编码" prop="materielNum">
                                <el-input v-model="materielForm.materielNum" placeholder="请输入产品编码" maxlength="10" show-word-limit />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品名称" prop="materielName">
                                <el-input v-model="materielForm.materielName" placeholder="请输入产品名称" maxlength="100" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="规格" prop="specification">
                                <el-input v-model="materielForm.specification" placeholder="请输入规格" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="型号" prop="modelNames">
                                <el-tag :key="index" v-for="(tag, index) in modelNames" closable :disable-transitions="false" @close="handleClose(tag)">
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
                            <el-form-item label="所需扭矩" prop="needTorque">
                                <el-input v-model="materielForm.needTorque" placeholder="请输入所需扭矩" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="输出扭矩" prop="outTorque">
                                <el-input v-model="materielForm.outTorque" placeholder="请输入输出扭矩" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="单位" prop="unitsName">
                                <el-input v-model="materielForm.unitsName" @focus="unitsFocus" ref="unitsBlur" placeholder="请选择单位" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单价" prop="price">
                                <el-input
                                    v-model="materielForm.price"
                                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                    maxlength="10"
                                    placeholder="请输入单价"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="最高价" prop="maxPrice">
                                <el-input
                                    v-model="materielForm.maxPrice"
                                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                    maxlength="10"
                                    placeholder="请输入最高价"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最低价" prop="minPrice">
                                <el-input
                                    v-model="materielForm.minPrice"
                                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                    maxlength="10"
                                    placeholder="请输入最低价"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input v-model="materielForm.remark" type="textarea" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitFormQuotation">确 定</el-button>
                    <el-button @click="cancelDialog">取 消</el-button>
                </div>
            </el-dialog>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="openMaterielModel" width="400px" append-to-body v-dialogDrag>
            <el-table :data="materielModelListData">
                <!-- <el-table-column prop="specification" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column> -->
                <el-table-column prop="modelName" label="型号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="单价" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-form ref="modelForm" :model="scope.row">
                            <el-form-item prop="price" :rules="rules.price">
                                <el-input
                                    v-model="scope.row.price"
                                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                                    maxlength="10"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormModels">确 定</el-button>
                <el-button @click="cancelDialog">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listMateriel, addMateriel, updateMateriel, deleteMateriel, getMateriel, getMaterielModels, updateMaterielModels } from '@/api/basis/materiel.js';
import { listMaterielFile, updateMaterielFile, deleteMaterielFile, downloadFile } from '@/api/basis/materielFile.js';
import { listQuotationMateriel } from '@/api/sales/quotation.js';
import { treeselect } from '@/api/basis/category.js';
import { listUnits } from '@/api/basis/units.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'basis-materiel',
    components: { Treeselect },
    data() {
        var validateModel = (rule, value, callback) => {
            if (this.$data.modelNames.length == 0) {
                callback(new Error('型号不能为空'));
            }
            if (this.$data.modelNames.indexOf(value) == 0) {
                callback(new Error(value + '型号不能重复'));
            } else {
                callback();
            }
        };
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            //产品数据
            materielListData: [],
            // 图纸
            fileList: [],
            //总条数
            total: 0,
            // 产品树选项
            categoryOptions: undefined,
            // 标签
            modelNames: [],
            inputVisible: false,
            inputValue: '',
            // 产品类别名称
            categoryName: undefined,
            //表单参数
            form: {},
            categoryId: undefined,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 状态数据字典
            statusOptions: [
                { dictValue: '0', dictLabel: '启用' },
                { dictValue: '1', dictLabel: '停用' }
            ],
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                materielName: undefined,
                materielNum: undefined,
                status: undefined
            },
            // 表单校验
            rules: {
                categoryId: [{ required: true, message: '未选择产品类别', trigger: 'blur' }],
                materielNum: [
                    { required: true, message: '产品编码不能为空', trigger: 'blur' },
                    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
                ],
                materielName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
                specification: [{ required: true, message: '产品规格不能为空', trigger: 'blur' }],
                modelNames: [{ required: true, validator: validateModel, trigger: 'blur' }],
                unitsName: [{ required: true, message: '产品单位不能为空', trigger: 'blur' }],
                price: [{ required: true, message: '产品单价不能为空', trigger: 'blur' }]
            },
            unitsOpen: false,
            unitsLoading: true,
            unitsQuery: {
                current: 1,
                size: 10,
                unitsName: undefined,
                unitsNum: undefined,
                unitsType: undefined,
                status: '0'
            },
            unitsTotal: 0,
            unitsListData: [],
            selectedUnits: undefined,
            radio: undefined,
            unitsTypeOptions: [
                { dictValue: '0', dictLabel: '基本单位' },
                { dictValue: '1', dictLabel: '包装单位' }
            ],
            // 图片
            uploadOpen: false,
            actionUrl: '/',
            imageLoading: true,
            imageListData: [],
            fileQuery: {
                current: 1,
                size: 10,
                materielId: undefined
            },
            fileTotal: 0,
            remarkOpen: false,
            remarkForm: {},
            filePreviewOpen: false,
            imageUrl: undefined,
            imageName: undefined,
            headers: {
                Authorization: this.$store.getters.token
            },
            // 报价产品
            quotaionOpen: false,
            loadingQuotation: false,
            quotaionMaterielList: [],
            quotationForm: {
                current: 1,
                size: 10,
                quotationNum: undefined,
                materielName: undefined
            },
            pageTotal: 0,
            materielOpen: false,
            modelNameOpen: false,
            selectionMaterielData: [],
            materielForm: {},
            isEdit: false,
            openMaterielModel: false,
            materielModelListData: []
        };
    },
    created() {
        this.getList();
    },
    watch: {
        // 根据名称筛选部门树
        categoryName(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        // 启用状态类型
        statusFormatter(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 查询产品列表
        getList() {
            this.getTreeselect();
            listMateriel(this.queryParams).then(res => {
                this.materielListData = res.data.records;
                this.total = res.data.total || 0;
                this.loading = false;
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryParams, 'current', val);
            this.getList();
        },
        handleSizeChange(val) {
            this.$set(this.queryParams, 'size', val);
            this.handleQuery();
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect({ category: '0' }).then(res => {
                this.categoryOptions = res.data;
            });
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.categoryId = data.id;
            this.categoryId = data.id;
            this.getList();
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.uploadOpen = false;
            this.quotaionOpen = false;
        },
        // 表单刷新
        reset() {
            this.form = {
                categoryId: undefined,
                materielId: undefined,
                materielName: undefined,
                materielNum: undefined,
                price: undefined,
                status: '0'
            };
            this.modelNames = [];
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.queryParams.categoryId = undefined;
            this.resetForm('queryParams');
            this.handleQuery();
        },
        // 删除产品
        handleDelete(row) {
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                return deleteMateriel(row.materielId).then(res => that.callbackFun(res));
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.form.categoryId = this.categoryId;
            this.open = true;
            this.isEdit = false;
            this.title = '新增产品';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            getMateriel(row.materielId).then(res => {
                // console.log('getMateriel', res);
                this.form = res.data;
                this.modelNames = res.data.materielModels;
                this.open = true;
                this.isEdit = true;
                this.title = '修改产品';
            });
        },
        // 获取型号价格
        handleUpdateModels(row) {
            this.reset();
            getMaterielModels({ materielId: row.materielId }).then(res => {
                this.title = row.materielName;
                this.openMaterielModel = true;
                this.materielModelListData = res.data;
            });
        },
        submitFormModels() {
            this.$refs.modelForm.validate(valid => {
                if (valid) {
                    updateMaterielModels(this.materielModelListData).then(res => {
                        if (res.success) {
                            this.msgSuccess(res.message);
                            this.openMaterielModel = false;
                        } else {
                            this.msgError(res.message);
                        }
                    });
                }
            });
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.form.modelNames = this.modelNames;
                    if (this.form.materielId != undefined) {
                        updateMateriel(this.form).then(res => this.callbackFun(res));
                    } else {
                        addMateriel(this.form).then(res => this.callbackFun(res));
                    }
                }
            });
        },
        callbackFun(res) {
            if (res.success) {
                this.msgSuccess(res.message);
                this.handleQuery();
                this.open = false;
            } else {
                this.msgError(res.message);
            }
            return true;
        },

        // 添加标签
        handleClose(tag) {
            this.modelNames.splice(this.modelNames.indexOf(tag), 1);
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
                if (this.modelNames.indexOf(inputValue) === -1) {
                    this.modelNames.push(inputValue);
                } else {
                    this.msgError('型号不能重复');
                }
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        // 产品单位编码输入框获取焦点
        unitsFocus(event) {
            this.unitsOpen = true;
            this.title = '选择产品单位';
            this.selectedUnits = undefined;
            this.getUnitsList();
            // 失去焦点
            this.$refs.unitsBlur.blur();
        },
        getUnitsList() {
            // console.log(this.unitsQuery);
            listUnits(this.unitsQuery).then(res => {
                this.unitsLoading = false;
                this.unitsListData = res.data.records;
                this.unitsTotal = res.data.total;
            });
        },
        getCurrentRow(row) {
            // console.log('选中行', row);
            this.selectedUnits = row;
        },
        handlePageChangeDialog(val) {
            this.$set(this.unitsQuery, 'current', val);
            this.getUnitsList();
        },
        handleSizeChangeDialog(val) {
            this.$set(this.unitsQuery, 'size', val);
            this.handleQueryDialog();
        },
        handleQueryDialog() {
            this.unitsQuery.current = 1;
            this.getUnitsList();
        },
        handledbClick(row, event, column) {
            this.getCurrentRow(row);
            this.submitFormDialog();
        },
        submitFormDialog() {
            this.form.unitsId = this.selectedUnits.unitsId;
            this.form.unitsNum = this.selectedUnits.unitsNum;
            this.$set(this.form, 'unitsName', this.selectedUnits.unitsName);
            this.$refs.form.clearValidate('unitsName');
            if (this.materielOpen) {
                this.materielForm.unitsId = this.selectedUnits.unitsId;
                this.materielForm.unitsNum = this.selectedUnits.unitsNum;
                this.$set(this.materielForm, 'unitsName', this.selectedUnits.unitsName);
                this.$refs.materielForm.clearValidate('unitsName');
            }
            this.unitsOpen = false;
        },
        cancelDialog() {
            this.unitsOpen = false;
            this.materielOpen = false;
            this.modelNameOpen = false;
            this.openMaterielModel = false;
        },
        unitsTypeFormatter(row, column) {
            return this.selectDictLabel(this.unitsTypeOptions, row.unitsType);
        },

        // 上传图片
        handleUpload(row) {
            this.fileQuery.materielId = row.materielId;
            listMaterielFile(this.fileQuery).then(res => {
                this.title = '图纸';
                this.uploadOpen = true;
                this.imageLoading = false;
                this.imageListData = res.data.records;
                this.fileTotal = res.data.total;
                this.actionUrl = process.env.VUE_APP_BASE_API + '/basis/materielFile/upload/' + row.materielId;
            });
        },
        getMaterielFile() {
            listMaterielFile(this.fileQuery).then(res => {
                this.imageListData = res.data.records;
                this.fileTotal = res.data.total;
            });
        },
        handlePageChangeFileDialog(val) {
            this.$set(this.fileQuery, 'current', val);
            this.getMaterielFile();
        },
        handleSizeChangeFileDialog(val) {
            this.$set(this.fileQuery, 'size', val);
            this.getMaterielFile();
        },
        uploadSuccess(response, file, fileList) {
            if (response.success) {
                this.msgSuccess('上传成功');
                this.imageLoading = false;
                this.getMaterielFile();
            } else {
                this.msgError('上传失败');
            }
        },
        beforeUpload(file) {
            // console.log(file);
            const isTypeTrue = /^image\/(jpeg|png|jpg|gif)$/.test(file.type);
            if (!isTypeTrue) {
                this.msgError('只允许上传jpeg|png|jpg|gif 格式的图片');
            }
            return isTypeTrue;
        },
        uploadProgress(file) {
            this.imageLoading = true;
            console.log('上传中...');
        },
        handleUpdateFile(row) {
            this.remarkForm = {};
            // console.log('remark', row);
            this.remarkForm = row;
            this.remarkOpen = true;
        },
        submitRemarkForm() {
            this.imageLoading = true;
            updateMaterielFile(this.remarkForm).then(res => {
                if (res.success) {
                    this.msgSuccess(res.message);
                } else {
                    this.msgError(res.message);
                }
                this.imageLoading = false;
                this.remarkOpen = false;
            });
        },
        handleRemoveFile(row) {
            deleteMaterielFile(row.pkId).then(res => {
                if (res.success) {
                    this.msgSuccess(res.message);
                    this.getMaterielFile();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleDownloadFile(row) {
            // console.log('handleDownloadFile', row);
            this.imageLoading = true;
            downloadFile(row.pkId)
                .then(res => {
                    this.download(res, row.name);
                    this.imageLoading = false;
                    console.log('下载成功');
                })
                .catch(e => {
                    this.imageLoading = false;
                    this.msgError('下载失败');
                });
        },
        handlePreviewFile(row) {
            this.filePreviewOpen = true;
            this.imageUrl = row.url;
            this.imageName = row.name;
        },
        // 添加报价产品
        handleQuotationAdd() {
            this.title = '添加报价产品';
            this.quotaionOpen = true;

            //查询报价产品
            this.handleQueryQuotation();
        },
        handlePageChangeQuotation(val) {
            this.$set(this.quotationForm, 'current', val);
            this.getQuotationMateriel();
        },
        handleSizeChangeQuotation(val) {
            this.$set(this.quotationForm, 'size', val);
            this.handleQueryQuotation();
        },
        handleQueryQuotation() {
            this.quotationForm.current = 1;
            this.getQuotationMateriel();
        },
        getQuotationMateriel() {
            this.loadingQuotation = true;
            this.quotaionMaterielList = [];
            this.pageTotal = 0;
            listQuotationMateriel(this.quotationForm)
                .then(res => {
                    this.loadingQuotation = false;
                    this.quotaionMaterielList = res.data.records;
                    this.pageTotal = res.data.total;
                })
                .catch(e => {
                    this.loadingQuotation = false;
                });
        },
        handleAddQuotationMateriel(row) {
            this.materielOpen = true;
            this.modelNames = [];
            this.resetForm('materielForm');
            this.modelNames.push(row.modelName);
            this.materielForm = row;
        },
        handleAddQuotationModelName(row) {
            this.modelNameOpen = true;
        },
        submitFormQuotation() {
            this.$refs.materielForm.validate(valid => {
                if (valid) {
                    this.materielForm.modelNames = this.modelNames;
                    this.materielForm.materielId = undefined;
                    addMateriel(this.materielForm).then(res => this.callbackFun(res));
                    this.materielOpen = false;
                    this.getList();
                }
            });
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
