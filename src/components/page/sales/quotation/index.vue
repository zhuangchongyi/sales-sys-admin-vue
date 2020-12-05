<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="quotationNum">
                <el-input v-model="queryParams.quotationNum" placeholder="报价单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleNum">
                <el-input v-model="queryParams.clienteleNum" placeholder="客户编码" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="clienteleName">
                <el-input v-model="queryParams.clienteleName" placeholder="客户名称" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="状态"
                    prop="status">
        <el-select v-model="queryParams.status"
                   placeholder="状态"
                   clearable
                   size="small"
                   style="width: 200px">
          <el-option v-for="dict in statusOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <div class="handle-box">
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['sales:quotation:add']" @click="handleAdd">新增</el-button>
            <el-dropdown trigger="click" style="margin: 0 10px;" v-hasPermi="['sales:quotation:submit']">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit" v-hasPermi="['sales:quotation:audit']">审核</el-button>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleGenerate" v-hasPermi="['sales:quotation:order']"
                >生成订单</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" :disabled="single" @click="handlePrint" v-hasPermi="['sales:quotation:print']">打印</el-button>
        </div>
        <el-table v-loading="loading" :data="dataList" ref="dataList" @row-click="selectionRowClick" highlight-current-row @row-dblclick="handledblclickRow" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column label="报价单号" align="center" prop="quotationNum" fixed="left" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="报价日期" prop="quotationTime" align="center" :show-overflow-tooltip="true" width="160"></el-table-column>
            <el-table-column label="状态" prop="status" :formatter="auditStatusFormatter" align="center" width="120" />
            <el-table-column label="客户编号" align="center" :show-overflow-tooltip="true" prop="clienteleNum" width="80" />
            <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" width="100" />
            <el-table-column prop="leader" label="客户联系人" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="联系人电话" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mobilephone" label="手机" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="personnelName" label="报价人员" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deptName" label="所属部门" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="总计金额" align="center" prop="totalPrice" width="160" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="付款条件" align="center" prop="payCondition" width="160" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="过期日期" align="center" prop="effectiveTime" width="160" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createBy" label="录入人" align="center" width="120" :show-overflow-tooltip="true" />
            <el-table-column prop="createTime" label="录入时间" align="center" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="审核人" align="center" prop="auditBy" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="审核时间" align="center" prop="auditTime" width="160" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" type="text" icon="el-icon-edit" v-hasPermi="['sales:quotation:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="small" type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['sales:quotation:delete']" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                :current-page="queryParams.current"
                :page-size="queryParams.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                :page-sizes="[10, 50, 100, 200]"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { listQuotation, deleteQuotation, submitQuotation } from '@/api/sales/quotation.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-quotation',
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 是否显示弹出层
            open: false,
            // 弹窗标题
            title: '',
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            //报价单数据
            dataList: [],
            //总条数
            total: 0,
            // 部门树选项
            deptOptions: undefined,
            // 部门名称
            deptName: undefined,
            //表单参数
            form: {},
            // 状态数据字典
            statusOptions: [],
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                quotationNum: undefined,
                clienteleNum: undefined,
                clienteleName: undefined,
                status: undefined
            },
            // 表单校验
            rules: {
                clienteleName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }]
            },
            selection: undefined,
            multipleSelection: []
        };
    },
    created() {
        this.getList();
    },
    activated() {
        this.getList();
    },
    methods: {
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        getList() {
            listQuotation(this.queryParams).then(res => {
                this.dataList = res.data.records;
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.multipleSelection = selection;
            this.ids = selection.map(item => item.quotationId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selection = selection[0];
        },
        selectionRowClick(row) {
            this.$refs.dataList.toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.current = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'quotationNum', status, msg);
        },
        handlePrint(row) {
            if (!this.verifyStatus('3') || !this.verifyStatus('5')) {
                this.message('请先审核');
                return;
            }
            let quotationId = row.quotationId || this.selection.quotationId;
            this.msgSuccess('打印成功');
        },
        handleGenerate() {
            if (this.selection.status !== '3') {
                this.msgError('请先审核');
                return;
            }
            let effectiveTime = new Date(this.parseTime(this.selection.effectiveTime, '{y}-{m}-{d}'));
            let nowTime = new Date(this.parseTime(new Date(), '{y}-{m}-{d}'));
            if (nowTime > effectiveTime) {
                this.msgError('已超过过期时间');
                return;
            }

            this.$router.push({ path: '/page/sales/quotation/preview2', query: { qId: this.selection.quotationId } });
        },
        handleSubmit() {
            if (this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitQuotation('1', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleNoSubmit() {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '已收回') || this.verifyStatus('3', '已审核，不能收回')) {
                return;
            }
            submitQuotation('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('收回成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleDelete(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let quotationId = row.quotationId || this.selection.quotationId;
            let that = this;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deleteQuotation(quotationId).then(res => {
                    if (res.success) {
                        that.msgSuccess('删除成功');
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/sales/quotation/add');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            if ('1' === row.status || '4' === row.status) {
                this.msgError('已提交，不能修改');
                return;
            } else if ('3' === row.status) {
                this.msgError('已审核，不能修改');
                return;
            }
            this.$router.push({ path: '/page/sales/quotation/edit', query: { id: row.quotationId } });
        },
        handlePreview(row) {
            this.$router.push({ path: '/page/sales/quotation/preview', query: { id: row.quotationId, isShow: false } });
        },
        handleAudit(row) {
            if (this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '请先提交')) {
                return;
            }
            let quotationId = row.quotationId || this.selection.quotationId;
            this.$router.push({ path: '/page/sales/quotation/preview', query: { id: quotationId, isShow: false, isAudit: true } });
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
</style>
