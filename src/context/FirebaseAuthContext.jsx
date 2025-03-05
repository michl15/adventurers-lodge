import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebase";


const FirebaseAuthContext = React.createContext({user: null});

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  const value = { user };

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
    if (context === undefined) {
      throw new Error(
        "useFirebaseAuth must be used within a FirebaseAuthProvider"
      );
    }
    return context;
  }

export { FirebaseAuthProvider, useFirebaseAuth };