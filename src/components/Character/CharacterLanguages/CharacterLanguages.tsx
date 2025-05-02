import {
    Button,
    Col,
    Collapse,
    Container,
    Form,
    FormGroup,
    ListGroup,
    Row,
} from 'react-bootstrap';
import { Language } from '../../../constants/types';
import { PlusCircle, Trash3Fill } from 'react-bootstrap-icons';
import styled from 'styled-components';
import React, { useState } from 'react';

type CharacterLanguagesProps = {
    langList: Language[] | null;
    edit: boolean;
    onAddLang?: (newLang: string) => void;
    onRemoveLang?: (index: string) => void;
};

const AddNewLanguage = styled(ListGroup.Item)`
    &:hover {
        cursor: pointer;
    }
`;

const LangInput = styled.div`
    margin-top: 10px;
`;

const SourceSpan = styled.span`
    font-style: italic;
    color: darkgray;
    font-size: 13px;
`;

const CharacterLanguages = ({
    langList,
    edit,
    onAddLang,
    onRemoveLang,
}: CharacterLanguagesProps) => {
    const [newLanguage, setNewLanguage] = useState('');
    const [showAddLangForm, setShowAddLangForm] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const onAddLanguageClick: React.MouseEventHandler<HTMLElement> = () => {
        setShowAddLangForm(!showAddLangForm);
    };

    const onCancel: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        setValidInput(true);
        setShowAddLangForm(false);
    };

    const onLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setNewLanguage(event.currentTarget.value);
    };

    const onSubmitLang = (event: React.MouseEvent<HTMLElement>) => {
        event?.stopPropagation();
        const trimmedName = newLanguage.trim();
        const index = trimmedName.replace(/\s+/g, '-').toLowerCase();
        if (onAddLang) {
            const checkInList = langList?.filter(
                (lang) => lang.index === index
            );
            if (newLanguage.trim() && checkInList?.length === 0) {
                setValidInput(true);
                onAddLang(newLanguage);
                setNewLanguage('');
                setShowAddLangForm(false);
            } else {
                setValidInput(false);
            }
        }
    };

    const onDeleteLang = (index: string) => {
        if (onRemoveLang) {
            onRemoveLang(index);
        }
    };

    const addNewLanguage = () => {
        return (
            <AddNewLanguage
                onClick={onAddLanguageClick}
                style={{
                    backgroundColor: showAddLangForm ? '#cfe2ff' : 'white',
                    color: showAddLangForm ? '#103e87' : 'black',
                }}
                data-testid="add-language-btn"
            >
                <PlusCircle
                    style={{ marginRight: '10px', marginBottom: '4px' }}
                />
                <span>Add new language</span>
                <Collapse in={showAddLangForm}>
                    <LangInput>
                        <FormGroup>
                            <Row>
                                <Col>
                                    <Form.Control
                                        value={newLanguage}
                                        onChange={onLanguageChange}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                        }}
                                        data-testid="add-language-input"
                                    />
                                    {!validInput && (
                                        <Form.Text data-testid="invalid-language-input">
                                            Please enter a unique language
                                        </Form.Text>
                                    )}
                                </Col>
                                <Col md="auto">
                                    <Button
                                        onClick={onSubmitLang}
                                        data-testid="add-language-submit"
                                    >
                                        Add
                                    </Button>
                                </Col>
                                <Col md="auto">
                                    <Button
                                        variant="secondary"
                                        onClick={onCancel}
                                        data-testid="add-language-cancel"
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </LangInput>
                </Collapse>
            </AddNewLanguage>
        );
    };

    return (
        <Container data-testid="languages-container">
            <ListGroup>
                {langList?.map((language) => (
                    <ListGroup.Item key={language.index}>
                        <Row>
                            <Col className="my-auto">
                                {language.name}{' '}
                                <SourceSpan>
                                    {language.source &&
                                        `(from ${language.source})`}
                                </SourceSpan>
                            </Col>
                            <Col md="auto">
                                {edit && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => {
                                            onDeleteLang(language.index);
                                        }}
                                        data-testid={`delete-language-${language.index}`}
                                    >
                                        <Trash3Fill
                                            style={{ marginBottom: '5px' }}
                                        />
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
                {!langList && (
                    <ListGroup.Item data-testid="no-languages">
                        No languages added for this character
                    </ListGroup.Item>
                )}
                {edit && addNewLanguage()}
            </ListGroup>
        </Container>
    );
};

export default CharacterLanguages;
