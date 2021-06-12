import * as admin from 'firebase-admin';
admin.initializeApp();

exports.vercelapp = require('./vercelapp');
exports.vercelapp_v2 = require('./vercelapp_v2');
exports.vercelapp_v4 = require('./vercelapp_v4');
exports.hatenablog = require('./hatenablog');
