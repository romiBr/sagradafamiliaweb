const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth');


module.exports = app => {
    const myConnection = dbConnection();

    app.get('/turnos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from especialidades'
            //let consulta = 'SELECT * from doctores inner join especialidades on doctores.idEspecialidad = especialidades.idEspecialidad';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('web/turnos', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                especialidades: rows
            });

        });

    });

    app.get('/misturnos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT t.idTurno, DATE_FORMAT(t.start,("%d-%m-%Y")) as fecha, TIME_FORMAT(t.start,("%H:%m")) as hora, t.idDoctor, t.valorConsulta, t.atendido, d.apellidoDoctor, d.nombreDoctor, m.nombreModalidad FROM turnos t inner JOIN doctores d inner join modalidad_pago m ON t.idDoctor = d.idDoctor and t.idModalidad = m.idModalidad WHERE t.idPaciente = ' + req.user.idPaciente + ' ORDER BY fecha ASC';

        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('web/listarturnos', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                turnos: rows
            });
        });

    });

    app.get('/hclinicas', authMiddleware.isLogged, (req, res) => {

        res.render('web/hclinica', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });


    });

    app.get('/turnos/doctores/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select * from doctores inner join doctor_especialidad on doctores.idDoctor = doctor_especialidad.idDoctor where doctor_especialidad.idEspecialidad =' + req.params.id;
        myConnection.query(consulta, (err, doctores) => {
            if (err) {
                console.log(err);
            }
            res.json(doctores)
        })
    });

    app.get('/turnos/doctor/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select d.idDoctor, d.honorarioDoctor, d.baja from doctores d where d.idDoctor =' + req.params.id;
        myConnection.query(consulta, (err, doctor) => {
            if (err) {
                console.log(err.code);
            }
            res.json(doctor[0]);
        })
    })

    app.get('/turnos/eventos/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from turnos inner join pacientes on pacientes.id = turnos.idPaciente where turnos.idDoctor =' + req.params.id;
        myConnection.query(consulta, (err, eventos) => {
            if (err) {
                console.log(err);
            }
            res.json(eventos);
        })
    })

    app.get('/turnos/eventos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from turnos inner join pacientes on pacientes.id = turnos.idPaciente';
        myConnection.query(consulta, (err, eventos) => {
            if (err) {
                console.log(err);
            }
            res.json(eventos);
        })
    });


    app.get('/turnos/agregar/:id', authMiddleware.isLogged, (req, res) => {
        res.render('partials/turnosAdd');
    })

    app.get('/turnos/pacientes', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.id, p.nombrePaciente, p.apellidoPaciente, p.dniPaciente, p.telefonoPaciente, p.emailPaciente, os.idObraS, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial ORDER BY p.apellidoPaciente ASC';
        myConnection.query(consulta, (err, pacientes) => {
            if (err) {
                console.log(err);
            }
            res.json(pacientes);

        });

    });

    app.post('/turnos/pacientes', authMiddleware.isLogged, (req, res) => {
        const { apellido, nombre, dni, fNac, direccion, telefono, email, obrasSociales, nroAfil } = req.body;

        let consulta = 'INSERT INTO pacientes set?';
        myConnection.query(consulta, {
            apellidoPaciente: apellido,
            nombrePaciente: nombre,
            dniPaciente: dni,
            fNacPaciente: fNac,
            domicilioPaciente: direccion,
            telefonoPaciente: telefono,
            emailPaciente: email,
            numeroAfiliado: nroAfil
        }, (err, resul) => {
            if (err) {
                console.log(err);
                res.redirect('/pacientes');
            };
            if (resul) {
                id = resul.insertId;
                consulta = 'INSERT INTO paciente_obrasocial (idPaciente, idObraSocial) VALUES (' + id + ',?)';
                obrasSociales.forEach(obrasocial => {
                    myConnection.query(consulta, obrasocial, (err, resul) => {
                        if (err) {
                            console.log(err.sqlMessage);
                        }

                    });
                });

            }

        })
    });

    app.post('/turnos/obrasspd', authMiddleware.isLogged, (req, res) => {
        const { idPacienteS, idDoctor } = req.body;
        let consulta = "select os.idObraS, os.nombreObraS, os.inhabilitada from paciente_obrasocial po inner join doctor_obrasocial dos inner join obrassociales os on po.idObraSocial = dos.idObraSocial and po.idObraSocial = os.idObraS where dos.idDoctor =" + idDoctor + " and po.idPaciente =" + idPacienteS;
        myConnection.query(consulta, (req, obrass) => {
            res.json(obrass);
        })
    });

    app.get('/turnos/paciente/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.nombrePaciente, p.apellidoPaciente, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial where p.id =' + req.params.id;
        myConnection.query(consulta, (err, paciente) => {
            res.json(paciente);
        })
    });

    app.get('/turnos/modalidades', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select m.idModalidad, m.nombreModalidad, m.activa from modalidad_pago m';
        myConnection.query(consulta, (err, modalidades) => {
            res.json(modalidades);
        })
    });

    app.get('/turnos/bancos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select b.idBanco, b.nombreBanco from bancos b';
        myConnection.query(consulta, (err, bancos) => {
            res.json(bancos);
        })
    });

    app.post('/turnos/agregar/turno', authMiddleware.isLogged, (req, res) => {

        const { start, idDoctor, idPaciente, idObraSocial, valor, idModalidad, idBanco } = req.body;
        let consulta = 'INSERT INTO turnos set ?';
        myConnection.query(consulta, {
            start: start,
            idDoctor: idDoctor,
            idPaciente: idPaciente,
            idObraS: idObraSocial,
            valorConsulta: valor,
            idModalidad: idModalidad,
            idBanco: idBanco
        }, (err, resul) => {
            res.json(resul);
        })
    });

    app.get('/turnos/obras/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select o.nombreObraS from obrassociales o where o.idObraS=' + req.params.id;
        myConnection.query(consulta, (err, obra) => {
            res.json(obra);
        })
    });

    app.get('/turnos/borrar/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from turnos where idTurno =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            res.json(resul);
        })
    });

    app.get('/turnos/modalidad/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select mp.nombreModalidad from modalidad_pago mp where mp.idModalidad=' + req.params.id;
        myConnection.query(consulta, (err, modalidad) => {
            res.json(modalidad);
        })
    });

}