import styled from 'styled-components';

const SwapToCustomClass = styled.span`
    font-size: 13px;
    color: #4287f5;
    margin-left: 10px;
    margin-bottom: 25px;

    &:hover {
        color: #103e87;
        cursor: pointer;
        text-decoration: underline;
    }
`;

export { SwapToCustomClass };
