const express = require('express')

require('dotenv').config({path: 'mysql/.env'})

const mysql = require('./mysql')
const ejs = require('ejs')
const app = express();


app.set('view engine', 'ejs')


app.use(express.json()) 
app.use(express.urlencoded({extended: true})); 

app.use(express.json({
    limit: '50mb'
}))

app.listen(3000, () => {
    console.log("Server Started port 3000...")
});

app.get('/', function(req, res){
    res.render('buy')
});

app.post('/result', async(req, res) => {
    
    obj = {
        name: req.body.name,
        product: req.body.product,
        buytime: new Date()
    }
    
    req.body.param = obj
    const result = await mysql.query('customerInsert', req.body.param);
    const purchase = await mysql.query('customerList');
    const obj2 = []
    for(var i=0;i<purchase.length;i++)
    {
        obj2[i] = {
            name: purchase[i].name,
            product: purchase[i].product,
            buytime: purchase[i].buytime
        }
    }
    res.render('result',{data:obj2});
});


