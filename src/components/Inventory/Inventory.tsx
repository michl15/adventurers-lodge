import {
    Button,
    ButtonGroup,
    Col,
    Container,
    ListGroup,
    Row,
} from 'react-bootstrap';
import { Equipment } from '../../constants/types';
import styled from 'styled-components';
import { PlusCircle } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { updateItemQuantity } from '../../redux/InventoryReducer';

type InventoryProps = {
    onAddClick?: () => void;
    edit?: boolean;
};

const LeftCol = styled(Col)`
    border-right: 1px solid #dee2e6;
    width: 35px;
`;

const CounterButtons = styled(Button)`
    height: 25px;
    width: 25px;
    padding-bottom: 9px;
`;

const AddButton = styled(ListGroup.Item)`
    &:hover {
        cursor: pointer;
    }
`;

const Inventory = ({ onAddClick, edit }: InventoryProps) => {
    const inventory = useSelector(
        (state: RootState) => state.inventory.inventoryList
    );
    const dispatch = useDispatch();

    const findInInventory = (index: string) => {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].index === index) {
                return i;
            }
        }
        return -1;
    };

    const onIncrementClick = (item: Equipment) => {
        const ind = item.index;
        let itemIndex = findInInventory(ind);
        if (itemIndex >= 0) {
            dispatch(
                updateItemQuantity({
                    value: (item.quantity || 0) + 1,
                    index: itemIndex,
                })
            );
        }
    };

    const onDecrementClick = (item: Equipment) => {
        const ind = item.index;
        let itemIndex = findInInventory(ind);
        if (item.quantity && itemIndex >= 0) {
            dispatch(
                updateItemQuantity({
                    value: (item.quantity || 0) - 1,
                    index: itemIndex,
                })
            );
        }
    };

    const renderEquipment = () => {
        return inventory.map((item: Equipment) => {
            return (
                <ListGroup.Item key={`inventory-${item.index}`}>
                    <Row>
                        <LeftCol md="auto">{item.quantity || 1}</LeftCol>
                        <Col>{item.name}</Col>
                        {edit && (
                            <Col md="auto">
                                <ButtonGroup>
                                    <CounterButtons
                                        size="sm"
                                        variant="outline-danger"
                                        className="d-flex justify-content-center align-items-center"
                                        onClick={() => {
                                            onDecrementClick(item);
                                        }}
                                    >
                                        -
                                    </CounterButtons>
                                    <CounterButtons
                                        size="sm"
                                        variant="outline-primary"
                                        className="d-flex justify-content-center align-items-center"
                                        onClick={() => {
                                            onIncrementClick(item);
                                        }}
                                    >
                                        +
                                    </CounterButtons>
                                </ButtonGroup>
                            </Col>
                        )}
                    </Row>
                </ListGroup.Item>
            );
        });
    };

    return (
        <Container>
            <ListGroup>
                {renderEquipment()}
                {edit && (
                    <AddButton onClick={onAddClick}>
                        <PlusCircle
                            style={{ marginRight: '10px', marginBottom: '4px' }}
                        />
                        Add an item
                    </AddButton>
                )}
            </ListGroup>
        </Container>
    );
};

export default Inventory;
