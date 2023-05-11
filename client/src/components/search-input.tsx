import styled from "@emotion/styled";
import { FC, useEffect, forwardRef } from "react";

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    ref: any
}


// Implementace otevření hledání skrze klávesnici (ctrl+f)
export function useOpenAndClose(open: () => void, close: () => void) {
    function handleWindowKeyUp(e: KeyboardEvent) {
        if (e.key == "Escape") {
            close();
            return;
        }

        if (e.key != "f" || !e.metaKey && !e.ctrlKey) return;
        e.preventDefault();
        open();
    }

    useEffect(() => {
        window.addEventListener("keydown", handleWindowKeyUp);
        return () => window.removeEventListener("keydown", handleWindowKeyUp);
    }, []);
}

export function getSearchValue(): string {
    for (const query of window?.location?.search.substring(1).split("&")) {
        if (query.split("=")[0] == "q") {
            return query.split("=")[1];
        }
    }

    return "";
}

const SearchInput: FC<SearchInputProps> = forwardRef(({ value, onChange }, ref: any) => (
    <StyledInput 
        ref={ref}
        placeholder="Hledat"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
));

const StyledInput = styled("input")`
    border: none;
    outline: none;
    background-color: ${p => p.theme.background.tertiary};
    border-radius: 20px;
    ${p => p.theme.fontStyles.b2};
    padding: 0px 15px;
    width: 100%;
    height: 100%;
    display: flex;
`;


export default SearchInput;