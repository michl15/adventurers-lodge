import { useEffect, useState } from 'react';
import { Equipment, EquipmentData } from '../../constants/types';
import ItemCard from '../ItemCard';
import { API_BASE_URL_5E } from '../../constants/api';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';

type ItemDisplayProps = {
    itemList: Equipment[];
};

const ItemDisplay = ({ itemList }: ItemDisplayProps) => {
    const [pageOffset, setPageOffset] = useState(0);
    const [equipmentDataList, setEquipmentDataList] = useState<EquipmentData[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [currentPageData, setCurrentPageData] = useState<EquipmentData[]>([]);

    const modal = document.getElementById('item-modal'); // Replace 'yourModalId'
    const modalBody = modal?.querySelector('.modal-body');

    const getEquipmentData = async (reset: boolean) => {
        const newDataList: EquipmentData[] = reset
            ? []
            : [...equipmentDataList];
        if (newDataList.length < pageOffset + 7) {
            const upperLimit =
                pageOffset + 7 <= itemList.length
                    ? pageOffset + 7
                    : itemList.length;
            for (let i = pageOffset; i < upperLimit; i++) {
                const item = itemList[i];
                if (typeof item.url === 'string') {
                    const response = await fetch(
                        `${API_BASE_URL_5E}${item.url}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        newDataList.push(data);
                    }
                }
            }
            setEquipmentDataList(newDataList);
            setCurrentPageData(newDataList.slice(pageOffset, pageOffset + 7));
        } else {
            setCurrentPageData(
                equipmentDataList.slice(pageOffset, pageOffset + 7)
            );
        }
        setIsLoading(false);
    };

    const onNextClick = () => {
        setPageOffset(pageOffset + 7);
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    };

    const onPrevClick = () => {
        setPageOffset(pageOffset - 7);
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setPageOffset(0);
        setEquipmentDataList([]);
        setCurrentPageData([]);
        getEquipmentData(true);
        // eslint-disable-next-line
    }, [itemList]);

    useEffect(() => {
        setIsLoading(true);
        getEquipmentData(false);
        // eslint-disable-next-line
    }, [pageOffset]);

    return (
        <>
            {isLoading ? (
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
                            {pageOffset > 0 ? (
                                <Button
                                    onClick={onPrevClick}
                                    variant="outline-info"
                                >
                                    {'<<'} Prev
                                </Button>
                            ) : null}
                        </Col>
                        <Col className="d-flex justify-content-end">
                            {pageOffset + 7 < itemList.length ? (
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
