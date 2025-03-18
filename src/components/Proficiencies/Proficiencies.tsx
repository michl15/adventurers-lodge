import { SKILLS, STATS_MAP } from '../../constants/constants';
import { calculateProficiencyBonus } from '../../util/calculations';
import { Form, ListGroup } from 'react-bootstrap';

interface ProficienciesTypes<Value> {
    [id: string]: Value;
}

type ProficienciesProps = {
    charLvl: string | number;
    onSwitchChange: (skill: string) => void;
    charSkills: ProficienciesTypes<boolean>;
    editMode: boolean;
};

const Proficiencies = ({
    charLvl,
    onSwitchChange,
    charSkills,
    editMode = false,
}: ProficienciesProps) => {
    const stats = Object.keys(SKILLS);
    const proficiencyBonus = calculateProficiencyBonus(charLvl);

    return (
        <ListGroup>
            {stats.map((stat: string) => {
                return (
                    <ListGroup.Item key={`skills-${stat}`}>
                        <Form.Group>
                            <Form.Label>{STATS_MAP[stat]}</Form.Label>
                            {SKILLS[stat].map((skill: string) => (
                                <ListGroup
                                    horizontal
                                    key={`${skill}-switch-listgroup`}
                                    style={{ margin: '3px 0px' }}
                                >
                                    <ListGroup.Item
                                        style={{ width: '200px' }}
                                        variant={
                                            charSkills[skill] ? 'info' : ''
                                        }
                                    >
                                        <Form.Check
                                            type="switch"
                                            id={`${skill}-switch`}
                                            label={skill}
                                            checked={charSkills[skill]}
                                            onChange={() => {
                                                onSwitchChange?.(skill);
                                            }}
                                            disabled={!editMode}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        variant={
                                            charSkills[skill] ? 'info' : ''
                                        }
                                    >
                                        {charSkills[skill]
                                            ? `+${proficiencyBonus}`
                                            : '+0'}
                                    </ListGroup.Item>
                                </ListGroup>
                            ))}
                        </Form.Group>
                    </ListGroup.Item>
                );
            })}{' '}
        </ListGroup>
    );
};

export default Proficiencies;
