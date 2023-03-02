import styled from "@emotion/styled";
import { Link, useRoute } from "wouter";

const Header = () => {

    const [homeActive] = useRoute("/");
    const [recipesActive] = useRoute("/recepty");
    const [locationsActive] = useRoute("/lokace");

    return(
        <Wrapper>
            <Link href="/">
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
    border: 1px solid red;
    > a {
        margin-right: 10px;

        &.active {
            color: red;
        }
    }
`;



export default Header;