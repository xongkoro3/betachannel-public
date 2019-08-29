import * as firebase from 'firebase';

if (!firebase.apps.length) {
    const config = {
        apiKey: "AIzaSyCsXOQxUtVnUkmxWmFGon3ktIZyY7QR4D0",
        authDomain: "betachannel-eb8fb.firebaseapp.com",
        databaseURL: "https://betachannel-eb8fb.firebaseio.com",
        projectId: "betachannel-eb8fb",
        storageBucket: "betachannel-eb8fb.appspot.com",
        messagingSenderId: "868969921084"
    }
    firebase.initializeApp(config)
}

export default firebase;