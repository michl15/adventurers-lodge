import React from "react";
import { Button, Card } from "react-bootstrap";

const CharacterCard = ({characterData}) => {
    const name = characterData.name;
    const charClass = characterData.class;

    return (
        <Card>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle>{charClass}</Card.Subtitle>
            <Card.Body>
                <Button variant="link">Details</Button>
            </Card.Body>
        </Card>
    )

}

export default CharacterCard;