<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="客户编码" prop=" materielNum">
                                <el-input v-model="form.materielNum" :disabled="true" maxlength="11" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="客户名称" prop="materielName">
                                <el-input v-model="form.materielName" :disabled="true" maxlength="50" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="应收款" prop="materielName">
                                <el-input v-model="form.materielName" :disabled="true" maxlength="50" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="已收款" prop="materielName">
                                <el-input v-model="form.materielName" :disabled="true" maxlength="50" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="待收款" prop="materielName">
                                <el-input v-model="form.materielName" :disabled="true" maxlength="50" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="13">
                <el-table :data="form.materielListData">
                    <el-table-column label="产品编码" align="center" prop="materielId" />
                    <el-table-column label="产品名称" align="center" prop="materielName" :show-overflow-tooltip="true" />
                    <el-table-column prop="personnelName" label="规格" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="personnelName" label="型号" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="dw" label="所需扭矩" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="dw" label="输出扭矩" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="dw" label="单位" align="center"></el-table-column>
                    <el-table-column prop="dw" label="售价" align="center"></el-table-column>
                    <el-table-column prop="sl" label="数量" align="center"></el-table-column>
                    <el-table-column label="已发数" align="center" prop="fhNumber"></el-table-column>
                    <el-table-column label="未发数" align="center" prop="fhNumber"></el-table-column>
                    <el-table-column label="签收数" align="center" prop="qsNumber"></el-table-column>
                    <el-table-column label="退回数" align="center" prop="qsNumber"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="1" style="min-height: 1px"> </el-col>
            <el-col :span="10">
                <el-table :data="form.proceedsListData">
                    <el-table-column label="收款时间" align="center" prop="createTime" width="140" />
                    <el-table-column label="收款单号" align="center" prop="materielId" />
                    <el-table-column label="收款金额" align="center" prop="materielId" />
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {}
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
