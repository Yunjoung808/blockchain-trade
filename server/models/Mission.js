const { Binary } = require('mongodb');
const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb+srv://asdw25:12345@cluster0.03lxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 autoIncrement.initialize(connection);


const Schema = mongoose.Schema;

let missionSchema = Schema({

    index:{ type: String, required: true, unique: true },
    title:{
        type: String,
        require: true
    },
    token:{
        type: String,
        require: true
    },
    auth:{
        type: String,
        require:true
    }
    
},{sysdate:true});

module.exports =  {
    Mission : connection.model('Mission', missionSchema)
}