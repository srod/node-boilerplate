var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Schema
 */

/* Nice examples methods :  https://github.com/madhums/node-express-mongoose-demo/blob/master/app/models/user.js */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' }
});

mongoose.model('User', UserSchema);