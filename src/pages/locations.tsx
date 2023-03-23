import styled from "@emotion/styled";
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
import LabelMain from "../components/label-main";
import LocationCard from "../components/location-card";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";

export interface SubLocation {
    id: number
    name: string
    description: string
    ingredients: number[]
}
export interface IngredienceLocation {
    name: string
    description: string
    subLocations: SubLocation[]
}



const Locations = () => {
    const {locations, searchQuery} = useContext(GlobalContext);
    const [activeLocations, setActiveLocations] = useState<IngredienceLocation[]>([]);


    useEffect(() => {
        let filteredLocations = [];
        for (const location of locations) {
            if (!location.name.toLowerCase().includes(searchQuery.toLowerCase())) continue;
            filteredLocations.push(location);
        }
        setActiveLocations(filteredLocations);
    }, [locations])
    
    if (locations.length == 0) {
        return (
            <>
                <Helmet>
                    <title>Načítání... | ZELDA COOK</title>
                </Helmet>
                <PageHeader>
                    Lokace
                </PageHeader>
            </>
        );
    }

    return(
        <>
            <Helmet>
                <meta property="og:title" content="Lokace | ZELDA COOK"/>
                <title>Lokace | ZELDA COOK</title>
            </Helmet>
            <PageHeader>
                Lokace
            </PageHeader>
                {activeLocations.map((location, index) => 
                    <div key={index}>  
                        <LabelMain>{location.name}</LabelMain>

                        <StyledCardWrapper>
                            {location.subLocations.map((subLocation, index) => {
                                if (!subLocation.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

                                return(
                                    <LocationCard
                                    {...subLocation}
                                    key={index}
                                    />
                                )
                            })}
                        </StyledCardWrapper>
                    </div>
                )}
        </>
    );
}

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;

export default Locations;