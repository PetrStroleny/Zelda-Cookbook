import styled from "@emotion/styled";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { GlobalContext } from "../utils/global-context";
import Button from "./button";
import SearchInput, { useOpenAndClose } from "./search-input";
import { Region } from "../pages/locations";
import { SpecialEffect } from "../pages/ingredients";
import { getData } from "../network";

interface FoodFiltersQuery {
    searchQuery: string
    setSearch: (value: string) => void

    specialEffectQuery: string
    setSpecialEffectQuery: (value: string) => void

    locationQuery: string
    setLocation: (value: string) => void
}

const Filters: FC<FoodFiltersQuery> = ({searchQuery, setSearch, specialEffectQuery, setSpecialEffectQuery, locationQuery, setLocation}) => {
    const [searchActive, setSearchActive] = useState(false);
    const [location, _] = useLocation();
    useOpenAndClose(() => setSearchActive(true), () => {setSearchActive(false); setSearch("")});
    const [regions, setRegions] = useState<Region[]>([]);
    const [specialEffects, setSpecialEffects] = useState<SpecialEffect[]>([]);

    useEffect(() => {
        const fetchRegionsAndSpecialEffects = async () => {
            try {
                const regionsData = await getData("location");
                const specialEffectsData = await getData("special-effect");
                console.log(regionsData)
                setRegions(regionsData);
                setSpecialEffects(specialEffectsData);
            } catch(e) {
                console.error(e);
            }
        }
        
        fetchRegionsAndSpecialEffects();
    }, []);

    function searchButtonClick() {
        if (searchActive) {
            setSearchActive(false);
            setSearch("");
            return;
        }

        setSearchActive(true);
    }

    function specialEffectButtonClick(specialEffectName: string) {
        if (specialEffectQuery != specialEffectName) {
            setSpecialEffectQuery(specialEffectName);
            return;
        } 

        setSpecialEffectQuery("");
    }

    return(
        <Wrapper>
            {location != "/lokace" && 
                <SpecialEffects>
                    {specialEffects.map((specialEffect, index) =>
                        <div 
                            key={index} 
                            className={specialEffectQuery == specialEffect.name ? "active" : ""} 
                            onClick={() => specialEffectButtonClick(specialEffect.name)} 
                        >
                            <img src={specialEffect.imgSrc}/>
                        </div>
                    )}
                </SpecialEffects>
            }
            <div>
                {location != "/lokace" &&
                    <Button onClick={searchButtonClick}>
                        <img src={`public/icons/${searchActive ? "close" : "search"}.svg`}/>
                    </Button>
                }
                {searchActive || location == "/lokace" ?
                    <SearchInput value={searchQuery} onChange={setSearch}/>
                :
                    <ButtonsWrapper>
                        {regions.map(region => 
                            region.locations.map((location, index) =>
                                <Button 
                                    key={index}
                                    onClick={() => locationQuery != location.name ? setLocation(location.name) : setLocation("")} 
                                    className={locationQuery == location.name ? "active" : ""}
                                >
                                    {location.name}
                                </Button>
                            )
                        )}
                    </ButtonsWrapper>
                }
            </div>
        </Wrapper>
    );
}

const SpecialEffects = styled("div")`
    display: flex;
    margin-left: auto;
    height: 40px;
    margin-bottom: 8px;
    gap: 4px;

    > div {
        width: 40px;
        border-radius: 999px;
        background-color: ${p => p.theme.content.primary};
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &.active {
            border: 2px solid ${p => p.theme.primitives.blue};
        }

        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 0.6;
        }

        > img {
            width: 28px;
            height: 28px;
            object-fit: contain;
        }
    }
`;

const Wrapper = styled("div")`
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    
    > div:last-of-type {
        border-radius: 26px;
        padding: 10px;
        background-color: ${p => p.theme.background.primary};
        border: 10px ${p => p.theme.background.primary};
        display: flex;
        align-items: center;
        height: 80px;
        position: relative;

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


export default Filters;
