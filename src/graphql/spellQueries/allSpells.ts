const getAllSpells = () => {
    const query = `query AllSpellsQuery {
      spells(limit: 0, order: {by: LEVEL}) {
        index
        area_of_effect {
          type
          size
        }
        attack_type
        casting_time
        classes {
          index
          name
        }
        components
        concentration
        damage {
          damage_type {
            name
          }
        }
        dc {
          desc
          success
          type {
            full_name
          }
        }
        desc
        duration
        higher_level
        level
        name
        range
        ritual
        school {
          name
        }
      }
    }`;

    return { query: query, queryName: 'AllSpellsQuery' };
};

export { getAllSpells };
