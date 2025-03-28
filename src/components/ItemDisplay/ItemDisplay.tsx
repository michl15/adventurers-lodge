import { useEffect, useState } from "react";
import { Equipment, EquipmentData } from "../../constants/types";
import ItemCard from "../ItemCard";
import { API_BASE_URL_5E } from "../../constants/api";
import { Spinner } from "react-bootstrap";

type ItemDisplayProps = {
    itemList: Equipment[];
}

const ItemDisplay = ({ itemList }: ItemDisplayProps) => {
    const [equipmentDataList, setEquipmentDataList] = useState<EquipmentData[]>();
    const [isLoading, setIsLoading] = useState(true);

    const getEquipmentData = async () => {
        let newDataList: EquipmentData[] = [];
        for (let i = 0; i < itemList.length; i++) {
            const item = itemList[i];
            if (typeof item.url === "string") {
                const response = await fetch(`${API_BASE_URL_5E}${item.url}`);
                if (response.ok) {
                    const data = await response.json();
                    newDataList.push(data);
                }
            }
        }
        setEquipmentDataList(newDataList);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        getEquipmentData();
    }, [itemList])

    return (
        <>
            {isLoading ? <Spinner /> :
                <>
                    {equipmentDataList?.map((item, index) => {
                        return <ItemCard itemData={item} key={index} />
                    })}
                </>}
        </>
    )
}

export default ItemDisplay;