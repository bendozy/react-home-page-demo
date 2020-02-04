import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBZMfV50TXHbKTogcbonyNK-l2iixhVFDg',
  authDomain: 'jetcake-demo-e6a3d.firebaseapp.com',
  databaseURL: 'https://jetcake-demo-e6a3d.firebaseio.com',
  projectId: 'jetcake-demo-e6a3d',
  storageBucket: 'jetcake-demo-e6a3d.appspot.com',
  messagingSenderId: '1012991759897',
  appId: '1:1012991759897:web:04387263741fd007ea7c88',
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
