var express = require('express');
var mdAuth  = require('../middlewares/auth');
var Medico  = require('../models/medico');

var app     = express();


app.get('/', (req, res) => {

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( 
        (err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success:false,
                message: 'Error fatal en la base de datos'
            })
        }

        res.status( 200 ).json({
            success: true,
            data
        })

    });

});


app.post('/', mdAuth.checkToken ,( req, res ) => {

    var body   = req.body;
    var user = req.user._id;

    var medico = new Medico({

        nombre:   body.nombre,
        usuario:  user,
        hospital: body.hospital

    });

    medico.save( ( err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success:false,
                message: 'Error fatal en la base de datos',
                error: err
            })
        }

        res.status( 201 ).json({
            success: true,
            data
        })

    });
});

app.put('/:id', mdAuth.checkToken ,( req, res ) => {

    var id     = req.params.id;
    var body   = req.body;
    var update = {
        nombre:   body.nombre,
        hospital: body.hospital
    };
    
    Medico.findByIdAndUpdate( id, update, ( err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success:false,
                message: 'Error fatal en la base de datos',
                error: err
            })
        }

        res.status( 200 ).json({
            success: true,
            message: 'Se actualizó el médico',
            data
        });
    });

});

app.delete('/:id', mdAuth.checkToken ,(req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove( id, ( err, data ) => {

        if( err ){
            return res.status( 500 ).json({
                success:false,
                message: 'Error fatal en la base de datos',
                error: err
            })
        }

        if( !data ){
            return res.status( 400 ).json({
                success:false,
                message: 'No fue posible eliminar al médico, no existe',
                error: err
            })
        }

        res.status( 200 ).json({
            success: true,
            data
        })
    });


})

module.exports = app;