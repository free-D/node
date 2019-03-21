const express = require('express');
var router = express.Router();
var pool = require('../pool.js');
//1.商品添加
router.post('/add',(req,res)=>{
  var obj = req.body;
  //键值对
  var i = 400;
  for(var key in obj){
	i++;
    if(!obj[key]){
	  res.send({code:i, msg:`${key} required`});
	  return;
	}
  }
  //添加iid属性到对象中
  obj.iid = null;
  //添加到数据库
  var sql = `INSERT INTO xz_shoppingcart_item SET ?`;
  pool.query(sql,[obj],(err,result)=>{
    if(err) throw err;
	res.send({code:200, msg:'add suc'});
  });
});
//2.商品删除
router.post('/delete',(req,res)=>{
  //检测为空？
  var $iid = req.body.iid;
  //删除数据
  var sql = 'DELETE FROM xz_shoppingcart_item WHERE iid=?';
  pool.query(sql,[$iid],(err,result)=>{
    if(err) throw err;
	res.send({code:200,msg:'delete suc'});
  });
});

module.exports = router;