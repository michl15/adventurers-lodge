import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Button,
    Col,
    ListGroup,
    Row,
} from 'react-bootstrap';
import { Spell } from '../../constants/types';
import { notEmptyList } from '../../util/util';
import { Trash3Fill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import {
    removeCharSpell,
    setSelectedSpellsState,
} from '../../redux/SpellsReducer';

type SpellSectionProps = {
    name: string;
    spellList: Spell[];
    edit?: boolean;
};

const SpellSection = ({ name, spellList, edit }: SpellSectionProps) => {
    const { selectedSpellsState } = useSelector(
        (state: RootState) => state.spells
    );

    const dispatch = useDispatch();

    const lastElementStyle = (index: number) => {
        if (index === spellList.length - 1) {
            return { borderRadius: '5px' };
        } else {
            return {};
        }
    };

    const renderList = () => {
        return spellList.map((spell, index) => {
            return (
                <ListGroup.Item
                    key={`char-spells-${index}`}
                    style={lastElementStyle(index)}
                >
                    <Row>
                        <Col className="my-auto">{spell.name}</Col>
                        <Col md="auto" className="my-auto">
                            {edit && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(
                                            setSelectedSpellsState({
                                                ...selectedSpellsState,
                                                [spell.index]: false,
                                            })
                                        );
                                        dispatch(removeCharSpell(spell));
                                    }}
                                    data-testid={`delete-spell-${spell.index}`}
                                >
                                    <Trash3Fill
                                        style={{ marginBottom: '5px' }}
                                    />
                                </Button>
                            )}
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
        });
    };

    return (
        notEmptyList(spellList) && (
            <AccordionItem eventKey={`spell-section-${name}`}>
                <AccordionHeader>
                    <b>{name}</b>
                </AccordionHeader>
                <AccordionBody style={{ padding: '0px' }}>
                    <ListGroup variant="flush">{renderList()}</ListGroup>
                </AccordionBody>
            </AccordionItem>
        )
    );
};

export default SpellSection;
