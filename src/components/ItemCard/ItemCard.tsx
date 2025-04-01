import { Card, Container, ListGroup, Row } from 'react-bootstrap';
import { EquipmentData } from '../../constants/types';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { addItem, updateItemQuantity } from '../../redux/InventoryReducer';

type ItemCardProps = {
    itemData: EquipmentData;
};

const ItemDescriptionTag = styled.div`
    color: darkgrey;
    font-style: italic;
    margin-top: 5px;
`;
const Item = styled(Card)`
    padding: 10px 10px;
    margin: 10px 0px;
`;

const CounterButtons = styled(ListGroup.Item)`
    &:hover {
        cursor: pointer;
        background-color: #dee2e6;
    }
    user-select: none;
`;

const ItemCard = ({ itemData }: ItemCardProps) => {
    const inventory = useSelector(
        (state: RootState) => state.inventory.inventoryList
    );
    const [itemCounter, setItemCounter] = useState(0);
    const dispatch = useDispatch();

    const getItemCategory = () => {
        if (itemData.weapon_category) {
            return `(${itemData.weapon_category})`;
        } else if (itemData.armor_category) {
            return `(${itemData.armor_category})`;
        }
    };

    const getItemDesc = () => {
        if (itemData.desc) {
            if (itemData.desc.length > 1) {
                const firstItem = itemData.desc[0];

                return (
                    <div>
                        <ItemDescriptionTag>{firstItem}</ItemDescriptionTag>
                        {itemData.desc.map((info, index) => (
                            <p key={`item-data-${index}`}>
                                {index !== 0 && info}
                            </p>
                        ))}
                    </div>
                );
            } else if (itemData.desc.length <= 1) {
                return (
                    <div>
                        <p>{itemData.desc[0]}</p>
                    </div>
                );
            }
        }
    };

    const findInInventory = (index: string) => {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].index === index) {
                return i;
            }
        }
        return -1;
    };

    const onIncrementClick = () => {
        const newCount = itemCounter + 1;
        setItemCounter(newCount);
        const ind = itemData.index;
        let itemIndex = findInInventory(ind);
        if (itemIndex >= 0) {
            dispatch(updateItemQuantity({ value: newCount, index: itemIndex }));
        } else {
            const newItem = {
                name: itemData.name,
                index: itemData.index,
                quantity: newCount,
                url: itemData.url,
            };
            dispatch(addItem(newItem));
        }
    };

    const onDecrementClick = () => {
        if (itemCounter > 0) {
            const newCount = itemCounter - 1;
            setItemCounter(newCount);
            const ind = itemData.index;
            let itemIndex = findInInventory(ind);
            if (itemIndex >= 0) {
                dispatch(
                    updateItemQuantity({ value: newCount, index: itemIndex })
                );
            }
        }
    };

    const disabledStyle = () => {
        return itemCounter === 0
            ? {
                  color: '#dee2e6',
              }
            : {};
    };

    const addItemCounter = () => {
        return (
            <Row className="d-flex justify-content-center">
                <ListGroup horizontal>
                    <CounterButtons
                        key="decrement-item"
                        onClick={onDecrementClick}
                        disabled={itemCounter === 0}
                        style={disabledStyle()}
                    >
                        -
                    </CounterButtons>
                    <ListGroup.Item key="item-quantity">
                        {itemCounter}
                    </ListGroup.Item>
                    <CounterButtons
                        key="increment-item"
                        onClick={onIncrementClick}
                    >
                        +
                    </CounterButtons>
                </ListGroup>
            </Row>
        );
    };

    useEffect(() => {
        console.log('itemcard rendering');
        const ind = itemData.index;
        let itemIndex = findInInventory(ind);
        if (itemIndex >= 0) {
            setItemCounter(inventory[itemIndex].quantity || 0);
        } else {
            setItemCounter(0);
        }
    }, []);

    return (
        <Item data-testid={`item-card-${itemData.name}`}>
            <Card.Title>{itemData.name}</Card.Title>
            <Card.Body>
                <Container>
                    {itemData.cost && (
                        <Row>
                            <span>
                                <b>Cost:</b> {itemData.cost.quantity}{' '}
                                {itemData.cost.unit}
                            </span>
                        </Row>
                    )}
                    {itemData.equipment_category && (
                        <Row>
                            <span>
                                <b>Category:</b>{' '}
                                {itemData.equipment_category.name}{' '}
                                {getItemCategory()}
                            </span>
                        </Row>
                    )}
                    {itemData.damage && (
                        <Row>
                            <span>
                                <b>Damage:</b> {itemData.damage.damage_dice}{' '}
                                {itemData.damage.damage_type.name}
                            </span>
                        </Row>
                    )}
                    {itemData.desc && <Row>{getItemDesc()}</Row>}

                    {addItemCounter()}
                </Container>
            </Card.Body>
        </Item>
    );
};

export default ItemCard;
