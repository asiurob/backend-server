//Requires
var express = require('express');
var mongo   = require('mongoose');
var bodyP   = require('body-parser');

//Importaciones
var routes       = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');

//Inicializaciones
var app = express();
mongo.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {

    if( err ) throw err;
    console.log( 'Mongo Corriendo' );

});

//MIDDLEWARES
//BodyParser
app.use( bodyP.urlencoded({extended : false}) );
app.use( bodyP.json() );

//Rutas
app.use('/usuario', usuarioRoute );
app.use('/login', loginRoute );
app.use('/', routes );





app.listen(3000, () => {
    console.log('Express Corriendo');
});
