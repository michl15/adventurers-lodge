import { Button, Modal, Nav } from 'react-bootstrap';
import { Equipment, EquipmentCategory } from '../../constants/types';
import { useState } from 'react';
import EquipmentTab from './EquipmentTab';

type ItemModalProps = {
    allEquipment: Equipment[];
    categories: EquipmentCategory[];
    showModal: boolean;
    closeModal: () => void;
};

const ItemModal = ({
    allEquipment,
    categories,
    showModal,
    closeModal,
}: ItemModalProps) => {
    const [activeTab, setActiveTab] = useState('1');

    const renderActiveTab = () => {
        if (activeTab === '1') {
            return (
                <EquipmentTab
                    allEquipment={allEquipment}
                    categories={categories}
                />
            );
        } else {
            return <div>Not yet implemented</div>;
        }
    };

    const handleTabSelect = (eventKey: string | null) => {
        setActiveTab(eventKey || '');
    };

    return (
        <Modal
            show={showModal}
            onHide={() => {
                closeModal();
                setActiveTab("1");
            }}
            size="xl"
            data-testid="item-modal"
            scrollable
            id="item-modal"
        >
            <Modal.Header closeButton>
                <h4>Add equipment to your inventory</h4>
            </Modal.Header>
            <Modal.Body>
                <Nav
                    variant="tabs"
                    onSelect={handleTabSelect}
                    defaultActiveKey="1"
                    data-testid="item-modal-tab-bar"
                >
                    <Nav.Item>
                        <Nav.Link eventKey="1" data-testid="tab-1">
                            Equipment (DnD 5e)
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2" data-testid="tab-2">
                            Magical Items (DnD 5e)
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="3" data-testid="tab-3">
                            Custom Item
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {renderActiveTab()}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={closeModal} variant='info'>Done</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ItemModal;
