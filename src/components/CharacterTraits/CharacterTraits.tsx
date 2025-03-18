import { Accordion, Button, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { Trait } from '../../constants/types';
import styled from 'styled-components';
import { PlusCircle, Trash3Fill } from 'react-bootstrap-icons';
import { useState } from 'react';

type CharacterTraitsProps = {
    traits: Trait[] | null;
    edit: boolean;
    addNewTrait?: (newTrait: Trait) => void;
    removeTrait?: (index: string) => void;
};

const SourceInfo = styled.p`
    font-style: italic;
    color: darkgray;
`;

const FormButton = styled(Button)`
    margin: 10px 10px 0px 10px;
`;

const CharacterTraits = ({
    traits,
    edit,
    addNewTrait,
    removeTrait,
}: CharacterTraitsProps) => {
    const [traitName, setTraitName] = useState('');
    const [traitInfo, setTraitInfo] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const renderTraits = () => {
        return traits?.map((trait) => {
            return (
                <Accordion.Item eventKey={trait.index} key={trait.index}>
                    <Accordion.Header>{trait.name}</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col>
                                {trait.source && (
                                    <SourceInfo>
                                        From <b>{trait.source}</b>
                                    </SourceInfo>
                                )}
                                {trait.info}
                            </Col>
                            <Col
                                md="auto"
                                className="d-flex justify-content-end mb-auto mt-1"
                            >
                                {edit && removeTrait && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        style={{ marginRight: '10px' }}
                                        onClick={() => {
                                            removeTrait(trait.index);
                                        }}
                                    >
                                        <Trash3Fill
                                            style={{ marginBottom: '5px' }}
                                        />
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            );
        });
    };

    const onTraitNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTraitName(event.currentTarget.value);
        setIsValidName(true);
    };

    const onTraitInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTraitInfo(event.currentTarget.value);
    };

    const onAddClick = () => {
        const trimmedName = traitName.trim();
        const index = trimmedName.replace(/\s+/g, '-').toLowerCase();

        // make sure there is a value and the index is unique
        if (
            trimmedName &&
            traits?.filter((trait) => trait.index === index).length === 0
        ) {
            setIsValidName(true);
            console.log('add');
            const newTrait: Trait = {
                name: traitName,
                info: traitInfo,
                index: index,
                url: false,
                source: false,
            };
            if (addNewTrait) {
                addNewTrait(newTrait);
            }
            setTraitInfo('');
            setTraitName('');
        } else {
            setIsValidName(false);
        }
    };

    const addTrait = () => {
        return (
            <Accordion.Item eventKey="Add-Trait">
                <Accordion.Header>
                    <PlusCircle style={{ marginRight: '10px' }} />
                    Add a trait
                </Accordion.Header>
                <Accordion.Body>
                    <Row>
                        <FormGroup>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={onTraitNameChange}
                                value={traitName}
                            />
                            {!isValidName && (
                                <Form.Text>
                                    Please enter a unique name for this trait
                                </Form.Text>
                            )}
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Form.Label>Info</Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                onChange={onTraitInfoChange}
                                value={traitInfo}
                            />
                        </FormGroup>
                    </Row>
                    <div className="d-flex justify-content-center">
                        <FormButton onClick={onAddClick}>Add</FormButton>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        );
    };

    return (
        <Accordion alwaysOpen>
            {renderTraits()}
            {!traits ? (
                <Accordion.Item eventKey="Empty">
                    <Accordion.Header>
                        No traits added to this character
                    </Accordion.Header>
                </Accordion.Item>
            ) : null}
            {edit && addTrait()}
        </Accordion>
    );
};

export default CharacterTraits;
