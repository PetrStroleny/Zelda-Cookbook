import styled from "@emotion/styled";
import { FC, useState } from "react";
import { useLocation } from "wouter";
import Button from "./button";
import SearchInput, { useOpenSearchWithKeyboard } from "./search-input";

interface FoodFiltersQuery {
    search: string
    setSearch: (value: string) => void

    location: string
    setLocation: (value: string) => void
}

export function getLocationValue(): string {
    for (const query of window?.location?.search.substring(1).split("&")) {
        if (query.split("=")[0] == "location") {
            return  decodeURI(query.split("=")[1]);
        }
    }

    return "";
}

const FoodFilters: FC<FoodFiltersQuery> = ({search, setSearch, location, setLocation}) => {
    const [searchActive, setSearchActive] = useState(false);
    useOpenSearchWithKeyboard(() => setSearchActive(true));

    return(
        <Wrapper>

                <Button onClick = {() => setSearchActive(p => !p)}>
                    <img src={`public/icons/${searchActive ? "close" : "search"}.svg`}/>
                </Button>
            {searchActive ?
                <SearchInput value={search} onChange={setSearch}/>
            :
                <ButtonsWrapper>
                    <Button 
                        onClick={() => location != "Akkala Highlands" ? setLocation("Akkala Highlands") : setLocation("")} 
                        className={location == "Akkala Highlands" ? "active" : ""}
                    >
                        Akkala Highlands
                    </Button>
                    <Button 
                        onClick={() => location != "Deep Akkala" ? setLocation("Deep Akkala") : setLocation("")} 
                        className={location == "Deep Akkala" ? "active" : ""}>
                        Deep Akkala
                    </Button>
                    <Button 
                        onClick={() => location != "Lanayru Great Spring" ? setLocation("Lanayru Great Spring") : setLocation("")} 
                        className={location == "Lanayru Great Spring" ? "active" : ""}>
                        Lanayru Great Spring
                    </Button>
                    <Button 
                        onClick={() => location !="Lanayru Sea" ? setLocation("Lanayru Sea") : setLocation("")} 
                        className={location == "Lanayru Sea" ? "active" : ""}>
                        Lanayru Sea
                    </Button>
                    <Button 
                        onClick={() => location !="Lanayru Wetlands" ? setLocation("Lanayru Wetlands") : setLocation("")} 
                        className={location == "Lanayru Wetlands" ? "active" : ""}>
                        Lanayru Wetlands
                    </Button>
                    <Button 
                        onClick={() => location !="Mount Lanayru" ? setLocation("Mount Lanayru") : setLocation("")} 
                        className={location == "Mount Lanayru" ? "active" : ""}>
                        Mount Lanayru
                    </Button>
                    <Button 
                        onClick={() => location !="East Necluda" ? setLocation("East Necluda") : setLocation("")} 
                        className={location == "East Necluda" ? "active" : ""}>
                        East Necluda
                    </Button>
                    <Button 
                        onClick={() => location !="West Necluda" ? setLocation("West Necluda") : setLocation("")} 
                        className={location == "West Necluda" ? "active" : ""}>
                        West Necluda
                    </Button>
                    <Button 
                        onClick={() => location !="Necluda Sea" ? setLocation("Necluda Sea") : setLocation("")} 
                        className={location == "Necluda Sea" ? "active" : ""}>
                        Necluda Sea
                    </Button>
                </ButtonsWrapper>
            }
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: fixed;
    bottom: 20px;
    left: 20px;
    border-radius: 26px;
    width: calc(100% - 40px);
    padding: 10px;
    background-color: ${p => p.theme.background.primary};
    border: 10px ${p => p.theme.background.primary};
    display: flex;
    align-items: center;
    height: 80px;

    > button {
        margin-right: 19px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        min-height: 60px;
        max-height: 60px;
        min-width: 60px;
        max-width: 60px;
        padding: 0;

        &:after {
            left: 78px;
            top: 16px;
            height: calc(100% - 32px);
            width: 3px;
            border-radius: 25px;
            content: "";
            position: absolute;
            background-color: ${p => p.theme.background.secondary};
        }
    }
`;

const ButtonsWrapper = styled("div")`
    display: flex;
    overflow-x: auto;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;

    > button {
        margin-right: 10px;

        &:last-of-type {
            margin-right: 0;
        }
    }
`;


export default FoodFilters;
