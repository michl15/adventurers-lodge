const getAllSpells = () => {
    const query = `query AllSpellsQuery {
      spells(limit: 1000, order: {by: LEVEL, direction: ASC}) {
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
          dc_success
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
