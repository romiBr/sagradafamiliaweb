const dbConnection = require('../../config/dbConnection');
const controllers = require('../controllers');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {

    app.get('/', controllers.homeController.index);

    app.get('/contacto', (req, res) => {
        res.render('web/contact', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.get('/aboutus/historia', (req, res) => {
        res.render('web/historia', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.get('/aboutus/misionvision', (req, res) => {
        res.render('web/misionvision', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.get('/servicios', (req, res) => {
        res.render('servicios', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    /*app.get('/prueba/:id', (req, res) => {
        //http://localhost:3000/1?name=romina&doctor=4
        console.log(req.params);
        console.log(req.query);
    })*/

}