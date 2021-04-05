const express = require('express');
const router = express.Router();
const Mongodb_URI = require('../config/dev').mongoURI
const { User } = require('../models/User');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(Mongodb_URI);

var DB;


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

//search by email function
router.post('/getUser', (req,res) => {
  User.find({ email: { $regex:req.body.searchKeyword }})
  .then((row) => {
    if (!row.length) return res.status(404).send({ err: '해당 사용자의 데이터가 없습니다.' });
    res.send(row);
  })
  .catch(err => res.status(500).send(err));
})



//회원정보 저장
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



module.exports = router;