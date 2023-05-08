import styled from "@emotion/styled";
import { FC, useContext } from "react";
import { IngredienceLocation } from "../pages/locations";
import { GlobalContext } from "../utils/global-context";
import { CardWrapper, NotFoundText } from "./cards";
import LabelMain from "./label-main";
import LoadingLocationCard from "./loading-location-card";
import LocationCard from "./location-card";

interface CardsLocationProps {
    locations: IngredienceLocation[]
    loading: boolean
}


const CardsLocation: FC<CardsLocationProps> = ({locations, loading}) => {
    const {setModalQuery, searchQuery } = useContext(GlobalContext);

    return (
        <>
            {loading || locations.map(location => location.subLocations).flat(1).filter(subLocation => subLocation.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ?
                loading ? 
                    <StyledCardWrapper>
                        {new Array(3).fill("").map((_, index) => <LoadingLocationCard key={index}/>)}
                    </StyledCardWrapper>
                    :
                locations.map((location, index) => 
                    (
                        location.subLocations.filter(subLocation => subLocation.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 &&
                        <div key={index}>  
                            <LabelMain>{location.name}</LabelMain>

                            <StyledCardWrapper>
                                {location.subLocations.map((subLocation, index) => {
                                    if (!subLocation.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

                                    return(
                                        <LocationCard
                                            onClick={() => setModalQuery(`location-${subLocation.id}-0`)}
                                            {...subLocation}
                                            key={index}
                                        />
                                    )
                                })}
                            </StyledCardWrapper>
                        </div>
                    )
                )
                :
            <NotFoundText>
                {searchQuery.length > 0 ? 
                    "Pro zadané filtry nebyly nalezeny žádné lokace."
                        : 
                    "Žádné lokace."
                }
            </NotFoundText>}
        </>
    );
}

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;


export default CardsLocation;