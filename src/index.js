const app = require('./config/server');
require('./app/routes/especialidades.rutas')(app);
require('./app/routes/obrassociales.rutas')(app);
require('./app/routes/inicio.rutas')(app);
require('./app/routes/pacientes.rutas')(app);
require('./app/routes/turnos.rutas')(app);
require('./app/routes/doctores.rutas')(app);
require('./app/routes/routes')(app);



//iniciar servidor
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
})