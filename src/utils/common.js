/**
 * 通用js方法封装处理
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  })
  return actions.join('');
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}



// 格式化审批状态
export function approvalStatusFormatter(val) {
  let status = val.status;
  let text = '';
  switch (status) {
    case '0':
      text = '已保存';
      break;
    case '1':
      text = '已提交';
      break;
    case '2':
      text = '已收回';
      break;
    case '3':
      text = '已审核';
      break;
    case '4':
      text = '反审核';
      break;
    case '5':
      text = '特批';
      break;
    case '6':
      text = '取消特批';
      break;
    case '7':
      text = '已关闭';
      break;
    default:
      text = '无';
      break;
  }
  return text;
}

// 销售签收拒收类型
export function rejectionTypeFormatter(val) {
  let status = val.status;
  let text = '';
  switch (status) {
    case '0':
      text = '报废';
      break;
    case '1':
      text = '退回';
      break;
    case '2':
      text = '赠送';
      break;
    default:
      text = '无';
      break;
  }
  return text;
}

// 调整单类型
export function adjustmentTypeFormatter(val) {
  let status = val.status;
  let text = '';
  switch (status) {
    case '0':
      text = '盘点调整';
      break;
    case '1':
      text = '录入调整';
      break;
    default:
      text = '无';
      break;
  }
  return text;
}

// 性别
export function genderFormatter(val) {
  let status = val.gender;
  let text = '';
  switch (status) {
    case '0':
      text = '男';
      break;
    case '1':
      text = '女';
      break;
    default:
      text = '其他';
      break;
  }
  return text;
}


// 销售签收拒收类型状态
export function verificationFormatter(val) {
  let status = val.sex;
  let text = '';
  switch (status) {
    case '0':
      text = '已核销';
      break;
    case '1':
      text = '未核销';
      break;
    default:
      text = '其他';
      break;
  }
  return text;
}

// 是否启用状态
export function startStatusFormatter(val) {
  let status = val.status;
  let text = '';
  switch (status) {
    case '0':
      text = '启用';
      break;
    case '1':
      text = '停用';
      break;
    default:
      text = '其他';
      break;
  }
  return text;
}

// 在职状态
export function jobStatusFormatter(val) {
  let status = val.jobStatus;
  let text = '';
  switch (status) {
    case '0':
      text = '在职';
      break;
    case '1':
      text = '离职';
      break;
    default:
      text = '其他';
      break;
  }
  return text;
}


// blob方式下载文件
export function download(res, filename) {
  let blob = new Blob([res]);
  var a = document.createElement('a');
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(a);
  a.click();
  body.removeChild(a);
  window.URL.revokeObjectURL(url);
}