const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/obrassociales', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT os.idObraS, os.nombreObraS, os.direccionObraS, os.telefonoObraS, os.emailObraS, os.inhabilitada from obrasSociales os';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('obrasSocialesVistas', {
                obrasSociales: rows
            });

        });

    });

    app.post('/obrassociales', authMiddleware.isLogged, (req, res) => {
        const { nombre, direccion, telefono, email } = req.body;
        let consulta = 'INSERT INTO obrasSociales set?';
        myConnection.query(consulta, {
            nombreObraS: nombre,
            direccionObraS: direccion,
            telefonoObraS: telefono,
            emailObraS: email
        }, (err, resul) => {
            res.redirect('/obrassociales');
        })
    });

    app.get('/obrassociales/delete/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from obrasSociales where idObraS =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            res.redirect('/obrassociales');
        })
    });

    app.get('/obrassociales/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT os.idObraS, os.nombreObraS, os.direccionObraS, os.telefonoObraS, os.emailObraS, os.inhabilitada FROM obrasSociales os where os.idObraS =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('./partials/obrasSocialesEdit', {
                obrasSociales: rows[0]
            })
        })

    });

    app.post('/obrassociales/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { nombre, direccion, telefono, email } = req.body;
        let consulta = 'UPDATE obrasSociales set ? where idObraS=' + req.params.id;
        myConnection.query(consulta, {
            nombreObraS: nombre,
            direccionObraS: direccion,
            telefonoObraS: telefono,
            emailObraS: email
        }, (err, resul) => {
            res.redirect('/obrassociales');
        })
    })

    app.get('/obrassociales/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/obrassocialesAdd');
    })


}