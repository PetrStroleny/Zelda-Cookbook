import { CardWrapper } from "./cards";
import LoadingFoodCard from "./loading-food-card";


const CardsLoading = () => (
    <CardWrapper>
        {new Array(15).fill("").map((_, index) => <LoadingFoodCard key={index}/>)}
    </CardWrapper>
);

export default CardsLoading;