import styled from "@emotion/styled";
import { Link, useRoute } from "wouter";
import { Theme } from "../style-variables";

const Header = () => {

    const [homeActive] = useRoute("/");
    const [recipesActive] = useRoute("/recepty");
    const [locationsActive] = useRoute("/lokace");

    return(
        <Wrapper>
            <Link className="active" href="/">
                Zelda Cookbook
            </Link>
            <Link className={homeActive ? "active" : ""} href="/">
                Ingredience
            </Link>
            <Link className={recipesActive ? "active" : ""} href="/recepty">
                Recepty
            </Link>
            <Link className={locationsActive ? "active" : ""} href="/lokace">
                Lokace
            </Link>
        </Wrapper>
    );
}

const Wrapper = styled("header")`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 32px 40px;

    a:nth-of-type(1) {
        margin-right: auto;
    }

    > a {
        margin-right: 40px;
        ${Theme.fontStyles.h4};

        color: ${Theme.content.secondary};

        &.active {
            color: ${Theme.content.primary};
        }
    }
`;



export default Header;