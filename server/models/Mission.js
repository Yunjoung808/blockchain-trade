const { Binary } = require('mongodb');
const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb+srv://asdw25:12345@cluster0.03lxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 autoIncrement.initialize(connection);


const Schema = mongoose.Schema;

let missionSchema = Schema({

    index:{ type: Number, required: true, unique: true },
    title:{
        type: String,
        require: true
    },
    token:{
        type: String,
        require: true
    },
    authDone:{
        type: String,
        require:true
    }
    
},{sysdate:true});

missionSchema.plugin(
    autoIncrement.plugin,
    { model : 'Mission', field : 'index', startAt : 1,increment : 1 }
);

module.exports =  {
    Mission : connection.model('Mission', missionSchema)
}