const getAllEquipmentCategories = () => {
    const query = `query EquipmentCategories {
        equipmentCategories {
          index
          name
        }
      }`;

    return { query: query, queryName: 'EquipmentCategories' };
};

export { getAllEquipmentCategories };
