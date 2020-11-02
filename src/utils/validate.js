 /**
  * @param {string} path
  * @returns {Boolean}
  */
 export function isExternal(path) {
     return /^(https?:|mailto:|tel:)/.test(path)
 }

 /**
  * @param {string} str
  * @returns {Boolean}
  */
 export function validUsername(str) {
     const valid_map = ['admin', 'editor']
     return valid_map.indexOf(str.trim()) >= 0
 }

 /**
  * @param {string} url
  * @returns {Boolean}
  */
 export function validURL(url) {
     const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
     return reg.test(url)
 }

 /**
  * 校验是否为小写字母
  * @param {string} str
  * @returns {Boolean}
  */
 export function validLowerCase(str) {
     const reg = /^[a-z]+$/
     return reg.test(str)
 }

 /**
  * 校验是否为大写字母
  * @param {string} str
  * @returns {Boolean}
  */
 export function validUpperCase(str) {
     const reg = /^[A-Z]+$/
     return reg.test(str)
 }

 /**
  * 校验是否为字母
  * @param {string} str
  * @returns {Boolean}
  */
 export function validAlphabets(str) {
     const reg = /^[A-Za-z]+$/
     return reg.test(str)
 }

 /**
  * 校验是否为邮箱
  * @param {string} email
  * @returns {Boolean}
  */
 export function validEmail(email) {
     const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     return reg.test(email)
 }

 /**
  * 校验是否为手机号码
  * @param {string} phone 
  */
 export function validMobile(phone) {
     const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
     return reg.test(phone)
 }
 /**
  * 校验是否为座机号
  * @param {string} phone 
  */
 export function validPhone(phone) {
     const reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
     return reg.test(phone)
 }

 /**
  * 校验是否为正整数
  * @param {string} number 
  */
 export function validNumber(number) {
     const reg = /^\+?[1-9][0-9]*$/
     return reg.test(number)
 }
 /**
  * 
  * 校验是否为两位小数
  * @param {string} number 
  */
 export function validFloatNumber(number) {
     const reg = /^(?!0+$)(?!0*\.0*$)\d{1,8}(\.\d{1,2})?$/
     return reg.test(number)
 }

 /**
  * @param {string} path
  * @returns {Boolean}
  */
 export function isImages(type) {
     return /^image\/(jpeg|png|jpg|gif)$/.test(type);
 }