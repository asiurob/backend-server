var express = require('express');
var bcrypt  = require('bcryptjs');
var mdAuth  = require('../middlewares/auth');

var app = express();

var Hospital = require('../models/hospital');


/*==================================
OBTENER LOS HOSPITALES
===================================*/
app.get('/', ( req, res ) => {

    Hospital.find({})
    .populate('usuario', 'nombre email')
    .exec(
        ( err, data ) => {

            if( err ){
                return res.status( 500 ).json({
                    success: false,
                    message: 'Error fatal en la base de datos'
                });
            }

            res.status( 200 ).json({
                success: true,
                data: data
            })

        }
    )
});

/*==================================
ALTA DE UN HOSPITAL
===================================*/

app.post( '/', mdAuth.checkToken, ( req, res ) => {

    //Recuperar la información que se envió
    var body = req.body; 
    var usr  = req.user._id;

    //Llamar al esquema de hospital
    var hospital = new Hospital({
        nombre:  body.nombre,
        usuario: usr,
        created: {
            by:  usr,
            date: new Date() 
        }
    });

    //Salvar el hospital
    hospital.save( ( err, data ) => {

        //Validar si hubo un error a nivel de DB
        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error fatal en la base de datos',
                error: err
            });
        }

        //Si no hubo error retornar el JSON con la información
        res.status( 201 ).json({
            success:true,
            data: data   
        });

    });

});

/*==================================
ACTUALIZAR UN HOSPITAL
===================================*/

app.put( '/:id', mdAuth.checkToken, ( req, res ) => {

    //Recuperar la información que se envió
    var body = req.body; 

    //El ID del hospital enviado
    var id   = req.params.id;

    //Validar primero que exista
    Hospital.findById( id, ( err, data ) => {

        //Validar errores a nivel de base de datos
        if( err ){

            return res.status( 500 ).json({
                success: false,
                message: 'Error fatal en la base de datos',
                error: err
            });

        }

        //Validar que exista un registro con el ID
        if( !data ){

            return res.status( 400 ).json({
                success: false,
                message: `El Hospital ${id} no existe en la base de datos`,
                error: err
            });

        }

        data.nombre = body.nombre;
        
        data.save( ( err, info ) => {

            if( err ){

                return res.status( 500 ).json({
                    success: false,
                    message: 'Error fatal en la base de datos',
                    error: err
                });

            }

            res.status( 200 ).json({
                success: true,
                message: `Se actualizó correctamente el hospital`
            });

        });
    });

});

app.delete( '/:id', mdAuth.checkToken, ( req, res ) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove( id, ( err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error fatal en la base de datos',
                error: err
            });
        }

        if( !data ){
            return res.status( 500 ).json({
                success: false,
                message: 'No fue posible eliminar el hospital, no existe',
                error: err
            });
        }

        res.status( 200 ).json({
            success: true,
            message: `Se eliminó el hospital ${ data.nombre } de la base de datos`
        })

    });


});

module.exports = app;