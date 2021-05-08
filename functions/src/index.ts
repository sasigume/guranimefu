import * as admin from 'firebase-admin';
admin.initializeApp();

exports.vercelapp = require('./vercelapp');
exports.hatenablog = require('./hatenablog');
