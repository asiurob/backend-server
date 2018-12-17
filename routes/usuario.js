var express = require('express');
var bcrypt  = require('bcryptjs');
var mdAuth  = require('../middlewares/auth');

app = express();

var Usuario = require('../models/usuario');

//Rutas
/*==================================
OBTENER USUARIOS
===================================*/
app.get('/', ( req, res, next ) => {


    Usuario.find({}, 'nombre email img rol')
        .exec( 
        ( err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error cargando usuarios',
                errors: err,
                data: null
            });
        }

        res.status( 200 ).json({
            success: true,
            message: 'Correcto',
            errors: null,
            data: data
        });

    });
    
});




/*==================================
CREAR NUEVOS USUARIOS
===================================*/
app.post('/', mdAuth.checkToken, (req, res) => {


    var body = req.body;

    var usuario = new Usuario({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img:      body.img,
        role:     body.role
    });

    usuario.save( ( err, saved ) => {

        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error al crear usuario',
                errors: err,
                data: null
            });
        }

        res.status( 201 ).json({
            success: true,
            usuario: saved
        });

    });


});

/*==================================
ACTUALIZAR USUARIOS
===================================*/
app.put('/:id', mdAuth.checkToken, (req, res) => {

    var body    = req.body;
    var id      = req.params.id;

    Usuario.findById( id, ( err, user ) => {

        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error de base de datos al verificar existencia del usuario',
                errors: err,
                data: null
            });
        }

        if( !user ){
            return res.status( 400 ).json({
                success: false,
                message: 'Error al verificar existencia del usuario',
                errors: err,
                data: null
            });
        }

        user.nombre = body.nombre;
        user.email  = body.email;
        user.role   = body.role;

        user.save( ( err, saved ) => {

            if( err ){
                return res.status( 400 ).json({
                    success: false,
                    message: 'Error al actualizar usuario',
                    errors: err,
                    data: null
                });
            }
            
            saved.password = null;
            res.status( 200 ).json({
                success: true,
                usuario: saved
            });
    
        });

    });

});


/*==================================
BORRAR USUARIO
===================================*/
app.delete('/:id', mdAuth.checkToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove( id, ( err, deleted ) => {

        if( err ){
            return res.status( 500 ).json({
                success: false,
                message: 'Error crítico de operación'
            });
        }

        if( !deleted ){
            return res.status( 400 ).json({
                success: false,
                message: `No existe un usuario con el ID ${ id }`
            });
        }
        
        res.status( 200 ).json({
            success: true,
            message: `El usuario ${deleted.nombre} ( ${deleted.email} ) fue eliminado`
        });

    });

});
module.exports = app;