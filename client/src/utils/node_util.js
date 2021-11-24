var data = require('./archived_timezones.json');
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块

function closure() {
  let cnt = 1;
  return function nextId() {
    return parseInt(cnt++).toString(16);
  };
}
const generateKey = closure();
for (const item of data) {
  // item.key = generateKey() + '=' + item.offset.toString();
  delete item.value;
  delete item.abbr;
  delete item.isdst;
  delete item.utc;
}

//把data对象转换为json格式字符串
var content = JSON.stringify(data);

//指定创建目录及文件名称，__dirname为执行当前js文件的目录
var file = path.join(__dirname, './timezone.min.json');

//写入文件
fs.writeFile(file, content, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('文件创建成功，地址：' + file);
});
