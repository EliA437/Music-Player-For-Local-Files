// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVMCz_GDZb-GzATg7PwIF0YgFHJ4_4144",
  authDomain: "music-player-266b3.firebaseapp.com",
  databaseURL: "https://music-player-266b3-default-rtdb.firebaseio.com",
  projectId: "music-player-266b3",
  storageBucket: "music-player-266b3.appspot.com",
  messagingSenderId: "931316857222",
  appId: "1:931316857222:web:64503c4049f2dedf739407"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;