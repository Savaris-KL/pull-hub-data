/*
 * @Descripttion:
 * @version: v1
 * @Author: Edison Mo
 * @Date: 2020-07-12 19:45:36
 * @LastEditors: Edison Mo
 * @LastEditTime: 2020-07-12 19:46:08
 */

/**
 * String
 */

String.prototype.textFilter = function () {
  var pattern = new RegExp("[`/~%@#^=''~@#&——‘”“'*]"); //[]内输入你要过滤的字符，这里是我的
  var rs = "";
  for (var i = 0; i < this.length; i++) {
    rs += this.substr(i, 1).replace(pattern, "");
  }
  return rs;
};
