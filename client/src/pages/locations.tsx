import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import AddOrEditLocation from "../components/add-or-edit-modals/add-or-edit-location";
import Button, { ButtonVariant } from "../components/button";
import { CardWrapper } from "../components/cards";
import CardsLocation from "../components/location-cards";
import PageHeader from "../components/page-header";
import { GlobalContext } from "../utils/global-context";
import ErrorPage from "./error-page";
import { getData } from "../network";
import LocationCardsLoading from "../components/location-cards-loading";

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
    const {searchQuery, modalQuery, transitioning, setTransitioning} = useContext(GlobalContext);
    const [regions, setRegions] = useState<Region[]>([]);
    const [addModalActive, setAddModalActive] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchLocations() {
        try {
            if (!regions) {
                setLoading(true);
            } else {
                setTransitioning(true);
            }

            const newLocations = await getData(`location?search=${encodeURIComponent(searchQuery)}`);
            setRegions(newLocations);
        } catch(e) {
            console.error(e);
            setErrored(true);
        } finally {
            setLoading(false);
            setTransitioning(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, [searchQuery, addModalActive, modalQuery]);

    if (errored) {
        return <ErrorPage/>;
    }

    if (!regions) {
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
            {loading ?
                <LocationCardsLoading/>
            :    
                <CardsLocation regions={regions} transitioning={transitioning}/>
        }
        </>
    );
}

export default Locations;