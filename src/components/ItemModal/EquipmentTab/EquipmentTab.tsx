import {
    Button,
    Card,
    Col,
    Collapse,
    Container,
    Form,
    Row,
} from 'react-bootstrap';
import styled from 'styled-components';
import { EquipmentCategory, EquipmentData } from '../../../constants/types';
import { useEffect, useState } from 'react';
import Select, { Options } from 'react-select';
import ItemDisplay from '../../ItemDisplay';
import { levenshtein } from '../../../util/calculations';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';

const SearchContainer = styled(Row)`
    background-color: #cff4fc;
    margin: 10px 0px;
    padding: 10px 10px;
    border-radius: 10px;
`;

type EquipmentTabProps = {
    categories: EquipmentCategory[];
};

type SelectOptions = {
    value: EquipmentCategory;
    label: string;
};

const EquipmentTab = ({ categories }: EquipmentTabProps) => {
    const [searchByName, setSearchByName] = useState('');
    const [categoriesOptions, setCategoriesOptions] =
        useState<SelectOptions[]>();
    const [selectedCategories, setSelectedCategories] = useState<
        EquipmentCategory[]
    >([]);
    const [searchResults, setSearchResults] = useState<EquipmentData[]>([]);
    const [expandSearch, setExpandSearch] = useState(true);

    const { equipmentList } = useSelector(
        (state: RootState) => state.equipment
    );

    const onSearchByNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchByName(event.target.value);
    };

    const onCategoriesChange = (option: Options<SelectOptions>) => {
        const newSelectedCategories: EquipmentCategory[] = [];
        option.forEach((opt) => {
            newSelectedCategories.push(opt.value);
        });
        setSelectedCategories(newSelectedCategories);
    };

    const matchCategory = (
        searchCategory: string,
        equipment: EquipmentData
    ) => {
        return (
            searchCategory === equipment.equipment_category?.name ||
            searchCategory === equipment.armor_category?.name ||
            searchCategory === equipment.gear_category?.name ||
            searchCategory === equipment.weapon_category?.name ||
            searchCategory === equipment.tool_category?.name ||
            searchCategory === equipment.vehicle_category?.name ||
            equipment.category_range?.name.includes(searchCategory)
        );
    };

    const onSearchSubmit = async () => {
        let newEquipmentList: EquipmentData[] = [];
        if (selectedCategories.length > 0) {
            for (let i = 0; i < selectedCategories.length; i++) {
                const category = selectedCategories[i].name;
                newEquipmentList.push(
                    ...equipmentList.filter((equip: EquipmentData) =>
                        matchCategory(category, equip)
                    )
                );
            }
        } else {
            newEquipmentList.push(...equipmentList);
        }

        const searchQuery = searchByName.trim().toLowerCase();
        if (searchQuery.length > 0) {
            newEquipmentList = newEquipmentList.filter((item) => {
                return (
                    levenshtein(item.name.toLowerCase(), searchQuery) < 3 ||
                    item.name.toLowerCase().includes(searchQuery)
                );
            });
        }
        setSearchResults(newEquipmentList);
        setExpandSearch(false);
    };

    const getCategoriesOptions = () => {
        const newCategoryOpts: SelectOptions[] = [];
        categories.forEach((category) => {
            newCategoryOpts.push({ value: category, label: category.name });
        });
        setCategoriesOptions(newCategoryOpts);
    };

    useEffect(() => {
        getCategoriesOptions();
        // eslint-disable-next-line
    }, []);

    return (
        <Container data-testid="equipment-tab">
            <SearchContainer>
                <Row>
                    <Col className="d-flex my-auto">
                        <h5>Search</h5>
                    </Col>
                    <Col
                        className="d-flex justify-content-end"
                        style={{ marginRight: '-23px' }}
                    >
                        <Button
                            variant="outline-info"
                            onClick={() => setExpandSearch(!expandSearch)}
                            style={{ paddingBottom: '10px' }}
                        >
                            {expandSearch ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                    </Col>
                </Row>

                <Collapse in={expandSearch}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Search by name</Form.Label>
                            <Form.Control
                                type="text"
                                value={searchByName}
                                onChange={onSearchByNameChange}
                                data-testid="search-input"
                            />
                        </Form.Group>
                        <hr />
                        <h6>Filters</h6>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Select
                                options={categoriesOptions}
                                isClearable
                                isSearchable
                                isMulti
                                onChange={onCategoriesChange}
                                data-testid="category-select"
                                aria-label="Category"
                            />
                        </Form.Group>
                        <br />
                        <Row
                            md="auto"
                            className="dflex justify-content-md-center"
                        >
                            <Button
                                onClick={onSearchSubmit}
                                data-testid="search-submit"
                                variant="info"
                            >
                                Search
                            </Button>
                        </Row>
                    </Form>
                </Collapse>
            </SearchContainer>
            <Row>
                {searchResults.length > 0 && (
                    <ItemDisplay itemList={searchResults} />
                )}
                {searchResults.length === 0 && (
                    <Card>
                        <Card.Body>No results found</Card.Body>
                    </Card>
                )}
            </Row>
        </Container>
    );
};

export default EquipmentTab;
