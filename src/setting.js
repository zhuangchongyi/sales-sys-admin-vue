import Vue from 'vue';
import {
  resetForm,
  selectDictLabel,
  handleTree,
  approvalStatusFormatter,
  rejectionTypeFormatter,
  adjustmentTypeFormatter,
  genderFormatter,
  parseTime,
  startStatusFormatter,
  jobStatusFormatter,
  download,
} from "@/utils/common.js";

// 全局方法挂载
Vue.prototype.resetForm = resetForm;
Vue.prototype.handleTree = handleTree;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.parseTime = parseTime; //格式化时间
Vue.prototype.download = download; //下载转换
Vue.prototype.approvalStatusFormatter = approvalStatusFormatter; //审核状态
Vue.prototype.rejectionTypeFormatter = rejectionTypeFormatter; //拒收状态
Vue.prototype.adjustmentTypeFormatter = adjustmentTypeFormatter; //调整来源状态
Vue.prototype.genderFormatter = genderFormatter; //性别
Vue.prototype.startStatusFormatter = startStatusFormatter; //启用状态
Vue.prototype.jobStatusFormatter = jobStatusFormatter; //在职状态
Vue.prototype.aduitStatusOptions = [{
  dictValue: '0',
  dictLabel: '已保存'
}, {
  dictValue: '1',
  dictLabel: '已提交'
}, {
  dictValue: '2',
  dictLabel: '已收回'
}, {
  dictValue: '3',
  dictLabel: '已审核'
}, {
  dictValue: '4',
  dictLabel: '反审核'
}, {
  dictValue: '5',
  dictLabel: '特批'
}, {
  dictValue: '6',
  dictLabel: '取消特批'
}];
Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success"
  });
};
Vue.prototype.msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error"
  });
};
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};
Vue.prototype.msgAlert = function (title, msg) {
  this.$alert(msg, title);
};