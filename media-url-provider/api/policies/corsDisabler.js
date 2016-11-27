module.exports = function (req, res, next) {
    res.removeHeader('Access-Control-Allow-Origin');
    res.removeHeader('Access-Control-Expose-Headers');
    res.removeHeader('Access-Control-Allow-Methods');
    res.removeHeader('Access-Control-Allow-Headers');
    res.removeHeader('Access-Control-Allow-Credentials');
    return next();
};
