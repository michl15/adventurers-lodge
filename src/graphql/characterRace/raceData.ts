const getRaceData = (index: string) => {
    const query = `query Race {
        race(index: "${index}") {
            ability_bonuses {
            ability_score {
                    index
                    name
                }
                bonus
            }
            languages {
                index
                name
            }
            language_desc
            traits {
                index
                name
                desc
            }
        }
    }`;

    return { query: query, queryName: 'RaceInfo' };
};

export { getRaceData };
