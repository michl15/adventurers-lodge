import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { push, ref, set } from "firebase/database";
import { Toast } from "react-bootstrap";
import { firebaseAuth, firebaseDatabase } from "../../firebase/firebase";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { BASE_STATS, DEFAULT_PROFICIENCIES, } from "../../constants/constants";
import { calculateProficiencyBonus, calculateStatModifier, rollStat } from "../../util/calculations";
import Proficiencies from "../Proficiencies";
import { AbilityBonus, Class, Language, ProficienciesTypes, Race, StatsTypes, Trait } from "../../constants/types";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import Dropdown from "./Dropdown";
import { API_BASE_URL_5E, API_CLASSES, API_RACES } from "../../constants/api";
import CharacterLanguages from "../CharacterLanguages";
import CharacterTraits from "../CharacterTraits/CharacterTraits";


const StatsRowContainer = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
`
const StatsButtons = styled(Button)`
    margin: 5px 5px;
    margin-top: 10px;
`

const DescriptionBox = styled(Form.Control)`
    min-height: 300px;
    width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 8px;
`

const StatsInput = styled(Form.Control)`
    height: 60px;
    text-align: center;
    font-size: 18px;
`

const NameInput =  styled(Form.Control)`
    margin-bottom: 10px;
`

const SubmitButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    padding: 10px 10px;
`

const SwapToCustomClass = styled.span`
    font-size: 13px;
    color: #4287f5;
    margin-left: 10px;
    margin-bottom: 25px;

    &:hover {
        color: #103e87;
        cursor: pointer;
        text-decoration: underline;
    }
`

