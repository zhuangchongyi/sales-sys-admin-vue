<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="" prop="orderNum">
                <el-input v-model="queryParams.orderNum" placeholder="订单号" clearable size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
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
            <el-button type="primary" size="small" icon="el-icon-plus" class="handle-del mr10" v-hasPermi="['sales:order:add']" @click="handleAdd">新增</el-button>
            <el-dropdown trigger="click" style="margin: 0 10px;">
                <el-button class="el-dropdown-link" size="small" type="primary"> 提交<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-top" @click.native="handleSubmit">提交</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-bottom" @click.native="handleNoSubmit">收回</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleAudit">审核</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" class="handle-del mr10" :disabled="single" @click="handleShipments">发货</el-button>
            <el-button type="primary" size="small" icon="el-icon-printer" class="handle-del mr10" @click="handlePrint" :disabled="single">打印</el-button>
            <el-button type="warning" size="small" icon="el-icon-finished" class="handle-del mr10" :disabled="single" @click="handleClose">关闭</el-button>
        </div>
        <el-table
            v-loading="loading"
            :data="orderListData"
            ref="orderListData"
            @row-click="selectionRowClick"
            highlight-current-row
            @row-dblclick="handledblclickRow"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="50" fixed="left" align="center" />
            <el-table-column label="订单号" align="center" prop="orderNum" fixed="left" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="订单日期" align="center" prop="orderTime" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="状态" prop="status" :formatter="auditStatusFormatter" align="center" width="120" />
            <el-table-column label="客户编号" align="center" prop="clienteleNum" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="客户名称" align="center" prop="clienteleName" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="客户联系人" align="center" prop="leader" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="联系人电话" align="center" prop="phone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="手机" align="center" prop="mobilephone" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="业务员" prop="personnelName" align="center" width="100" />
            <el-table-column label="业务部门" prop="deptName" :show-overflow-tooltip="true" align="center" width="100" />
            <el-table-column label="交货日期" align="center" :show-overflow-tooltip="true" prop="deliveryTime" width="150" />
            <el-table-column label="总计金额" align="center" :show-overflow-tooltip="true" prop="totalPrice" width="160" />
            <el-table-column label="税率" align="center" :show-overflow-tooltip="true" prop="taxrate" width="160" />
            <el-table-column label="税额" align="center" prop="taxamount" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="付款条件" align="center" prop="payCondition" :show-overflow-tooltip="true" width="160" />
            <el-table-column label="录入人" prop="createBy" :show-overflow-tooltip="true" align="center" width="120" />
            <el-table-column label="录入时间" prop="createTime" :show-overflow-tooltip="true" align="center" width="160" />
            <el-table-column label="审核人" align="center" prop="auditBy" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="审核时间" align="center" :show-overflow-tooltip="true" prop="auditTime" width="160" />
            <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['sales:order:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-info" v-hasPermi="['sales:order:preview']" @click="handlePreview(scope.row)">明细</el-button> -->
                    <!-- <el-button size="mini" type="text" icon="el-icon-info" style="color:#e6a23c" v-hasPermi="['sales:order:schedule']" @click="handleSchedule(scope.row)">查看进度</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color:#fd5656" v-hasPermi="['sales:order:delete']" @click="handleDelete(scope.row)">删除</el-button>
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

        <el-dialog v-dialogDrag title="产品发货" :visible.sync="open" width="1000px" append-to-body>
            <el-table v-loading="loading" :data="materielListData" ref="materielListData" highlight-current-row @row-click="selectionRowShipments" @selection-change="handleSelectionShipments">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column label="产品编码" align="center" :show-overflow-tooltip="true" prop="materielNum" />
                <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" />
                <el-table-column label="规格" align="center" :show-overflow-tooltip="true" prop="specification" />
                <el-table-column label="型号" align="center" :show-overflow-tooltip="true" prop="modelName" />
                <el-table-column label="所需扭矩" align="center" :show-overflow-tooltip="true" prop="needTorque" />
                <el-table-column label="输出扭矩" align="center" :show-overflow-tooltip="true" prop="outTorque" />
                <el-table-column prop="unitsName" label="单位" align="center" />
                <el-table-column prop="number" label="订购数量" width="150" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="hasShipmentNum" label="已发货数量" width="150" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="shipmentNum" label="本次可发货数量" width="150" align="center">
                    <template slot-scope="scope">
                        <el-input
                            size="small"
                            :readonly="scope.row.number == scope.row.hasShipmentNum"
                            @input="calculateTotal(scope.row)"
                            oninput="value=value.replace(/[^\d]/g,'')"
                            maxLength="9"
                            v-model="scope.row.shipmentNum"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确认发货</el-button>
                <el-button type="primary" @click="cancelForm">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listOrder, deleteOrder, submitOrder, auditOrder, getOrderSub } from '@/api/sales/order.js';
