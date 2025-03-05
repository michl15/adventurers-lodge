import { SKILLS, STATS_MAP } from "../../constants/constants";
import { calculateProficiencyBonus } from "../../util/calculations";
import { Form, ListGroup } from "react-bootstrap";

interface ProficienciesTypes<Value> {
    [id: string]: Value
}

type ProficienciesProps = {
    charLvl: string | number;
    onSwitchChange: Function;
    charSkills: ProficienciesTypes<boolean>
}

const Proficiencies = ({charLvl, onSwitchChange, charSkills}: ProficienciesProps) => {
    const stats = Object.keys(SKILLS);
    const proficiencyBonus = calculateProficiencyBonus(charLvl);
    
    return stats.map((stat: string) => {
                return (
                    <Form.Group key={`skills-${stat}`}>
                        <Form.Label>{STATS_MAP[stat]}</Form.Label>
                        {SKILLS[stat].map((skill: string) => (
                            <ListGroup horizontal key={`${skill}-switch-listgroup`} style={{margin:'1px 0px'}}>
                                <ListGroup.Item style={{width:'200px'}} variant={charSkills[skill] ? "info" : ""}>
                                    <Form.Check
                                        type="switch"
                                        id={`${skill}-switch`}
                                        label={skill}
                                        checked={charSkills[skill]}
                                        onChange={() => {
                                            onSwitchChange(skill);
                                        }}
                                    />
                                </ListGroup.Item>
                                <ListGroup.Item variant={charSkills[skill] ? "info" : ""}>
                                    {charSkills[skill] ?`+${proficiencyBonus}`: "+0"}
                                </ListGroup.Item>
                            </ListGroup>
                        ))}
                    </Form.Group>
                )
            }
    )
}

export default Proficiencies;