var express = require('express');
var upload  = require('express-fileupload');
var fs      = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app = express();

app.use( upload() );
//Rutas
app.put('/:tipo/:id', ( req, res, next ) => {

    var type = req.params.tipo;
    var id   = req.params.id;
    var cols = [ 'usuarios', 'hospitales', 'medicos' ];

    if( cols.indexOf( type ) === -1 ){

        return res.status( 400 ).json({
            success:false,
            message: 'La colección donde se almacenará no es válida'
        });

    }
    

    if( !req.files ){

        return res.status( 400 ).json({
            success:false,
            message: 'No se envío el archivo a subir'
        });
    }

    var file   = req.files.image;
    var ext    = file.name.split('.');
    var getExt = ext[ ext.length - 1 ].toLowerCase();

    var allowedExt = [ 'png','jpg', 'jpeg', 'gif', 'svg' ];

    if( allowedExt.indexOf( getExt )  === -1 ){

        return res.status( 400 ).json({
            success:false,
            message: 'El tipo de archivo no es válido, únicamente ' + allowedExt.join(', '),
            currExt: getExt
        });

    }

    var fileName = `${ id }.${ getExt }`;

    var path = `./uploads/${ type }/avatar-${ fileName }`;
    file.mv( path, (err) => {

        if( err ){
            return res.status( 500 ).json({
                success:false,
                message: 'Error al subir archivo al servidor',
                error: err
            });
        } 

        uploadType( type, id, fileName, res );

    });

    



});


function uploadType( type, id, fileName, res ){

    if( type === 'usuarios' ){

        Usuario.findById( id, ( err, data ) => {

            if( err ){

                return res.status( 400 ).json({
                    success:false,
                    message: 'El usuario no existe'
                });
            }

            var oldPath = './uploads/usuarios/avatar' + fileName;

            if( fs.existsSync( oldPath ) ){
                fs.unlink( oldPath );
            }

            data.img = fileName;
            data.save( ( err, dataUp ) => {

                if( err ){
                    return res.status( 500 ).json({
                        success:false,
                        message: 'No fue posible actualizar el avatar del usuario',
                        error: err
                    });
                }

                return res.status( 200 ).json({
                    success: true,
                    message: 'Usuario actualizado'
                });

            });
        });

        return;
    }

    if( type === 'medicos' ){

        Medico.findById( id, ( err, data ) => {

            if( err ){

                return res.status( 400 ).json({
                    success:false,
                    message: 'El medico no existe'
                });
            }

            var oldPath = './uploads/medicos/avatar' + fileName;

            if( fs.existsSync( oldPath ) ){
                fs.unlink( oldPath );
            }

            data.img = fileName;
            data.save( ( err, dataUp ) => {

                if( err ){
                    return res.status( 500 ).json({
                        success:false,
                        message: 'No fue posible actualizar el avatar del médico',
                        error: err
                    });
                }

                return res.status( 200 ).json({
                    success: true,
                    message: 'Médico actualizado'
                });

            });
        });
    }

    if( type === 'hospitales' ){

        Hospital.findById( id, ( err, data ) => {

            if( err ){

                return res.status( 400 ).json({
                    success:false,
                    message: 'El hospital no existe'
                });
            }

            var oldPath = './uploads/hospitales/avatar' + fileName;

            if( fs.existsSync( oldPath ) ){
                fs.unlink( oldPath );
            }

            data.img = fileName;
            data.save( ( err, dataUp ) => {

                if( err ){
                    return res.status( 500 ).json({
                        success:false,
                        message: 'No fue posible actualizar el avatar del hospital',
                        error: err
                    });
                }

                return res.status( 200 ).json({
                    success: true,
                    message: 'Hospital actualizado'
                });

            });
        });

    }



}

module.exports = app;