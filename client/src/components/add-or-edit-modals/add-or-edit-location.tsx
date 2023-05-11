
import { FC, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { addLocation, editLocation } from "../../utils/adding-editing";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown from "../dropdown";
import Input from "../input";
import TextArea from "../text-area";
import {Region} from "../../pages/locations";
import {Ingredient} from "../../pages/ingredients";

interface AddOrEditLocationProps {
    hide: () => void
    edit?: boolean
    regions: Region[]
    ingredients: Ingredient[]
}

export interface AddOrEditLocationInfo {
    id?: number
    name: string
    description: string
    regionName: string
    ingredients: number[]
}

const AddOrEditLocation: FC<AddOrEditLocationProps> = ({hide, regions, edit, ingredients}) => {
    const { control, handleSubmit, reset, getValues } = useForm<AddOrEditLocationInfo>({defaultValues: { 
        ingredients: [],
        regionName: "Akkala"
    }});

    useEffect(() => {
        reset();
        document.body.classList.add("scroll-disabled");

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    function onSubmit(data: AddOrEditLocationInfo) {
        const currentID = getValues()?.id ?? (Math.max(...regions.map(region => region.locations).flat(1).map(location => location.id)) + 1);
        let editedData: any = data;
        delete editedData.region;

        if (edit) {
            //editLocation({id: currentID, ...editedData}, data.regionName, initialValues.regionName, regions, setRegions)
        } else {
            //addLocation({id: currentID, ...editedData}, data.regionName, regions, setRegions);
        }

        hide();
    }

    return (
        <>
            <Helmet>
                <meta property="og:title" content={`${edit ? "Editovat" : "Přidat"} lokaci | ZELDA COOK`}/>
                <title>{edit ? "Editovat" : "Přidat"} lokaci | ZELDA COOK</title>
            </Helmet>
            <AddOrEditModal 
                editing={edit == true}
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
                    items={regions.map(region => ({value: region.name, label: region.name}))}
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