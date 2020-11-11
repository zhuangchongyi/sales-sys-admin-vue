 import Vue from 'vue';
 import {
   resetForm,
   selectDictLabel,
   handleTree,
   approvalStatusFormatter,
   getGenderFormatter,
   parseTime,
   download,
   checkAuditStatus,
   parseFloatFormatter
 } from "@/utils/common.js";

 // 全局方法挂载
 Vue.prototype.resetForm = resetForm;
 Vue.prototype.handleTree = handleTree;
 Vue.prototype.selectDictLabel = selectDictLabel;
 Vue.prototype.parseTime = parseTime; //格式化时间
 Vue.prototype.download = download; //下载转换
 Vue.prototype.approvalStatusFormatter = approvalStatusFormatter; //审核状态
 Vue.prototype.getGenderFormatter = getGenderFormatter; //性别
 Vue.prototype.checkAuditStatus = checkAuditStatus; //校验单据状态
 Vue.prototype.parseFloatFormatter = parseFloatFormatter; //保留小数位

 Vue.prototype.msgSuccess = function (msg) {
   this.$message({
     showClose: true,
     message: msg,
     type: "success"
   });
 }
 Vue.prototype.msgError = function (msg) {
   this.$message({
     showClose: true,
     message: msg,
     type: "error"
   });
 }
 Vue.prototype.msgInfo = function (msg) {
   this.$message.info(msg);
 }
 Vue.prototype.msgAlert = function (title, msg) {
   this.$alert(msg, title);
 }