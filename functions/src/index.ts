import * as admin from 'firebase-admin';
admin.initializeApp();

exports.apiv4_appv2 = require('./apiv4_appv2');
exports.vercelapp_v4 = require('./vercelapp_v4');
