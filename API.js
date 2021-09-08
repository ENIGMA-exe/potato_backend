const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const hbs = require('hbs');
const path = require('path');
const favicon = require('serve-favicon');

const port = process.env.PORT || 3135;

//db
const mongo_conn = require('./src/db/db_config');
mongo_conn();


const app = express();

app.set("view engine","hbs");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/views"));
app.use(authRoutes);
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')));

app.get('/',(req,res)=>{
    var ApiEndPoint = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('admin_dashbord.hbs',{
        ApiEndPoint:ApiEndPoint
    });
})


app.listen(port,(req,res)=>{
    console.log(`server running @ localhost:${port}`);
})