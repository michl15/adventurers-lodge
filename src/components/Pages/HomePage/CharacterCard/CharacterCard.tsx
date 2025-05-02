import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { CharacterData } from '../../../../constants/types';
import { shortenString } from '../../../../util/stringFormatting';

const CharCard = styled(Card)`
    padding: 10px;
`;

type CharacterCardProps = {
    characterData: CharacterData;
};

const CharacterCard = ({ characterData }: CharacterCardProps) => {
    const { name, race, level, key } = characterData;
    const charClass = characterData.class;

    const navigate = useNavigate();

    const onCharacterClick = () => {
        navigate(`/characters/${key}`);
    };

    const descriptionString = `Level ${level} ${race.name} ${charClass.name}`;

    return (
        <CharCard
            border="info"
            onClick={onCharacterClick}
            data-testid="character-card"
        >
            <Card.Body>
                <h4 data-testid="character-card-name">
                    {shortenString(name, 15)}
                </h4>
                <p>{shortenString(descriptionString, 30)}</p>
            </Card.Body>
        </CharCard>
    );
};

export default CharacterCard;
