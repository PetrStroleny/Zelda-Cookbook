import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
import LabelMain from "../components/label-main";
import LocationCard from "../components/location-card";
import PageHeader from "../components/page-header";
import ErrorPage from "./error-page";


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

interface LocationsProps {
    searchQuery: string
}

const Locations: FC<LocationsProps> = ({searchQuery}) => {
    const [locations, setLocations] = useState<IngredienceLocation[]>();
    const [errored, setErrored] = useState(false);

    async function fetchLocations() {
        try {
            const res = await fetch('../server/locations.json');
            const json = await res.json();
            
            setLocations(json.data);
        } catch (e) {
            console.error(e);
            setErrored(true);
        }
    }

    useEffect(() => {fetchLocations()}, []);

    if (errored) {
        return <ErrorPage/>;
    }

    if (!locations) {
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
                {locations.map((location, index) => 
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