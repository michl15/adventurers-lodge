const getClassSpellcasting = (index: string) => {
    const query = `query Class {
        class(index: "${index}") {
          spellcasting {
            spellcasting_ability {
              name
            }
          }
        }
      }`;

    return { query: query, queryName: 'ClassSpellcasting' };
};

export { getClassSpellcasting };
