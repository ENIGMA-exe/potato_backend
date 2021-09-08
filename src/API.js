const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const hbs = require('hbs');
const path = require('path');

const port = process.env.PORT || 3135;

//db
const mongo_conn = require('./db/db_config.js');
mongo_conn();


const app = express();

app.set("view engine","hbs");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/views"));
app.use(authRoutes);

app.get('/',(req,res)=>{
    res.render('admin_dashbord.hbs',{
        hbs_path:path.join(__dirname,'../')+'views'
    });
    //res.render(path.join(__dirname,'../')+'/views/admin_dashbord.hbs');
})


app.listen(port,(req,res)=>{
    console.log(`server running @ localhost:${port}`);
})