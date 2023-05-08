import styled from "@emotion/styled";
import { FC, useContext } from "react";
import { Region } from "../pages/locations";
import { GlobalContext } from "../utils/global-context";
import { CardWrapper, NotFoundText } from "./cards";
import LabelMain from "./label-main";
import LoadingLocationCard from "./loading-location-card";
import LocationCard from "./location-card";

interface CardsLocationProps {
    regions: Region[]
    loading: boolean
}


const CardsLocation: FC<CardsLocationProps> = ({regions, loading}) => {
    const {setModalQuery, searchQuery } = useContext(GlobalContext);

    return (
        <>
            {loading || regions.map(region => region.locations).flat(1).filter(location => location.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ?
                loading ? 
                    <StyledCardWrapper>
                        {new Array(3).fill("").map((_, index) => <LoadingLocationCard key={index}/>)}
                    </StyledCardWrapper>
                    :
                    regions.map((region, index) => 
                    (
                        region.locations.filter(location => location.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 &&
                        <div key={index}>  
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

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;


export default CardsLocation;