const CharacterCreationPage = () => {
    const [charName, setCharName] = useState<string>('');
    const [charClass, setCharClass] = useState<string>('');
    const [charStats, setCharStats] = useState<StatsTypes>(BASE_STATS);
    const [charLvl, setCharLvl] = useState<number | string>(1);
    const [validated, setValidated] = useState<boolean>(false)
    const [charSkills, setCharSkills] = useState<ProficienciesTypes<boolean>>(DEFAULT_PROFICIENCIES);
    const [charMaxHP, setCharMaxHP] = useState<number | string>(10);
    const [charDesc, setCharDesc] = useState<string>('');
    const [customClass, setCustomClass] = useState(false);
    const [classOptions, setClassOptions] = useState<Class[]>([]);
    const [hitDie, setHitDie] = useState(10);
    const [proficienciesInfo, setProficienciesInfo] = useState("");
    const [raceOptions, setRaceOptions] = useState<Race[]>([]);
    const [customRace, setCustomRace] = useState(false);
    const [charRace, setCharRace] = useState("");
    const [charLanguages, setCharLanguages] = useState<Language[]>([]);
    const [statBonuses, setStatBonuses] = useState<AbilityBonus[]>([]);
    const [statsApplied, setStatsApplied] = useState(false);
    const [charTraits, setCharTraits] = useState<Trait[]>([]);

    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const toggleToast = () => setShowToast(true)
    const toggleToastOff = () => setShowToast(false)

    const [user, setUser] = useState<FirebaseUser | null>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharName(event.target.value);
    }

    const onClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharClass(event.target.value);
    }

    const onClassDropdownChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValidated(false);
        setCharClass(event.target.value);
        if (event.target.value) {
            const response = await fetch(`${API_CLASSES}${event.target.value.toLowerCase()}`);
            const classInfo = await response.json();
            setHitDie(classInfo.hit_die);
            setCharMaxHP(classInfo.hit_die + calculateStatModifier(charStats['con']));
            setProficienciesInfo(classInfo.proficiency_choices[0].desc);
            console.log(classInfo);
        }
    }

    const onRaceDropdownChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValidated(false);
        setCharRace(event.target.value);
        if (event.target.value) {
            const response = await fetch(`${API_RACES}${event.target.value.toLowerCase()}`);
            const raceInfo = await response.json();
            
            // Languages from race
            const languages = raceInfo.languages;
            languages.forEach((lang: Language) => {lang.source = event.target.value})
            const removeOld = charLanguages.filter((lang) => lang.source === undefined)
            const newLanguages: Language[] = [...removeOld, ...languages];
            setCharLanguages(newLanguages);

            // traits from race
            const traits = raceInfo.traits;
            for(let i = 0; i < traits.length; i++) {
                traits[i].source = event.target.value;
                const traitResp = await fetch(`${API_BASE_URL_5E}${traits[i].url}`);
                const traitInfo = await traitResp.json();
                console.log(traitInfo);
                let desc = "";
                traitInfo.desc.forEach((str: string) => desc += str + " ");
                traits[i].info = desc;
            }
            const removeOldTraits = charTraits.filter((trait) => trait.source === undefined)
            const newTraits: Trait[] = [...removeOldTraits, ...traits];
            setCharTraits(newTraits);

            // stat bonuses from race
            const abilities = raceInfo.ability_bonuses;
            setStatBonuses(abilities);
            setStatsApplied(false);

            console.log(raceInfo);
        }
    }

    const applyStatBonus = () => {
        let newCharStats = {...charStats};
        for(let i = 0; i < statBonuses.length; i++) {
            const stat = statBonuses[i].ability_score?.index;
            const adjustedStat = charStats[stat as keyof StatsTypes] + statBonuses[i].bonus;
            newCharStats = {...newCharStats, [stat]: adjustedStat}
        }
        setCharStats(newCharStats);
        setStatsApplied(true);
    }

    const onRaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharRace(event.target.value);
    }

    const onHitDieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        const numVal = Number(val.substring(1));
        setHitDie(numVal);
        setCharMaxHP(numVal + calculateStatModifier(charStats['con']) );

    }

    const onStatChange = (event: React.ChangeEvent<HTMLInputElement>, label: string) => {
        setValidated(false);
        setStatsApplied(false);
        if (!event.target.value) {
            setCharStats({...charStats, [label]: ''})

        }
        else if (Number(event.target.value)) {
            setCharStats({...charStats, [label]: Number(event.target.value)})
        }

        if (label === 'con' && hitDie) {
            setCharMaxHP(hitDie + calculateStatModifier(event.target.value))
        }
    }

    const onLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        if (!event.target.value) {
            setCharLvl('')
        }
        else if (Number(event.target.value)) {
            setCharLvl(Number(event.target.value))
        }
    }

    const onMaxHPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            setCharMaxHP('')
        }
        else if (Number(event.target.value)) {
            setCharMaxHP(Number(event.target.value))
        }
    }

    const onDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharDesc(event.target.value);
    }


    const onRollStats = () => {
        let newStatsObj: StatsTypes = {...BASE_STATS}
        for(const [key] of Object.entries(charStats)) {
            // generate a random number between 0-20
            const newStat = rollStat();
            newStatsObj[key as keyof StatsTypes] = newStat;
        }
        setCharStats(newStatsObj);
        setCharMaxHP(hitDie + calculateStatModifier(newStatsObj['con']));
        setStatsApplied(false);
    }

    const onResetStats = () => {
        setCharStats(BASE_STATS);
        setCharMaxHP(hitDie);
        setStatsApplied(false);
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (user && form.checkValidity()) {
            const database = firebaseDatabase;
            const charRef = ref(database, 'characters');

            const charData = {
                name: charName,
                class: charClass,
                stats: charStats,
                level: charLvl,
                skills: charSkills,
                hp: charMaxHP,
                maxHP: charMaxHP,
                description: charDesc,
                race: charRace,
                languages: charLanguages,
                traits: charTraits
            }

            const newCharKey = push(charRef, charData).key;
            const userRef = ref(database, "users/" + user?.uid + "/characters/" + newCharKey);

            set(userRef, true).then(() => {
                navigate(`/characters/${newCharKey}`);
            }).catch((error) => {
                toggleToast();
                console.error(error)
            });
        }
    }

    const getClasses = async () => {
        const response = await fetch(API_CLASSES);
        if (response.ok) {
            const data = await response.json();
            setClassOptions(data.results);
        }
    }

    const getRaces = async () => {
        const response = await fetch(API_RACES);
        if (response.ok) {
            const data = await response.json();
            setRaceOptions(data.results);
        }
    }

    const renderStatsForm = () => {
        const statsNames = Object.keys(charStats);
        return statsNames.map((stat) => {
            const modifier = calculateStatModifier(charStats[stat as keyof StatsTypes]);
            return (
            <Col key={`stats-${stat}`}>
                <Form.Group>
                    <Form.Label>{stat.toUpperCase()}</Form.Label>
                    <StatsInput type="text" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {onStatChange(event, stat)}} value={charStats[stat as keyof StatsTypes]}/>
                    <Form.Text>
                        {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                    </Form.Text>
                </Form.Group>
            </Col>
        )})
    }

    const onSwitchChange = (skill: string) => {
        setCharSkills({...charSkills, [skill]: !charSkills[skill]})
    }

    const showCustomClassButtonContent = () => {
        return customClass ? 'Use Vanilla 5e classes' : 'Use custom class'
    }

    const onCustomClassButtonClick = () => {
        setCustomClass(!customClass);
        setCharClass("");
    }

    const showCustomRaceButtonContent = () => {
        return customRace ? 'Use Vanilla 5e races' : 'Use custom race'
    }

    const onCustomRaceButtonClick = () => {
        setCustomRace(!customRace);
        const removeOld = charLanguages.filter((lang) => lang.source === undefined)
        const newLanguages: Language[] = [...removeOld];
        setCharLanguages(newLanguages);

        const removeOldTraits = charTraits.filter((trait) => trait.source === undefined)
        const newTraits: Trait[] = [...removeOldTraits];
        setCharTraits(newTraits);

        setCharRace("");
    }

    const statInfo = () => {
        let infoStr = "";
        statBonuses.forEach((ability) => {
            infoStr += `${ability.ability_score.name} +${ability.bonus}, `
        })
        const trimmedInfo = infoStr.substring(0, infoStr.length - 2);
        return trimmedInfo;
    }

    const onAddLanguageClick = () => {

    }

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (u) => {
            setUser(u);
        });
        getClasses();
        getRaces();
    }, [])

    return (
        <div>
            <Container fluid>
                <div className="d-flex justify-content-center"><h2>Create a Character</h2></div>
            <Form onSubmit={onSubmit} validated={validated} noValidate>
                <Row style={{marginBottom:"10px"}}>
                <h4>Basic Info</h4>
                <Col sm={8}>
                    <Form.Group>
                        <Form.Label><h5>Character Name</h5></Form.Label>
                        <NameInput required type="text" onChange={onNameChange} value={charName}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter a name for your character.
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Col>
                <Col sm={4}>
                    <Form.Group>
                        <Form.Label><h5>Character Race</h5></Form.Label>
                        <SwapToCustomClass onClick={onCustomRaceButtonClick}>{showCustomRaceButtonContent()}</SwapToCustomClass>
                        {
                            customRace ?
                            <Form.Control required type="text" onChange={onRaceChange} value={charRace}/>
                            : <Dropdown options={raceOptions} onOptChange={onRaceDropdownChange}/>
                        }
                        <Form.Control.Feedback type="invalid">
                            Please enter a race for your character.
                        </Form.Control.Feedback>
                        <Form.Text>{!validated && customRace && "Enter the name of your custom race"}</Form.Text>
                    </Form.Group>
                </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label><h5>Character Class</h5></Form.Label>
                            <SwapToCustomClass onClick={onCustomClassButtonClick}>{showCustomClassButtonContent()}</SwapToCustomClass>
                            {
                                customClass ?
                                <Form.Control required type="text" onChange={onClassChange} value={charClass}/>
                                : <Dropdown options={classOptions} onOptChange={onClassDropdownChange}/>
                            }
                            <Form.Control.Feedback type="invalid">
                                Please enter a class for your character.
                            </Form.Control.Feedback>
                            <Form.Text>{!validated && customClass && "Enter the name of your custom class"}</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group>
                            <Form.Label><h5>Level</h5></Form.Label>
                            <Form.Control required type="text" onChange={onLevelChange} value={charLvl}/>
                            <Form.Control.Feedback type="invalid">
                                Please enter a level for your character.
                            </Form.Control.Feedback>
                            <Form.Text>
                                {`Proficiency Bonus: +${calculateProficiencyBonus(charLvl)}`}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group>
                            <Form.Label><h5>Max HP</h5></Form.Label>
                            <Form.Control required type="text" onChange={onMaxHPChange} value={charMaxHP}/>
                            <Form.Text>{`Max Hit Die + CON modifier`}</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group>
                            <Form.Label><h5>Hit Die</h5></Form.Label>
                            <Form.Select value={`d${hitDie}`} onChange={onHitDieChange}>
                                <option key={6}>d6</option>
                                <option key={8}>d8</option>
                                <option key={10}>d10</option>
                                <option key={12}>d12</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col md="auto">
                    <h4>Skills</h4>
                        <Alert show={!customClass && charClass !== ""} variant="info" style={{width:"286px"}}>
                            <b>{charClass}:</b> {proficienciesInfo}
                        </Alert>
                        <Proficiencies charLvl={charLvl} charSkills={charSkills} onSwitchChange={onSwitchChange} editMode={true}/>
                    </Col>
                    <Col>
                    <StatsRowContainer>
                    <h4>Stats</h4>
                    <Row>
                        <Alert show={!customRace && charRace !== ""} variant="info" >
                            <Row>
                                <Col className="d-flex my-auto">
                                    <b>{charRace}</b>: {statInfo()}
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button onClick={applyStatBonus} variant={statsApplied ? "outline-info" : "info"} disabled={statsApplied}>{statsApplied ? "Bonuses Applied" : "Apply Bonuses"}</Button>
                                </Col>
                            </Row>
                        </Alert>
                    </Row>
                    {renderStatsForm()}
                        <Row className="justify-content-md-center">
                            <Col xs lg="2">
                                <StatsButtons onClick={onRollStats} size="sm">Randomize</StatsButtons>
                            </Col>
                            <Col xs lg="2">
                                <StatsButtons onClick={onResetStats} size="sm" variant="danger">Reset</StatsButtons>
                            </Col>
                        </Row>
                </StatsRowContainer>
                    <h4>Other</h4>
                    <Row>
                        <h5>Traits</h5>
                        <CharacterTraits traits={charTraits} edit/>
                        <br/>
                    </Row>
                    <Row>
                        <h5>Languages</h5>
                        <CharacterLanguages langList={charLanguages} edit={true} onAddLang={onAddLanguageClick}/>
                    </Row>
                    <br/>
                        <Row>
                            <Form.Group>
                                <Form.Label><h5>Description/Notes</h5></Form.Label>
                                <DescriptionBox type="text" onChange={onDescChange} value={charDesc} as="textarea"/>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="formFileLg" className="mb-3">
                                <Form.Label>Upload an image (NOT WORKING right now)</Form.Label>
                                <Form.Control type="file" accept=".png,.jpeg" disabled/>
                            </Form.Group>
                        </Row>
                    </Col>
                </Row>
                <Toast show={showToast} onClose={toggleToastOff}>
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>Something went wrong, please try again</Toast.Body>
                </Toast>
                <SubmitButtonContainer>
                            <Button type="submit" size='lg'>Create Character!</Button>
                        </SubmitButtonContainer>
            </Form>
            </Container>
        </div>

    )
}

export default CharacterCreationPage;
