import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { firebaseAuth, firebaseDatabase } from '../../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/UserReducer';
import { CurrentUser } from '../../../constants/types';
import { get, ref, update } from 'firebase/database';

const AuthBoundary = (props: PropsWithChildren) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (pathname !== '/login') {
            const setUserData = async (currUser: CurrentUser) => {
                if (currUser.uid) {
                    const userRef = ref(
                        firebaseDatabase,
                        `users/${currUser?.uid}/userData`
                    );
                    const snapshot = await get(userRef);

                    const userData: CurrentUser = snapshot.val();
                    const newUserData: CurrentUser = {
                        uid: userData?.uid || currUser.uid,
                        displayName:
                            userData?.displayName || currUser.displayName,
                        email: userData?.email || currUser.email,
                        emailVerified:
                            userData?.emailVerified || currUser.emailVerified,
                        photoURL: userData?.photoURL || currUser.photoURL,
                    };
                    update(userRef, newUserData);
                    dispatch(updateUser(newUserData));
                }
            };

            firebaseAuth.onAuthStateChanged((user) => {
                if (!user) {
                    if (pathname !== '/' && pathname !== '/browse') {
                        navigate('/auth_error');
                    }
                } else {
                    const newUser: CurrentUser = {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        photoURL: user.photoURL,
                    };
                    setUserData(newUser);
                }
            });
        }
    }, [pathname, navigate, dispatch]);

    return props.children;
};

export default AuthBoundary;
