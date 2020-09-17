<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover"
                 class="mgb20"
                 style="height:280px;">
          <div class="user-info">
            <img src="../../assets/img/avatar.gif"
                 class="user-avator"
                 alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{loginTime}}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{loginAddress}}</span>
          </div>
          <div class="user-info-list">
            登录IP地址：&ensp;&ensp;
            <span>{{ip}}</span>
          </div>
        </el-card>

        <el-card shadow="hover"
                 style="height:252px;">
          <div slot="header"
               class="clearfix">
            <span>系统监控</span>
          </div>
          内存
          <el-progress :percentage="71.3"
                       color="#42b983" />
          CPU
          <el-progress :percentage="33.7" />
          JVM
          <el-progress :percentage="24.1"
                       color="#f1e05a" />
          磁盘
          <el-progress :percentage="46.9"
                       color="#f56c6c" />
        </el-card>

      </el-col>
      <el-col :span="16">
        <el-row :gutter="20"
                class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-lx-people grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-lx-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>订单数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="hover"
                 style="height:430px;">
          <div slot="header"
               class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text"
                       @click="addSchedule">添加</el-button>
          </div>
          <el-table :show-header="false"
                    :data="todoList"
                    height="330px"
                    style="width:100%;">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"
                             @change="editStatus(scope.$index,scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="todo-item"
                     :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           icon="el-icon-edit"
                           @click="editSchedule(scope.$index,scope.row)"></el-button>
                <el-button size="mini"
                           type="text"
                           icon="el-icon-delete"
                           style="color:#fd5656"
                           @click="deleteSchedule(scope.$index,scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="bar"
                  class="schart"
                  canvasId="bar"
                  :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line"
                  class="schart"
                  canvasId="line"
                  :options="options2"></schart>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="title"
               :visible.sync="open"
               width="400px"
               append-to-body>
      <el-form ref="form"
               :model="form">
        <el-input v-model="form.title"
                  maxlength="150"
                  type="textarea" />
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Schart from 'vue-schart';
import bus from '../common/bus';

export default {
  name: 'dashboard',
  data () {
    return {
      loginTime: undefined,
      loginAddress: undefined,
      ip: undefined,
      name: undefined,
      open: false,
      isEdit: false,
      form: { status: false },
      title: undefined,
      index: undefined,
      todoList: [],
      options: {
        type: 'bar',
        title: {
          text: '最近一周各品类销售图'
        },
        xRorate: 25,
        labels: ['周一', '周二', '周三', '周四', '周五'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
          {
            label: '百货',
            data: [164, 178, 190, 135, 160]
          },
          {
            label: '食品',
            data: [144, 198, 150, 235, 120]
          }
        ]
      },
      options2: {
        type: 'line',
        title: {
          text: '最近几个月各品类销售趋势图'
        },
        labels: ['6月', '7月', '8月', '9月', '10月'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
          {
            label: '百货',
            data: [164, 178, 150, 135, 160]
          },
          {
            label: '食品',
            data: [74, 118, 200, 235, 90]
          }
        ]
      },
    };
  },
  components: {
    Schart
  },
  computed: {
    role () {
      this.name = this.$store.getters.name;
      // console.log(this.$store.getters.roles)
      return this.name === 'admin' ? '超级管理员' : '普通用户';
    }
  },
  mounted () {
    this.loginTime = localStorage.getItem("loginTime");
    this.todoList = JSON.parse(localStorage.getItem('mySchedule')) || [{ title: '本地缓存', status: false }];
    let ipdate = JSON.parse(localStorage.getItem('ipdate'));
    this.loginAddress = ipdate.cityName;
    this.ip = ipdate.ip;
  },
  methods: {
    // 添加待办任务
    addSchedule () {
      this.form = { status: false }
      this.open = true;
      this.title = '添加待办事项';
      this.isEdit = false;
    },
    // 修改待办任务
    editSchedule (index, row) {
      this.open = true;
      this.title = '修改待办事项';
      this.form = row;
      this.isEdit = true;
      this.index = index;
    },
    // 删除待办任务
    deleteSchedule (index, row) {
      this.todoList.splice(index, 1);
      localStorage.setItem('mySchedule', JSON.stringify(this.todoList));
    },
    // 修改待办任务状态
    editStatus (index, row) {
      this.todoList[index] = row;
      localStorage.setItem('mySchedule', JSON.stringify(this.todoList));
    },
    submit () {
      if (this.isEdit) {
        this.todoList[this.index] = this.form;
      } else {
        this.todoList.push(this.form);
      }
      this.open = false;
      localStorage.setItem('mySchedule', JSON.stringify(this.todoList));
    },
    cancel () {
      this.form = { status: false };
      this.open = false;
    }

    // changeDate () {
    //   const now = new Date().getTime();
    //   this.data.forEach((item, index) => {
    //     const date = new Date(now - (6 - index) * 86400000);
    //     item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    //   });
    // },
    // handleListener () {
    //   bus.$on('collapse', this.handleBus);
    //   // 调用renderChart方法对图表进行重新渲染
    //   window.addEventListener('resize', this.renderChart);
    // },
    // handleBus (msg) {
    //   setTimeout(() => {
    //     this.renderChart();
    //   }, 200);
    // },
    // renderChart () {
    //   this.$refs.bar.renderChart();
    //   this.$refs.line.renderChart();
    // }
  },
  // created () {
  //   this.handleListener();
  //   this.changeDate();
  // },
  // activated () {
  //   this.handleListener();
  // },
  // deactivated () {
  //   window.removeEventListener('resize', this.renderChart);
  //   bus.$off('collapse', this.handleBus);
  // },
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
