const express = require('express');
const router = express.Router();
const Mongodb_URI = require('../config/dev').mongoURI
const { Company } = require('../models/Company');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(Mongodb_URI);
var DB;

client.connect().then( res =>{
  DB = client.db('myFirstDatabase')
  console.log(DB)
})


//=================================
//             Company
//=================================


router.post('/',(req,res) => {
    const companys = new Company(req.body)
    const companySchema = new companySchema(req.body)
    companys.save((err)=>{
      if(err) return res.status(400).json({success:false, err})
      return res.status(200).json({success:true})
    })
  })

router.post('/register', (req,res) => {

    var companys = DB.collection('companys');

    companys.insertOne({
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