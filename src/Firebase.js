import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, arrayUnion, updateDoc, addDoc, increment, getDoc } from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";
    
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore
const firestore = getFirestore(app);
// Get analytics
const analytics = getAnalytics(app);
// Get auth
const auth = getAuth(app);

// Global vars
let userExists = false;

// Check for authentication change, saves user if new sign in
onAuthStateChanged(auth, async (user) => {
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
                ActiveOrgs: [],
            });
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
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

// Checks if user already exists
const checkIfUserExists = async (uid) => {
    const querySnapshot = await getDocs(query(collection(firestore, "users"), where("uid", "==", uid)));
    return !querySnapshot.empty;
};

// Checks if org already exists
const checkIfOrgExists = async (orgCode) => {
    const querySnapshot = await getDocs(query(collection(firestore, "organizations"), where("Code", "==", orgCode)));
    return querySnapshot;
};

// Checks if user is already in a given org
const checkIfOrgAlreadyJoined = async (orgCode) => {
    try {
        const user = auth.currentUser;
        const userDocSnap = await getDoc(doc(firestore, "users", user.uid));
        const activeOrgs = userDocSnap.data().ActiveOrgs;
        
         // Iterate over each organization reference in ActiveOrgs
         for (const orgRef of activeOrgs) {
            // Get the document snapshot of the organization
            const orgDocSnap = await getDoc(orgRef);
            // Check if the organization's code matches the provided orgCode
            if (orgDocSnap.exists() && orgDocSnap.data().Code === orgCode) {
                return true; // Organization already joined
            }
        }
        
        return false; // Organization not yet joined
    } catch (error) {
        console.error("Error checking if organization already joined:", error);
    }
};

// handles a user creating an organization
const handleCreateOrg = async (orgName, orgCode) => {
    try {
        // Checks firestore to see if organization already exists
        const querySnapshotCode = await checkIfOrgExists(orgCode)
        const querySnapshotName = await getDocs(query(collection(firestore, "organizations"), where("Name", "==", orgName)));
        const orgExists = (!querySnapshotCode.empty) || (!querySnapshotName.empty);
        
      if (!orgExists) {
        const user = auth.currentUser;
        // Create a new organization
        const newOrgRef = doc(collection(firestore, "organizations"));
        await setDoc(newOrgRef, {
            Name: orgName,
            Code: orgCode,
            numMembers: 1,
            Admins: [user.uid],
            Members: [],
        });
        await updateDoc(doc(firestore, "users", user.uid), {
            ActiveOrgs: arrayUnion(newOrgRef),
        });
  
        console.log(`'${orgName}' with code '${orgCode}' created successfully!`);
        return true; // Organization joined successfully
      } else {
        console.log(`Organization with code '${orgCode}' or name '${orgName}' already exists.`);
        return false; // Organization already exists
      }
    } catch (error) {
      console.error('Error joining organization:', error);
      throw error; // Throw error
    }
};

// handles a user joining an organization with a code
const handleJoinOrg = async (orgCode) => {
    try {
        // Checks firestore to see if organization already exists
        const querySnapshot = await checkIfOrgExists(orgCode)
        const orgExists = !querySnapshot.empty;
        
      if (orgExists) {
        // Add organization to user's ActiveOrgs array
        const organizationDoc = querySnapshot.docs[0];
        const user = auth.currentUser;
        await updateDoc(doc(firestore, "users", user.uid), {
            ActiveOrgs: arrayUnion(organizationDoc.ref),
        });
        await updateDoc(doc(firestore, "organizations", organizationDoc.id), {
            Members: arrayUnion(user.uid),
            numMembers: increment(1),
        });
  
        console.log(`Organization with code '${orgCode}' joined successfully!`);
        return true; // Organization joined successfully
      } else {
        console.log(`Organization with code '${orgCode}' does not exist.`);
        return false; // Organization does not exist
      }
    } catch (error) {
      console.error('Error joining organization:', error);
      throw error; // Throw error
    }
};

// gets all the active orgs for a user
const getActiveOrgs = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        // Get the user document
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
    
        // Get the user's ActiveOrgs array
        const activeOrgs = userDoc.data().ActiveOrgs;
    
        // Get the organization documents for each organization reference in the ActiveOrgs array
        const organizationDocs = await Promise.all(
            activeOrgs.map((orgRef) => getDoc(orgRef))
        );
    
        // Return the organization documents
        return organizationDocs;
    } catch (error) {
        console.error('Error retrieving active organizations:', error);
    }
  };

export { 
    app,
    handleGoogleSignIn,
    handleSignOut,
    handleJoinOrg,
    handleCreateOrg,
    checkIfOrgAlreadyJoined,
    getActiveOrgs,
};