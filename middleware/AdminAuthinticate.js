module.exports = (req, res, next) => {
    if (!req.session.user || req.session.admin !== true) { 
        return res.redirect('/admin/logout');
    }
    next();
}