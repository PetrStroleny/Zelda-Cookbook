import styled from "@emotion/styled";
import { Link } from "wouter";

const Header = () => (
    <Wrapper>
        <Link href="/">
            Zelda Cookbook
        </Link>
        <Link href="/">
            Ingredience
        </Link>
        <Link href="/recepty">
            Recepty
        </Link>
        <Link href="/lokace">
            Lokace
        </Link>
    </Wrapper>
);

const Wrapper = styled("header")`
    border: 1px solid red;
    > a {
        margin-right: 10px;
    }
`;



export default Header;