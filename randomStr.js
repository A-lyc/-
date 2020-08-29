/**
 * 生成随机的字符串
 * */
function randomString() {
  //16位
  let len = 16;
  //随机值
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  //随机的长度
  var maxPos = $chars.length;
  //暂时定义为空的
  var str = '';
  //循环拼接
  for (var i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}
// 到处命名的类
  module.exports =  {
    randomString:randomString
  }

