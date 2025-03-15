import { Container, ListGroup } from "react-bootstrap";
import { Language } from "../../constants/types"
import { PlusCircle } from "react-bootstrap-icons";
import styled from "styled-components";

type CharacterLanguagesProps = {
    langList: Language[] | null;
    edit: boolean;
    onAddLang: () => void;
}

const AddNewLanguage = styled(ListGroup.Item)`
    &:hover {
        color: #103e87;
        cursor: pointer;
        background-color: #dbf9ff;
    }
`

const SourceSpan = styled.span`
    font-style: italic;
    color: darkgray;
    font-size: 13px;
`

const CharacterLanguages = ({langList, edit, onAddLang}: CharacterLanguagesProps) => {
    const addNewLanguage = () => {
        return (
            <AddNewLanguage onClick={onAddLang}>
                <PlusCircle style={{marginRight: "10px", marginBottom:"4px"}}/>
                <span>Add new language (TODO)</span>
            </AddNewLanguage>
        )
    }

    return (
        <Container>
            <ListGroup>
                {langList?.map((language) => (
                    <ListGroup.Item key={language.index}>
                        {language.name} <SourceSpan>{ language.source && `(from ${language.source})`}</SourceSpan>
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