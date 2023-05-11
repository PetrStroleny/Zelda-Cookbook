import LoadingLocationCard from "./loading-location-card";
import { StyledCardWrapper } from "./location-cards";


const LocationCardsLoading = () => (
    <StyledCardWrapper>
        {new Array(3).fill("").map((_, index) => <LoadingLocationCard key={index}/>)}
    </StyledCardWrapper>
);

export default LocationCardsLoading;