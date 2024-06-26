import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, confirmPasswordReset } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, arrayUnion, updateDoc, addDoc, increment, getDoc, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LiaEthernetSolid } from "react-icons/lia";
    
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
                Friends: [],
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
        localStorage.removeItem('currentUser');
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
const checkIfOrgAlreadyJoined = async (orgCode, uid) => {
    try {
        const userDocSnap = await getDoc(doc(firestore, "users", uid));
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
const handleCreateOrg = async (orgImage, orgName, orgCode, setActiveOrgs) => {
    try {
        // Checks firestore to see if organization already exists
        const querySnapshotCode = await checkIfOrgExists(orgCode)
        const orgExists = (!querySnapshotCode.empty);
        
        if (!orgExists) {
            const uid = JSON.parse(localStorage.getItem('currentUser')).uid;
            // Create a new organization
            const newOrgRef = doc(collection(firestore, "organizations"));
            const userRef = doc(firestore, "users", uid);
            let downloadURL = ""
            if (orgImage) {
                downloadURL = await uploadImage(orgImage, orgName);
            }
            await setDoc(newOrgRef, {
                id: newOrgRef.id,
                Image: downloadURL,
                Name: orgName,
                Code: orgCode,
                numMembers: 1,
                Admins: [userRef],
                Members: [],
            });

            await updateDoc(userRef, {
                ActiveOrgs: arrayUnion(newOrgRef),
            });

            // update home page when an org is created
            const updatedOrgsSnapshot = await getActiveOrgs();
            const updatedOrgs = updatedOrgsSnapshot.map(doc => doc.data());
            setActiveOrgs(updatedOrgs);
    
            return true; // Organization joined successfully
        } else {
            return false; // Organization already exists
        }
    } catch (error) {
        console.error(error)
    }
};

// handles a user joining an organization with a code
const handleJoinOrg = async (orgCode, setActiveOrgs) => {
    try {
        // Checks firestore to see if organization already exists
        const querySnapshot = await checkIfOrgExists(orgCode)
        const orgExists = !querySnapshot.empty;
        
      if (orgExists) {
        // Add organization to user's ActiveOrgs array
        const organizationDoc = querySnapshot.docs[0];
        const user = auth.currentUser;
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, {
            ActiveOrgs: arrayUnion(organizationDoc.ref),
        });
        await updateDoc(doc(firestore, "organizations", organizationDoc.id), {
            Members: arrayUnion(userRef),
            numMembers: increment(1),
        });

        // update home page when an org is created
        const updatedOrgsSnapshot = await getActiveOrgs();
        const updatedOrgs = updatedOrgsSnapshot.map(doc => doc.data());
        setActiveOrgs(updatedOrgs);
  
        return true; // Organization joined successfully
      } else {
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
        const uid = JSON.parse(localStorage.getItem('currentUser')).uid;
        const userDoc = await getDoc(doc(firestore, "users", uid));
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

// gets all the user information for Profile Drawer
const getActiveUserInfo = async () => {
    try {
        const uid = JSON.parse(localStorage.getItem('currentUser')).uid;
        const userDoc = await getDoc(doc(firestore, "users", uid));
    
        const name = userDoc.data().Name;
        const email = userDoc.data().Email;
        const pfp = userDoc.data().Pfp;
        const numFriends = userDoc.data().Friends.length;
    
        // Return user information including the number of friends
        return userDoc.data();
    } catch (error) {
        console.error('Error retrieving active user info:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
};

// uploads an image into firebase storage and returns the download URL to the image
const uploadImage = async (image, path) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${path}/${image.name}`);
  
    await uploadBytes(storageRef, image);
  
    const downloadURL = await getDownloadURL(storageRef);
  
    return downloadURL;
  };

// get user info of a given array of user references (returns array of Doc.data)
const getUsersInfo = async (references) => {
    try {
        const users = [];
        for (const reference of references) {
            const docSnap = await getDoc(reference);
            if (docSnap.exists()) {
                users.push(docSnap.data());
            } else {
                console.log("Document does not exist:", reference.id);
            }
        }
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// creates an event of an org
const handleCreateEvent = async (orgId, image, name, location, time, setEvents) => {
    try {
        const orgRef = doc(firestore, "organizations", orgId);
        const eventsRef = doc(collection(orgRef, 'events'));
        const orgDoc = await getDoc(orgRef);
        const orgName = orgDoc.data().Name;

        let downloadURL = ""
        if (image) {
            downloadURL = await uploadImage(image, `${orgName}/${name}`);
        }

        await setDoc(eventsRef, {
            id: eventsRef.id,
            Image: downloadURL,
            Name: name,
            Location: location,
            Time: time,
            Drivers: [],
            Riders: [],
        });

        // update home page when an org is created
        const updatedEvents = await getEvents(orgId);
        setEvents(updatedEvents);

        return true;
    } catch (error) {
        console.error("Error creating event", error);
        return false;
    }
}

// adds a user to an org given their gmail
const handleAddUserToOrg = async (orgId, email, setPeople) => {
    try {
        const orgRef = doc(firestore, "organizations", orgId);
        const orgDoc = await getDoc(orgRef);
        const orgCode = orgDoc.data().Code;
        
        // Query the users collection to find the user by Gmail
        const usersQuery = query(collection(firestore, "users"), where("Email", "==", email));
        const querySnapshot = await getDocs(usersQuery);

        if (querySnapshot.empty) {
            console.error(`No user found using ${email}`);
            return 1;
        }

        // Get the user document reference and data
        const userDoc = querySnapshot.docs[0];
        const userRef = userDoc.ref;

        const alreadyJoined = await checkIfOrgAlreadyJoined(orgCode, userDoc.data());
        if (alreadyJoined) {
            return 2;
        }

        // Update the organization
        await updateDoc(orgRef, {
            Members: arrayUnion(userRef),
            numMembers: increment(1),
        });

        // Update the user's activeOrgs array
        await updateDoc(userRef, {
            ActiveOrgs: arrayUnion(orgRef)
        });

        // update the org edit screen after adding their email
        const people = await getOrgPeople(orgId);
        setPeople(people);

        return 0;

    } catch (error) {
        console.error("Error adding user to org", error);
        return 1;
    }
}

// get a user based on single ref (returns Doc)
const getUser = async (ref) => {
    try {
        // get event docs from organization subcollection
        const userDoc = await getDoc(ref);

        return userDoc;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

// get a user ref given an id (returns Reference)
const getUserRef = (uid) => {
    try {
        return doc(firestore, "users", uid);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

// get an org based on id
const getOrg = async (orgId) => {
    try {
        // get event docs from organization subcollection
        const orgRef = doc(firestore, "organizations", orgId);
        const orgDoc = await getDoc(orgRef);
        
        return orgDoc;
    } catch (error) {
        console.error("Error fetching org:", error);
    }
}

// get the events of an org (returns doc.data)
const getEvents = async (orgId) => {
    try {
        // get event docs from organization subcollection
        const orgRef = doc(firestore, "organizations", orgId);
        const eventsSnapshot = await getDocs(query(collection(orgRef, 'events')));

        // if empty, return empty early
        if (eventsSnapshot.empty) {
            return [];
        }
        
        const events = eventsSnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });

        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// get the event of an org based on orgId and eventId
const getEvent = async (orgId, eventId) => {
    try {
        // get event docs from organization subcollection
        const orgRef = doc(firestore, "organizations", orgId);
        const querySnapshot = await getDocs(query(collection(orgRef, 'events'), where("id", "==", eventId)));

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0];
        } else {
            console.log("No event found with eventId:", eventId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// get the locations of an org (returns doc.data)
const getLocations = async (orgId, eventId) => {
    try {
        // get event docs from organization subcollection
        const orgRef = doc(firestore, "organizations", orgId);
        const eventQuery = await getDocs(query(collection(orgRef, 'events'), where("id", "==", eventId)));
        const eventRef = (eventQuery.docs[0]).ref;
        const locationsSnapshot = await getDocs(query(collection(eventRef, 'PickupLocations')));

        // if empty, return empty early
        if (locationsSnapshot.empty) {
            return [];
        }
        
        const locations = locationsSnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });

        return locations;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// get the rides of an org's event
// todo
const handleUpdateRides = async (orgId, eventId, addedDrivers, removedDrivers) => {
    try {
        // get event doc from organization subcollection
        const eventDoc = await getEvent(orgId, eventId);
        const eventRef = eventDoc.ref;
        const ridesRef = collection(eventRef, 'Rides');
        const ridesDocs = await getDocs(query(ridesRef));
        const drivers = eventDoc.data().Drivers;

        for (const rideDoc of ridesDocs.docs) {
            const rideData = rideDoc.data();
            const rideRef = rideDoc.ref;
            const driverRef = rideData.Driver;

            // remove ride from pickupLocation doc's rides array
            const pickupLocationRef = rideData.PickupLocation;
            const pickupLocationDoc = await getDoc(pickupLocationRef);
            const updatedRidesArray = [];

            // remove ride from pickupLocation doc's rides array
            if (removedDrivers.some(removedDriver => removedDriver.id === driverRef.id)) {
                updatedRidesArray = pickupLocationDoc.data().Rides.filter(ref => ref.id !== rideRef.id);
            }

            // add ride from pickupLocation doc's rides array

            await updateDoc(pickupLocationRef, { Rides: updatedRidesArray });
        }

        return true;
    } catch (error) {
        console.error("Error updating rides subcollection:", error);
        return false;
    }
}

// get the rides of an org's event
const getRides = async (orgId, eventId, pickupLocationId) => {
    try {
        // get event doc from organization subcollection
        const eventDoc = await getEvent(orgId, eventId);
        const eventRef = eventDoc.ref;
        const locationQuery = await getDocs(query(collection(eventRef, 'PickupLocations'), where("id", "==", pickupLocationId)));
        const pickupLocationDoc = locationQuery.docs[0];

        const rideRefs = pickupLocationDoc.data().Rides;

        const rides = [];
        for (const rideRef of rideRefs) {
            const rideDoc = await getDoc(rideRef);
            rides.push({ id: rideDoc.id, ...rideDoc.data() });
        }

        return rides;
    } catch (error) {
        console.error("Error fetching rides:", error);
    }
}

// updates user given the updates
const updateUser = async (uid, updates) => {
    try {
        const userRef = doc(firestore, "users", uid);
        const { Name, Pfp, Car } = updates;

        let downloadURL = ""
        if (Pfp) {
            downloadURL = await uploadImage(Pfp, 'pfps');
        }

        await updateDoc(userRef, {
            ...(Name && { Name }),
            ...(Pfp && { Pfp: downloadURL }),
            ...(Car && { Car: Car }),
        });

    } catch (error) {
        console.error("Error updating user", error);
    }
};

// updates org given the updates
const updateOrg = async (orgId, updates) => {
    try {
        const orgRef = doc(firestore, "organizations", orgId);
        const { updatedAdmins, updatedMembers, Name, Code, Image } = updates;

        const adminRefs = updatedAdmins.map(admin => {
            return typeof admin === 'string' ? doc(firestore, "users", admin) : admin;
        });

        let downloadURL = ""
        if (Image) {
            downloadURL = await uploadImage(Image, 'orgPfps');
        }

        await updateDoc(orgRef, {
            Admins: adminRefs,
            Members: updatedMembers,
            ...(Name && { Name }),
            ...(Code && { Code }),
            ...(downloadURL && { Image: downloadURL }),
        });
    } catch (error) {
        console.error("Error updating org", error);
    }
};

// updates event given the updates
const updateEvent = async (orgId, eventId, updates) => {
    try {
        // get event doc from organization subcollection
        const eventDoc = await getEvent(orgId, eventId);
        const eventRef = eventDoc.ref;
        const { updatedDrivers, updatedRiders, Name, Time, Image } = updates;

        const driverRefs = updatedDrivers.map(driver => {
            return typeof driver === 'string' ? doc(firestore, "users", driver) : driver;
        });

        let downloadURL = ""
        if (Image) {
            downloadURL = await uploadImage(Image, 'eventPfps');
        }

        await updateDoc(eventRef, {
            Drivers: driverRefs,
            Riders: updatedRiders,
            ...(Name && { Name }),
            ...(Time && { Time }),
            ...(downloadURL && { Image: downloadURL }),
        });
    } catch (error) {
        console.error("Error updating event", error);
    }
};

// removes a user from an org (org edit page)
const removeUserFromOrg = async (orgId, uid, setPeople) => {
    try {
        // Fetch the organization document
        const orgRef = doc(firestore, "organizations", orgId);
        const orgDoc = await getDoc(orgRef);
        const orgData = orgDoc.data();

        // Fetch the user document
        const userRef = doc(firestore, "users", uid);
        const userDoc = await getUser(userRef);
        const userData = userDoc.data();

        // Remove the user from the organization's Admins and Members arrays
        const updatedAdmins = orgData.Admins.filter(adminRef => adminRef.id !== uid);
        const updatedMembers = orgData.Members.filter(memberRef => memberRef.id !== uid);

        // Update the organization's Admins and Members arrays
        await updateDoc(orgRef, {
            Admins: updatedAdmins,
            Members: updatedMembers,
            numMembers: increment(-1),
        });

        // Remove the organization from the user's ActiveOrgs array
        const updatedActiveOrgs = userData.ActiveOrgs.filter(orgRef => orgRef.id !== orgId);

        // Update the user's ActiveOrgs array
        await updateDoc(userRef, {
            ActiveOrgs: updatedActiveOrgs,
        });

        // update the org edit screen
        const people = await getOrgPeople(orgId);
        setPeople(people);
        
        return true;
    } catch (error) {
        console.error('Error removing user from organization:', error);
        return false;
    }
};

// removes current user user from an org (profile edit page)
const leaveOrg = async (orgId, uid, setActiveOrgs) => {
    try {
        // Fetch the organization document
        const orgRef = doc(firestore, "organizations", orgId);
        const orgDoc = await getDoc(orgRef);
        const orgData = orgDoc.data();

        // Fetch the user document
        const userRef = doc(firestore, "users", uid);
        const userDoc = await getUser(userRef);
        const userData = userDoc.data();

        // Remove the user from the organization's Admins and Members arrays
        const updatedAdmins = orgData.Admins.filter(adminRef => adminRef.id !== uid);
        const updatedMembers = orgData.Members.filter(memberRef => memberRef.id !== uid);

        // Update the organization's Admins and Members arrays
        await updateDoc(orgRef, {
            Admins: updatedAdmins,
            Members: updatedMembers,
            numMembers: increment(-1),
        });

        // Remove the organization from the user's ActiveOrgs array
        const updatedActiveOrgs = userData.ActiveOrgs.filter(orgRef => orgRef.id !== orgId);

        // Update the user's ActiveOrgs array
        await updateDoc(userRef, {
            ActiveOrgs: updatedActiveOrgs,
        });

        const updatedActiveOrgsData = await Promise.all(
            updatedActiveOrgs.map(async (orgRef) => {
                const orgDoc = await getDoc(orgRef);
                return { id: orgDoc.id, ...orgDoc.data() };
            })
        );
        // update the profile edit screen
        setActiveOrgs(updatedActiveOrgsData);
        
        return true;
    } catch (error) {
        console.error('Error removing user from organization:', error);
        return false;
    }
};

// gets Admins and Members' documents of an org
const getOrgPeople = async (orgId) => {
    try {
        const orgDoc = await getOrg(orgId);
        const membersData = await getUsersInfo(orgDoc.data().Members);
        const adminsData = await getUsersInfo(orgDoc.data().Admins);
        return membersData.concat(adminsData)
    } catch (error) {
        console.error('Error getting admins and members of this organization:', error);
        return false;
    }
};

export { 
    app,
    firestore,
    handleGoogleSignIn,
    handleSignOut,
    handleJoinOrg,
    handleCreateOrg,
    handleAddUserToOrg,
    checkIfOrgAlreadyJoined,
    checkIfOrgExists,
    getActiveOrgs,
    getActiveUserInfo,
    getUsersInfo,
    handleCreateEvent,
    handleUpdateRides,
    getUserRef,
    getUser,
    getOrg,
    getEvent,
    getEvents,
    getRides,
    getLocations,
    updateUser,
    updateOrg,
    updateEvent,
    uploadImage,
    removeUserFromOrg,
    leaveOrg,
    getOrgPeople,
};