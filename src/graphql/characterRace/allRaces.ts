const getAllRaces = () => {
    const query = `query Races {
        races {
          index
          name
        }
      }`;

    return { query: query, queryName: 'GetAllRaces' };
};

export { getAllRaces };
