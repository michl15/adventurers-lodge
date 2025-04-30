import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Row,
    Spinner,
} from 'react-bootstrap';
import { get, push, ref, set, update } from 'firebase/database';
import { Toast } from 'react-bootstrap';
import { firebaseDatabase } from '../../firebase/firebase';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import {
    BASE_SAVING_THROWS,
    BASE_STATS,
    DEFAULT_PROFICIENCIES,
} from '../../constants/constants';
import {
    calculateProficiencyBonus,
    calculateStatModifier,
    rollStat,
} from '../../util/calculations';
import Proficiencies from '../Proficiencies';
import {
    AbilityBonus,
    Class,
    ClassInfo,
    EquipmentCategory,
    Language,
    ProficienciesTypes,
    Race,
    SavingThrowsTypes,
    StatsTypes,
    Trait,
} from '../../constants/types';
import Dropdown from './Dropdown';
import CharacterLanguages from '../CharacterLanguages';
import CharacterTraits from '../CharacterTraits';
import Inventory from '../Inventory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { resetInventory, setInventory } from '../../redux/InventoryReducer';
import CharacterAccessDenied from './CharacterAccessDenied';
import { graphQuery } from '../../graphql/queryUtil';
import {
    getAllClasses,
    getAllEquipmentCategories,
    getAllRaces,
    getClassProficiencies,
    getRaceData,
} from '../../graphql/queries';
import CharacterSpells from '../CharacterSpells';
import {
    resetCharSpells,
    resetSelectedSpellState,
    resetSpellcasting,
    resetSpellSlots,
    setCharSpells,
} from '../../redux/SpellsReducer';
import { getIndexFromString } from '../../util/stringFormatting';
import CharacterSavingThrows from '../CharacterSavingThrows';

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

type CharacterCreationPageProps = {
    editMode?: boolean;
};

