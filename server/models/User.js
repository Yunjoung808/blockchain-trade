const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb+srv://asdw25:12345@cluster0.03lxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

autoIncrement.initialize(connection);

const Schema = mongoose.Schema;

let userSchema = Schema({

  
    googleId:{
        type: String,
        require: true
    },
    imageUrl:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require:true
    },
    name:{
        type: String,
        require:true
    },
    familyName:{
        type: String,
        require:true
    },
    givenName:{
        type: String,
        require:true
    },
    authEmail:{
        type: String,
        require: true
    },
    walletAddress:{
        type: String,
        require: true
    }
    
},{sysdate:true});



module.exports =  {
    User : connection.model('User', userSchema)
}