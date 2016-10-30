// a stub that fills req.userId when testing
module.exports.jwtMiddlewareStub = function (req, res, next) {
	if(!_user) {
		return next(new Error('jwtMiddlewareStub was called before user was created.'));
	}
	req.userId = _user.id;
	return next();
}