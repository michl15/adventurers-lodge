import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Modal, Nav } from 'react-bootstrap';
import { useState } from 'react';
import { Class, SpellsKnown } from '../../constants/types';
import SpellTable from '../SpellTable';
import SpellSlots from '../SpellSlots';

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
    const { spellList } = useSelector((state: RootState) => state.spells);

    const renderTab = () => {
        switch (activeTab) {
            case 'tab-1':
                return <SpellTable spellList={spellList} />;
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

    return (
        <Modal
            show={showSpellModal}
            onHide={() => {
                closeModal();
            }}
            size="xl"
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
                            {' '}
                            Class Spellcasting Info
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <SpellSlots
                    spellsKnown={spellsKnown}
                    charClass={charClass}
                    charLvl={charLvl}
                    compact
                />
                {renderTab()}
            </Modal.Body>
        </Modal>
    );
};

export default SpellModal;
