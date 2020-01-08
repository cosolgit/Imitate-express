let express=require('./express');

//app 监听函数
let app=express();

//RESTFul API 根据方法名的不同 做对应的资源处理
app.get('/name',(req,res)=>{
    res.end('yjx')
})
app.post('/name',(req,res)=>{
    res.end('post name ')
})




//all代表的是匹配所有的方法 *代表匹配所有的路径
app.all('*',function(req,res){
    res.end(req.method+' user');
})

app.listen(3000,function(){
    console.log(`server start 3000`);
});