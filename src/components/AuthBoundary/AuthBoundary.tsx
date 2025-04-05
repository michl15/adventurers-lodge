import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { firebaseAuth } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/UserReducer';

const AuthBoundary = (props: PropsWithChildren) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (pathname !== '/') {
            firebaseAuth.onAuthStateChanged((user) => {
                if (!user) {
                    navigate('/auth_error');
                } else {
                    dispatch(updateUser(user));
                }
            });
        }
    }, [pathname]);

    return props.children;
};

export default AuthBoundary;
