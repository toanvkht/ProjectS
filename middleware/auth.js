const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Bạn cần đăng nhập trước!');
    res.redirect('/auth/login');
};

const checkRole = (allowedRoles) => (req, res, next) => {
    if (req.isAuthenticated() && (allowedRoles.includes(req.user.role) || req.user.role === 'admin')) {
        return next();
    }
    req.flash('error', 'Bạn không có quyền truy cập!');
    res.redirect('/auth/login');
};

module.exports = { ensureAuthenticated, checkRole };