import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Theme } from "../style-variables";
import Button from "./button";
import { useOpenAndClose } from "./search-input";

const Header = () => {

    const [homeActive] = useRoute("/");
    const [recipesActive] = useRoute("/recepty");
    const [locationsActive] = useRoute("/lokace");

    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    useOpenAndClose(() => {}, () => setMobileMenuActive(false));

    return(
        <Wrapper>
            <Link className="active" href="/">
                Zelda Cookbook
            </Link>
                <Button 
                    style={{zIndex: "2"}}
                    onClick={() => setMobileMenuActive(p => !p)} 
                    rounded 
                    className="hide-on-desktop"
                >
                    <img 
                        style={{height: "38px", width: "38px"}} 
                        src={mobileMenuActive ? "public/icons/close.svg" : "public/icons/burger.svg"}
                    />
                </Button>
            <LinksWrapper mobileMenuActive={mobileMenuActive}>
                <Link 
                    className={homeActive ? "active" : ""} 
                    onClick={() => setMobileMenuActive(false)} 
                    href="/"
                >
                    Ingredience
                </Link>
                <Link 
                    className={recipesActive ? "active" : ""} 
                    onClick={() => setMobileMenuActive(false)} 
                    href="/recepty"
                >
                    Recepty
                </Link>
                <Link 
                    className={locationsActive ? "active" : ""} 
                    onClick={() => setMobileMenuActive(false)} 
                    href="/lokace"
                >
                    Lokace
                </Link>
            </LinksWrapper>
        </Wrapper>
    );
}

const Wrapper = styled("header")`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 32px 40px;
    max-height: 100px;
    min-height: 100px;

    > a {
        margin-right: auto;
        ${Theme.fontStyles.h4};
        color: ${Theme.content.primary};
    }
`;

const LinksWrapper = styled("div")<{mobileMenuActive: boolean}>`
    > a {
        margin-right: 40px;
        ${Theme.fontStyles.h4};
        color: ${Theme.content.secondary};

        &.active {
            color: ${Theme.content.primary};
        }
    }

    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        position: absolute;
        padding: 32px 40px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        width: 100%;
        left: 0;
        top: -100%;
        background-color: ${p => p.theme.background.primary};
        transform: ${p => `translateY(${p.mobileMenuActive ? "100%" : "0"})`};
        transition: 0.3s;
        z-index: 1;
    }
`;


export default Header;