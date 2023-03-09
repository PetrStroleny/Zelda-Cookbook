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
                <>
                    <Button onClick={() => setLocation("Akkala Highlands")} className={location == "Akkala Highlands" ? "active" : ""}>
                        Akkala Highlands
                    </Button>
                    <Button onClick={() => setLocation("Deep Akkala")} className={location == "Deep Akkala" ? "active" : ""}>
                        Deep Akkala
                    </Button>
                    <Button onClick={() => setLocation("Lanayru Great Spring")} className={location == "Lanayru Great Spring" ? "active" : ""}>
                        Lanayru Great Spring
                    </Button>
                    <Button onClick={() => setLocation("Lanayru Sea")} className={location == "Lanayru Sea" ? "active" : ""}>
                        Lanayru Sea
                    </Button>
                    <Button onClick={() => setLocation("Lanayru Wetlands")} className={location == "Lanayru Wetlands" ? "active" : ""}>
                        Lanayru Wetlands
                    </Button>
                    <Button onClick={() => setLocation("Mount Lanayru")} className={location == "Mount Lanayru" ? "active" : ""}>
                        Mount Lanayru
                    </Button>
                    <Button onClick={() => setLocation("East Necluda")} className={location == "East Necluda" ? "active" : ""}>
                        East Necluda
                    </Button>
                    <Button onClick={() => setLocation("West Necluda")} className={location == "West Necluda" ? "active" : ""}>
                        West Necluda
                    </Button>
                    <Button onClick={() => setLocation("Necluda Sea")} className={location == "Necluda Sea" ? "active" : ""}>
                        Necluda Sea
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
    width: 1764.32px;
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
            min-height: 60px;
            max-height: 60px;
            min-width: 60px;
            max-width: 60px;
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



export default FoodFilters;
