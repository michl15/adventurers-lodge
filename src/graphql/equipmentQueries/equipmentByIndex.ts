const equipmentQueryByIndex = (index: string) => {
    const query = `query EquipmentQueryByIndex {
          equipmentCategory(index: "${index}") {
            equipment {
              equipment_category {
                name
              }
              index
              name
              desc
              ... on MagicItem {
                rarity
                image
              }
              ... on Tool {
                weight
                tool_category {
                  name
                }
                cost {
                  quantity
                  unit
                }
              }
              ... on Gear {
                cost {
                  quantity
                  unit
                }
                weight
                gear_category {
                  name
                }
              }
              ... on Pack {
                cost {
                  quantity
                  unit
                }
                weight
                gear_category {
                  name
                }
                contents {
                  quantity
                  item {
                    name
                  }
                }
              }
              ... on Ammunition {
                cost {
                  quantity
                  unit
                }
                weight
                gear_category {
                  name
                }
              }
              ... on Weapon {
                cost {
                  quantity
                  unit
                }
                weight
                damage {
                  damage_dice
                  damage_type {
                    name
                  }
                }
                range {
                  normal
                  long
                }
                throw_range {
                  normal
                  long
                }
                weapon_category {
                  name
                }
                weapon_range
                category_range {
                  name
                }
                two_handed_damage {
                  damage_dice
                  damage_type {
                    name
                  }
                }
                properties {
                  name
                  desc
                }
                special
              }
              ... on Armor {
                index
                name
                cost {
                  quantity
                  unit
                }
                desc
                weight
                armor_category {
                  name
                }
                str_minimum
                stealth_disadvantage
                armor_class {
                  base
                  dex_bonus
                  max_bonus
                }
              }
              ... on Vehicle {
                cost {
                  quantity
                  unit
                }
                weight
                vehicle_category {
                  name
                }
                speed {
                  quantity
                  unit
                }
                capacity
              }
              ... on IEquipment {
                cost {
                  quantity
                  unit
                }
                weight
              }
              ... on IGear {
                cost {
                  quantity
                  unit
                }
                weight
                gear_category {
                  name
                }
              }
            }
          }
        }`;

    return { query: query, queryName: 'EquipmentQueryByIndex' };
};

export { equipmentQueryByIndex };
