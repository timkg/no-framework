function wrapMethod (obj, methodName, callback) {
  var originalMethod = obj[methodName];
  obj[methodName] = function () {
    var res = originalMethod.apply(obj, arguments);
    callback(res);
    return res;
  }
}

module.exports = wrapMethod;
