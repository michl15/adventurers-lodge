import * as React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase";


const FirebaseAuthContext = React.createContext({user: null, useSignOut: () => {}});

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  const firebaseSignOut = async (callback) => {
    return signOut(firebaseAuth).then(() => {
        callback();
    });
  }
  const value = { user, firebaseSignOut };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => {
        setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

function useFirebaseAuth() {
    const context = React.useContext(FirebaseAuthContext);
    //console.log(context.user);
    if (context === undefined) {
      throw new Error(
        "useFirebaseAuth must be used within a FirebaseAuthProvider"
      );
    }
    return context;
  }

export { FirebaseAuthProvider, useFirebaseAuth };