//Requires
var express = require('express');
var mongo   = require('mongoose');
var bodyP   = require('body-parser');

//Importaciones
var routes        = require('./routes/app');
var usuarioRoute  = require('./routes/usuario');
var loginRoute    = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute   = require('./routes/medico');
var uploadRoute   = require('./routes/upload');
var imagesRoute   = require('./routes/images');

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
app.use('/hospitales', hospitalRoute );
app.use('/medico', medicoRoute );
app.use('/upload', uploadRoute );
app.use('/images', imagesRoute );
app.use('/', routes );





app.listen(3000, () => {
    console.log('Express Corriendo');
});
