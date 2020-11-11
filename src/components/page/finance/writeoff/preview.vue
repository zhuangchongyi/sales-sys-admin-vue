<template>
    <div class="container">
        <div v-show="isAudit">
            <el-button type="primary" icon="el-icon-check" :loading="btnLoading" @click="submitAuditForm">确认核销</el-button>
            <!-- <el-button type="primary" icon="el-icon-close" :loading="btnLoading" @click="cancelAuditForm">反审核</el-button> -->
        </div>
        <el-divider><strong>客户信息</strong></el-divider>
        <el-form :model="clienteleForm" ref="clienteleForm" :rules="rules" label-position="right" label-width="auto" :inline="true">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="客户编码" prop="clienteleNum">
                        <el-input v-model="clienteleForm.clienteleNum" size="small" clearable readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户名称" prop="clienteleName">
                        <el-input v-model="clienteleForm.clienteleName" clearable size="small" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="核销日期" prop="writeoffTime">
                        <el-date-picker v-model="clienteleForm.writeoffTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" readonly />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="累计核销金额" prop="writeoffPrice">
                        <el-input v-model="clienteleForm.writeoffPrice" clearable size="small" readonly />
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
        <div>
            <el-table :data="writeoffListData" ref="writeoffListData" border show-summary :summary-method="getSummaries" highlight-current-row>
                <el-table-column label="编号" prop="writeoffSubId" :show-overflow-tooltip="true" align="center" width="60" />
                <el-table-column label="收款单号" prop="receiptNum" :show-overflow-tooltip="true" align="center" width="180" />
                <el-table-column label="应收单号" prop="receivableNum" :show-overflow-tooltip="true" align="center" width="180" />
                <el-table-column label="总收款" prop="receiptPrice" :show-overflow-tooltip="true" align="center" />
                <el-table-column label="总应收款" prop="receivablePrice" :show-overflow-tooltip="true" align="center" />
                <el-table-column label="核销前" align="center">
                    <el-table-column label="收款金额" prop="frontReceiptPrice" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="应收款金额" prop="frontReceivablePrice" :show-overflow-tooltip="true" align="center" />
                </el-table-column>
                <el-table-column label="核销后" align="center">
                    <el-table-column label="收款金额" prop="backReceiptPrice" :show-overflow-tooltip="true" align="center" />
                    <el-table-column label="应收款金额" prop="backReceivablePrice" :show-overflow-tooltip="true" align="center" />
                </el-table-column>
                <el-table-column label="本次核销金额" prop="writeoffPrice" :show-overflow-tooltip="true" align="center" />
            </el-table>
        </div>
    </div>
</template>

<script>
import { getWriteoff, listWriteoffSub, auditWriteoff } from '@/api/finance/writeoff.js';
import { treeselect } from '@/api/basis/category.js';
import { userListDialog } from '@/api/system/user.js';
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
            // 表单校验
            rules: {
                writeoffTime: [{ required: true, message: '核销时间不能为空', trigger: 'blur' }],
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                writeoffPrice: [{ required: true, message: '核销金额不能为空', trigger: 'blur' }],
                clienteleNum: [{ required: true, message: '客户编码不能为空', trigger: 'blur' }]
                // personnelName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
                // deptName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
            },
            //表单参数
            clienteleForm: {}, //主表信息
            clienteleTypeOptions: [], //客户类别
            // 添加客户
            clienteleListData: [],
            clienteleQueryParams: {
                current: 1,
                pageSize: 10,
                categoryId: undefined,
                clienteleNum: undefined,
                clienteleName: undefined
            },
            pageTotal: 0,
            writeoffListData: [],
            isAudit: false,
            btnLoading: false
        };
    },
    watch: {
        $route(to, form) {
            if (to.path === '/page/sales/returns/edit' && this.clienteleForm.writeoffId !== this.$route.query.wId) {
                this.isAudit = JSON.parse(this.$route.query.isAudit || false);
                this.getReturnsData();
            }
        }
    },
    created() {
        this.isAudit = JSON.parse(this.$route.query.isAudit || false);
        this.getWriteoffListDato();
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            // const propertys = ['frontReceiptPrice', 'frontReceivablePrice', 'backReceiptPrice', 'backReceivablePrice', 'writeoffPrice'];
            const propertys = ['writeoffPrice'];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (propertys.indexOf(column.property) !== -1) {
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = '';
                    }
                } else {
                    sums[index] = '';
                }
            });

            return sums;
        },
        getWriteoffListDato() {
            if (this.$route.query.wId) {
                getWriteoff(this.$route.query.wId).then(res => {
                    if (res.success) {
                        this.clienteleForm = res.data;
                        listWriteoffSub({ writeoffId: this.$route.query.wId }).then(res => {
                            this.writeoffListData = res.data;
                        });
                    }
                });
            }
        },
        submitAuditForm() {
            if (this.clienteleForm.writeoffStatus === '1') {
                this.msgError('已核销');
                return;
            }
            let that = this;
            this.$confirm('请确认是否核销？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.btnLoading = true;
                let data = { writeoffId: this.clienteleForm.writeoffId, writeoffStatus: '1' };
                auditWriteoff(data)
                    .then(res => {
                        this.btnLoading = false;
                        if (res.success) {
                            this.getWriteoffListDato();
                            this.msgSuccess('核销成功');
                        } else {
                            that.msgError(res.message);
                        }
                    })
                    .catch(e => {
                        this.btnLoading = false;
                    });
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
