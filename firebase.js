import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyD-_MGNwvL2M4Z0ofP28mufVi2QWFZBmg8',
    authDomain: 'fir-authorization-f9fdc.firebaseapp.com',
    projectId: 'fir-authorization-f9fdc',
    storageBucket: 'fir-authorization-f9fdc.appspot.com',
    messagingSenderId: '87586613774',
    appId: '1:87586613774:web:e2812b74d7a6c9b0776a5f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

// Create a new user with email and password
const registerUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('User registered successfully', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error registering user:', errorCode, errorMessage);
        });
};

// Sign in an existing user with email and password
const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User signed in successfully', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in:', errorCode, errorMessage);
        });
};

export { app, auth, registerUser, signInUser };


/* import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyD-_MGNwvL2M4Z0ofP28mufVi2QWFZBmg8',
    authDomain: 'fir-authorization-f9fdc.firebaseapp.com',
    projectId: 'fir-authorization-f9fdc',
    storageBucket: 'fir-authorization-f9fdc.appspot.com',
    messagingSenderId: '87586613774',
    appId: '1:87586613774:web:e2812b74d7a6c9b0776a5f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

// Create a new user with email and password
const registerUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('User registered successfully', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error registering user:', errorCode, errorMessage);
        });
};

// Sign in an existing user with email and password
const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User signed in successfully', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in:', errorCode, errorMessage);
        });
};

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { app, registerUser, signInUser };
 */