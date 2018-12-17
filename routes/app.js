var express = require('express');

app = express();

//Rutas
app.get('/', ( req, res, next ) => {

    res.status( 200 ).json({
        success: true,
        message: 'Petición correcta'
    });

});

module.exports = app;