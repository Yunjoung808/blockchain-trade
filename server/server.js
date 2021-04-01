const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const config = require("./config/key");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');


const connect = mongoose.connect(config.mongoURI,
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
  
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)

//Mission
app.use('/api/mission', require('./routes/mission'))

//User
app.use('/api/user', require('./routes/user'))


if (process.env.NODE_ENV === "production") {

    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`))