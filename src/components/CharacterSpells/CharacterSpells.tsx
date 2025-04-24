import { useEffect, useState } from 'react';
import { Accordion, Container, ListGroup, Row } from 'react-bootstrap';
import SpellModal from '../SpellModal';
import { graphQuery } from '../../graphql/queryUtil';
import { getAllSpells } from '../../graphql/queries';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setSpells, setSpellsLoading } from '../../redux/SpellsReducer';
import { Spell } from '../../constants/types';
import { PlusCircle } from 'react-bootstrap-icons';
import styled from 'styled-components';
import SpellSection from './SpellSection';

type CharacterSpellsProps = {
    charClass: string;
    edit?: boolean;
};

type Section = {
    name: string;
    spells: Spell[];
};

const AddSpellButton = styled(ListGroup.Item)`
    &:hover {
        cursor: pointer;
    }
`;

const CharacterSpells = ({ charClass, edit }: CharacterSpellsProps) => {
    const [showSpellModal, setShowSpellModal] = useState(false);

    // spell lists by level
    const [cantrips, setCantrips] = useState<Spell[]>([]);
    const [firstLvl, setFirstLvl] = useState<Spell[]>([]);
    const [secondLvl, setSecondLvl] = useState<Spell[]>([]);
    const [thirdLvl, setThirdLvl] = useState<Spell[]>([]);
    const [fourthLvl, setFourthLvl] = useState<Spell[]>([]);
    const [fifthLvl, setFifthLvl] = useState<Spell[]>([]);
    const [sixthLvl, setSixthLvl] = useState<Spell[]>([]);
    const [seventhLvl, setSeventhLvl] = useState<Spell[]>([]);
    const [eighthLvl, setEighthLvl] = useState<Spell[]>([]);
    const [ninthLvl, setNinthLvl] = useState<Spell[]>([]);

    const [spellSections, setSpellSections] = useState<Section[]>([]);

    const { spellList, charSpells } = useSelector(
        (state: RootState) => state.spells
    );
    const dispatch = useDispatch();

    const renderSection = (sectionList: Section[]) => {
        return sectionList.map((section, index) => {
            return (
                <SpellSection
                    spellList={section.spells}
                    name={section.name}
                    edit={edit}
                />
            );
        });
    };

    useEffect(() => {
        const fetchSpells = async () => {
            if (spellList.length === 0) {
                const response = await graphQuery(getAllSpells());
                if (response) {
                    dispatch(setSpells(response.spells));
                }
            }
            dispatch(setSpellsLoading(false));
        };

        fetchSpells();
    }, [dispatch, spellList]);

    useEffect(() => {
        setCantrips(charSpells.filter((spell) => spell.level === 0));
        setFirstLvl(charSpells.filter((spell) => spell.level === 1));
        setSecondLvl(charSpells.filter((spell) => spell.level === 2));
        setThirdLvl(charSpells.filter((spell) => spell.level === 3));
        setFourthLvl(charSpells.filter((spell) => spell.level === 4));
        setFifthLvl(charSpells.filter((spell) => spell.level === 5));
        setSixthLvl(charSpells.filter((spell) => spell.level === 6));
        setSeventhLvl(charSpells.filter((spell) => spell.level === 7));
        setEighthLvl(charSpells.filter((spell) => spell.level === 8));
        setNinthLvl(charSpells.filter((spell) => spell.level === 9));
    }, [charSpells]);

    useEffect(() => {
        setSpellSections([
            {
                name: 'Cantrips',
                spells: cantrips,
            },
            {
                name: 'First Level',
                spells: firstLvl,
            },
            {
                name: 'Second Level',
                spells: secondLvl,
            },
            {
                name: 'Third Level',
                spells: thirdLvl,
            },
            {
                name: 'Fourth Level',
                spells: fourthLvl,
            },
            {
                name: 'Fifth Level',
                spells: fifthLvl,
            },
            {
                name: 'Sixth Level',
                spells: sixthLvl,
            },
            {
                name: 'Seventh Level',
                spells: seventhLvl,
            },
            {
                name: 'Eighth Level',
                spells: eighthLvl,
            },
            {
                name: 'Ninth Level',
                spells: ninthLvl,
            },
        ]);
    }, [
        cantrips,
        firstLvl,
        secondLvl,
        thirdLvl,
        fourthLvl,
        fifthLvl,
        sixthLvl,
        seventhLvl,
        eighthLvl,
        ninthLvl,
    ]);

    const emptySpells = () => {
        for (let i in spellSections) {
            if (spellSections[i].spells.length !== 0) {
                return false;
            }
        }
        return true;
    };
    const getAddButtonStyle = () => {
        if (!emptySpells()) {
            return {
                borderTopLeftRadius: '0%',
                borderTopRightRadius: '0%',
                borderTop: '0',
            };
        }
    };

    return (
        <Container>
            <Row>
                <Accordion alwaysOpen>
                    {renderSection(spellSections)}
                    {edit && (
                        <ListGroup>
                            <AddSpellButton
                                onClick={() => setShowSpellModal(true)}
                                style={getAddButtonStyle()}
                            >
                                <PlusCircle
                                    style={{
                                        marginRight: '10px',
                                        marginBottom: '4px',
                                    }}
                                />{' '}
                                Add a spell
                            </AddSpellButton>
                        </ListGroup>
                    )}
                </Accordion>
            </Row>
            <SpellModal
                showSpellModal={showSpellModal}
                closeModal={() => setShowSpellModal(false)}
                charClass={charClass}
            />
        </Container>
    );
};

export default CharacterSpells;
