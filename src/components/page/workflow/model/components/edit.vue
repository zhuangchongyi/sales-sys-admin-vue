<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="模型编号" prop="warehouseNum">
                <el-input v-model.trim="form.warehouseNum" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模型名称" prop="warehouseName">
                <el-input v-model.trim="form.warehouseName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="remark">
                <el-input v-model.trim="form.remark" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addWarehouse, updateWarehouse } from '@/api/basis/warehouse.js';
export default {
    name: 'workflow-model-edit',
    data() {
        return {
            form: {
                warehouseNum: undefined,
                warehouseName: undefined,
                remark: undefined
            },
            rules: {
                warehouseNum: [{ required: true, message: '模型编号不能为空', trigger: 'blur' }],
                warehouseName: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }]
            },
            title: '',
            dialogFormVisible: false
        };
    },
    created() {},
    methods: {
        open(row) {
            if (!row) {
                this.title = '新增';
            } else {
                this.title = '编辑';
                this.form = Object.assign({}, row);
            }
            this.dialogFormVisible = true;
        },
        close() {
            this.$refs['form'].resetFields();
            this.form = this.$options.data().form;
            this.dialogFormVisible = false;
        },
        save() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    //保存数据
                    this.msgSuccess('OK');
                    this.$emit('fetch-data');
                    this.close();
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
