import styled from "@emotion/styled";
import { FC, useEffect, useRef } from "react";
import { SubLocation } from "../pages/locations";
import {  } from "react-router-dom";


interface SearchInputProps {

}

export function getSearchValue(): string {
    for (const query of window?.location?.search.substring(1).split("&")) {
        if (query.split("=")[0] == "q") {
            return query.split("=")[1];
        }
    }

    return "";
}

const SearchInput: FC<SearchInputProps> = ({ }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.value = getSearchValue();
        }
    }, []);

    return(
        <Wrapper 
            ref={inputRef}
            onChange={(e) => window.history.replaceState({}, "", `${window.location.pathname}?q=${e.target.value}`)}
        >

        </Wrapper>
    );
}

const Wrapper = styled("input")`
    border: none;
    outline: none;
    background-color: ${p => p.theme.background.tertiary};
    border-radius: 20px;
    ${p => p.theme.fontStyles.b2};
    padding: 0px 15px;
`;


export default SearchInput;