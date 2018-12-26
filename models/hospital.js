var mongo  = require('mongoose');
var Schema = mongo.Schema;

var hospitalSchema = new Schema({

    nombre:  { type: String, required: [true, 'El nombre del hospital es necesario'] },
    img:     { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    created: {
        by:  { type: Schema.Types.ObjectId, ref: 'Usuario' },
        date:{ type: Date, required: [true, 'Fecha de creación'] } 
    }
},  {collection: 'hospitales'});

module.exports = mongo.model('Hospital', hospitalSchema);