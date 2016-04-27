/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	// optional video management system provider
  	provider: {
  		type: 'string',
  		enum: ['kaltura']
  	},

  	// if using provider, the id in the provider system
  	providerId: {
  		type: 'string'
  	},

    // additional data from the provider (can be anything)
    providerData: {
      type: 'json'
    },

    relativePath: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

  	toJSON: function(){
			var obj = this.toObject();
			delete obj.createdAt;
			delete obj.updatedAt;
			// do not show user that we're using provider; it's transparent to him
			delete obj.provider;
			delete obj.providerId;
      delete obj.relativePath;
      
      // might want to strip irrelevant data from providerData here

			return obj;
		}
  }
};

