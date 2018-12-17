//Requires
var express = require('express');
var mongo   = require('mongoose');

//Inicializaciones
var app = express();
mongo.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if( err ) throw err;
    console.log( 'Mongo Corriendo' );
});


//Rutas
app.get('/', ( req, res, next ) => {

    res.status( 200 ).json({
        success: true,
        message: 'Petición correcta :D'
    });

});


app.listen(3000, () => {
    console.log('Express Corriendo');
});
