/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  me: function (req, res) {
    console.log('user:', req.user);
    console.log('isAuthenticated:', req.isAuthenticated());
    res.view();
  }
};
