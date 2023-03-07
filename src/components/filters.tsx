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
            <Button>
                Eldin
            </Button>
            <Button>
                Faron
            </Button>
            <Button>
                Gerudo
            </Button>
            <Button>
                Hebra
            </Button>
            <Button>
                Lanayru
            </Button>
            <Button>
                Necluda
            </Button>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: fixed;
    bottom: 20px;
    left: 20px;
    border-radius: 26px;
    width: fit-content;
    height: 80px;
    padding: 10px;
    background-color: ${p => p.theme.background.primary};
    border: 10px ${p => p.theme.background.primary};

    > button {
        width: fit-content;
        padding: 0px 10px;
        height: 60px;
        margin-right: 10px;
        border-radius: 20px;
        background: ${p => p.theme.background.tertiary};
        ${p => p.theme.fontStyles.b1};   
    }

    > :last-child {margin-right: 0};
`;



export default Filters;