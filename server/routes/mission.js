const express = require('express');
const router = express.Router();
const Mongodb_URI = require('../config/dev').mongoURI
const {Mission} = require('../models/Mission');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(Mongodb_URI);
var DB;

client.connect().then( res =>{
  DB = client.db('myFirstDatabase')
})

//=================================
//             Mission
//=================================


//db에서 Mission 가져오기 
router.get('/getMission', (req,res) => {
  var missions = DB.collection('missions');
  let cursor;

  if(req.query.index == null){
    cursor = missions.find({"auth":{$eq: null}})
  }else {
    cursor = missions.find({ 
      index: {$eq : parseInt(req.query.index) },
      auth:{$eq: null}
    })
  }

  let result=['a'];
  cursor.count().then(cnt =>{
    console.log(cnt);
    let arrLength=  cnt;
    if(cnt==0) {
      res.json(result);
    } else{
      cursor.each( function(err,doc){
        if (doc != null) {
          result.push(doc)
          if(result.length == arrLength){
            res.json(result)
          }
        } 
      })
    }
  }); 
})


module.exports = router;