const mongoose = require('mongoose');
const validator = require('validator');

//schema

const ads_schema = mongoose.Schema({
    ads_id:{
        type:String,
        default:"ads_"
    },
    organization:{
        type:String,
        require:[true,'Organizatin name is not mentioned']
    },
    type:{
        type:String,
        require:[true,'Ads type(video/banner) is not given']
    },
    catogory:{
        type:String,
        require:[true,'Ads catogory is not meintioned']
    },
    duration:{
        type:Number,
        default:1,
        require:[true,'Ads duration(months) is not mentioned']
    },
    price:{
        type:Number,
        require:[true,'Price is not meintioned']
    },
    ads_URL:{
        type:String,
        require:[true,'Ads Url is not meintioned'],
        validate: { 
            validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid Moive URL' 
        },
    }
});

const ads = mongoose.model('advertisement',ads_schema);

module.exports = ads;