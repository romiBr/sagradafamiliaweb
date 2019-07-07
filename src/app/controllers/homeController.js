module.exports = {
    index: (req, res, next) => {
        res.render('web/index', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }
}