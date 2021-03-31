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
router.get('/getMission', () => {
  var missions = DB.collection('missions');
  let cursor;

  cursor = missions.find()
                  .sort({
                    "index":1
                  })
                  .toArray(function(err, items){
                    console.log(itmes);
                    db.close();
                    callback(null, 'find ok...', items);
                  });
  
})

module.exports = router;