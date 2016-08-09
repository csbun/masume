import File from './file';

const path = require('path');

const REG_REQUIRE = /^\s*require\(\s*(['"])?([^'"]+)\1\s*\)\s*;?\s*$/;
//                       require\(   ($1  ) ($2   )     \)

function isString(value) {
  return typeof value === 'string';
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

function stepIn(fileObj, fullpath) {
  if (isObject(fileObj)) {
    const newFileObj = {};
    Object.keys(fileObj).forEach(key => {
      newFileObj[key] = stepIn(fileObj[key], fullpath);
    });
    return newFileObj;
  } else if (isArray(fileObj)) {
    return fileObj.map(val => stepIn(val, fullpath));
  } else if (isString(fileObj) && REG_REQUIRE.test(fileObj)) {
    // support require(xxx)
    const matches = REG_REQUIRE.exec(fileObj);
    const requiredFilePath = path.resolve(path.dirname(fullpath), matches[2]);
    return loadFileContext(requiredFilePath);
  }
  return fileObj;
}

export default function loadFileContext(filePath) {
  const file = new File(filePath);
  return stepIn(file.ctx, file.fullpath);
}
