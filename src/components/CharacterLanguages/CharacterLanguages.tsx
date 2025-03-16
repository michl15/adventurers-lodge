import { Button, Col, Collapse, Container, Form, FormGroup, ListGroup, Row } from "react-bootstrap";
import { Language } from "../../constants/types"
import { PlusCircle, Trash3Fill } from "react-bootstrap-icons";
import styled from "styled-components";
import React, { useState } from "react";

type CharacterLanguagesProps = {
    langList: Language[] | null;
    edit: boolean;
    onAddLang?: (newLang: string) => void;
    onRemoveLang?: (index: string) => void;
}

const AddNewLanguage = styled(ListGroup.Item)`
    &:hover {
        color: #103e87;
        cursor: pointer;
        background-color: #dbf9ff;
    }
`

const LangInput = styled.div`
    margin-top: 10px;
`

const SourceSpan = styled.span`
    font-style: italic;
    color: darkgray;
    font-size: 13px;
`

const CharacterLanguages = ({langList, edit, onAddLang, onRemoveLang}: CharacterLanguagesProps) => {
    const [newLanguage, setNewLanguage] = useState("");
    const [showAddLangForm, setShowAddLangForm] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const onAddLanguageClick: React.MouseEventHandler<HTMLElement> = () => {
        setShowAddLangForm(true);
    }
    
    const onCancel: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        setShowAddLangForm(false);
    }

    const onLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setNewLanguage(event.currentTarget.value);
    }

    const onSubmitLang = () => {
        if (onAddLang) {

            const checkInList = langList?.filter((lang) => lang.index === newLanguage.toLowerCase())
            if (newLanguage.trim() && checkInList?.length === 0) {
                setValidInput(true);
                onAddLang(newLanguage);
                console.log('added');
                setNewLanguage('');
                setShowAddLangForm(false);
            } else {
                setValidInput(false);
            }
        }
    }

    const onDeleteLang = (index: string) => {
        if (onRemoveLang) {
            onRemoveLang(index);
        }
    }

    const addNewLanguage = () => {
        return (
            <AddNewLanguage onClick={onAddLanguageClick}>
                <PlusCircle style={{marginRight: "10px", marginBottom:"4px"}}/>
                <span>Add new language</span>
                <Collapse in={showAddLangForm}>
                    <LangInput>
                        <FormGroup>
                            <Row>
                                <Col>
                                    <Form.Control value={newLanguage} onChange={onLanguageChange}/>
                                    {!validInput && <Form.Text>Please enter a unique language</Form.Text>}
                                </Col>
                                <Col md="auto">
                                    <Button onClick={onSubmitLang}>Add</Button>
                                </Col>
                                <Col md="auto">
                                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </LangInput>
                </Collapse>
            </AddNewLanguage>
        )
    }

    return (
        <Container>
            <ListGroup>
                {langList?.map((language) => (
                    <ListGroup.Item key={language.index}>
                        <Row>
                            <Col className="my-auto">
                                {language.name} <SourceSpan>{ language.source && `(from ${language.source})`}</SourceSpan>
                            </Col>
                            <Col md="auto">
                            {edit && <Button variant="outline-danger" size="sm" onClick={() => {onDeleteLang(language.index)}}>
                                <Trash3Fill/>
                            </Button>}
                                
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
                {!langList &&
                <ListGroup.Item>
                    No languages added for this character
                </ListGroup.Item>}
                {edit && addNewLanguage()}
            </ListGroup>
        </Container>
    )
}

export default CharacterLanguages;