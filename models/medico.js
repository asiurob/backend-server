var mongo = require('mongoose');
var Schema = mongo.Schema;


var medicoSchema = new Schema({

    nombre:   { type: String, required:[ true, 'El nombre del médico es necesario' ] },
    img:      { type: String },
    usuario:  { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true }

}, {collection: ',medicos'});


module.exports = mongo.model( 'Medico', medicoSchema );