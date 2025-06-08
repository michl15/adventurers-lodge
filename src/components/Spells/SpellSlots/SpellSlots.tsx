import { useEffect, useState } from 'react';
import { Class, SpellsKnown, StatsTypes } from '../../../constants/types';
import { graphQuery } from '../../../graphql/queryUtil';
import { getSpellCastingData } from '../../../graphql/queries';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetSpellSlots,
    setSpellcastingInfo,
    setSpellSlots,
} from '../../../redux/SpellsReducer';
import { RootState } from '../../../redux';
import { Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { getClassSpellcasting } from '../../../graphql/characterClass';
import { calculateStatModifier } from '../../../util/calculations';
import { setCharSpellsPrepared } from '../../../redux/CharDataReducer';

type SpellSlotsProps = {
    charClass?: Class | null;
    charLvl?: number;
    spellsKnown: SpellsKnown;
    compact?: boolean;
    edit?: boolean;
};

type SpellSlotsSection = {
    name: string;
    known: number;
    available: number;
};

const SlotLabel = styled.span`
    font-size: 10px;
    margin-bottom: -5px;
`;

const SpellSlots = ({
    charClass,
    spellsKnown,
    compact,
    edit,
}: SpellSlotsProps) => {
    const { charStats, charSpellsPrepared, charLvl, spellcastingAbility } =
        useSelector((state: RootState) => state.charData);
    const { spellSlots } = useSelector((state: RootState) => state.spells);
    const [slotsSections, setSlotsSections] = useState<SpellSlotsSection[]>([]);
    const [isLoadingSpellSlots, setIsLoadingSpellSlots] = useState(true);
    //const [spellsPrepared, setSpellsPrepared] = useState(spellSlots?.spells_known)
    const dispatch = useDispatch();
    const getVariant = (available: number) => {
        if (available === 0 || available === null) {
            return 'secondary';
        } else {
            return 'none';
        }
    };

    useEffect(() => {
        const getSpellcastingAbility = async () => {
            if (spellcastingAbility) {
                return spellcastingAbility;
            } else if (charClass?.index) {
                const classResponse = await graphQuery(
                    getClassSpellcasting(charClass?.index)
                );
                const spellcastingAbility =
                    classResponse.class.spellcasting?.spellcasting_ability.name;
                return spellcastingAbility;
            } else {
                return '';
            }
        };

        const getSpellsPrepared = async () => {
            const spellcasting = await getSpellcastingAbility();
            const abilityKey = spellcasting?.toLowerCase();
            if (spellcasting && abilityKey !== '') {
                const statVal = charStats[abilityKey as keyof StatsTypes];
                const statBonus = calculateStatModifier(statVal);
                dispatch(setCharSpellsPrepared((charLvl || 0) + statBonus));
            } else {
                dispatch(setCharSpellsPrepared(0));
            }
        };

        getSpellsPrepared();
    }, [charLvl, charStats]);

    useEffect(() => {
        const fetchSpellCastingInfo = async () => {
            if (charLvl && charClass) {
                const response = await graphQuery(
                    getSpellCastingData(charLvl, charClass?.index)
                );
                if (response) {
                    const spellsAtLevel = response.level?.spellcasting;
                    if (spellsAtLevel) {
                        dispatch(setSpellSlots(spellsAtLevel));
                    } else {
                        dispatch(resetSpellSlots());
                    }
                    const classSpellCasting = response.class.spellcasting;
                    dispatch(setSpellcastingInfo(classSpellCasting));
                }
            }
            setIsLoadingSpellSlots(false);
        };
        fetchSpellCastingInfo();
    }, [charClass, charLvl, dispatch]);

    useEffect(() => {
        if (spellSlots && !isLoadingSpellSlots) {
            setSlotsSections([
                {
                    name: 'Cantrips',
                    known: spellsKnown.cantrips_known,
                    available: spellSlots.cantrips_known,
                },
                {
                    name: compact ? '1st' : '1st Level',
                    known: spellsKnown.spell_slots_level_1,
                    available: spellSlots.spell_slots_level_1,
                },
                {
                    name: compact ? '2nd' : '2nd Level',
                    known: spellsKnown.spell_slots_level_2,
                    available: spellSlots.spell_slots_level_2,
                },
                {
                    name: compact ? '3rd' : '3rd Level',
                    known: spellsKnown.spell_slots_level_3,
                    available: spellSlots.spell_slots_level_3,
                },
                {
                    name: compact ? '4th' : '4th Level',
                    known: spellsKnown.spell_slots_level_4,
                    available: spellSlots.spell_slots_level_4,
                },
                {
                    name: compact ? '5th' : '5th Level',
                    known: spellsKnown.spell_slots_level_5,
                    available: spellSlots.spell_slots_level_5,
                },
                {
                    name: compact ? '6th' : '6th Level',
                    known: spellsKnown.spell_slots_level_6,
                    available: spellSlots.spell_slots_level_6,
                },
                {
                    name: compact ? '7th' : '7th Level',
                    known: spellsKnown.spell_slots_level_7,
                    available: spellSlots.spell_slots_level_7,
                },
                {
                    name: compact ? '8th' : '8th Level',
                    known: spellsKnown.spell_slots_level_8,
                    available: spellSlots.spell_slots_level_8,
                },
                {
                    name: compact ? '9th' : '9th Level',
                    known: spellsKnown.spell_slots_level_9,
                    available: spellSlots.spell_slots_level_9,
                },
            ]);
        }
    }, [spellSlots, spellsKnown, charClass, charLvl, isLoadingSpellSlots]);

    return spellsKnown.spells_known || edit ? (
        <Container className="py-2">
            <h5 className="text-center">Spell Slots</h5>
            {!isLoadingSpellSlots ? (
                <>
                    <Container
                        className={`d-flex justify-content-md-center ${spellSlots && 'py-3'}`}
                    >
                        <Row md="auto">
                            <ListGroup horizontal>
                                {spellSlots &&
                                    slotsSections.map((section, index) => (
                                        <ListGroup.Item
                                            variant={getVariant(
                                                section.available
                                            )}
                                            key={`spell-slots-${index}`}
                                            style={{
                                                color:
                                                    section.available === 0 ||
                                                    section.available === null
                                                        ? 'grey'
                                                        : 'black',
                                            }}
                                        >
                                            <Row className="text-center">
                                                <small>{section.name}</small>
                                            </Row>
                                            <Row className="text-center">
                                                {compact ? (
                                                    <span>
                                                        {section.available || 0}
                                                    </span>
                                                ) : (
                                                    <h4>
                                                        {section.available || 0}
                                                    </h4>
                                                )}
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </Row>
                    </Container>
                    <h6 className="text-center">
                        Spells Prepared: {spellsKnown?.spells_known}/
                        {charSpellsPrepared}
                    </h6>
                </>
            ) : (
                <Spinner variant="info" className="my-3" />
            )}
        </Container>
    ) : (
        <Container>
            <div>No spells here, edit your character to add some</div>
        </Container>
    );
};

export default SpellSlots;
