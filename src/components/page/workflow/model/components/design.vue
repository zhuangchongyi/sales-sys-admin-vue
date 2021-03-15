<template>
    <el-dialog title="流程模型设计" :visible.sync="dialogFormVisible" width="1000px" @close="close" v-dialogDrag>
        <iframe src="http://localhost:9001/editor?modelId=7501" frameborder="0" width="100%" height="600px"></iframe>
    </el-dialog>
</template>

<script>
import { addWarehouse, updateWarehouse } from '@/api/basis/warehouse.js';
export default {
    name: 'workflow-model-edit',
    data() {
        return {
            dialogFormVisible: false
        };
    },
    created() {},
    methods: {
        open(row) {
            this.dialogFormVisible = true;
        },
        close() {
            this.dialogFormVisible = false;
        }
    }
};
</script>
