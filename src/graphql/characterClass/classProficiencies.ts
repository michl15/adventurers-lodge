const getClassProficiencies = (index: string) => {
    const query = `query ClassProficiencies {
        class(index: "${index}") {
          index
          name
          proficiencies {
            name
          }
          proficiency_choices {
            desc
          }
          starting_equipment_options {
            desc
          }
          hit_die
          saving_throws {
            name
          }
          spellcasting {
            info {
              name
              desc
            }
            spellcasting_ability {
              name
            }
          }
          multi_classing {
            prerequisites {
              ability_score {
                name
              }
            }
          }
        }
      }`;

    return { query: query, queryName: 'ClassProficiencies' };
};

export { getClassProficiencies };
