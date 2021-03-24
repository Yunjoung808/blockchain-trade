const express = require('express');
const router = express.Router();
const Mongodb_URI = require('../config/dev').mongoURI
const {Mission} = require('../models/Mission');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(Mongodb_URI);
var DB;
let getNextSequence;

client.connect().then( res =>{
  DB = client.db('DM_Plus')
  console.log(DB)
  
  getNextSequence = async function(){
    let pd = DB.collection('Mission')
    var ret = await pd.findOneAndUpdate(
      { _id: "index" },
      { $inc: { seq: 1 } },
      {
        returnOriginal: false
      })
    return ret.value.seq;
  }
  console.log(getNextSequence)
})

//=================================
//             Mission
//=================================


//db에서 Mission 가져오기 
router.get('/getMission', (req,res) =>{
  var missions = DB.collection('Mission');
  let cursor;
  if(req.query.index){
    cursor = missions.find({index:parseInt(req.query.index)});
  }
  else {
    cursor =missions.find({});
  }
  
  let result=[];
  cursor.count().then(cnt =>{
    let arrLength=cnt;
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