import styled from "@emotion/styled";
import { FC, useState } from "react";
import { useLocation } from "wouter";
import Button from "./button";
import SearchInput, { useOpenSearchWithKeyboard } from "./search-input";

interface FoodFiltersQuery {
    searchQuery: string
    setSearch: (value: string) => void

    locationQuery: string
    setLocation: (value: string) => void
}

const FoodFilters: FC<FoodFiltersQuery> = ({searchQuery, setSearch, locationQuery, setLocation}) => {
    const [searchActive, setSearchActive] = useState(false);
    const [location, _] = useLocation();
    useOpenSearchWithKeyboard(() => setSearchActive(true), () => setSearchActive(false));

    function searchButtonClick() {
        if (searchActive) {
            setSearchActive(false);
            setSearch("");
            return;
        }

        setSearchActive(true);
    }

    return(
        <Wrapper>
            {location != "/lokace" &&
                <Button onClick={searchButtonClick}>
                    <img src={`public/icons/${searchActive ? "close" : "search"}.svg`}/>
                </Button>
            }
            {searchActive || location == "/lokace" ?
                <SearchInput value={searchQuery} onChange={setSearch}/>
            :
                <ButtonsWrapper>
                    <Button 
                        onClick={() => locationQuery != "Akkala Highlands" ? setLocation("Akkala Highlands") : setLocation("")} 
                        className={locationQuery == "Akkala Highlands" ? "active" : ""}
                    >
                        Akkala Highlands
                    </Button>
                    <Button 
                        onClick={() => locationQuery != "Deep Akkala" ? setLocation("Deep Akkala") : setLocation("")} 
                        className={locationQuery == "Deep Akkala" ? "active" : ""}>
                        Deep Akkala
                    </Button>
                    <Button 
                        onClick={() => locationQuery != "Lanayru Great Spring" ? setLocation("Lanayru Great Spring") : setLocation("")} 
                        className={locationQuery == "Lanayru Great Spring" ? "active" : ""}>
                        Lanayru Great Spring
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="Lanayru Sea" ? setLocation("Lanayru Sea") : setLocation("")} 
                        className={locationQuery == "Lanayru Sea" ? "active" : ""}>
                        Lanayru Sea
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="Lanayru Wetlands" ? setLocation("Lanayru Wetlands") : setLocation("")} 
                        className={locationQuery == "Lanayru Wetlands" ? "active" : ""}>
                        Lanayru Wetlands
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="Mount Lanayru" ? setLocation("Mount Lanayru") : setLocation("")} 
                        className={locationQuery == "Mount Lanayru" ? "active" : ""}>
                        Mount Lanayru
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="East Necluda" ? setLocation("East Necluda") : setLocation("")} 
                        className={locationQuery == "East Necluda" ? "active" : ""}>
                        East Necluda
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="West Necluda" ? setLocation("West Necluda") : setLocation("")} 
                        className={locationQuery == "West Necluda" ? "active" : ""}>
                        West Necluda
                    </Button>
                    <Button 
                        onClick={() => locationQuery !="Necluda Sea" ? setLocation("Necluda Sea") : setLocation("")} 
                        className={locationQuery == "Necluda Sea" ? "active" : ""}>
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
