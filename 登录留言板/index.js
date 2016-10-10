const exp = require('express');
const fs = require('fs');
const multer = require('multer');
const bs = require('body-parser');
const externalip = require('externalip');

const app = exp();
const form = multer();

app.use(exp.static('www'));

app.use(bs.urlencoded({extended: false}));


app.get('/Jqindex/get', function (req, res) {
    fs.readFile('message.txt', function (err, data) {
        var arr = data.toString().trim();
        var strObj = JSON.parse('[' + arr + ']');
        console.log(strObj);
        console.log(strObj[1]);
        res.status(200).send(strObj);
    })
})
app.post('/Jqindex', function (req, res) {
    var nowIp;
    externalip(function (err, ip) {
        nowIp = ip;
        var header = req.body.header;
        var content = req.body.content;
        var reg1 = /</mg;
        var reg2 = />/mg;
        console.log('内容'+content);
        content = content.replace(reg1, '&lt;')
        content = content.replace(reg2, '&gt;')
        var date = new Date();
        var toDate = '发布日期：' + date.toLocaleDateString() + '发布时间：' + date.toLocaleTimeString();
        var str = [header, content, toDate, nowIp];
        var strObj = {"header": header, "content": content, "date": toDate, "ip": nowIp}
        res.status(200).send(str);
        var arr = JSON.stringify(strObj);
        fs.readFile('message.txt', function (err, data) {
            var douhao = (data.toString().trim().length > 0) ? ',' : '';
            fs.appendFile('message.txt', douhao + arr, function () {
            });
        })

    })
})

app.post('/jqpost', function (req, res) {
    console.log('服务器连通');
    var user = req.body;
    var userStr = JSON.stringify(user);
    fs.readFile('user.txt', function (err, data) {
        var usersStr = data.toString().trim();
        var userArr = JSON.parse('[' + usersStr + ']')
        var isIn = false;
        userArr.forEach(function (ele, ind) {
            if (user.account == ele.account) {
                isIn = true;
            }
        });
        // 判断该用户存在
        if (isIn) {
            res.status(200).send(0)
        } else {
            var douhao = usersStr.length > 0 ? ',' : '';
            // 向文件中追加内容
            // 参数1：追加的文件
            // 参数2：要追加的内容
            // 参数3：回调
            fs.appendFile('user.txt', douhao + userStr, function (err) {
                if (err) {
                    res.status(200).send(0)
                } else {
                    res.status(200).send('<p style="color:green">恭喜你' + ' ' + req.body.account + ' ' + '注册成功</p>')
                }
            })
        }
    })
})

app.post('/Jqindex/post', function (req, res) {
    console.log('服务器连通')
    var user = req.body;
    fs.readFile('user.txt', function (err, data) {
        var str = data.toString().trim();
        var obj = JSON.parse('[' + str + ']');
        console.log(obj);
        var isIn = obj.some(function (ele, ind, arr) {
            return (user.account == ele.account && user.password == ele.password)
        })
        if (isIn) {
            res.status(200).send('<p style="color:green">登陆成功</p>')
        } else {
            res.status(200).send(0)
        }
    })
})

app.listen(3000, function () {
    console.log('恭迎圣驾')
})