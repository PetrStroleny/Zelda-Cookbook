import styled from "@emotion/styled";
import { Link } from "wouter";

const Header = () => (
    <Wrapper>
        <Link href="/">
            <a>
                <img src="public/menu-icon.svg"/>
            </a>
        </Link>
        <Link href="/">
            Ingredience
        </Link>
        <Link href="/recepty">
            Recepty
        </Link>
    </Wrapper>
);

const Wrapper = styled("header")`
    min-height: 100px;
    max-height: 100px;
    padding: 10px;
    width: 100%;
    position: fixed;
    align-items: center;
    display: flex;
    background-color: ${p => p.theme.tints.primary};
    color: ${p => p.theme.tints.white};


    > a {
        &:first-of-type {
            margin-right: 40px;
        }

        &:not(:last-of-type) {
            margin-right: 20px;
        }
    }
`;



export default Header;