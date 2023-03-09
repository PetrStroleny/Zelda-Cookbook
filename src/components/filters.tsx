import styled from "@emotion/styled";
import { useState } from "react";
import Button from "./button";
import SearchInput, { getSearchValue } from "./search-input";

const Filters = () => {
    const [searchInputActive, setSearchInputActive] = useState(getSearchValue().length > 0);

    return(
        <Wrapper>

                <Button onClick = {() => setSearchInputActive(p => !p)}>
                    <img src={`public/icons/${searchInputActive ? "close" : "search"}.svg`}/>
                </Button>
            {searchInputActive ?
                <SearchInput/>
            :
                <>
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
                </>
            }
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
    display: flex;

    > button {
        margin-right: 10px;

        &:last-of-type {
            margin-right: 0;
        }

        &:first-of-type {
            margin-right: 19px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
            position: relative;
            height: 60px;
            width: 60px;
            padding: 0;

            &:after {
                right: -9.5px;
                top: 6px;
                height: 48px;
                width: 3px;
                border-radius: 25px;
                content: "";
                position: absolute;
                background-color: ${p => p.theme.background.secondary};
            }
        }

    }
`;



export default Filters;
