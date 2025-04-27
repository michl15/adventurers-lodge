const query = `
    query EquipmentQuery {
        equipments(limit: 0) {
          equipment_category {
            name
          }
          name
          ... on Weapon {
            damage {
              damage_dice
              damage_type {
                name
              }
            }
            weapon_category {
              name
            }
            category_range {
              name
            }
          }
          index
          cost {
            quantity
            unit
          }
          desc
          weight
          ... on Tool {
            tool_category {
              name
            }
          }
          ... on Gear {
            gear_category {
              name
            }
          }
          ... on Pack {
            gear_category {
              name
            }
          }
          ... on Ammunition {
            gear_category {
              name
            }
          }
          ... on Armor {
            armor_category {
              name
            }
            armor_class {
              base
              dex_bonus
              max_bonus
            }
            stealth_disadvantage
            str_minimum
          }
          ... on Vehicle {
            vehicle_category {
              name
            }
            speed {
              quantity
              unit
            }
          }
          ... on IGear {
            gear_category {
              name
            }
          }
        }
      }`;

const equipmentQueryObj = { query: query, queryName: 'EquipmentQuery' };

export { equipmentQueryObj };
