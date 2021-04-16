// const functions = require('firebase-functions');
const admin = require('firebase-admin');
// 
// admin.initializeApp(functions.config().firebase);
admin.initializeApp(firebaseConfig)

// module.exports = {admin , functions}
module.exports = { admin }