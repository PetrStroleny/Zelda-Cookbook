import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditLocation from "../components/add-or-edit-modals/add-or-edit-location";
import Button, { ButtonVariant } from "../components/button";
import { CardWrapper } from "../components/cards";
import CardsLocation from "../components/cards-location";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";

export interface ZeldaLocation {
    id: number
    name: string
    description: string
    ingredients: number[]
}
export interface Region {
    id: number
    name: string
    description: string
    locations: ZeldaLocation[]
}

const Locations = () => {
    const [errored, setErrored] = useState(false);
    const {regions: locations, searchQuery} = useContext(GlobalContext);
    const [activeLocations, setActiveLocations] = useState<Region[]>([]);
    const [addModalActive, setAddModalActive] = useState(false);
    const [loading, setLoading] = useState(false);

    async function fetchLocations() {
        try {
            setLoading(true);
            let filteredLocations = [];
            for await (const location of locations) {
                if (!location.name.toLowerCase().includes(searchQuery.toLowerCase())) continue;
                filteredLocations.push(location);
            }
            setActiveLocations(filteredLocations);
        } catch(e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, [locations]);

    if (errored) {
        return <ErrorPage/>;
    }

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
            {addModalActive && <AddOrEditLocation hide={() => setAddModalActive(false)}/>}
            
            <PageHeader
                trailing={
                    <Button 
                        onClick={() => setAddModalActive(true)}
                        variant={ButtonVariant.BLUE} 
                        rounded
                    >
                        <img src="public/icons/add.svg"/>
                </Button>}
            >
                Lokace
            </PageHeader>
            <CardsLocation regions={activeLocations} loading={loading}/>
        </>
    );
}

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;

export default Locations;