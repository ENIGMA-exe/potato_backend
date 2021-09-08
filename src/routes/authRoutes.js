require('dotenv').config();
//const express = require('express');
const {Router} = require('express');
const router = Router();
const bc = require('bcrypt');
//const cors = require('cors');


// const app = express();
// app.use(cors());

//model
const ads = require('../models/ads_model');
const API = require('../models/api_model');
const movie_details = require('../models/md_model');
const series_details = require('../models/sd_model');
const user_details = require('../models/ud_model');

//..........................ADMIN PANEL........................................

router.post('/backend_admin/:uid',async(req,res)=>{
    try {
        
        var result = await API.findOne({},'admins');
        var temp = false;
        for(var i=0; i<result.admins.length; i++){
            if(result.admins[i].uid == req.params.uid){
                if(result.admins[i].pwd == req.body.pwd){
                    temp = true;
                    break;
                }
            }
        }

        return res.status(200).send(temp);

    } catch (err) {
        res.status(422).send(err);
    }
})

//..........................API-DETAILS........................................

router.get('/api',async(req,res)=>{
    try {
        var result = await API.find();

        if(result.length == 0){
             await new API(req.body).save();
             var result = await API.find();
             res.status(200).send(result);
        }else{
            res.status(200).send(result);
        }
    } catch (error) {
        res.status(417).send(error);
    }
});

router.get('/api/:temp',async(req,res)=>{

    try {
        switch(req.params.temp){

            case "total_user":
                await API.find({},(err,arr)=>{
                    var result = arr.map((data)=>{
                        return data.total_user
                    })
                    res.status(200).send(result);
                });break;

            case "total_movies":
                await API.find({},(err,arr)=>{
                    var result = arr.map((data)=>{
                        return data.total_movies
                    })
                    res.status(200).send(result);
                });break;

            case "total_series":
                await API.find({},(err,arr)=>{
                    var result = arr.map((data)=>{
                        return data.total_series
                    })
                    res.status(200).send(result);
                });break;
            default:
                res.status(404).send("path not found") 
        }
    } catch (error) {
        res.status(422).send(error)
    }
    
})

router.post('/api', async(req,res)=>{
    try {
        var result = await API.find();

        if( result == 0){
            var result = await new API(req.body).save();
            res.status(201).send(result);
        }else{
            res.status(200).send(await API.find());
        }
        
    } catch (error) {
        //422 = Unprocessable Entity
        res.status(422).send(error);
    }
})

router.post('/api/add_admins', async(req,res)=>{
    try {
        var result = await API.updateOne(
            {id:"API_POTATO_01"},
            {$push:{admins:req.body}}
        )
        res.status(201).send(result);
    } catch (error) {
        res.status(422).send(error);
    }
})

//......................................USER-DETAILS.................................................

router.get('/user_details',async(req,res)=>{
    try {
        var result = await user_details.find();
        res.status(201).send(result);
    } catch (error) {
        //400:- bad request
        res.status(400).send(error);
    }
})

router.post('/user_details',async(req,res)=>{
    try {
       
        var user_data = new user_details(req.body);
        
        await API.find({},(err,arr)=>{
            arr.map(async (api_data)=>{

                user_data.user_id = user_data.user_id + (api_data.total_user+1).toString();

                await user_data.save(async (err,result)=>{
                    if(err){
                        if(err.name == 'MongoError' && err.code == 11000){
                            return res.status(422).send('Email Already Exist');
                        }
                        return res.status(422).send(err);
                    }else{
                        res.status(201).send('saved successfully \n');
                        await API.updateOne({id:"API_POTATO_01"},{$set:{total_user:api_data.total_user+1}});
                    }
                });

                //take it form here...
                
            })
        });

    } catch (error) {
        //422 = Unprocessable Entity
        res.status(422).send('error in saving \n'+ error);
    }
})

