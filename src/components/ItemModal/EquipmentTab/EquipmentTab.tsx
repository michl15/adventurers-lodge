import { Button, Card, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { Equipment, EquipmentCategory } from "../../../constants/types";
import { useEffect, useState } from "react";
import Select, { Options } from 'react-select'
import { API_BASE_URL_5E } from "../../../constants/api";
import ItemDisplay from "../../ItemDisplay";
import { levenshtein } from "../../../util/calculations";

const SearchContainer = styled(Row)`
    background-color: #cff4fc;
    margin: 10px 10px;
    padding: 10px 10px;
    border-radius: 10px;
`;

type EquipmentTabProps = {
    allEquipment: Equipment[];
    categories: EquipmentCategory[];
}

type SelectOptions = {
    value: EquipmentCategory;
    label: string;
}

const EquipmentTab = ({ allEquipment, categories }: EquipmentTabProps) => {
    const [searchByName, setSearchByName] = useState("");
    const [categoriesOptions, setCategoriesOptions] = useState<SelectOptions[]>();
    const [selectedCategories, setSelectedCategories] = useState<EquipmentCategory[]>([]);
    const [searchResults, setSearchResults] = useState<Equipment[]>([]);

    const onSearchByNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchByName(event.target.value);
    }

    const onCategoriesChange = (option: Options<SelectOptions>) => {
        let newSelectedCategories: EquipmentCategory[] = [];
        option.forEach((opt) => {
            newSelectedCategories.push(opt.value);
        });
        setSelectedCategories(newSelectedCategories);
    }

    const fetchEquipmentByCategory = async (url: string) => {
        const response = await fetch(`${API_BASE_URL_5E}${url}`);
        if (response.ok) {
            const data = await response.json();
            return data.equipment;
        }
    }

    const onSearchSubmit = async () => {
        let newEquipmentList: Equipment[] = [];
        if (selectedCategories.length > 0) {
            for (let i = 0; i < selectedCategories.length; i++) {
                const category = selectedCategories[i];
                if (typeof category.url === "string") {
                    const equipmentList = await fetchEquipmentByCategory(category.url);
                    if (equipmentList) {
                        newEquipmentList.push(...equipmentList);
                    }
                }
            }
        } else {
            newEquipmentList.push(...allEquipment)
        }

        const searchQuery = searchByName.trim().toLowerCase();
        if (searchQuery.length > 0) {
            newEquipmentList = newEquipmentList.filter((item) => { return levenshtein(item.name.toLowerCase(), searchQuery) < 3 || item.name.toLowerCase().includes(searchQuery) });
        }
        setSearchResults(newEquipmentList);

    }

    const getCategoriesOptions = () => {
        let newCategoryOpts: SelectOptions[] = []
        categories.forEach((category) => {
            newCategoryOpts.push({ value: category, label: category.name });
        });
        setCategoriesOptions(newCategoryOpts);
    }

    useEffect(() => {
        getCategoriesOptions();
    }, []);

    return (
        <Container data-testid="equipment-tab">
            <SearchContainer>
                <Form>
                    <h5>Search</h5>
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
                    <Button onClick={onSearchSubmit} data-testid="search-submit">Search</Button>
                </Form>
            </SearchContainer>
            <Row>
                {searchResults.length > 0 && <ItemDisplay itemList={searchResults} />}
                {searchResults.length === 0 &&
                    <Card>
                        <Card.Body>
                            No results found
                        </Card.Body>
                    </Card>
                }
            </Row>
        </Container>
    )
}

export default EquipmentTab;