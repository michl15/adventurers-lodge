import { useEffect, useState } from 'react';
import { EquipmentData } from '../../../constants/types';
import ItemCard from '../ItemCard';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';

type ItemDisplayProps = {
    itemList: EquipmentData[];
};

const ItemDisplay = ({ itemList }: ItemDisplayProps) => {
    const pageSize = 5;

    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(pageSize);
    const [currentPageData, setCurrentPageData] = useState<EquipmentData[]>([]);

    const modal = document.getElementById('item-modal'); // Replace 'yourModalId'
    const modalBody = modal?.querySelector('.modal-body');

    const { equipmentIsLoading } = useSelector(
        (state: RootState) => state.equipment
    );
    const totalResults = itemList.length;

    const onNextClick = () => {
        setStartIndex(startIndex + pageSize);
        setEndIndex(endIndex + pageSize);
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    };

    const onPrevClick = () => {
        setStartIndex(Math.max(startIndex - pageSize, 0));
        setEndIndex(endIndex - pageSize);
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    };

    useEffect(() => {
        setCurrentPageData(itemList.slice(startIndex, endIndex));
        // eslint-disable-next-line
    }, [itemList, startIndex, endIndex]);

    useEffect(() => {
        setStartIndex(0);
        setEndIndex(pageSize);
    }, [itemList]);

    return (
        <>
            {equipmentIsLoading ? (
                <Container>
                    <Row
                        className="d-flex justify-content-center"
                        style={{ padding: '10px 0px' }}
                    >
                        <Spinner
                            variant="info"
                            style={{ width: '50px', height: '50px' }}
                        />
                    </Row>
                </Container>
            ) : (
                <Container>
                    {currentPageData?.map((item, index) => {
                        return <ItemCard itemData={item} key={index} />;
                    })}
                    <Row>
                        <Col className="d-flex justify-content-start">
                            {startIndex > 0 ? (
                                <Button
                                    onClick={onPrevClick}
                                    variant="outline-info"
                                >
                                    {'<<'} Prev
                                </Button>
                            ) : null}
                        </Col>
                        <Col className="d-flex justify-content-end">
                            {endIndex < totalResults ? (
                                <Button
                                    onClick={onNextClick}
                                    variant="outline-info"
                                >
                                    Next {'>>'}
                                </Button>
                            ) : null}
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
};

export default ItemDisplay;
