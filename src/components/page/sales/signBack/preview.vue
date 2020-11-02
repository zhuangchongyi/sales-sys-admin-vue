<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" v-show="isAudit" @click="auditForm">审核</el-button>
            <el-button type="primary" icon="el-icon-close" v-show="isAudit" @click="cancelAuditForm">反审核</el-button>
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="100px" :inline="true">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="发货单号" prop="shipmentsNum">
                        <el-input v-model="clienteleForm.shipmentsNum" placeholder="请输入客户编码" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" placeholder="请输入客户编码" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" placeholder="请输入客户名称" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系人" prop="leader">
                        <el-input v-model="clienteleForm.leader" placeholder="请输入联系人" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="clienteleForm.phone" placeholder="请输入联系电话" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机号码" prop="mobilephone">
                        <el-input v-model="clienteleForm.mobilephone" placeholder="请输入手机号码" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="clienteleForm.email" placeholder="请输入邮箱" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="clienteleForm.address" placeholder="请输入地址" size="small" style="width: 400px" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="签收日期" prop="signbackTime">
                        <el-date-picker v-model="clienteleForm.signbackTime" placeholder="选择日期" size="small" style="width: 150px;" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="签收人" prop="personnelName">
                        <el-input v-model="clienteleForm.personnelName" size="small" placeholder="请选择" suffix-icon="el-icon-search" ref="personnelBlur" style="width: 155px;" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="签收总数" prop="signNum">
                        <el-input v-model="clienteleForm.signNum" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="拒收总数" prop="rejectionNum">
                        <el-input v-model="clienteleForm.rejectionNum" size="small" style="width: 150px" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="拒收处理方式" prop="processMode">
                        <el-select v-model="clienteleForm.processMode" placeholder="请选择" clearable size="small" style="width: 150px" disabled>
                            <el-option v-for="dict in processModeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="clienteleForm.remark" type="textarea" style="width: 1000px" size="small" readonly />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider><strong>产品信息</strong></el-divider>
        <el-table v-loading="loading" :data="materielList">
            <el-table-column label="产品编码" prop="materielNum" align="center" />
            <el-table-column label="产品名称" prop="materielName" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="规格" prop="specification" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="型号" prop="modelName" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="所需扭矩" prop="needTorque" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="输出扭矩" prop="outTorque" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="单位" prop="unitsName" align="center"></el-table-column>
            <!-- <el-table-column label="数量" prop="number" align="center"></el-table-column> -->
            <el-table-column label="出库数" prop="outboundNum" align="center"></el-table-column>
            <el-table-column label="签收数" prop="signNum" width="120" align="center"> </el-table-column>
            <el-table-column prop="rejectionNum" label="拒收数" width="120" align="center"></el-table-column>
            <!-- <el-table-column prop="jscl" label="拒收处理" width="300" align="center">
                <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.jscl" />
                </template>
            </el-table-column> -->
        </el-table>

        <!-- 业务人员弹窗 -->
        <el-dialog :title="title" :visible.sync="personnelOpen" width="600px" append-to-body>
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
    </div>
</template>

<script>
import { auditSignback, getSignback, listSignbackSub } from '@/api/sales/signback.js';
import { treeselect } from '@/api/basis/category.js';
import { userListPage } from '@/api/system/user.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
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
                signbackTime: [{ required: true, message: '签收日期不能为空', trigger: 'blur' }],
                personnelName: [{ required: true, message: '签收人不能为空', trigger: 'blur' }]
            },
            //表单参数
            clienteleForm: {}, //主表信息
            materielList: [], //子表信息
            clienteleTypeOptions: [], //客户类别

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
            radio: '',
            signbackId: undefined,
            processModeOptions: [
                { dictValue: '0', dictLabel: '报废' },
                { dictValue: '1', dictLabel: '退回' },
                { dictValue: '2', dictLabel: '赠送' },
                { dictValue: '3', dictLabel: '其他' }
            ],
            isAudit: false,
            btnLoading: false
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/sales/signBack/preview' && this.signbackId !== this.$route.query.signId) {
                this.signbackId = this.$route.query.signId;
                this.isAudit = JSON.parse(this.$route.query.isAudit || false);
                this.getList();
            }
        }
    },
    created() {
        this.signbackId = this.$route.query.signId;
        this.isAudit = JSON.parse(this.$route.query.isAudit || false);
        this.getList();
    },
    methods: {
        getList() {
            if (this.signbackId) {
                getSignback(this.signbackId).then(res => {
                    this.clienteleForm = res.data;
                    listSignbackSub({ signbackId: this.signbackId }).then(res => {
                        this.materielList = res.data;
                        // this.calculateTotalAll();
                    });
                });
            }
        },
        // 客户类别
        getTreeselectClienteleType() {
            treeselect({ category: '1' }).then(res => {
                this.clienteleTypeOptions = res.data;
            });
        },
        // 计算数量
        calculateTotalAll() {
            let allSignNum = 0;
            let allRejectionNum = 0;
            this.materielList.forEach(item => {
                item.rejectionNum = parseInt(item.outboundNum || 0) - parseInt(row.signNum || 0);
                allSignNum = allSignNum + parseInt(item.signNum || 0);
                allRejectionNum = allRejectionNum + parseInt(item.rejectionNum || 0);
            });
        },
        calculateTotal(row) {
            if (row.signNum > row.outboundNum) {
                row.signNum = row.outboundNum;
            }
            row.rejectionNum = parseInt(row.outboundNum || 0) - parseInt(row.signNum || 0);
            this.calculateTotalAll();
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        auditForm() {
            if (this.clienteleForm.status === '3') {
                this.msgError('已审核');
                return;
            }
            let data = {
                signbackId: this.signbackId,
                status: '3'
            };
            this.btnLoading = true;
            this.$refs['clienteleForm'].validate(valid => {
                if (valid) {
                    auditSignback(data)
                        .then(res => {
                            this.btnLoading = false;
                            if (res.success) {
                                this.msgSuccess('审核成功');
                                this.getList();
                            } else {
                                this.msgError(res.message);
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            this.btnLoading = false;
                        });
                }
            });
        },
        cancelAuditForm() {
            if (this.clienteleForm.status === '4') {
                this.msgError('已反审核');
                return;
            }
            let data = {
                signbackId: this.signbackId,
                status: '4'
            };
            this.btnLoading = true;
            auditSignback(data)
                .then(res => {
                    this.btnLoading = false;
                    if (res.success) {
                        this.msgSuccess('反审核成功');
                        this.getList();
                    } else {
                        this.msgError(res.message);
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.btnLoading = false;
                });
        },
        // 业务员
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
