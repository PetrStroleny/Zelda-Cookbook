import styled from "@emotion/styled";

const LoadingFoodCard = () => (
    <Wrapper className="fading"/>
);

const Wrapper = styled("div")`
    border-radius: 20px;
    background-color: #E5E5E5;
    height: 300px;
`;

export default LoadingFoodCard;