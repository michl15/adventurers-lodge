import { GRAPHQL_URL } from '../constants/api';

const graphQuery = async (query: { query: string; queryName: string }) => {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query.query }),
        });
        if (response.ok) {
            const dataJSON = await response.json();
            return dataJSON.data;
        } else {
            console.error(
                'HTTP Response Error: ' + response.status + response.statusText
            );
            console.error(
                'The above error occurred while attempting to query graphql: ',
                query.queryName
            );
            return response;
        }
    } catch (error) {
        console.error('Error: ', error);
        console.error(
            'The above error occurred while attempting to query graphql: ',
            query.queryName
        );
    }
};

export { graphQuery };
