var express   = require('express');
var bcrypt    = require('bcryptjs');
var jwt       = require('jsonwebtoken');

var UserModel = require('../models/usuario');
var seed      = require('../config/config').seed;

var app       = express();


app.post('/', (req, res) => {

    
    var body = req.body;
    UserModel.findOne({ email: body.email }, (err, found) =>{
        if( err ){
            return res.status(500).json({
                success: false,
                message: 'Error crítico en la base de datos'
            });
        }

        if( !found ){
            return res.status(400).json({
                success: false,
                message: 'El usuario y/o contraseña son incorrectos mail'
            });
        }

        if( !bcrypt.compareSync( body.password, found.password ) ){
            return res.status(400).json({
                success: false,
                message: 'El usuario y/o contraseña son incorrectos pass'
            });
        }

        found.password = null;
        var token = jwt.sign(
                               { user: found }, 
                                seed, 
                                { expiresIn: 14400 });

        res.status(200).json({
            success: true,
            message: 'Login correcto',
            id: found,
            token: token
        });

    });
    

    

});



module.exports = app;