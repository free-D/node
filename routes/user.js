//user模块
const express = require('express');
var router = express.Router();
//引入连接池
var pool = require('../pool.js');
//一、用户注册
router.post('/register', (req,res)=>{
  //获取表单中的数据
  //console.log(req.body);
  //在这块执行把数据插入到数据库中
  //1.检测用户名不能为空
  var $uname = req.body.uname;
  if(!$uname){
    res.send({code: 401,msg: 'uname required'});
	return;//阻止程序继续往后执行
  }
  //2.检测密码不能为空
  var $upwd = req.body.upwd;
  if(!$upwd){
    res.send({code: 402,msg: 'upwd required'});
    return;
  }
  //3.检测邮箱不能为空
  var $email = req.body.email;
  //false  '' null undefined NaN 0
  if(!$email){
    res.send({code: 403,msg: 'email required'});
	return;
  }
  //4.检测电话不能为空
  var $phone = req.body.phone;
  if($phone==''){
    res.send({code: 404,msg: 'phone required'});
	return;
  }
  var sql = `INSERT INTO xz_user VALUES(NULL,?,?,?,?,NULL,NULL,NULL)`;
  pool.query(sql,[$uname,$upwd,$email,$phone],(err,result)=>{
    if(err){
	  throw error; //抛出异常
	}
	res.send({code: 200, msg: 'register suc'});
  });
});
//二、用户登录
router.post('/login',(req,res)=>{
  //console.log(req.body);
  //1.检测用户名和密码
  var $uname = req.body.uname;
  if(!$uname){
    res.send({code: 401,msg: 'uname required'});
    return;
  }
  var $upwd = req.body.upwd;
  if(!$upwd){
    res.send({code: 402,msg: 'upwd required'});
	return;
  }
  //2.在数据库中查找用户名和密码匹配的数据
  var sql = `SELECT * FROM xz_user WHERE uname=? AND upwd=?`;
  pool.query(sql,[$uname,$upwd],(err,result)=>{
    console.log(result);
	//如果result数组长度大于0，说明登录成功，否则说明用户名或者密码错误 --16:09
	if(result.length>0){
	  res.send({code: 200,msg: 'login suc'});
	}else{
	  res.send({code: 301,msg: 'uname or upwd is error'});
	}
  })
});
//三、用户列表
router.get('/list', (req,res)=>{
  //获取提交的数据
  console.log(req.query);
  //如果页码为空，默认设置为1
  var $pno = req.query.pno;
  if(!$pno){
    $pno = 1;
  }
  //如果每页大小为空，默认设置为5
  //否则把用户输入的值转为整型
  var $pageSize = req.query.pageSize;
  if(!$pageSize){
    $pageSize = 5;
  }else{
    $pageSize = parseInt($pageSize);
  }
  //根据页码和每页大小查询用户列表
  //0,5   --17:13
  //5,5
  //10,5
  //15,5
  //开始 = (当前的页码-1)*每页大小
  var sql = `SELECT * FROM xz_user ORDER BY uid ASC LIMIT ?,?`;
  pool.query(sql,[($pno-1)*$pageSize,$pageSize],(err,result)=>{
    if(err) throw error;
	res.send(result);
  });
});
//四、用户检索
router.get('/query', (req,res)=>{
  //获取用户的编号
  var $uid = req.query.uid;
  //检测用户编号
  if(!$uid){
    res.send({code: '401', msg: 'uid required'});
	return;
  }
  //根据编号来查找对应这条数据
  var sql = `SELECT * FROM xz_user WHERE uid=?`;
  pool.query(sql,[$uid],(err,result)=>{
    res.send(result[0]);
  });
});
//五、删除用户
router.post('/delete',(req,res)=>{
  var $uid = req.body.uid;
  if(!$uid){
    res.send({code: 401, msg: 'uid required'});
	return;
  }
  var sql = 'DELETE FROM xz_user WHERE uid=?';
  pool.query(sql,[$uid],(err,result)=>{
    if(err) throw error;
	res.send({code:200,msg:'delete suc'});
  });
});
//六、修改用户
router.post('/update',(req,res)=>{
  //拿到客户端数据，分别检测数据
  var $uid = req.body.uid;
  if(!$uid){
    res.send({code:401,msg: 'uid required'});
	return;
  }
  var $user_name = req.body.user_name;
  if(!$user_name){
    res.send({code: 402, msg: 'user_name required'});
	return;
  }
  var $gender = req.body.gender;
  if(!$gender){
    res.send({code:403, msg: 'gender required'});
	return;
  }
  var $phone = req.body.phone;
  if(!$phone){
    res.send({code:404, msg: 'phone required'});
	return;
  }
  var $email = req.body.email;
  if(!$email){
    res.send({code:405, msg: 'email required'});
	return;
  }
  //更改mysql中的数据
  var sql = 'UPDATE xz_user SET user_name=?,gender=?,phone=?,email=? WHERE uid=?';
  pool.query(sql,[$user_name,$gender,$phone,$email,$uid],(err,result)=>{
    if(err) throw error;
	console.log(result);
    res.send({code:200, msg: 'update suc'});
  });
});




//导出
module.exports = router;





