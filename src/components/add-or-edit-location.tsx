
import { FC, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext, addLocation, editLocation } from "../utils/global-context";
import AddOrEditModal from "./add-or-edit-modal";
import Dropdown from "./dropdown";
import Input from "./input";
import TextArea from "./text-area";
import { Helmet } from "react-helmet";

interface AddOrEditLocationProps {
    hide: () => void
    initialValues?: AddOrEditLocationInfo
}

export interface AddOrEditLocationInfo {
    id?: number
    name: string
    description: string
    regionName: string
    ingredients: number[]
}

const AddOrEditLocation: FC<AddOrEditLocationProps> = ({hide, initialValues}) => {
    const {ingredients, locations, setLocations } = useContext(GlobalContext);
    
    const { control, handleSubmit, reset } = useForm<AddOrEditLocationInfo>({defaultValues: initialValues ?? { 
        ingredients: [],
        regionName: "Akkala"
    }});

    useEffect(() => {
        reset();
        document.body.classList.add("scroll-disabled");

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    function onSubmit(data: AddOrEditLocationInfo) {
        const currentID = initialValues?.id ?? (Math.max(...locations.map(location => location.subLocations).flat(1).map(subLocation => subLocation.id)) + 1);
        let editedData: any = data;
        delete editedData.region;

        if (initialValues) {
            editLocation({id: currentID, ...editedData}, data.regionName, initialValues.regionName, locations, setLocations)
        } else {
            addLocation({id: currentID, ...editedData}, data.regionName, locations, setLocations);
        }

        hide();
    }

    return (
        <>
            <Helmet>
                <meta property="og:title" content="Přidat lokaci | ZELDA COOK"/>
                <title>Přidat lokaci | ZELDA COOK</title>
            </Helmet>
            <AddOrEditModal 
                editing={initialValues != undefined}
                submit={handleSubmit(onSubmit)} 
                hide={hide}
            >   
            <h2>Přidat Lokaci</h2>
                <Input 
                    label="Název"
                    control={control}
                    rules={{ required: { message: "Vyplňte název", value: true } }}
                    name="name"
                />

                <TextArea
                    label="Popis"
                    control={control}
                    rules={{ required: { message: "Vyplňte popis", value: true } }}
                    name="description"
                    maxLength={750}
                />

                <Dropdown
                    items={locations.map(location => ({value: location.name, label: location.name}))}
                    label="Region"
                    control={control}
                    rules={{required: { message: "Vyberte region lokace", value: true }}}
                    name="regionName"
                />

                <Dropdown
                    items={ingredients.map(ingredient => ({value: ingredient.id, label: ingredient.name}))}
                    label="Ingredience"
                    control={control}
                    rules={{required: { message: "Vyberte alespoň jednu ingredienci", value: true }}}
                    multiple
                    name="ingredients"
                />
            </AddOrEditModal>
        </>
    );
}


export default AddOrEditLocation;