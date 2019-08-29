import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/messaging'
import 'firebase/performance'

export default (ctx, inject) => {
  const options = {"config":{"development":{"apiKey":"AIzaSyCsXOQxUtVnUkmxWmFGon3ktIZyY7QR4D0","authDomain":"betachannel-eb8fb.firebaseapp.com","databaseURL":"https:\u002F\u002Fbetachannel-eb8fb.firebaseio.com","projectId":"betachannel-eb8fb","storageBucket":"betachannel-eb8fb.appspot.com","messagingSenderId":"868969921084","appId":"1:868969921084:web:376032dec8158bc7"},"production":{"apiKey":"AIzaSyCsXOQxUtVnUkmxWmFGon3ktIZyY7QR4D0","authDomain":"betachannel-eb8fb.firebaseapp.com","databaseURL":"https:\u002F\u002Fbetachannel-eb8fb.firebaseio.com","projectId":"betachannel-eb8fb","storageBucket":"betachannel-eb8fb.appspot.com","messagingSenderId":"868969921084","appId":"1:868969921084:web:376032dec8158bc7"}},"currentEnv":"development","useOnly":["auth","firestore","functions","storage","realtimeDb","messaging","performance"]}

  // Don't include when Firebase is already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(options.config[options.currentEnv])
  }

  if (options.useOnly.includes('auth')) {
    const fireAuth = firebase.auth()
    const fireAuthObj = firebase.auth
    inject('fireAuth', fireAuth)
    inject('fireAuthObj', fireAuthObj)
  }

  if (options.useOnly.includes('realtimeDb')) {
    const fireDb = firebase.database()
    const fireDbObj = firebase.database
    inject('fireDb', fireDb)
    inject('fireDbObj', fireDbObj)
  }

  if (options.useOnly.includes('firestore')) {
    const fireStore = firebase.firestore()
    const fireStoreObj = firebase.firestore
    inject('fireStore', fireStore)
    inject('fireStoreObj', fireStoreObj)
  }

  if (options.useOnly.includes('storage')) {
    const fireStorage = firebase.storage()
    const fireStorageObj = firebase.storage
    inject('fireStorage', fireStorage)
    inject('fireStorageObj', fireStorageObj)
  }

  if (options.useOnly.includes('functions')) {
    const fireFunc = firebase.app().functions(options.functionsLocation)
    const fireFuncObj = firebase.functions
    inject('fireFunc', fireFunc)
    inject('fireFuncObj', fireFuncObj)
  }

  // Firebase Messaging can only be initiated on client side
  if (process.browser && options.useOnly.includes('messaging')) {
    const fireMess = firebase.messaging()
    const fireMessObj = firebase.messaging
    inject('fireMess', fireMess)
    inject('fireMessObj', fireMessObj)
  }

  // Firebase Performance can only be initiated on client side
  if(process.browser && options.useOnly.includes('performance')){
    const firePerf = firebase.performance()
    const firePerfObj = firebase.performance
    inject('firePerf', firePerf)
    inject('firePerfObj', firePerfObj)
  }
}
