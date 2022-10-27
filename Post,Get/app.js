var express = require('express')
var app = express()

app.set('view engine','ejs')//html template을 ejs로 사용
app.set('views','./views')//views폴더를 ./views폴더로 지정

app.get('/',(req,res)=>{
    res.send("MAin page")
})

app.get('/free',(req,res)=>{
    res.render("free")
})
app.use=(express.static(__dirname + '/public'))
app.get('/ejs_test',(req,res)=>{
    res.render("ejs_test",{
        name:req.query.name,
        title:req.query.title,
        content:req.query.content,
    })
})

var bodyParser = require('body-parser'); 
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// app.post('/ejs_test', urlencodedParser, (req, res) => {
//     obj = {
//         name: req.body.name,
//         title: req.body.title,
//         content: req.body.content
//     }
    
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
//     //res.end(JSON.stringify(obj)); //json객체로 전달
    
//     var html = `
//         <table border="1">
//             <tr>
//                 <td>이름</td>
//                 <td>${obj.name}</td>
//             </tr>
//             <tr>
//                 <td>제목</td>
//                 <td>${obj.title} </td>
//             </tr>
//             <tr>
//                 <td>내용</td>
//                 <td>${obj.content} </td>
//             </tr>
//         </table>`;
    
    //res.end(`<h1>${obj.name}</h1>`);
//     res.end(html);   //html로 표현
//     console.log(obj)
// });

var server = app.listen(5000,function(){
    var host =server.address().address
    var port = server.address().port
    console.log('서버 시작 http://%s:%s',host,port)
})