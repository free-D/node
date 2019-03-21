//使用express构建web服务器 --11:25
const express = require('express');
const bodyParser = require('body-parser');
var user = require('./routes/user.js');
var product = require('./routes/product.js');
var shoppingcart = require('./routes/shoppingcart.js');
var app = express();
var server = app.listen(3000);
//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
//托管静态资源到public目录下
app.use(express.static('public'));
//使用路由器来管理路由
//把user路由器挂载到/user下
app.use('/user',user);
//把product路由器挂载到/product下
app.use('/product',product);
app.use('/cart',shoppingcart);