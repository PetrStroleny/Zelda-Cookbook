import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
import LocationCard from "../components/location-card";
import PageHeader from "../components/page-header";
import ErrorPage from "./error-page";

export interface Location {
    id: number
    name: string
}

const Locations = () => {
    const [locations, setLocations] = useState<Location[]>();
    const [loading, setLoading] = useState(false);
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
            <CardWrapper>
                {locations.map((location, index) => (
                    <LocationCard
                        key={index}
                        {...location}
                    />
                ))}
            </CardWrapper>
        </>
    );
}


export default Locations;