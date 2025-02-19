import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import styled from 'styled-components'

const CharCard = styled(Card) `
    padding: 10px;
`

const CharacterCard = ({characterData}) => {
    const name = characterData.name;
    const charClass = characterData.class;
    const charLevel = characterData.level;
    const charId = characterData.key;

    const navigate = useNavigate();

    const onCharacterClick = () => {
        navigate(`/characters/${charId}`);
    }


    return (
        <CharCard border="info">
            <Card.Body>
                <h3>{name}</h3>
                <p>Level {charLevel} {charClass}</p>
            </Card.Body>
        </CharCard>
    )

}

export default CharacterCard;