import { addAndUpdateShipments } from '@/api/sales/shipments.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'sales-order',
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
            //用户数据
            orderListData: [],
            //表单参数
            form: {},
            // 状态数据字典
            statusOptions: [],
            selection: undefined,
            multipleSelection: [],
            //总条数
            total: 0,
            // 查询参数
            queryParams: {
                current: 1,
                size: 10,
                orderNum: undefined,
                clienteleNum: undefined,
                clienteleName: undefined,
                status: undefined
            },
            materielListData: [],
            selectionShipments: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        auditStatusFormatter(row, column) {
            return this.approvalStatusFormatter(row.status);
        },
        getList() {
            listOrder(this.queryParams).then(res => {
                if (res.success) {
                    this.orderListData = res.data.records;
                    this.total = res.data.total || 0;
                }
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 刷新按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
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
            this.ids = selection.map(item => item.orderId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selection = selection[0];
            this.multipleSelection = selection;
        },
        selectionRowClick(row) {
            this.$refs['orderListData'].toggleRowSelection(row);
        },
        handledblclickRow(row, event, column) {
            this.handlePreview(row);
        },

        // 校验状态
        verifyStatus(status, msg) {
            return this.checkAuditStatus(this.multipleSelection, 'orderNum', status, msg);
        },
        /** 提交按钮 */
        handleSubmit() {
            if (this.verifyStatus('7', '已提交') || this.verifyStatus('1', '已提交') || this.verifyStatus('4', '已提交') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitOrder('1', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('提交成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        // 收回按钮
        handleNoSubmit() {
            if (this.verifyStatus('7', '已提交') || this.verifyStatus('0', '请先提交') || this.verifyStatus('2', '已收回') || this.verifyStatus('3', '已审核')) {
                return;
            }
            submitOrder('2', this.ids).then(res => {
                if (res.success) {
                    this.msgSuccess('收回成功');
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/page/sales/order/add');
        },
        // 打印
        handlePrint() {
            if (this.verifyStatus('7', '已关闭')) return;
            if (!this.verifyStatus('3') && !this.verifyStatus('5')) {
                this.msgError('请先审核');
                return;
            }
            this.msgSuccess('打印成功');
        },
        // 删除按钮
        handleDelete(row) {
            if ('1' === row.status || '4' === row.status || '6' === row.status) {
                this.msgError('已提交，请收回删除');
                return;
            } else if ('3' === row.status || '5' === row.status) {
                this.msgError('已审核，不能删除');
                return;
            }
            let that = this;
            let orderId = row.orderId || this.selection.orderId;
            this.$confirm('请确认是否删除？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function() {
                deleteOrder(orderId).then(res => {
                    if (res.success) {
                        that.msgSuccess(res.message);
                        that.handleQuery();
                    } else {
                        that.msgError(res.message);
                    }
                });
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            let status = parseInt(row.status || 0);
            if ('' === row.status) {
                this.msgError('已关闭，不允许修改');
                return;
            } else if (status == 1 || status > 2) {
                this.msgError('已提交不允许修改');
                return;
            }
            this.$router.push({ path: '/page/sales/order/edit', query: { id: row.orderId } });
        },
        /** 明细按钮操作 */
        handlePreview(row) {
            this.$router.push({ path: '/page/sales/order/preview', query: { id: row.orderId, isShow: false } });
        },
        handleAudit(row) {
            let status = row.status || this.selection.status;
            if (this.verifyStatus('7', '已关闭')) return;
            if (status == '0' || status == '2') {
                this.msgError('请先提交');
                return;
            }
            let orderId = row.orderId || this.selection.orderId;
            this.$router.push({ path: '/page/sales/order/preview', query: { id: orderId, isShow: false, isAudit: true } });
        },
        // 关闭按钮
        handleClose() {
            if (this.verifyStatus('7', '已关闭')) return;
            let data = {
                orderId: this.selection.orderId,
                status: '7'
            };
            auditOrder(data).then(res => {
                if (res.success) {
                    this.msgSuccess(res.message);
                    this.handleQuery();
                } else {
                    this.msgError(res.message);
                }
            });
        },
        handleSchedule(row) {
            this.$router.push({ path: '/page/sales/order/schedule', query: { id: row.orderId } });
        },

        // 发货按钮
        handleShipments() {
            if (this.verifyStatus('7', '已关闭')) return;
            let status = parseInt(this.selection.status || 0);
            if (status == 6 || status == 4 || status < 3) {
                this.msgError('请先审核');
                return;
            }
            this.materielListData = [];
            // 查询子表
            let param = { orderId: this.selection.orderId };
            getOrderSub(param).then(res => {
                this.materielListData = res.data || [];
                this.calculateTotalAll();
            });
            this.open = true;
            this.selectionShipments = [];
        },
        handleSelectionShipments(selection) {
            this.selectionShipments = selection;
        },
        selectionRowShipments(row) {
            this.$refs['materielListData'].toggleRowSelection(row);
        },
        cancelForm() {
            this.open = false;
        },
        // 计算数量
        calculateTotalAll() {
            this.materielListData.forEach(item => {
                item.shipmentNum = parseInt(item.number || 0) - parseInt(item.hasShipmentNum || 0);
            });
        },
        calculateTotal(row) {
            let shipmentNum = parseInt(row.number || 0) - parseInt(row.hasShipmentNum || 0);
            let newShipmentNum = parseInt(row.shipmentNum || 0);
            if (newShipmentNum > shipmentNum) {
                row.shipmentNum = shipmentNum;
            }
        },
        submitForm() {
            if (this.selectionShipments.length == 0) {
                this.msgError('没有可发货的产品');
                return;
            }
            let materielListData = this.selectionShipments.filter(item => {
                item.orderSubId = item.subId;
                item.subId = undefined;
                return item.shipmentNum > 0;
            });
            if (materielListData.length == 0) {
                this.msgError('没有可发货的产品');
                return;
            }
            let data = {
                clientele: JSON.stringify(this.selection),
                materielList: JSON.stringify(materielListData)
            };
            addAndUpdateShipments(data).then(res => {
                if (res.success) {
                    this.msgSuccess(res.message);
                    this.open = false;
                } else {
                    this.msgError(res.message);
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
</style>
