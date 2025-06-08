import { graphQuery } from '../../../graphql/queryUtil';
import {
    equipmentQuery,
    getMagicItems,
} from '../../../graphql/equipmentQueries';
import { useDispatch, useSelector } from 'react-redux';
import {
    addEquipment,
    setEquipment,
    setEquipmentIsLoading,
    setExtraEquipmentFetched,
} from '../../../redux/EquipmentReducer';
import { RootState } from '../../../redux';
import { useEffect } from 'react';
import { getAllSpells } from '../../../graphql/spellQueries';
import { setSpells, setSpellsLoading } from '../../../redux/SpellsReducer';

const LargeQueries = () => {
    const dispatch = useDispatch();

    const { equipmentIsLoading, equipmentList, extraEquipmentFetched } =
        useSelector((state: RootState) => state.equipment);
    const { spellList } = useSelector((state: RootState) => state.spells);

    useEffect(() => {
        const getAllEquipment = async () => {
            if (!equipmentIsLoading && !(equipmentList.length > 0)) {
                dispatch(setEquipmentIsLoading(true));
                const graphResponse = await graphQuery(equipmentQuery());
                if (graphResponse) {
                    dispatch(setEquipment(graphResponse?.equipments || []));
                }

                if (!extraEquipmentFetched) {
                    dispatch(setExtraEquipmentFetched(true));
                    const extraResp = await graphQuery(getMagicItems());
                    if (extraResp) {
                        dispatch(addEquipment(extraResp?.magicItems || []));
                    }
                }
                dispatch(setEquipmentIsLoading(false));
            }
        };

        getAllEquipment();
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        const fetchSpells = async () => {
            if (spellList.length === 0) {
                const response = await graphQuery(getAllSpells());
                if (response) {
                    dispatch(setSpells(response?.spells || []));
                }
            }
            dispatch(setSpellsLoading(false));
        };
        fetchSpells();
        // eslint-disable-next-line
    }, [dispatch, spellList]);
    return null;
};

export default LargeQueries;
