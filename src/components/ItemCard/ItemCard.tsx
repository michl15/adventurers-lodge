import { Card, Container, Row } from "react-bootstrap";
import { EquipmentData } from "../../constants/types";

type ItemCardProps = {
    itemData: EquipmentData
}

const ItemCard = ({ itemData }: ItemCardProps) => {
    return (
        <Card data-testid={`item-card-${itemData.name}`}>
            <Card.Title>
                {itemData.name}
            </Card.Title>
            <Card.Body>
                <Container>
                    <Row>
                        {itemData.cost && <span>Cost: {itemData.cost.quantity} {itemData.cost.unit}</span>}
                    </Row>
                    <Row>
                        {itemData.equipment_category && <span>Category: {itemData.equipment_category.name}</span>}
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

export default ItemCard;