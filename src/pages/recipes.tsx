import { Helmet } from "react-helmet";
import Card from "../components/card";
import CardWrapper from "../components/card-wrapper";

const Recipes = () => (
    <>
        <Helmet>
            <meta property="og:title" content="Recepty | ZELDA COOK"/>
            <title>Recepty | ZELDA COOK</title>
        </Helmet>
        <CardWrapper>
            {new Array(25).fill("název receptu").map((name, index) => (
                <Card
                    key={index}
                    name={name}
                />
            ))}
        </CardWrapper>
    </>
);



export default Recipes;