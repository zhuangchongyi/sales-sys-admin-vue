<template>
    <div class="container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item prop="search">
                <el-input v-model="queryParams.search" placeholder="关键字" clearable size="small" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">刷新</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="tableData" class="table">
            <el-table-column prop="username" label="登录账号" align="center" sortable>
                <template slot-scope="scope">
                    <span v-html="handleShowData(scope.row.username)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="startTimestamp" label="系统登录时间" align="center" sortable>
                <template slot-scope="scope">
                    <span v-html="handleShowData(scope.row.startTimestamp)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="lastAccessTime" label="上次操作时间" align="center" sortable>
                <template slot-scope="scope">
                    <span v-html="handleShowData(scope.row.lastAccessTime)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="timeout" label="过期时间" align="center" sortable>
                <template slot-scope="scope">
                    <span v-html="handleShowData(scope.row.timeout)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="host" label="主机" align="center" sortable>
                <template slot-scope="scope">
                    <span v-html="handleShowData(scope.row.host)"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="warning" @click="handleKickOut(scope.row)" v-hasPermi="['monitor:online:kickout']">强制下线</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { listOnline, deleteOnline } from '@/api/monitor/online.js';
export default {
    data() {
        return {
            loading: false,
            dataList: [],
            queryParams: {}
        };
    },
    created() {
        this.getList();
    },
    computed: {
        tableData() {
            let search = this.queryParams.search;
            if (search) {
                return this.dataList.filter(function(dataNews) {
                    return Object.keys(dataNews).some(function(key) {
                        if ('id' == key) {
                            return false;
                        } else {
                            return dataNews[key].indexOf(search) > -1;
                        }
                    });
                });
            } else {
                return this.dataList;
            }
        }
    },
    methods: {
        handleTimeout(row) {
            let timeout = row.timeout; // 过期时间
            let lastAccessTime = new Date(row.lastAccessTime); // 上次操作时间
            let endTimestamp = new Date(lastAccessTime.getTime() + timeout); // 结束时间
            return this.parseTime(endTimestamp);
        },
        handleShowData(val) {
            val = String(val);
            let search = this.queryParams.search;
            if (val.indexOf(search) !== -1 && search !== '') {
                return val.replace(search, '<font color="#F00">' + search + '</font>');
            } else {
                return val;
            }
        },
        resetQuery() {
            this.resetForm('queryParams');
            this.getList();
        },
        getList() {
            listOnline(this.queryParams).then(res => {
                this.dataList = res.data;
            });
        },
        handleKickOut(row) {
            deleteOnline({ id: row.id }).then(res => {
                if (res.success) {
                    this.msgSuccess('退出成功');
                    this.getList();
                } else {
                    this.msgError(res.message);
                }
            });
        }
    }
};
</script>

<style scoped>
.table {
    width: 100%;
    font-size: 14px;
}
</style>
