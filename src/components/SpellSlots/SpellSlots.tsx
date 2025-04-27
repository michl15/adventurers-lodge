import { useEffect, useState } from 'react';
import { Class, SpellsKnown } from '../../constants/types';
import { graphQuery } from '../../graphql/queryUtil';
import { getSpellCastingData } from '../../graphql/queries';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetSpellSlots,
    setSpellcastingInfo,
    setSpellSlots,
} from '../../redux/SpellsReducer';
import { RootState } from '../../redux';
import { Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import styled from 'styled-components';

type SpellSlotsProps = {
    charClass?: Class | null;
    charLvl?: number;
    spellsKnown: SpellsKnown;
    compact?: boolean;
};

type SpellSlotsSection = {
    name: string;
    known: number;
    available: number;
};

const SlotLabel = styled.span`
    font-size: 14px;
    margin-bottom: -5px;
`;

const SpellSlots = ({
    charClass,
    charLvl,
    spellsKnown,
    compact,
}: SpellSlotsProps) => {
    const [slotsSections, setSlotsSections] = useState<SpellSlotsSection[]>([]);
    const [isLoadingSpellSlots, setIsLoadingSpellSlots] = useState(true);
    const dispatch = useDispatch();

    const { spellSlots } = useSelector((state: RootState) => state.spells);
    const getVariant = (known: number, available: number) => {
        if (known > available) {
            return 'danger';
        } else if (available > 0 && known === available) {
            return 'success';
        } else if (available === 0 || available === null) {
            return 'secondary';
        } else {
            return 'none';
        }
    };

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
                    name: '1st Level',
                    known: spellsKnown.spell_slots_level_1,
                    available: spellSlots.spell_slots_level_1,
                },
                {
                    name: '2nd Level',
                    known: spellsKnown.spell_slots_level_2,
                    available: spellSlots.spell_slots_level_2,
                },
                {
                    name: '3rd Level',
                    known: spellsKnown.spell_slots_level_3,
                    available: spellSlots.spell_slots_level_3,
                },
                {
                    name: '4th Level',
                    known: spellsKnown.spell_slots_level_4,
                    available: spellSlots.spell_slots_level_4,
                },
                {
                    name: '5th Level',
                    known: spellsKnown.spell_slots_level_5,
                    available: spellSlots.spell_slots_level_5,
                },
                {
                    name: '6th Level',
                    known: spellsKnown.spell_slots_level_6,
                    available: spellSlots.spell_slots_level_6,
                },
                {
                    name: '7th Level',
                    known: spellsKnown.spell_slots_level_7,
                    available: spellSlots.spell_slots_level_7,
                },
                {
                    name: '8th Level',
                    known: spellsKnown.spell_slots_level_8,
                    available: spellSlots.spell_slots_level_8,
                },
                {
                    name: '9th Level',
                    known: spellsKnown.spell_slots_level_9,
                    available: spellSlots.spell_slots_level_9,
                },
            ]);
        }
    }, [spellSlots, spellsKnown, charClass, charLvl, isLoadingSpellSlots]);

    return (
        <Container
            className={`d-flex justify-content-md-center ${spellSlots && 'py-3'}`}
        >
            {!isLoadingSpellSlots ? (
                <ListGroup horizontal className="d-flex">
                    {spellSlots &&
                        slotsSections.map((section, index) => (
                            <ListGroup.Item
                                variant={getVariant(
                                    section.known,
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
                                    <SlotLabel>{section.name}</SlotLabel>
                                </Row>
                                <Row className="text-center">
                                    {compact ? (
                                        <span>
                                            {section.known}/
                                            {section.available || 0}
                                        </span>
                                    ) : (
                                        <h5>
                                            {section.known}/
                                            {section.available || 0}
                                        </h5>
                                    )}
                                </Row>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            ) : (
                <Spinner variant="info" className="my-3" />
            )}
        </Container>
    );
};

export default SpellSlots;
