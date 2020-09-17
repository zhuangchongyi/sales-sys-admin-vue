<template>
  <div class="container">
    <el-form :model="queryParams"
             ref="queryParams"
             :inline="true">
      <el-form-item label="仓库编码"
                    prop="clienteleNum">
        <el-input v-model="queryParams.clienteleNum"
                  placeholder="请选择仓库"
                  size="small"
                  @focus="warehouseFocus"
                  ref="warehouseBlur"
                  suffix-icon="el-icon-search"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="仓库名称"
                    prop="clienteleName">
        <el-input v-model="queryParams.clienteleName"
                  :disabled="true"
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="handle-box">
    </div>
    <el-table v-loading="loading"
              :data="clienteleList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="50"
                       align="center" />
      <el-table-column label="产品编号"
                       align="center"
                       prop="clienteleId" />
      <el-table-column label="产品名称"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true" />
      <el-table-column label="产品类型"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true" />
      <el-table-column label="规格"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="clienteleId" />
      <el-table-column label="型号"
                       align="center"
                       prop="clienteleName"
                       :show-overflow-tooltip="true" />
      <el-table-column label="所需扭矩"
                       align="center"
                       prop="type"
                       :show-overflow-tooltip="true" />
      <el-table-column label="输出扭矩"
                       align="center"
                       :show-overflow-tooltip="true"
                       prop="type" />
      <el-table-column label="单位"
                       align="center"
                       prop="clienteleId" />
      <el-table-column label="现存量"
                       align="center"
                       prop="clientelePrice"
                       :show-overflow-tooltip="true" />
    </el-table>
    <div class="pagination">
      <el-pagination background
                     layout="total, prev, pager, next"
                     :current-page="queryParams.pageNum"
                     :page-size="queryParams.pageSize"
                     :total="pageTotal"
                     @current-change="handlePageChange"></el-pagination>
    </div>

    <el-dialog :title="title"
               :visible.sync="open"
               width="400px"
               append-to-body>
      <el-form :model="query"
               ref="query"
               :inline="true">
        <el-form-item label=""
                      prop="warehouseName">
          <el-input v-model="query.warehouseName"
                    placeholder="请输入仓库编码或名称"
                    size="small"
                    style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleQueryWarehouse">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="warehouseListData"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="50"
                         align="center" />
        <el-table-column label="仓库编号"
                         align="center"
                         prop="userName" />
        <el-table-column label="仓库名称"
                         align="center"
                         prop="nickName" />
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="query.pageNum"
                       :page-size="query.pageSize"
                       :total="query.total"
                       @current-change="handlePageChange"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData, treeselect } from '@/api/basis/clientele.js';
export default {
  name: 'warehouse-standingStock',//现存量
  data () {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      // 弹窗标题
      title: '',
      //用户数据
      clienteleList: [],
      //总条数
      pageTotal: 0,
      // 部门名称
      //表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseId: undefined,
        warehouseName: undefined,
        warehouseNum: undefined,
        deptId: undefined
      },
      query: {
        pageNum: 1,
        pageSize: 10,
        pageTotal: 0,
        warehouseName: undefined
      },
      selectionWarehouse: [],
      warehouseListData: [],
    };
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      listData(this.query).then(res => {
        console.log(res);
        this.clienteleList = res.data;
        this.pageTotal = res.pageTotal || 50;
        this.loading = false;
      });
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.queryParams, 'pageNum', val);
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionWarehouse = selection;
    },
    // 取消按钮
    cancel () {
      this.open = false;
    },
    // 表单重置
    reset () {
      this.form = {
        userId: undefined,
        deptId: undefined,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.page = 1;
      this.getList();
    },
    handleQueryWarehouse () {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 提交按钮 */
    submitForm () {
      if (this.selectionWarehouse.length != 1) {
        this.msgError('只能选择一个仓库');
        return;
      }
      this.queryParams.warehouseId = this.selectionWarehouse[0].warehouseId;
      this.queryParams.warehouseName = this.selectionWarehouse[0].warehouseName;
      this.queryParams.warehouseNum = this.selectionWarehouse[0].warehouseNum;
    },
    // 获取焦点
    warehouseFocus (event) {
      this.open = true;
      this.title = '选择仓库';
      listData(this.query).then(res => {
        console.log(res);
        this.warehouseListData = res.rows;
        this.query.total = res.total;
      })

      // 失去焦点
      this.$refs.warehouseBlur.blur();
    },
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
