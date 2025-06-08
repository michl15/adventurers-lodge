const equipmentQuery = () => {
    const query = `
    query EquipmentQuery  {
  equipments(limit: 1000) {
    ... on Armor {
      name
      armor_category
      armor_class {
        base
      }
      cost {
        quantity
        unit
      }
      desc
      equipment_category {
        name
      }
      index
      gear_category {
        name
      }
    }
    ... on Vehicle {
      name
      cost {
        unit
        quantity
      }
      vehicle_category
      desc
      index
    }
    ... on Weapon {
      name
      index
      cost {
        quantity
        unit
      }
      damage {
        damage_dice
        damage_type {
          name
        }
      }
      range {
        normal
      }
      desc
      equipment_category {
        name
      }
      weapon_category
      weapon_range
    }
    ... on Tool {
      name
      cost {
        unit
        quantity
      }
      desc
      equipment_category {
        name
      }
      gear_category {
        name
      }
      index
      tool_category
    }
    ... on Gear {
      cost {
        quantity
        unit
      }
      desc
      gear_category {
        name
      }
      index
      name
      equipment_category {
        name
      }
    }
    ... on Pack {
      gear_category {
        name
      }
      cost {
        quantity
        unit
      }
      name
    }
    ... on Ammunition {
      cost {
        quantity
        unit
      }
      equipment_category {
        name
      }
      gear_category {
        name
      }
      name
      index
      desc
    }
  }
}`;

    return { query: query, queryName: 'EquipmentQuery' };
};

export { equipmentQuery };
