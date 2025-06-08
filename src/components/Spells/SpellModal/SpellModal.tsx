import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Alert, Container, Modal, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Class, Spell, SpellsKnown } from '../../../constants/types';
import SpellTable from '../SpellTable';
import SpellSlots from '../SpellSlots';
import { filterSpellListByClass } from '../../../util/util';
import { ExclamationCircle } from 'react-bootstrap-icons';

type SpellModalProps = {
    showSpellModal: boolean;
    closeModal: () => void;
    charClass?: Class | null;
    spellsKnown: SpellsKnown;
    charLvl?: number;
};

const SpellModal = ({
    showSpellModal,
    closeModal,
    charClass,
    charLvl,
    spellsKnown,
}: SpellModalProps) => {
    const [activeTab, setActiveTab] = useState('tab-1');
    const [classSpellList, setClassSpellList] = useState<Spell[]>([]);
    const { spellList } = useSelector((state: RootState) => state.spells);

    const renderTab = () => {
        switch (activeTab) {
            case 'tab-1':
                if (classSpellList?.length > 0 && charClass) {
                    return (
                        <SpellTable
                            spellList={spellList}
                            charClass={charClass}
                        />
                    );
                }
                return (
                    <Container>
                        <Alert className="my-3">
                            <ExclamationCircle
                                style={{ margin: '0px 10px 3px 0px' }}
                            />
                            The class {charClass?.name || 'you selected'} has no
                            spellcasting data. Displaying all spells.
                        </Alert>
                        <SpellTable
                            spellList={spellList}
                            charClass={charClass}
                        />
                    </Container>
                );
            case 'tab-2':
                return 'Not yet implemented';
            case 'tab-3':
                return 'not yet implemented';
            default:
                return null;
        }
    };

    const handleTabSelect = (eventKey: string | null) => {
        setActiveTab(eventKey || 'tab-1');
    };

    useEffect(() => {
        if (charClass) {
            setClassSpellList(
                filterSpellListByClass(spellList, charClass?.index)
            );
        }
    }, [spellList, charClass]);

    return (
        <Modal
            show={showSpellModal}
            onHide={() => {
                closeModal();
            }}
            size="xl"
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title>Spells</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Nav
                    variant="tabs"
                    onSelect={handleTabSelect}
                    defaultActiveKey={'tab-1'}
                >
                    <Nav.Item>
                        <Nav.Link eventKey={'tab-1'}>All Spells (5e)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'tab-2'}>Custom</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'tab-3'}>
                            Class Spellcasting Info
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <SpellSlots
                    spellsKnown={spellsKnown}
                    charClass={charClass}
                    charLvl={charLvl}
                    compact
                    edit
                />
                {renderTab()}
            </Modal.Body>
        </Modal>
    );
};

export default SpellModal;
