const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/doctores', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from doctores d inner JOIN doctor_especialidad de inner join especialidades e where d.idDoctor=de.idDoctor and e.idEspecialidad = de.idEspecialidad';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('doctoresVistas', {
                doctores: rows
            });

        });

    });

    app.get('/doctores/especialidades', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from especialidades';
        myConnection.query(consulta, (err, especialidades) => {
            if (err) {
                console.log(err);
            }
            res.json(especialidades);

        });

    });

    app.post('/doctores', authMiddleware.isLogged, (req, res) => {
        const { apellido, nombre, especialidades, matricula, email, obrassociales, honorarios, horarioLunes } = req.body;

        let consulta = 'INSERT INTO doctores set?';
        myConnection.query(consulta, {
            matriculaDoctor: matricula,
            apellidoDoctor: apellido,
            nombreDoctor: nombre,
            emailDoctor: email,
            honorarioDoctor: honorarios,
        }, (err, resul) => {
            if (err) {
                console.log(err.sqlMessage);
                res.redirect('/doctores');
            }
            if (resul) {
                var id = resul.insertId;
                consulta = 'INSERT INTO doctor_especialidad (idDoctor, idEspecialidad) VALUES (' + id + ',?)';
                especialidades.forEach(especialidad => {
                    myConnection.query(consulta, especialidad, (err, resul) => {
                        if (err) {
                            console.log(err.sqlMessage);
                            res.redirect('/doctores');
                        }
                        if (resul) {
                            consulta = 'INSERT INTO doctor_obrasocial (idDoctor, idObraSocial) VALUES(' + id + ',?)';
                            obrassociales.forEach(obrasocial => {
                                myConnection.query(consulta, obrasocial, (err, resul) => {
                                    if (err) {
                                        console.log(err);
                                        res.redirect('/doctores');
                                    }
                                    if (resul) {
                                        consulta = 'INSERT INTO user set ?';
                                        myConnection.query(consulta, {
                                            userName: email,
                                            userPassword: matricula,
                                            name: nombre + " " + apellido,
                                            userRol: 'doctor'
                                        }, (err, resul) => {
                                            if (resul) {
                                                var id2 = resul.insertId;
                                                consulta = 'UPDATE doctores set ? where idDoctor=' + id;
                                                myConnection.query(consulta, {
                                                    idUser: id2,
                                                }, (err, resul) => {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                })

                                            }
                                        })
                                    }
                                })
                            })
                        }

                    });
                });
                res.redirect('/doctores');
            }

        })
    });

    app.get('/doctores/delete/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from doctores where idDoctor =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            res.redirect('/doctores');
        })
    });

    app.get('/doctores/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select d.idDoctor, d.nombreDoctor, d.apellidoDoctor, d.matriculaDoctor, d.emailDoctor, d.honorarioDoctor, e.idEspecialidad, e.nombreEspecialidad, os.idObraS, os.nombreObraS from doctores d inner join doctor_especialidad de inner join especialidades e inner join doctor_obrasocial dos inner join obrassociales os on d.idDoctor = de.idDoctor and e.idEspecialidad = de.idEspecialidad and d.idDoctor = dos.idDoctor and os.idObraS = dos.idObraSocial where d.idDoctor =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            };
            res.render('./partials/doctoresEdit', {
                doctores: rows
            })
        })

    });

    app.post('/doctores/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { apellido, nombre, honorarios, especialidades, obrassociales, email, matricula } = req.body;
        let consulta = 'UPDATE doctores set ? where idDoctor=' + req.params.id;
        myConnection.query(consulta, {
            apellidoDoctor: apellido,
            nombreDoctor: nombre,
            emailDoctor: email,
            honorarioDoctor: honorarios,
            matriculaDoctor: matricula
        }, (err, resul) => {
            if (err) {
                console.log(err);
                res.redirect('/doctores');
            }
            if (resul) {
                consulta = 'DELETE from doctor_especialidad  where doctor_especialidad.idDoctor = ' + req.params.id;
                myConnection.query(consulta, (err, resul) => {
                    if (err) {
                        console.log(err);
                        res.redirect('/doctores');
                    }
                    consulta = 'INSERT INTO doctor_especialidad (idDoctor, idEspecialidad) VALUES (' + req.params.id + ',?)';
                    especialidades.forEach(especialidad => {
                        myConnection.query(consulta, especialidad, (err, resul) => {
                            if (err) {
                                console.log(err.sqlMessage);
                                res.redirect('/doctores');
                            };

                        });
                    });
                    consulta = 'DELETE FROM doctor_obrasocial where doctor_obrasocial.idDoctor = ' + req.params.id;
                    myConnection.query(consulta, (err, resul) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/doctores');
                        }
                        consulta = 'INSERT INTO doctor_obrasocial (idDoctor, idObraSocial) VALUES (' + req.params.id + ',?)';
                        obrassociales.forEach(obrasocial => {
                            myConnection.query(consulta, obrasocial, (err, resul) => {
                                if (err) {
                                    console.log(err);
                                    res.redirect('/doctores');
                                };
                            })
                        })

                    })

                })
            }

        })
        res.redirect('/doctores');
    })


    app.get('/doctores/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/doctoresAdd');
    })

    app.get('/doctores/obrassociales', (req, res) => {
        let consulta = "SELECT os.idObraS, os.nombreObraS from obrassociales os";
        myConnection.query(consulta, (err, obrassociales) => {
            if (err) {
                console.log(err);
            }
            res.json(obrassociales);

        })
    })


}