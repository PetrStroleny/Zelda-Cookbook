import styled from "@emotion/styled";
import { FC } from "react";

const LoadingFoodCard: FC = ({  }) => (
    <Wrapper className="fading">

    </Wrapper>
);
    
const Wrapper = styled("div")`
    cursor: pointer; 
    border-radius: 20px;
    background-color: #E5E5E5;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: flex-end;
    padding: 22px;
    height: 300px;
`;

export default LoadingFoodCard;