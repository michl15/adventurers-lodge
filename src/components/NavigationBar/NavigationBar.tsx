import { signOut } from 'firebase/auth';
import {
    Button,
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavDropdown,
} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router';
import { firebaseAuth } from '../../firebase/firebase';
import { useEffect, useState } from 'react';

const NavigationBar = () => {
    const [showNavBar, setShowNavBar] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const onSignOut = () => {
        signOut(firebaseAuth).then(() => {
            navigate('/');
        });
    };

    useEffect(() => {
        setShowNavBar(
            location.pathname !== '/' && location.pathname !== '/auth_error'
        );
    }, [location.pathname]);

    return (
        showNavBar && (
            <Navbar
                bg="info"
                variant="dark"
                sticky="top"
                data-testid="navigation-bar"
            >
                <Container fluid>
                    <Nav>
                        <NavbarBrand as={Link} to="/home">
                            Adventurer&apos;s Lodge
                        </NavbarBrand>
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        <NavDropdown title="Create">
                            <NavDropdown.Item
                                as={Link}
                                to="/character_creation"
                            >
                                Create a Character
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/campaign_creation">
                                Create a Campaign (TODO)
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Link>
                            <Button
                                onClick={onSignOut}
                                variant="outline-light"
                                data-testid="navbar-sign-out-btn"
                            >
                                Sign Out
                            </Button>
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    );
};

export default NavigationBar;
