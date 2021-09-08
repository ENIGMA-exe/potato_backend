const mongoose = require('mongoose');
const validator = require('validator');

//schema
const md_schema = mongoose.Schema({
    movie_id:{
        type:String,
        default:"movie_"
    },
    name:{
        type:String,
        require:[true,'name not present']
    },
    director:{
        type:String,
        require:[true,'Director name is not present.']
    },
    release_year:{
        type:Number,
        require:[true,'Released year is not mentioned.']
    },
    imdb:{
        type:String,
        require:[true,'IMDB not maintioned']
    },
    description:{
        type:String,
        require:[true,'Description has not meintioned.']
    },
    // genres:[
    //     {
    //         gen:{type:String}
    //     }
    // ],
    genres:{
        type:Array,
        default:[{gen:"none"}]
    },
    banner_URL:{
        type:String,
        require:[true,'Banner link is not given'],
        validate: { 
            validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid Banner URL' 
        }
    },
    movie_URL:{
        type:String,
        require:[true,'Movie link is not given'],
        validate: { 
            validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid Moive URL' 
        },
    }
});

const movie_details = mongoose.model('movie_detail',md_schema);
module.exports = movie_details;
