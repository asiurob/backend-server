var express   = require('express');
var bcrypt    = require('bcryptjs');
var jwt       = require('jsonwebtoken');

var UserModel = require('../models/usuario');
var seed      = require('../config/config').seed;


var app       = express();

/*==================================
CON GOOGLE
===================================*/
const CLIENT_ID        = require('../config/config').GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client           = new OAuth2Client(CLIENT_ID);

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    return payload;
}

app.post('/google', async ( req, res ) => {

    var token = req.body.token;
    
    var googleUser = await verify( token )
                    .catch( e => {
                        return res.status(403).json({
                            success:true,
                            message: 'Token inválido',
                            error: e
                        });
                    });

    UserModel.findOne( { email: googleUser.email }, ( err, data ) => {

        if( err ){
            return res.status( 400 ).json({
                success: false,
                message: 'Error interno en la base de datos'
            })
        }

        if( data ){
            if( !data.google ){
                return res.status( 403 ).json({
                    success: false,
                    message: 'Se debe usar su autenticación normal'
                })  
            }else{
                var token = jwt.sign(
                    { user: data }, 
                     seed, 
                     { expiresIn: 14400 });

                res.status(200).json({
                success: true,
                message: 'Login correcto',
                id: data,
                token: token
                });
            }
        }else{

            var usuario = new UserModel();

            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.image = googleUser.picture;
            usuario.role = 'ADMIN_ROLE';
            usuario.google = true;
            usuario.password = 'ROFLMAO';

            usuario.save( (err, dataSave) => {
                var token = jwt.sign(
                    { user: dataSave }, 
                     seed, 
                     { expiresIn: 14400 });

                return res.status(200).json({
                success: true,
                message: 'Login correcto',
                id: dataSave._id,
                token: token
                });
            });
        }

    });

})

/*==================================
NORMAL
===================================*/

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