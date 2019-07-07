var localStrategy = require('passport-local').Strategy;
const dbConnection = require('../src/config/dbConnection');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(new localStrategy({
        passReqToCallback: true,
    }, (req, email, password, done) => {
        var myConnection = dbConnection();
        var consulta = 'SELECT * FROM user_web WHERE userName = ?';
        myConnection.query(consulta, email, (err, rows, fields) => {
            if (err) throw err;

            myConnection.end();

            if (rows.length > 0) {
                var user = rows[0];

                if (password == user.userPassword) {
                    return done(null, {
                        idUser: user.idUser,
                        email: user.userName,
                        name: user.name,
                        lastname: user.lastname,
                        dni: user.userDni,
                        idPaciente: user.idPaciente
                    });
                }

            }

            return done(null, false, req.flash('authmessage', 'Email o Password incorrecto.'));
        })
    }));
}