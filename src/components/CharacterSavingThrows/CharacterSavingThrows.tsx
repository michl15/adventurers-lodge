import { Col, Form, ListGroup } from 'react-bootstrap';
import { SavingThrowsTypes, StatsTypes } from '../../constants/types';
import {
    calculateProficiencyBonus,
    calculateStatModifier,
} from '../../util/calculations';

type CharacterSavingThrowsProps = {
    charSavingThrows: SavingThrowsTypes;
    charStats: StatsTypes;
    charLvl?: number;
    onCheckChange?: (stat: string) => void;
    edit?: boolean;
};

const CharacterSavingThrows = ({
    charSavingThrows,
    charStats,
    onCheckChange,
    charLvl,
    edit,
}: CharacterSavingThrowsProps) => {
    const statsNames = Object.keys(charSavingThrows);
    return statsNames.map((stat) => {
        const modifier = calculateStatModifier(
            charStats[stat as keyof StatsTypes]
        );
        const savingThrowModifier =
            modifier + calculateProficiencyBonus(charLvl || 1);
        return (
            <Col key={`saving-throw-${stat}`}>
                <Form.Group>
                    <Form.Text>{`${stat.toUpperCase()} Save`}</Form.Text>
                    <ListGroup
                        horizontal
                        className="d-flex justify-content-center my-auto"
                    >
                        <ListGroup.Item
                            style={{ width: '50%' }}
                            className="d-flex justify-content-center"
                            variant={charSavingThrows[stat] ? 'info' : ''}
                        >
                            <Form.Check
                                onChange={() => {
                                    if (onCheckChange) {
                                        onCheckChange(stat);
                                    }
                                }}
                                checked={charSavingThrows[stat]}
                                disabled={!edit}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item
                            style={{ width: '50%' }}
                            className="d-flex justify-content-center"
                            variant={charSavingThrows[stat] ? 'info' : ''}
                        >
                            {charSavingThrows[stat]
                                ? `${savingThrowModifier >= 0 ? '+' : ''}${savingThrowModifier}`
                                : `${modifier >= 0 ? '+' : ''}${modifier}`}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>
            </Col>
        );
    });
};

export default CharacterSavingThrows;
