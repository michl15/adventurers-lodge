import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { CharacterData } from '../../../constants/types';

const CharCard = styled(Card)`
    padding: 10px;
`;

type CharacterCardProps = {
    characterData: CharacterData;
};

const CharacterCard = ({ characterData }: CharacterCardProps) => {
    const name = characterData.name;
    const charClass = characterData.class;
    const charLevel = characterData.level;
    const charId = characterData.key;

    const navigate = useNavigate();

    const onCharacterClick = () => {
        navigate(`/characters/${charId}`);
    };

    return (
        <CharCard
            border="info"
            onClick={onCharacterClick}
            data-testid="character-card"
        >
            <Card.Body>
                <h3 data-testid="character-card-name">{name}</h3>
                <p>
                    Level {charLevel} {charClass?.name}
                </p>
            </Card.Body>
        </CharCard>
    );
};

export default CharacterCard;
