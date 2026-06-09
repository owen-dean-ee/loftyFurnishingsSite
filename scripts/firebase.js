// firebase-config.js (module) - initializes Firebase and exports helpers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFOG35v7i0xJRCw-DsDSNU36Q03VTQufM",
  authDomain: "lofty-furnishing.firebaseapp.com",
  projectId: "lofty-furnishing",
  storageBucket: "lofty-furnishing.firebasestorage.app",
  messagingSenderId: "796911302364",
  appId: "1:796911302364:web:28a95a54c70be4e4586619"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);

/**
 * Save an ambassador application to Firestore.
 * @param {Object} data - { name, email, phone, earlyArrival }
 */
export async function saveApplication(data) {
  try {
    const docRef = await addDoc(collection(db, "applications"), data);
    console.log("Application saved with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding application:", e);
    throw e;
  }
}

/**
 * Save a booking order to Firestore.
 * @param {Object} bookingData - booking details
 */
export async function saveBooking(bookingData) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    console.log("Booking saved with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding booking:", e);
    throw e;
  }
}
