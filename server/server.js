const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const config = require("./config/key");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors')


const connect = mongoose.connect(config.mongoURI,
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
  
  app.use(cors())



app.use('api/mission', require('./routes/mission'))

app.get('/api/hello', (req, res)=>{
 res.send([
  {
  'index' : '1',
  'title' : 'email 인증',
  'token' : '10'
  },
  {
  'index' : '2',
  'title' : 'sms 인증',
  'token' : '10'
  },
  {
  'index' : '3',
  'title' : '여권 인증',
  'token' : '20'
  },
  {
    'index' : '4',
    'title' : 'SNS 인증',
    'token' : '50'
  },
  {
    'index' : '5',
    'title' : '주소 인증',
    'token' : '100'
  },
  {
    'index' : '6',
    'title' : '민증 인증',
    'token' : '200'
  },
  {
    'index' : '7',
    'title' : '얼굴 인증',
    'token' : '300'
  },
  {
    'index' : '8',
    'title' : '네이버 인증',
    'token' : '25'
  }
]);
});

if (process.env.NODE_ENV === "production") {

    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`))