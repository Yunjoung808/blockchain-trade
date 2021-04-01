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


router.get('/getMission', (req, res) => {
  Mission.find()
    .then((row) => {
      if (!row.length) return res.status(404).send({ err: 'not found' });
      res.send(row);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;