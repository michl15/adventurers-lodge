import { Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";

type HPDisplayProps = {
    maxHP: number;
    currHP: number;
}

const HPDisplay = ({maxHP, currHP}: HPDisplayProps) => {
    const getHPStyle = () => {
        const health = currHP/maxHP;
        if (health > .75) {
            return "success";
        } else if (health > .30) {
            return "warning";
        } else {
            return "danger";
        }
    }

    return (
        <ListGroup horizontal>
            <ListGroupItem variant={getHPStyle()}>
                <Container fluid>
                    <Row className="text-center">Current HP/Max HP</Row>
                    <Row className="text-center">
                        <h4>{currHP}/{maxHP}</h4>
                    </Row>
                </Container>
            </ListGroupItem>
            <ListGroupItem>
                <Container fluid>
                    <Row className="text-center">Temp HP</Row>
                    <Row className="text-center">
                        <h4>0</h4>
                    </Row>
                </Container>
            </ListGroupItem>
        </ListGroup>
    )
}

export default HPDisplay;