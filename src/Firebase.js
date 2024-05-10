import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";
    
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore
const firestore = getFirestore(app);
// Get analytics
const analytics = getAnalytics(app);

// Global vars
let userExists = false;

// **************
// Authentication
// **************
// Check for authentication change
onAuthStateChanged(getAuth(app), async (user) => {
    if (user) {
        userExists = await checkIfUserExists(user.uid);
        if (!userExists) {
            saveUser({
                uid: user.uid,
                Name: user.displayName,
                Email: user.email,
                Pfp: user.photoURL,
                EventsAttended: 0,
                EventsDriven: 0,
                EventsOrganized: 0,
                RidePartners: [],
            });
        }
    }
});

// Save user data to Firestore
const saveUser = async (userData) => {
    try {
      await setDoc(doc(firestore, "users", userData.uid), userData);
    } catch (error) {
        console.log("Error saving user data into firestore", error)
    }
};

// Google Sign In
const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    auth.useDeviceLanguage();
  
    try {
        await signInWithRedirect(auth, provider);
        await getRedirectResult(auth);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }     
};
  
// Sign out
const handleSignOut = () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        signOut(auth).then(() => {
            console.log("Sucessfully signed out")
        }).catch((error) => {
            console.log("Error signing out")
        });
    } else {
        console.log("No user currently signed in")
    }
};

// Checks firestore to see if user already exists
const checkIfUserExists = async (uid) => {
    const querySnapshot = await getDocs(query(collection(firestore, "users"), where("uid", "==", uid)));
    return !querySnapshot.empty;
};

export { 
    app,
    handleGoogleSignIn,
    handleSignOut,
};