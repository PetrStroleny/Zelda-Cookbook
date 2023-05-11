
import { FC, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { GlobalContext } from "../../utils/global-context";
import AddOrEditModal from ".";
import Dropdown, { DropdownItem } from "../dropdown";
import Input from "../input";
import TextArea from "../text-area";
import {Region, ZeldaLocation} from "../../pages/locations";
import {Ingredient} from "../../pages/ingredients";
import { GENERAL_ERROR_MESSAGE, getData, postData } from "../../network";

interface AddOrEditLocationProps {
    hide: () => void
    edit?: boolean
}

export interface AddOrEditLocationInfo {
    id?: number
    name: string
    description: string
    regionName: string
    ingredients: number[]
}

const AddOrEditLocation: FC<AddOrEditLocationProps> = ({hide, edit}) => {
    const { control, handleSubmit, reset, getValues } = useForm<AddOrEditLocationInfo>({defaultValues: { 
        ingredients: [],
        regionName: "Akkala"
    }});
    const {modalQuery} = useContext(GlobalContext);
    const [ingredientDropdownItems, setIngredientDropdownItems] = useState<DropdownItem[]>([]);
    const [regionDropdownItems, setRegionDropdownItems] = useState<DropdownItem[]>([]);

    useEffect(() => {
        const fetchIngredientsAndRegions = async () => {
            try {
                const regionsData: Region[] = await getData("location");
                const ingredientsData: Ingredient[] = await getData("ingredient");

                if (edit) {
                    const activeID = modalQuery.split("-")[modalQuery.split("-").length - 2];
                    const editingLocation: {location: ZeldaLocation, ingredients: Ingredient[]} = await getData(`location/${activeID}`);

                    let newValues: AddOrEditLocationInfo = {
                        id: Number(editingLocation.location.id),
                        name: editingLocation.location.name,
                        description: editingLocation.location.description,
                        regionName: regionsData.filter(region => region.locations.map(location => location.id).includes(Number(editingLocation.location.id)))[0].name,
                        ingredients: editingLocation.ingredients.map(ingredient => ingredient.id)
                    };

                    reset(newValues);
                }

                setRegionDropdownItems(regionsData.map(region => ({value: region.id, label: region.name})));
                setIngredientDropdownItems(ingredientsData.map(ingredient => ({value: ingredient.id, label: ingredient.name})));
            } catch(e) {
                console.error(e);
            }
        }

        reset();
        document.body.classList.add("scroll-disabled");
        fetchIngredientsAndRegions();

        return () => document.body.classList.remove("scroll-disabled");
    }, []);

    async function onSubmit(data: AddOrEditLocationInfo) {
        let editedData: any = data;
        editedData.id = getValues()?.id ?? 0;
        delete editedData.region;

        try {
            await postData("location/create-or-edit", editedData);
            hide();
        } catch(e) {
            alert(GENERAL_ERROR_MESSAGE);
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
            <h2>{edit ? "Editovat" : "Přidat"} Lokaci</h2>
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
                    items={regionDropdownItems}
                    label="Region"
                    control={control}
                    rules={{required: { message: "Vyberte region lokace", value: true }}}
                    name="regionName"
                />

                <Dropdown
                    items={ingredientDropdownItems}
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