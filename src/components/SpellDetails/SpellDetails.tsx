import { Card, Container, Row } from 'react-bootstrap';
import { Spell } from '../../constants/types';
import styled from 'styled-components';

type SpellDetailsProps = {
    spellData: Spell;
};

const SpellDetailCard = styled(Card)`
    padding: 15px 10px 0px 10px;
    margin: 5px 0px;
`;

const SpellDetails = ({ spellData }: SpellDetailsProps) => {
    return (
        <SpellDetailCard>
            <Container>
                <Row>
                    <span>
                        <b>
                            <h3>{spellData.name}</h3>
                        </b>
                    </span>
                    <span>
                        <b>Casting Time: </b>
                        {spellData.casting_time}
                    </span>
                    <span>
                        <b>Range{spellData.area_of_effect ? '/Area' : ''}: </b>
                        {spellData.range}
                        {spellData.area_of_effect
                            ? `, ${spellData.area_of_effect?.size} ft ${spellData.area_of_effect?.type.toLowerCase()}`
                            : ''}
                    </span>
                    <span>
                        <b>Components: </b>
                        {spellData.components?.toString()}
                    </span>
                    <span>
                        <b>Duration: </b>
                        {spellData.duration}
                    </span>
                    <span>
                        <b>Concentration: </b>
                        {spellData.concentration ? 'Yes' : 'No'}
                    </span>
                </Row>
                <br />
                <Row>
                    {spellData.desc?.map((line, index) => (
                        <p key={`${spellData.index}-desc-${index}`}>{line}</p>
                    ))}
                </Row>
                {spellData.higher_level ? (
                    <>
                        <Row>
                            <p>
                                <span>
                                    <i>
                                        <b>At Higher Levels. </b>
                                    </i>
                                    {spellData.higher_level}
                                </span>
                            </p>
                        </Row>
                    </>
                ) : null}
            </Container>
        </SpellDetailCard>
    );
};

export default SpellDetails;
