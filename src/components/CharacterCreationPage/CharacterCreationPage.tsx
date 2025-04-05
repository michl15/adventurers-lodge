import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { push, ref, set } from 'firebase/database';
import { Toast } from 'react-bootstrap';
import { firebaseDatabase } from '../../firebase/firebase';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { BASE_STATS, DEFAULT_PROFICIENCIES } from '../../constants/constants';
import {
    calculateProficiencyBonus,
    calculateStatModifier,
    rollStat,
} from '../../util/calculations';
import Proficiencies from '../Proficiencies';
import {
    AbilityBonus,
    Class,
    Equipment,
    EquipmentCategory,
    Language,
    ProficienciesTypes,
    Race,
    StatsTypes,
    Trait,
} from '../../constants/types';
import Dropdown from './Dropdown';
import {
    API_BASE_URL_5E,
    API_CLASSES,
    API_EQUIPMENT,
    API_EQUIPMENT_CATEGORIES,
    API_RACES,
} from '../../constants/api';
import CharacterLanguages from '../CharacterLanguages';
import CharacterTraits from '../CharacterTraits';
import ItemModal from '../ItemModal';
import Inventory from '../Inventory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { resetInventory } from '../../redux/InventoryReducer';

const StatsRowContainer = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const StatsButtons = styled(Button)`
    margin: 5px 5px;
    margin-top: 10px;
`;

const DescriptionBox = styled(Form.Control)`
    min-height: 200px;
    width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 8px;
`;

const StatsInput = styled(Form.Control)`
    height: 60px;
    text-align: center;
    font-size: 18px;
`;

const NameInput = styled(Form.Control)`
    margin-bottom: 10px;
`;

const SubmitButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    padding: 10px 10px;
`;

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
`;

