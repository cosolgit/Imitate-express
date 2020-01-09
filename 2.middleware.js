//中间件   use
//中间件  执行路由之前 要干一些处理工作就可以采用中间件
let express=require('./express');
let app=express();

//use方法第一个参数不写默认是/
//中间件扩展一些方法

app.use(function(req,res,next){
    console.log('middleware1');
    next();
})
app.use(function(req,res,next){
    console.log('middleware2');
    next();
})



app.get('/name',(req,res)=>{
    res.setHeader('Content-type','text/html;charset=utf-8')
    res.end('yjx晕了')
})
app.get('/age',(req,res)=>{
    res.setHeader('Content-type','text/plain;charset=utf-8');
    //express默认封装了一些中间件
    
    console.log(req.path);
    console.log(req.hostname);
    console.log(req.query);
    res.end('年龄19岁')
})

//错误中间件(4个参数)
app.use(function(err,req,res,next) {
    
   
})

app.listen(8080,()=>{
    console.log(`server start 8080`);
})
