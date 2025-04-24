import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Modal, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { filterSpellListByClass } from '../../util/util';
import { Spell } from '../../constants/types';
import SpellTable from '../SpellTable';

type SpellModalProps = {
    showSpellModal: boolean;
    closeModal: () => void;
    charClass: string;
};

const SpellModal = ({
    showSpellModal,
    closeModal,
    charClass,
}: SpellModalProps) => {
    const [classSpellList, setClassSpellList] = useState<Spell[]>([]);
    const [hasClassSpells, setHasClassSpells] = useState(
        charClass && classSpellList.length > 0
    );
    const [activeTab, setActiveTab] = useState('tab-1');
    const { spellList } = useSelector((state: RootState) => state.spells);

    const renderTab = () => {
        switch (activeTab) {
            case 'tab-1':
                return <SpellTable spellList={classSpellList} />;
            case 'tab-2':
                return <SpellTable spellList={spellList} />;
            case 'tab-3':
                return 'Not yet implemented';
            case 'tab-4':
                return 'not yet implemented';
            default:
                return null;
        }
    };

    const handleTabSelect = (eventKey: string | null) => {
        setActiveTab(eventKey || 'tab-1');
    };

    useEffect(() => {
        const filteredList = filterSpellListByClass(spellList, charClass);
        setClassSpellList(filteredList);
        setHasClassSpells(filteredList.length > 0);
        setActiveTab(filteredList.length > 0 ? 'tab-1' : 'tab-2');
    }, [spellList, charClass]);

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
                    defaultActiveKey={hasClassSpells ? 'tab-1' : 'tab-2'}
                >
                    {charClass && classSpellList.length > 0 ? (
                        <Nav.Item>
                            <Nav.Link
                                eventKey={'tab-1'}
                            >{`${charClass} Spells`}</Nav.Link>
                        </Nav.Item>
                    ) : null}
                    <Nav.Item>
                        <Nav.Link eventKey={'tab-2'}>All Spells (5e)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={'tab-3'}>Custom</Nav.Link>
                    </Nav.Item>
                    {charClass && classSpellList.length > 0 ? (
                        <Nav.Item>
                            <Nav.Link
                                eventKey={'tab-4'}
                            >{`${charClass} Spellcasting Info`}</Nav.Link>
                        </Nav.Item>
                    ) : null}
                </Nav>
                {renderTab()}
            </Modal.Body>
        </Modal>
    );
};

export default SpellModal;
