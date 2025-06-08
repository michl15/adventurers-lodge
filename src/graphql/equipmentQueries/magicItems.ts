const getMagicItems = () => {
    const query = `query MagicItems {
  magicItems(limit: 1000) {
    desc
    equipment_category {
      name
    }
    name
    rarity {
      name
    }
    index
  }
}`;

    return { query: query, queryName: 'MagicItems' };
};

export { getMagicItems };
