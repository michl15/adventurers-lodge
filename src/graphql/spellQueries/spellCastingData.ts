const getSpellCastingData = (charLvl: number, charClassIndex: string) => {
    const query = `query Query {
      level(index: "${charClassIndex}-${charLvl}") {
        spellcasting {
          cantrips_known
          spell_slots_level_1
          spell_slots_level_2
          spell_slots_level_3
          spell_slots_level_4
          spell_slots_level_5
          spell_slots_level_6
          spell_slots_level_7
          spell_slots_level_8
          spell_slots_level_9
          spells_known
        }
      }
      class(index: "${charClassIndex}") {
        spellcasting {
          info {
            desc
            name
          }
          spellcasting_ability {
            desc
            full_name
            index
          }
        }
      }
    }`;

    return { query: query, queryName: 'SpellCastingQuery' };
};

export { getSpellCastingData };
