import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CardWrapper from "../components/card-wrapper";
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
    const {locations, searchQuery, setModalQuery, ingredients, setLocations} = useContext(GlobalContext);
    const [activeLocations, setActiveLocations] = useState<IngredienceLocation[]>([]);
    const [addModalActive, setAddModalActive] = useState(false);

    const { control, handleSubmit, reset } = useForm<AddLocationInfo>({defaultValues: {
        ingredients: [],
        regionName: "Akkala"
    }});
    
    function onSubmit(data: AddLocationInfo) {
        const currentID = locations[0].subLocations[0].id + 1;
        let editedData: any = data;
        delete editedData.region;

        addLocation({id: currentID, ...editedData}, data.regionName, locations, setLocations);

        setAddModalActive(false);
    }

    useEffect(() => {
        let filteredLocations = [];
        for (const location of locations) {
            if (!location.name.toLowerCase().includes(searchQuery.toLowerCase())) continue;
            filteredLocations.push(location);
        }
        setActiveLocations(filteredLocations);
    }, [locations]);

    useEffect(() => {
        reset();
    }, [addModalActive]);
    
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
                {activeLocations.map((location, index) => 
                    <div key={index}>  
                        <LabelMain>{location.name}</LabelMain>

                        <StyledCardWrapper>
                            {location.subLocations.map((subLocation, index) => {
                                if (!subLocation.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

                                return(
                                    <LocationCard
                                        onClick={() => setModalQuery(`location-${subLocation.id}-0`)}
                                        {...subLocation}
                                        key={index}
                                    />
                                )
                            })}
                        </StyledCardWrapper>
                    </div>
                )}
        </>
    );
}

const StyledCardWrapper = styled(CardWrapper)`
    grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
`;

export default Locations;