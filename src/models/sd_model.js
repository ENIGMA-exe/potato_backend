const mongoose = require('mongoose');
const validator = require('validator');

//schema
const sd_schema = mongoose.Schema({
    series_id:{
        type:String,
        default:'series_',
        unique:true
    },
    name:{
        type:String,
        require:[true,'name not mentioned'],
    },
    director:{
        type:String,
        require:[true,'director_name not maintioned']
    },
    release_year:{
        type:Number,
        require:[true,'Release year is not mentioned']
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
    total_episodes:{
        type:Number,
        require:[true,'Total no. of episodes is not mentioned']
    },
    banner_URL:{
        type:String,
        require:[true,'Banner link is not given'],
        validator(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid URL');
            };
        }
    },
    episodes:[
        {
            episode_no:{type:Number},
            episode_name:{type:String},
            episode_URL:{
                type:String,
                validator(value){
                    if(!validator.isURL(value)){
                        throw new Error('Invalid URL');
                    }
                }
            }
        }
    ]

});

const series_details = mongoose.model('series_detail',sd_schema);
module.exports = series_details;