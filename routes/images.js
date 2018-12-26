var express = require('express');

app = express();

const path = require('path');
const fs   = require('fs');

//Rutas
app.get('/tipo:/img', ( req, res, next ) => {

    var tipo = req.params.tipo;
    var img  = req.params.img;

    var pathImage = path.resolve( __dirname, `../uploads/${ tipo }/avatar-${ img }` );

    if( fs.existsSync( pathImage ) ){
        res.sendFile( pathImage );
    }else{
        var noImage = '';
    }
    res.status( 200 ).json({
        success: true,
        message: 'Petición correcta'
    });

});

module.exports = app;