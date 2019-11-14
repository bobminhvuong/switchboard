var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
const axios = require('axios');
var app = express();
var cors = require('cors');
var http = require("http");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())

app.post('/api/nhanvien/login', function(req,res){
   axios.post('http://services.quanlyshop.vn/api/nhanvien/login',req.body).then(r=>{
        if(r) res.send(r.data);    
   }).catch(r=>{
        if(r) res.send(r.response.data);  
   })
});

app.listen(3000);
console.log(`serve is listening port ${3000}`)