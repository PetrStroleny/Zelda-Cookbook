import { CardWrapper } from "./cards";
import { StyledCardWrapper } from "./location-cards";
import LoadingFoodCard from "./loading-food-card";
import LoadingLocationCard from "./loading-location-card";


const CardsLoading = () => (
    <StyledCardWrapper>
        {new Array(3).fill("").map((_, index) => <LoadingLocationCard key={index}/>)}
    </StyledCardWrapper>
);

export default CardsLoading;