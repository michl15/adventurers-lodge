const getMagicItems = () => {
    const query = `query MagicItems {
        magicItems(limit: 0) {
          name
          equipment_category {
            name
          }
          rarity
          index
          desc
        }
      }`;

    return { query: query, queryName: 'MagicItems' };
};

export { getMagicItems };
