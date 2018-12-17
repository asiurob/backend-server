/*==================================
VERIFICAR TOKEN
===================================*/
var jwt  = require('jsonwebtoken');
var seed = require('../config/config').seed;

exports.checkToken = function( req, res, next ){

    var token = req.query.token;
    jwt.verify( token, seed, ( err, decoded ) => {

        if( err ){
            return res.status( 401 ).json({
                success: false,
                message: 'Token no válido o expirado',
                errors: err
            });
        }

        req.user = decoded.user;

        next();

    });

}
