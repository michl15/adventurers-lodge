import { JSX } from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

const PaddedContainer = styled(Container)`
    width: 100%;
    padding: 10px 0px;
`;

type PageContainerProps = {
    children: JSX.Element;
};
const PageContainer = ({ children }: PageContainerProps) => {
    return <PaddedContainer data-testid="page-container">{children}</PaddedContainer>;
};

export default PageContainer;
