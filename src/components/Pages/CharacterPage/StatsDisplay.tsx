import { Alert, Container, ListGroup, Row } from 'react-bootstrap';
import { StatsTypes } from '../../../constants/types';
import styled from 'styled-components';
import { calculateStatModifier } from '../../../util/calculations';
import { BASE_STATS } from '../../../constants/constants';

type StatsDisplayProps = {
    stats: StatsTypes;
};

const StatsListGroup = styled(ListGroup)`
    margin-top: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StatsItem = styled(ListGroup.Item)`
    width: 130px;
`;

const Modifier = styled(Alert)`
    width: 30px;
    height: 30px;
    border-radius: 25%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StatsDisplay = ({ stats }: StatsDisplayProps) => {
    const renderStats = () => {
        const statsList = Object.keys(BASE_STATS);
        return statsList.map((stat) => {
            const statValue = stats[stat as keyof StatsTypes];
            const modifier = calculateStatModifier(statValue);
            const positive = modifier >= 0;
            return (
                <StatsItem key={`stats-list${stat}`}>
                    <Container fluid>
                        <Row className="text-center">
                            <div>{stat.toUpperCase()}</div>
                        </Row>
                        <Row className="text-center">
                            <h4>{statValue}</h4>
                        </Row>
                        <Row className="d-flex align-items-center justify-content-center">
                            <Modifier variant={positive ? 'info' : 'danger'}>
                                {positive ? `+${modifier}` : `${modifier}`}
                            </Modifier>
                        </Row>
                    </Container>
                </StatsItem>
            );
        });
    };

    return <StatsListGroup horizontal>{renderStats()}</StatsListGroup>;
};

export default StatsDisplay;