router.get('/user_details/:fname/:lname',async (req,res)=>{

    try {
        var result = await user_details.find({fname:req.params.fname,lname:req.params.lname},{pwd:0});
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
    
})

router.get('/user_details/:user_id',async (req,res)=>{

    try {
        var result = await user_details.findOne({user_id:req.params.user_id},{pwd:0});
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
    
})

//post-patch method to update

router.post('/patch/user_details/:user_id',async (req,res)=>{
    try {
        if(req.body.pwd != "" && req.body.pwd != undefined){
            req.body.pwd = await bc.hash(req.body.pwd,10);
        }
        await user_details.updateOne(
            {user_id:req.params.user_id},
            {$set:req.body},
            (err)=>{
                if(err){
                    if(err.name == 'MongoError' && err.code == 11000){
                        return res.status(422).send('Email Already Exist');
                    }
                    return res.status(422).send(err);
                }else{
                    res.status(201).send('Update successfully \n');
                }
            }
        );
        //res.status(200).send('successfully update \n'+ result);
    } catch (error) {
        res.status(422).send("error in update \n" + error);
    }
});

//................................SERIES-DETAILS....................................................

router.get('/series_details',async (req,res)=>{
    try {
        var result = await series_details.find();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);   
    }
})


router.get('/series_details/:series_id', async(req,res)=>{
    try {
        var result = await series_details.findOne({series_id:req.params.series_id});
        res.status(200).send(result);

    } catch (err) {
        res.status(404).send(err);
    }
})

router.get('/series_details/name/:series_name', async(req,res)=>{
    try {
        var result = await series_details.findOne({name:req.params.series_name});
        res.status(200).send(result);

    } catch (err) {
        res.status(404).send(err);
    }
})

router.post('/series_details',async(req,res)=>{
    try {
        var series_data = new series_details(req.body);
        await API.find({},(err,arr)=>{
            arr.map(async (api_data)=>{
                series_data.series_id = series_data.series_id + (api_data.total_series+1).toString();
                var result = await series_data.save();
                await API.updateOne({id:"API_POTATO_01"},{$set:{total_series:api_data.total_series+1}},{new:true});
                res.status(201).send('saved successfully');
            })
        })
    } catch (error) {
        //422 = Unprocessable Entity
        res.status(422).send('error in saving \n'+error);
    }
})

router.patch('/series_details/:series_id',async(req,res)=>{
    try {
        var result = await series_details.updateOne({series_id:req.params.series_id},{$set:req.body},{new:true});
        res.status(200).send(result);
    } catch (error) {
        res.status(422).send("series details not updated \n"+error);
    }
})

//PATCH-POST method
//using post method to update the data..
router.post('/series_details/:series_id',async(req,res)=>{
    try {
        var result = await series_details.updateOne({series_id:req.params.series_id},{$set:req.body},{new:true});
        res.status(200).send("Series Details update successfully!");
    } catch (error) {
        res.status(422).send("series details not updated \n"+error);
    }
})

//............................................MOVIES-DETAILS......................................................................................

router.get('/movies_details',async (req,res)=>{
    try {
        var result = await movie_details.find();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);   
    }
})

//find by movie id
router.get('/movie_details/:movie_id',async (req,res)=>{
    try {
        var result = await movie_details.findOne({movie_id:req.params.movie_id});
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);   
    }
})

//find by movie name
router.get('/movie_details/name/:movie_name',async (req,res)=>{
    try {
        var result = await movie_details.findOne({name:req.params.movie_name});
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);   
    }
})

router.post('/movie_details',async(req,res)=>{
    try {
        var movie_data = new movie_details(req.body);
        await API.find({},(err,arr)=>{
            arr.map(async (api_data)=>{

                movie_data.movie_id = movie_data.movie_id + (api_data.total_movies+1).toString();

                await movie_data.save(async (err,result)=>{
                    if(err){
                        if (err.name == "ValidationError") {
                            let msg = "";

                            Object.keys(err.errors).forEach((key) => {
                                msg = msg+" "+err.errors[key].message+".";
                            });

                            return res.status(400).send(msg);
                        }
                        return res.status(422).send(err);
                    }else{
                        await API.updateOne({id:"API_POTATO_01"},{$set:{total_movies:api_data.total_movies+1}},{new:true});
                        res.status(201).send('Movie saved successfully');
                    }
                });

               //taken from here....
            })
        })
    } catch (error) {
        //422 = Unprocessable Entity
        res.status(422).send('error in saving \n'+error);
    }
})

router.patch('/movie_details/:movie_id',async(req,res)=>{
    try {
        var result = await movie_details.updateOne({movie_id:req.params.movie_id},{$set:req.body},{new:true,runValidators: true});
        res.status(200).send(result);
    } catch (error) {
        res.status(422).send("movie details not updated \n"+error);
    }
})

//post-patch method to update the movie data..
router.post('/movie_details/:movie_id',async(req,res)=>{
    try {
        var result = await movie_details.updateOne({movie_id:req.params.movie_id},{$set:req.body},{new:true,runValidators: true});
        res.status(200).send("movie details updated successfully");
    } catch (error) {
        res.status(422).send("movie details not updated \n"+error);
    }
})

//......................................ADS-DETAILS.........................................................................

router.get('/ads_details',async (req,res)=>{
    try {
        var result = await ads.find();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);   
    }
})

router.post('/ads_details',async(req,res)=>{
    try {
        var ads_data = new ads(req.body);
        await API.find({},(err,arr)=>{
            arr.map(async (api_data)=>{
                ads_data.ads_id = ads_data.ads_id + (api_data.total_ads+1).toString();

                await ads_data.save(async (err,result)=>{
                    if(err){
                        if (err.name == "ValidationError") {
                            let msg = "";

                            Object.keys(err.errors).forEach((key) => {
                                msg = msg+" "+err.errors[key].message+".";
                            });

                            return res.status(400).send(msg);
                        }
                        return res.status(422).send(err);
                    }else{
                        await API.updateOne({id:"API_POTATO_01"},{$set:{total_ads:api_data.total_ads+1}},{new:true});
                        res.status(201).send('Ads saved successfully');
                    }
                });

                //taken from here..
                // await API.updateOne({id:"API_POTATO_01"},{$set:{total_ads:api_data.total_ads+1}},{new:true});
                // res.status(201).send('Ads saved successfully');
            })
        })
    } catch (error) {
        //422 = Unprocessable Entity
        res.status(422).send('error in saving \n'+error);
    }
})

router.patch('/ads_details/:ads_id',async(req,res)=>{
    try {
        var result = await ads.updateOne({ads_id:req.params.ads_id},{$set:req.body},{new:true});
        res.status(200).send(result);
    } catch (error) {
        res.status(422).send("movie details not updated \n"+error);
    }
})




module.exports = router;