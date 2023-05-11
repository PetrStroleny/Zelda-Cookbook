import styled from "@emotion/styled";
import { FC, useContext } from "react";
import { Region } from "../pages/locations";
import { GlobalContext } from "../utils/global-context";
import { CardWrapper, NotFoundText } from "./cards";
import LabelMain from "./label-main";
import LocationCard from "./location-card";

interface CardsLocationProps {
    regions: Region[]
    transitioning: boolean
}

const CardsLocation: FC<CardsLocationProps> = ({regions, transitioning}) => {
    const {setModalQuery, searchQuery } = useContext(GlobalContext);

    return (
        <>
            {regions.map(region => region.locations).flat(1).filter(location => location.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ?
                    regions.map((region, index) => 
                    (
                        region.locations.filter(location => location.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 &&
                        <div className={transitioning ? "fading" : ""} key={index}>  
                            <LabelMain>{region.name}</LabelMain>

                            <StyledCardWrapper>
                                {region.locations.map((location, index) => {
                                    if (!location.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

                                    return(
                                        <LocationCard
                                            onClick={() => setModalQuery(`location-${location.id}-0`)}
                                            {...location}
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

export const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;


export default CardsLocation;