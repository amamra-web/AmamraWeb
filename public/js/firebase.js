// src/firebase.js
import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyCQeRokmQShz34B7IkXDljChUynJgEsGKE",
    authDomain: "aramara-web.firebaseapp.com",
    databaseURL: "https://aramara-web.firebaseio.com",
    projectId: "aramara-web",
    storageBucket: "aramara-web.appspot.com",
    messagingSenderId: "220873330118",
    appId: "1:220873330118:web:440d24aee3c8492c5776c7",
    measurementId: "G-V5JRWFDW0G"
  };

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const db = firebase.database();
export default firebase;