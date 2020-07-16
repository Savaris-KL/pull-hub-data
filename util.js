/*
 * @Descripttion:
 * @version: v1
 * @Author: Edison Mo
 * @Date: 2020-07-12 17:42:35
 * @LastEditors: Edison Mo
 * @LastEditTime: 2020-07-15 14:03:53
 */
const fs = require("fs");
const path = require("path");

module.exports.findFileRecursively = function findFileRecursively(
  targetDir,
  fileName
) {
  const files = fs.readdirSync(targetDir);
  const exists = fs.existsSync(`${targetDir}/${fileName}`);
  if (exists) {
    return true;
  } else {
    return files.some((file) => {
      const stat = fs.statSync(`${targetDir}/${file}`);
      if (stat.isDirectory()) {
        return findFileRecursively(`${targetDir}/${file}`, fileName);
      }
      return false;
    });
  }
};

module.exports.deleteDirRecursively = function deleteDirRecursively(
  filePath,
  callback
) {
  // 先判断当前filePath的类型(文件还是文件夹,如果是文件直接删除, 如果是文件夹, 去取当前文件夹下的内容, 拿到每一个递归)
  fs.stat(filePath, function (err, stat) {
    if (err) return console.log(err);
    if (stat.isFile()) {
      fs.unlink(filePath, callback);
    } else {
      fs.readdir(filePath, function (err, data) {
        if (err) return console.log(err);
        let dirs = data.map((dir) => path.join(filePath, dir));
        let index = 0;
        !(function next() {
          // 此处递归删除掉所有子文件 后删除当前 文件夹
          if (index === dirs.length) {
            fs.rmdirSync(filePath, callback);
          } else {
            deleteDirRecursively(dirs[index++], next);
          }
        })();
      });
    }
  });
};

module.exports.promiseForEach = function (arr, cb) {
  let realResult = [];
  let result = Promise.resolve();
  arr.forEach((a, index) => {
    result = result.then(() => {
      return cb(a).then((res) => {
        realResult.push(res);
      });
    });
  });

  return result.then(() => {
    return realResult;
  });
};

module.exports.readDirRecursively = function readDirRecursively(path) {
  const list = fs.readdirSync(path);
  let ret = [];
  list.forEach((file) => {
    const stat = fs.statSync(`${path}/${file}`);
    if (stat.isDirectory()) {
      const dir = file;
      const files = readDirRecursively(`${path}/${dir}`);
      ret = ret.concat(files);
    } else {
      ret.push(`${path}/${file}`);
    }
  });

  return ret;
};
