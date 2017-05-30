// floder:string(image resource path)
var floder = '';

if(!floder){
    console.error("please assign resource path first in 'index.js'!");
    return false;
}
var fs = require('fs');

var async = function(arr, callback1, callback2) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return callback2(new Error('first argument must be array'));
    }
    if (arr.length === 0)
        return callback2(null);
    (function walk(i) {
        if (i >= arr.length) {
            return callback2(null);
        }
        callback1(arr[i], function() {
            walk(++i);
        });
    })(0);
}
var listFiles = function(dir, callback) {
    var filesArr = [];
    (function dir(dirpath, fn) {
        var files = fs.readdirSync(dirpath);
        async(files, function(item, next) {
            var info = fs.statSync(dirpath + item);
            if (info.isDirectory()) {
                dir(dirpath + item + '/', function() {
                    next();
                });
            } else {
                filesArr.push(dirpath + item);
                callback && callback(dirpath + item);
                next();
            }
        }, function(err) {
            !err && fn && fn();
        });
    })(dir);
    return filesArr;
}
var list = listFiles(floder).map(function(file, index) {
    return {
        id: 'img' + ((index < 10) ? ('0' + index) : index),
        src: file
    };
});
fs.writeFile("./images-resource.json", JSON.stringify(list), function(err) {
    if (err) throw err;
    console.log("write successful");
});

