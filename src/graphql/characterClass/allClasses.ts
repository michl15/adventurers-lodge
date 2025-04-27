const getAllClasses = () => {
    const query = `query Query {
        classes {
          name
          index
        }
      }`;

    return { query: query, queryName: 'AllClassesQuery' };
};

export { getAllClasses };
