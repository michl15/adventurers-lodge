import { Accordion } from "react-bootstrap";
import { Trait } from "../../constants/types"
import styled from "styled-components";
import { PlusCircle } from "react-bootstrap-icons";

type CharacterTraitsProps = {
    traits: Trait[] | null;
    edit: boolean;
}

const SourceInfo = styled.p`
    font-style: italic;
    color: darkgray;
`

const CharacterTraits = ({traits, edit}: CharacterTraitsProps )=> {
    const renderTraits = () => {
        return traits?.map((trait) => {
            return (
            <Accordion.Item eventKey={trait.index} key={trait.index}>
                <Accordion.Header>{trait.name}</Accordion.Header>
                <Accordion.Body>
                    {trait.source && <SourceInfo>From <b>{trait.source}</b></SourceInfo>}
                    {trait.info}
                </Accordion.Body>
            </Accordion.Item>)
        })
    }

    const addTrait = () => {
        return (
            <Accordion.Item eventKey="Add-Trait">
                <Accordion.Header><PlusCircle style={{marginRight: "10px"}}/>Add a trait (TODO)</Accordion.Header>
            </Accordion.Item>
        )
    }

    return (
        <Accordion alwaysOpen>
            {renderTraits()}
            {!traits ? <Accordion.Item eventKey="Empty">
                <Accordion.Header>No traits added to this character</Accordion.Header>
            </Accordion.Item>: null}
            {edit && addTrait()}
        </Accordion>
    )

}

export default CharacterTraits;