const CharacterCreationPage = () => {
    // #region State
    // Character input fields
    const [charName, setCharName] = useState<string>('');
    const [charClass, setCharClass] = useState<Class | null>(null);
    const [charStats, setCharStats] = useState<StatsTypes>(BASE_STATS);
    const [charLvl, setCharLvl] = useState<number | string>(1);
    const [charSkills, setCharSkills] = useState<ProficienciesTypes<boolean>>(
        DEFAULT_PROFICIENCIES
    );
    const [charMaxHP, setCharMaxHP] = useState<number | string>(10);
    const [charDesc, setCharDesc] = useState<string>('');
    const [charRace, setCharRace] = useState<Race | null>(null);
    const [hitDie, setHitDie] = useState(10);
    const [charLanguages, setCharLanguages] = useState<Language[]>([]);
    const [charTraits, setCharTraits] = useState<Trait[]>([]);
    const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
    const [equipmentCategories, setEquipmentCategories] = useState<
        EquipmentCategory[]
    >([]);

    // flags
    const [validated, setValidated] = useState(false);
    const [customClass, setCustomClass] = useState(false);
    const [customRace, setCustomRace] = useState(false);
    const [statsApplied, setStatsApplied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);

    // options for dropdowns
    const [classOptions, setClassOptions] = useState<Class[]>([]);
    const [raceOptions, setRaceOptions] = useState<Race[]>([]);

    // data for selected class/race
    const [proficienciesInfo, setProficienciesInfo] = useState('');
    const [statBonuses, setStatBonuses] = useState<AbilityBonus[]>([]);

    // user data for current user
    //const [user, setUser] = useState<FirebaseUser | null>(null);
    const user = useSelector((state: RootState) => state.user.user);

    // redux
    const inventory = useSelector(
        (state: RootState) => state.inventory.inventoryList
    );
    const dispatch = useDispatch();

    // #endregion State
    // hook for React Router navigation
    const navigate = useNavigate();

    // Toast toggle utility fn
    const toggleToast = () => setShowToast(true);
    const toggleToastOff = () => setShowToast(false);

    const closeModal = () => setShowItemModal(false);

    /* =================================== Input field onChange handlers ===================================== */
    // #region onChange handlers
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharName(event.target.value);
    };

    const onClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        if (event.target.value) {
            setCharClass({
                name: event.target.value,
                index: false,
                url: false,
            });
        } else {
            setCharClass(null);
        }
    };

    const onClassDropdownChange = async (selectedClass: Class | null) => {
        setValidated(false);
        setCharClass(selectedClass);
        if (selectedClass?.url) {
            const response = await fetch(
                `${API_BASE_URL_5E}${selectedClass.url}`
            );
            const classInfo = await response.json();
            setHitDie(classInfo.hit_die);
            setCharMaxHP(
                classInfo.hit_die + calculateStatModifier(charStats['con'])
            );
            setProficienciesInfo(classInfo.proficiency_choices[0].desc);
        }
    };

    const onRaceDropdownChange = async (race: Race | null) => {
        setValidated(false);
        setCharRace(race);
        if (race?.url) {
            const response = await fetch(`${API_BASE_URL_5E}${race.url}`);
            const raceInfo = await response.json();

            // Languages from race
            const languages = raceInfo.languages;
            languages.forEach((lang: Language) => {
                lang.source = race.name;
            });
            const removeOld = charLanguages.filter(
                (lang) => lang.source === false
            );
            const newLanguages: Language[] = [...removeOld, ...languages];
            setCharLanguages(newLanguages);

            // traits from race
            const traits = raceInfo.traits;
            for (let i = 0; i < traits.length; i++) {
                traits[i].source = race.name;
                const traitResp = await fetch(
                    `${API_BASE_URL_5E}${traits[i].url}`
                );
                const traitInfo = await traitResp.json();
                let desc = '';
                traitInfo.desc.forEach((str: string) => (desc += str + ' '));
                traits[i].info = desc;
            }
            // when selecting a new race, remove other traits from prev race
            const removeOldTraits = charTraits.filter(
                (trait) => trait.source === false
            );
            const newTraits: Trait[] = [...removeOldTraits, ...traits];
            setCharTraits(newTraits);

            // stat bonuses from race
            const abilities = raceInfo.ability_bonuses;
            setStatBonuses(abilities);
            setStatsApplied(false);
        } else {
            removeOldValues();
        }
    };

    const onRaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        if (event.target.value) {
            const newRace = {
                name: event.target.value,
                index: false,
                url: false,
            };
            setCharRace(newRace);
        } else {
            setCharRace(null);
        }
    };

    const onHitDieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        const numVal = Number(val.substring(1));
        setHitDie(numVal);
        setCharMaxHP(numVal + calculateStatModifier(charStats['con']));
    };

    const onStatChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        label: string
    ) => {
        setValidated(false);
        setStatsApplied(false);
        if (!event.target.value) {
            setCharStats({ ...charStats, [label]: '' });
        } else if (Number(event.target.value)) {
            setCharStats({ ...charStats, [label]: Number(event.target.value) });
        }

        if (label === 'con' && hitDie) {
            setCharMaxHP(hitDie + calculateStatModifier(event.target.value));
        }
    };

    const onLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        if (!event.target.value) {
            setCharLvl('');
        } else if (Number(event.target.value)) {
            setCharLvl(Number(event.target.value));
        }
    };

    const onMaxHPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            setCharMaxHP('');
        } else if (Number(event.target.value)) {
            setCharMaxHP(Number(event.target.value));
        }
    };

    const onDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        setCharDesc(event.target.value);
    };

    const onSwitchChange = (skill: string) => {
        setCharSkills({ ...charSkills, [skill]: !charSkills[skill] });
    };

    // #endregion onChange handlers
    /* ===================================== Button onClick handlers ======================================== */
    // #region onClick handlers
    const onRollStats = () => {
        const newStatsObj: StatsTypes = { ...BASE_STATS };
        for (const [key] of Object.entries(charStats)) {
            // generate a random number between 0-20
            const newStat = rollStat();
            newStatsObj[key as keyof StatsTypes] = newStat;
        }
        setCharStats(newStatsObj);
        setCharMaxHP(hitDie + calculateStatModifier(newStatsObj['con']));
        setStatsApplied(false);
    };

    const onResetStats = () => {
        setCharStats(BASE_STATS);
        setCharMaxHP(hitDie);
        setStatsApplied(false);
    };

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
                traits: charTraits,
                hitDie: hitDie,
                inventory: inventory,
            };

            const newCharKey = push(charRef, charData).key;
            const userRef = ref(
                database,
                'users/' + user?.uid + '/characters/' + newCharKey
            );

            set(userRef, true)
                .then(() => {
                    navigate(`/characters/${newCharKey}`);
                })
                .catch((error) => {
                    toggleToast();
                    console.error(error);
                });
        } else {
            window.scrollTo(0, 0);
        }
    };

    const onCustomClassButtonClick = () => {
        setCustomClass(!customClass);
        setCharClass(null);
    };

    const onCustomRaceButtonClick = () => {
        setCustomRace(!customRace);
        setCharRace(null);
        removeOldValues();
    };

    const onAddLanguageClick = (newLang: string) => {
        const newLanguage: Language = {
            index: newLang.trim().replace(/\s+/g, '-').toLowerCase(),
            name: newLang,
            url: false,
            source: false,
        };
        setCharLanguages([...charLanguages, newLanguage]);
    };

    const onRemoveLanguageClick = (index: string) => {
        const newLanguages = charLanguages.filter(
            (lang) => lang.index !== index
        );
        setCharLanguages(newLanguages);
    };

    const onAddTraitClick = (newTrait: Trait) => {
        setCharTraits([...charTraits, newTrait]);
    };

    const onRemoveTraitClick = (index: string) => {
        const newTraits = charTraits.filter((trait) => trait.index !== index);
        setCharTraits(newTraits);
    };

    const applyStatBonus = () => {
        let newCharStats = { ...charStats };
        for (let i = 0; i < statBonuses.length; i++) {
            const stat = statBonuses[i].ability_score?.index;
            const adjustedStat =
                charStats[stat as keyof StatsTypes] + statBonuses[i].bonus;
            newCharStats = { ...newCharStats, [stat]: adjustedStat };
        }
        setCharStats(newCharStats);
        setStatsApplied(true);
    };

    // #endregion onClick handlers
    /* ===================================== Initial API fetches ======================================== */
    // #region API calls
    const getClasses = async () => {
        const response = await fetch(API_CLASSES);
        if (response.ok) {
            const data = await response.json();
            setClassOptions(data.results);
        }
    };

    const getRaces = async () => {
        const response = await fetch(API_RACES);
        if (response.ok) {
            const data = await response.json();
            setRaceOptions(data.results);
        }
    };

    const getAllEquipment = async () => {
        const response = await fetch(API_EQUIPMENT);
        if (response.ok) {
            const equipmentData = await response.json();
            setAllEquipment(equipmentData.results);
        }
    };

    const getEquipmentCategories = async () => {
        const response = await fetch(API_EQUIPMENT_CATEGORIES);
        if (response.ok) {
            const equipmentCategoriesData = await response.json();
            setEquipmentCategories(equipmentCategoriesData.results);
        }
    };

    // #endregion API calls
    /* ===================================== Content rendering/utility ======================================== */
    // #region Rendering/utility
    const renderStatsForm = () => {
        const statsNames = Object.keys(charStats);
        return statsNames.map((stat) => {
            const modifier = calculateStatModifier(
                charStats[stat as keyof StatsTypes]
            );
            return (
                <Col key={`stats-${stat}`}>
                    <Form.Group>
                        <Form.Label>{stat.toUpperCase()}</Form.Label>
                        <StatsInput
                            type="text"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onStatChange(event, stat);
                            }}
                            value={charStats[stat as keyof StatsTypes]}
                            data-testid={`stats-input-${stat}`}
                        />
                        <Form.Text data-testid={`stats-modifier-${stat}`}>
                            {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                        </Form.Text>
                    </Form.Group>
                </Col>
            );
        });
    };

    const showCustomClassButtonContent = () => {
        return customClass ? 'Use Vanilla 5e classes' : 'Use custom class';
    };

    const showCustomRaceButtonContent = () => {
        return customRace ? 'Use Vanilla 5e races' : 'Use custom race';
    };

    const statInfo = () => {
        let infoStr = '';
        statBonuses.forEach((ability) => {
            infoStr += `${ability.ability_score.name} +${ability.bonus}, `;
        });
        const trimmedInfo = infoStr.substring(0, infoStr.length - 2);
        return trimmedInfo;
    };

    const removeOldValues = () => {
        const removeOld = charLanguages.filter((lang) => lang.source === false);
        const newLanguages: Language[] = [...removeOld];
        setCharLanguages(newLanguages);

        const removeOldTraits = charTraits.filter(
            (trait) => trait.source === false
        );
        const newTraits: Trait[] = [...removeOldTraits];
        setCharTraits(newTraits);
    };

    // #endregion Rendering/utility

    useEffect(() => {
        getClasses();
        getRaces();
        getEquipmentCategories();
        getAllEquipment();
    }, []);

    useEffect(() => {
        //on unmount, reset inventory
        return () => {
            dispatch(resetInventory());
        };
    }, [dispatch]);

    return (
        <div data-testid="character-creation-page-container">
            <Container fluid>
                <div className="d-flex justify-content-center">
                    <h2>Create a Character</h2>
                </div>
                <Form
                    onSubmit={onSubmit}
                    validated={validated}
                    noValidate
                    data-testid="character-creation-form"
                >
                    <Row style={{ marginBottom: '10px' }}>
                        <h4>Basic Info</h4>
                        <Col sm={8}>
                            <Form.Group>
                                <Form.Label>
                                    <h5>Character Name</h5>
                                </Form.Label>
                                <NameInput
                                    required
                                    type="text"
                                    onChange={onNameChange}
                                    value={charName}
                                    data-testid="char-name-input"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a name for your character.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label>
                                    <h5>Character Race</h5>
                                </Form.Label>
                                <SwapToCustomClass
                                    onClick={onCustomRaceButtonClick}
                                    data-testid="char-custom-race-btn"
                                >
                                    {showCustomRaceButtonContent()}
                                </SwapToCustomClass>
                                {customRace ? (
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={onRaceChange}
                                        value={charRace?.name || ''}
                                        data-testid="char-race-input"
                                    />
                                ) : (
                                    <Dropdown
                                        options={raceOptions}
                                        onOptChange={onRaceDropdownChange}
                                        data-testid="char-race-dropdown"
                                    />
                                )}
                                <Form.Control.Feedback type="invalid">
                                    Please enter a race for your character.
                                </Form.Control.Feedback>
                                <Form.Text>
                                    {!validated &&
                                        customRace &&
                                        'Enter the name of your custom race'}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>
                                    <h5>Character Class</h5>
                                </Form.Label>
                                <SwapToCustomClass
                                    onClick={onCustomClassButtonClick}
                                    data-testid="char-custom-class-btn"
                                >
                                    {showCustomClassButtonContent()}
                                </SwapToCustomClass>
                                {customClass ? (
                                    <Form.Control
                                        required
                                        type="text"
                                        onChange={onClassChange}
                                        value={charClass?.name || ''}
                                        data-testid="char-class-input"
                                    />
                                ) : (
                                    <Dropdown
                                        options={classOptions}
                                        onOptChange={onClassDropdownChange}
                                        data-testid="char-class-dropdown"
                                    />
                                )}
                                <Form.Control.Feedback type="invalid">
                                    Please enter a class for your character.
                                </Form.Control.Feedback>
                                <Form.Text>
                                    {!validated &&
                                        customClass &&
                                        'Enter the name of your custom class'}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group>
                                <Form.Label>
                                    <h5>Level</h5>
                                </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    onChange={onLevelChange}
                                    value={charLvl}
                                    data-testid="char-lvl-input"
                                />
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
                                <Form.Label>
                                    <h5>Max HP</h5>
                                </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    onChange={onMaxHPChange}
                                    value={charMaxHP}
                                    data-testid="char-max-hp"
                                />
                                <Form.Text>{`Max Hit Die + CON modifier`}</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group>
                                <Form.Label>
                                    <h5>Hit Die</h5>
                                </Form.Label>
                                <Form.Select
                                    value={`d${hitDie}`}
                                    onChange={onHitDieChange}
                                    data-testid="hit-die-select"
                                >
                                    <option key={6}>d6</option>
                                    <option key={8}>d8</option>
                                    <option key={10}>d10</option>
                                    <option key={12}>d12</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="auto">
                            <h4>Skills</h4>
                            <Alert
                                show={!customClass && charClass !== null}
                                variant="info"
                                style={{ width: '286px' }}
                                data-testid="class-info-alert"
                            >
                                <b>{charClass?.name}:</b> {proficienciesInfo}
                            </Alert>
                            <Proficiencies
                                charLvl={charLvl}
                                charSkills={charSkills}
                                onSwitchChange={onSwitchChange}
                                editMode={true}
                            />
                        </Col>
                        <Col>
                            <StatsRowContainer>
                                <h4>Stats</h4>
                                <Row>
                                    <Alert
                                        show={!customRace && charRace !== null}
                                        variant="info"
                                        data-testid="race-info-alert"
                                    >
                                        <Row>
                                            <Col className="d-flex my-auto">
                                                <b>{charRace?.name}</b>:{' '}
                                                {statInfo()}
                                            </Col>
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    data-testid="apply-bonus-btn"
                                                    onClick={applyStatBonus}
                                                    variant={
                                                        statsApplied
                                                            ? 'outline-info'
                                                            : 'info'
                                                    }
                                                    disabled={statsApplied}
                                                >
                                                    {statsApplied
                                                        ? 'Bonuses Applied'
                                                        : 'Apply Bonuses'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Alert>
                                </Row>
                                {renderStatsForm()}
                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <StatsButtons
                                            onClick={onRollStats}
                                            size="sm"
                                            data-testid="roll-stats"
                                        >
                                            Randomize
                                        </StatsButtons>
                                    </Col>
                                    <Col>
                                        <StatsButtons
                                            onClick={onResetStats}
                                            size="sm"
                                            variant="danger"
                                            data-testid="reset-stats"
                                        >
                                            Reset
                                        </StatsButtons>
                                    </Col>
                                </Row>
                            </StatsRowContainer>
                            <h4>Other</h4>
                            <Row>
                                <h5>Traits</h5>
                                <CharacterTraits
                                    traits={charTraits}
                                    edit
                                    addNewTrait={onAddTraitClick}
                                    removeTrait={onRemoveTraitClick}
                                />
                            </Row>
                            <br />
                            <Row>
                                <h5>Languages</h5>
                                <CharacterLanguages
                                    langList={charLanguages}
                                    edit={true}
                                    onAddLang={onAddLanguageClick}
                                    onRemoveLang={onRemoveLanguageClick}
                                />
                            </Row>
                            <br />
                            <Row>
                                <h5>Inventory</h5>
                                <Inventory
                                    onAddClick={() => setShowItemModal(true)}
                                    edit
                                />
                            </Row>
                            <br />
                            <Row>
                                <Form.Group>
                                    <Form.Label>
                                        <h5>Description/Notes</h5>
                                    </Form.Label>
                                    <DescriptionBox
                                        type="text"
                                        onChange={onDescChange}
                                        value={charDesc}
                                        as="textarea"
                                        data-testid="char-description-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group
                                    controlId="formFileLg"
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        Upload an image (TODO)
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".png,.jpeg"
                                        disabled
                                    />
                                </Form.Group>
                            </Row>
                        </Col>
                    </Row>
                    <Toast show={showToast} onClose={toggleToastOff}>
                        <Toast.Header>
                            <strong className="me-auto">Error</strong>
                        </Toast.Header>
                        <Toast.Body>
                            Something went wrong, please try again
                        </Toast.Body>
                    </Toast>
                    <SubmitButtonContainer>
                        <Button
                            type="submit"
                            size="lg"
                            data-testid="create-char-submit"
                        >
                            Create Character!
                        </Button>
                    </SubmitButtonContainer>
                </Form>
                <ItemModal
                    showModal={showItemModal}
                    closeModal={closeModal}
                    allEquipment={allEquipment}
                    categories={equipmentCategories}
                />
            </Container>
        </div>
    );
};

export default CharacterCreationPage;
