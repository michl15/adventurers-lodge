import styled from 'styled-components';
import { Form } from 'react-bootstrap';

export const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
`;

export const StyledForm = styled(Form)`
    margin: 10px 0px;
`;

export const StyledHeader = styled.h1`
    padding: 20px 10px;
`;

export const HeaderImage = styled.img`
    width: 600px;
    margin: 10px 0px;
`;
