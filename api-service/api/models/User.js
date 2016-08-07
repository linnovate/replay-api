/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      email: true,
      unique: true,
      required: true
    },
    password: {
      type: 'string'
    },
    displayName: {
      type: 'string'
    },
    picture: {
      type: 'string'
    },
    google: {
      type: 'string'
    },
    facebook: {
      type: 'string'
    }
  }
};
