import { useState } from 'react';
import {
    Alert,
    Button,
    Col,
    Collapse,
    Container,
    Form,
    FormGroup,
    Row,
} from 'react-bootstrap';
import styled from 'styled-components';
import { SwapToCustomClass } from '../../Styled/CustomComponents';
import { EquipmentCategory } from '../../../constants/types';

const MidLine = styled.div`
    border-bottom: 1px solid lightgrey;
    margin-top: 15px;
`;

type CustomItemFormProps = {
    categories: EquipmentCategory[];
};

const CustomItemForm = ({ categories }: CustomItemFormProps) => {
    // form fields
    const [itemName, setItemName] = useState('');

    // flags
    const [expandDetails, setExpandDetails] = useState(false);
    const [useCustomCategory, setUseCustomCategory] = useState(false);

    const onItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    };

    return (
        <Container data-testid="custom-item-form">
            <Form>
                <br />
                <Row>
                    <FormGroup>
                        <Form.Label>Enter a name for the item*</Form.Label>
                        <Form.Control
                            value={itemName}
                            onChange={onItemNameChange}
                        />
                    </FormGroup>
                </Row>
                <br />
                <Row className="dflex justify-content-md-center">
                    <Col>
                        <MidLine />
                    </Col>
                    <Col md="auto">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setExpandDetails(!expandDetails)}
                        >
                            {expandDetails
                                ? 'Hide Optional Details'
                                : 'Show Optional Details'}
                        </Button>
                    </Col>
                    <Col>
                        <MidLine />
                    </Col>
                </Row>
                <br />
                <Collapse in={expandDetails}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Form.Label>Category</Form.Label>
                                <SwapToCustomClass
                                    onClick={() =>
                                        setUseCustomCategory(!useCustomCategory)
                                    }
                                >
                                    {useCustomCategory
                                        ? 'Use preset category'
                                        : 'Use custom category'}
                                </SwapToCustomClass>
                                {useCustomCategory ? (
                                    <Form.Control />
                                ) : (
                                    <Form.Select />
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                </Collapse>
                <br />
                <Row md="auto" className="dflex justify-content-md-center">
                    <Col>
                        <Alert variant="info">
                            <b>Note:</b> Please try to keep items unique - avoid
                            duplicates where possible, and use available 5e
                            equipment. You may need to select specific
                            categories to find special items.
                        </Alert>
                    </Col>
                </Row>
                <Row md="auto" className="dflex justify-content-md-center">
                    <Button>Submit</Button>
                </Row>
            </Form>
        </Container>
    );
};

export default CustomItemForm;
