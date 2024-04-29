// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDFW_llkQCPeWx-_Kv4DddXluGc8dE_Y2o", 
//   authDomain: "test-23c8b.firebaseapp.com",
//   databaseURL: "https://test-23c8b.firebaseio.com",
//   projectId: "test-23c8b",
//   storageBucket: "test-23c8b.appspot.com",
//   messagingSenderId: "994086423557",
//   appId: "1:994086423557:web:5629f976c495b8e2d0e06c",
//   measurementId: "G-2CZNSPBDE8"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const firebase = app;



// import * as firebase from 'firebase';

// import { firebase } from '@firebase/app';
// import '@firebase/auth';
// import '@firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyDFW_llkQCPeWx-_Kv4DddXluGc8dE_Y2o",
//   authDomain: "test-23c8b.firebaseapp.com",
//   databaseURL: "https://test-23c8b.firebaseio.com",
//   projectId: "test-23c8b",
//   storageBucket: "test-23c8b.appspot.com",
//   messagingSenderId: "994086423557",
//   appId: "1:994086423557:web:5629f976c495b8e2d0e06c",
//   measurementId: "G-2CZNSPBDE8"
// };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

// export { firebase };



import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestoreDb = firebaseApp.firestore();
const firebaseAuth = firebaseApp.auth();


export { firebase, firebaseApp, firebaseAuth, firestoreDb };
