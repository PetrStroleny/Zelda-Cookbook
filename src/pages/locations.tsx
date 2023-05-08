import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {CardWrapper} from "../components/cards";
import LabelMain from "../components/label-main";
import LocationCard from "../components/location-card";
import PageHeader from "../components/page-header";
import { GlobalContext, addLocation } from "../utils/global-context";
import AddOrEditModal from "../components/add-or-edit-modal";
import { useForm } from "react-hook-form";
import Input from "../components/input";
import TextArea from "../components/text-area";
import Dropdown from "../components/dropdown";
import Button, { ButtonVariant } from "../components/button";
import AddOrEditLocation from "../components/add-or-edit-location";
import CardsLocation from "../components/cards-location";

export interface SubLocation {
    id: number
    name: string
    description: string
    ingredients: number[]
}
export interface IngredienceLocation {
    id: number
    name: string
    description: string
    subLocations: SubLocation[]
}

interface AddLocationInfo {
    name: string
    description: string
    regionName: string
    ingredients: number[]
}

const Locations = () => {
    const {locations, searchQuery, setLocations} = useContext(GlobalContext);
    const [activeLocations, setActiveLocations] = useState<IngredienceLocation[]>([]);
    const [addModalActive, setAddModalActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let filteredLocations = [];
        for (const location of locations) {
            if (!location.name.toLowerCase().includes(searchQuery.toLowerCase())) continue;
            filteredLocations.push(location);
        }
        setActiveLocations(filteredLocations);
        setLoading(false);
    }, [locations]);

    
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
            <CardsLocation locations={activeLocations} loading={loading}/>
        </>
    );
}

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;

export default Locations;