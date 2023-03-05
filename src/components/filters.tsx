import styled from "@emotion/styled";
import Button from "./button";

const Filters = () => {


    return(
        <Wrapper>
            <Button className="active">
                Akkala
            </Button>
            <Button>
                Central Hyrule
            </Button>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: fixed;
    bottom: 20px;
    left: 20px;
    transform: translateY(-100%);
    border-radius: 26px;
    background-color: ${p => p.theme.background.primary};
    padding: 10px;
    border: 10px solid red;

    > button {
        margin-right: 40px;
    }
`;



export default Filters;