const CharacterCreationPage = ({ editMode }: CharacterCreationPageProps) => {
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
    const [equipmentCategories, setEquipmentCategories] = useState<
        EquipmentCategory[]
    >([]);
    const [charSavingThrows, setCharSavingThrows] =
        useState<SavingThrowsTypes>(BASE_SAVING_THROWS);

    // flags
    const [validated, setValidated] = useState(false);
    const [customClass, setCustomClass] = useState(false);
    const [customRace, setCustomRace] = useState(false);
    const [statsApplied, setStatsApplied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [editable, setEditable] = useState(editMode);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);
    const [isLoadingRaces, setIsLoadingRaces] = useState(true);
    const [isLoadingProficiencies, setIsLoadingProficiencies] = useState(false);
    const [isLoadingRaceInfo, setIsLoadingRaceInfo] = useState(false);

    // options for dropdowns
    const [classOptions, setClassOptions] = useState<Class[]>([]);
    const [raceOptions, setRaceOptions] = useState<Race[]>([]);

    // data for selected class/race
    const [proficienciesInfo, setProficienciesInfo] = useState('');
    const [statBonuses, setStatBonuses] = useState<AbilityBonus[]>([]);

    // user data for current user
    const user = useSelector((state: RootState) => state.user.user);

    // redux
    const inventory = useSelector(
        (state: RootState) => state.inventory.inventoryList
    );
    const { charSpells } = useSelector((state: RootState) => state.spells);
    const dispatch = useDispatch();

    // #endregion State
    // hook for React Router navigation
    const navigate = useNavigate();

    // Toast toggle utility fn
    const toggleToast = () => setShowToast(true);
    const toggleToastOff = () => setShowToast(false);

    const { charId } = useParams();

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
                index: getIndexFromString(event.target.value),
            });
        } else {
            setCharClass(null);
        }
    };

    const onClassDropdownChange = async (selectedClass: Class | null) => {
        setValidated(false);
        setCharClass(selectedClass);
        if (selectedClass?.index) {
            setIsLoadingProficiencies(true);
            const response = await graphQuery(
                getClassProficiencies(selectedClass.index)
            );
            if (response) {
                const classInfo: ClassInfo = response.class;
                setHitDie(classInfo.hit_die);
                setCharMaxHP(
                    classInfo.hit_die + calculateStatModifier(charStats['con'])
                );
                if (classInfo.proficiency_choices) {
                    setProficienciesInfo(classInfo.proficiency_choices[0].desc);
                }

                const savingThrows = classInfo.saving_throws;
                let newSavingThrows = BASE_SAVING_THROWS;
                if (savingThrows && savingThrows.length > 0) {
                    for (const i in savingThrows) {
                        newSavingThrows = {
                            ...newSavingThrows,
                            [savingThrows[i].name.toLowerCase()]: true,
                        };
                    }
                }
                setCharSavingThrows({ ...newSavingThrows });
            }
            setIsLoadingProficiencies(false);
        } else {
            setCharSavingThrows(BASE_SAVING_THROWS);
        }
    };

    const onRaceDropdownChange = async (race: Race | null) => {
        setValidated(false);
        setCharRace(race);
        setStatsApplied(false);
        if (race?.index) {
            setIsLoadingRaceInfo(true);
            const response = await graphQuery(getRaceData(race.index));
            if (response) {
                // ability bonuses
                const abilityBonuses = response.race.ability_bonuses;
                setStatBonuses(abilityBonuses);

                // languages
                const languages = response.race.languages;
                languages.forEach((lang: Language) => {
                    lang.source = race.name;
                });
                const removeOld = charLanguages.filter(
                    (lang) => lang.source === false
                );

                const newLanguages: Language[] = [...removeOld, ...languages];
                setCharLanguages(newLanguages);

                const traits = response.race.traits;
                traits.forEach((trait: Trait) => {
                    trait.source = race.name;
                });
                const removeOldTraits = charTraits.filter(
                    (trait) => trait.source === false
                );
                const newTraits: Trait[] = [...removeOldTraits, ...traits];
                setCharTraits(newTraits);
            }
            setIsLoadingRaceInfo(false);
        } else {
            removeOldValues();
        }
    };

    const onRaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValidated(false);
        if (event.target.value) {
            const newRace = {
                name: event.target.value,
                index: getIndexFromString(event.target.value),
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

    const onSavingThrowChange = (stat: string) => {
        setCharSavingThrows({
            ...charSavingThrows,
            [stat]: !charSavingThrows[stat],
        });
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

        if (user && form.checkValidity() && !editable) {
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
                owner: user.uid,
                spells: charSpells,
                savingThrows: charSavingThrows,
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
        } else if (editable && form.checkValidity()) {
            const charRef = ref(firebaseDatabase, `characters/${charId}`);

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
                spells: charSpells,
                savingThrows: charSavingThrows,
            };
            update(charRef, charData)
                .then(() => {
                    navigate(`/characters/${charId}`);
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
            let adjustedStat;
            if (!statsApplied) {
                adjustedStat =
                    charStats[stat as keyof StatsTypes] + statBonuses[i].bonus;
                setStatsApplied(true);
            } else {
                adjustedStat =
                    charStats[stat as keyof StatsTypes] - statBonuses[i].bonus;
                setStatsApplied(false);
            }
            newCharStats = { ...newCharStats, [stat]: adjustedStat };
        }
        setCharStats(newCharStats);
    };

    const onCancelEdit = () => {
        navigate(`/characters/${charId}`);
    };

    // #endregion onClick handlers
    /* ===================================== Initial API fetches ======================================== */
    // #region API calls
    const getClasses = async () => {
        const response = await graphQuery(getAllClasses());
        if (response) {
            setClassOptions(response.classes);
        }
        setIsLoadingClasses(false);
    };

    const getRaces = async () => {
        const response = await graphQuery(getAllRaces());
        if (response) {
            setRaceOptions(response.races);
        }
        setIsLoadingRaces(false);
    };

    const getEquipmentCategories = async () => {
        const response = await graphQuery(getAllEquipmentCategories());
        if (response) {
            setEquipmentCategories(response.equipmentCategories);
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (editMode && !isLoadingClasses && !isLoadingRaces) {
            const fetchInitialValues = async () => {
                const charRef = ref(firebaseDatabase, `/characters/${charId}`);
                const response = await get(charRef);
                if (response.exists()) {
                    const charData = response.val();
                    if (charData.owner !== user?.uid) {
                        setEditable(false);
                        setIsLoadingInitial(false);
                        return;
                    }
                    await onRaceDropdownChange(charData.race);
                    await onClassDropdownChange(charData.class);
                    setCharStats(charData.stats);
                    setEditable(true);
                    setCharDesc(charData.description);
                    setCharLvl(charData.level);
                    setCharLanguages(charData.languages || []);
                    setCharTraits(charData.traits || []);
                    setCharSkills(charData.skills);
                    if (charData.inventory) {
                        dispatch(setInventory(charData.inventory));
                    }
                    if (charData.spells) {
                        dispatch(setCharSpells(charData.spells));
                    }
                    setCharName(charData.name);
                    setCharMaxHP(charData.maxHP);
                    setCharSavingThrows(
                        charData.savingThrows || BASE_SAVING_THROWS
                    );
                } else {
                    setEditable(false);
                }
                setIsLoadingInitial(false);
            };
            fetchInitialValues();
        }
        // eslint-disable-next-line
    }, [
        editMode,
        charId,
        dispatch,
        user?.uid,
        isLoadingClasses,
        isLoadingRaces,
    ]);

    useEffect(() => {
        //on unmount, reset inventory
        return () => {
            dispatch(resetInventory());
            dispatch(resetCharSpells());
            dispatch(resetSelectedSpellState());
            dispatch(resetSpellSlots());
            dispatch(resetSpellcasting());
            dispatch(resetCharSpells());
        };
    }, [dispatch]);

    return (
        <div data-testid="character-creation-page-container">
            {editMode && !editable && !isLoadingInitial ? (
                <CharacterAccessDenied />
            ) : (
                <Container fluid>
                    <div className="d-flex justify-content-center">
                        <h2>
                            {editMode
                                ? 'Edit a Character'
                                : 'Create a Character'}
                        </h2>
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
                                        maxLength={50}
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
                                            defaultValue={charRace?.name}
                                            loading={isLoadingRaces}
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
                                            defaultValue={charClass?.name}
                                            loading={isLoadingClasses}
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
                                    <b>{charClass?.name}:</b>{' '}
                                    {isLoadingProficiencies ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        proficienciesInfo
                                    )}
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
                                            show={
                                                !customRace && charRace !== null
                                            }
                                            variant="info"
                                            data-testid="race-info-alert"
                                        >
                                            <Row>
                                                <Col className="d-flex my-auto">
                                                    <span>
                                                        <b>{charRace?.name}</b>:{' '}
                                                        {isLoadingRaceInfo ? (
                                                            <Spinner
                                                                size="sm"
                                                                className="my-auto"
                                                            />
                                                        ) : (
                                                            statInfo()
                                                        )}
                                                    </span>
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
                                                    >
                                                        {statsApplied
                                                            ? 'Undo Apply Bonuses'
                                                            : 'Apply Bonuses'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Alert>
                                    </Row>
                                    <Row>{renderStatsForm()}</Row>
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
                                    <Row>
                                        <span>Saving Throws</span>
                                        <CharacterSavingThrows
                                            charSavingThrows={charSavingThrows}
                                            charStats={charStats}
                                            charLvl={Number(charLvl)}
                                            onCheckChange={onSavingThrowChange}
                                            edit
                                        />
                                    </Row>
                                </StatsRowContainer>
                                <h4>Other</h4>
                                <Row>
                                    <h5>Inventory</h5>
                                    <Inventory
                                        categories={equipmentCategories}
                                        edit
                                    />
                                </Row>
                                <br />
                                <Row>
                                    <h5>Spells</h5>
                                    <CharacterSpells
                                        charClass={charClass}
                                        charLvl={Number(charLvl)}
                                        edit
                                    />
                                </Row>
                                <br />
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
                                style={{ marginRight: '10px' }}
                            >
                                {editMode ? 'Save' : 'Create Character!'}
                            </Button>
                            {editMode ? (
                                <Button
                                    size="lg"
                                    variant="outline-secondary"
                                    onClick={onCancelEdit}
                                    data-testid="edit-cancel-btn"
                                >
                                    Cancel
                                </Button>
                            ) : null}
                        </SubmitButtonContainer>
                    </Form>
                </Container>
            )}
        </div>
    );
};

export default CharacterCreationPage;
