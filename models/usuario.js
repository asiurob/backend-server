var mongo = require('mongoose');
var schema = mongo.Schema;

var usuarioSchema = new schema({

    nombre:   { type: String, required: [true, 'El nombre es necesario'] },
    email:    { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El correo es necesario'] },
    image:    { type: String},
    role:     { type: String, required: true, default: 'USER_ROLE' }

});

module.exports = mongo.model('Usuario', usuarioSchema);