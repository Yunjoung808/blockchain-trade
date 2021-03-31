const express = require('express');
const router = express.Router();
const Mongodb_URI = require('../config/dev').mongoURI
const { User } = require('../models/User');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(Mongodb_URI);
var DB;
let getNextSequence;


client.connect().then( res =>{
  DB = client.db('myFirstDatabase')
  console.log(DB)
})


//=================================
//             User
//=================================


router.post('/',(req,res) => {
    const users = new User(req.body)
    const userSchema = new userSchema(req.body)
    users.save((err)=>{
      if(err) return res.status(400).json({success:false, err})
      return res.status(200).json({success:true})
    })
  })

router.post('/register', (req,res) => {

    var users = DB.collection('users');

    users.insertOne({
        googleId: req.body.googleId,
        imageUrl: req.body.imageUrl,
        email: req.body.email,
        name: req.body.name,
        familyName: req.body.familyName,
        givenName: req.body.givenName,
    }).then ((data) => {
        res.json({success:true, msg:data})
    })
})

router.get('/getUser', (req,res) => {
    var users = DB.collection('users');
    let cursor;

    if(req.query.index){
        cursor = users.find({index:parseInt(req.query.index)});
    }else{
        cursor = users.find({});
    }

})


module.exports = router;