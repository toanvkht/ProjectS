const express = require('express');
const router = express.Router();

router.get('/admin', (req, res) => {
    res.render('userpage/admin', { user: req.user });
});

router.get('/tutor', (req, res) => {
    res.render('userpage/tutor', { user: req.user });
});

router.get('/student', (req, res) => {
    res.render('userpage/student', { user: req.user });
});

module.exports = router;