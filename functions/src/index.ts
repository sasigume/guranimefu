import * as admin from 'firebase-admin';
admin.initializeApp();

exports.vercelapp = require('./vercelapp');
exports.vercelapp_v2 = require('./vercelapp_v2');
exports.hatenablog = require('./hatenablog');
