
import styled from "@emotion/styled";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { validateIsNumber } from "../utils/form";
import Button, { ButtonVariant } from "./button";
import Input from "./input";
import { useOpenAndClose } from "./search-input";

export enum ModalType {
    LOCATION,
    RECEIPT,
    INGREDIENT,
}

function getModalLabel(type: ModalType) {
    switch(type) {
        case ModalType.LOCATION:
            return "Přidat lokaci";
        case ModalType.RECEIPT:
            return "Přidat recept";
        case ModalType.INGREDIENT:
            return "Přidat ingredienci";
        }
}
            
interface AddModalProps {
    hide: () => void
    submitFunction: (values: any) => void
    type: ModalType
}

const AddModal: FC<AddModalProps> = ({hide, submitFunction, type}) => {
    const { control, handleSubmit } = useForm<{ 
        name: string, 
        description: string,
        numberOfHearts?: number,
    }>();

    const [customHeartsError, setCustomHeartsError] = useState("");

    const onSubmit = async (data: any) => {
        await submitFunction(data);
        hide();
    };

    useOpenAndClose(() => {}, hide);

    return (
        <Wrapper onClick={hide}>
            <Content 
                onSubmit={handleSubmit(onSubmit)} 
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{getModalLabel(type)}</h2>
                <Input 
                    label="Název"
                    control={control}
                    rules={{ required: { message: "Vyplňte název", value: true } }}
                    name="name"
                />
                {type != ModalType.LOCATION &&
                    <Input 
                        label="Počet srdíček"
                        control={control}
                        name="numberOfHearts"
                        maxLength={3}
                        customError={customHeartsError}
                        rules={{ 
                            required: { message: "Vyplňte počet srdíček", value: true },
                            validate: (value: string) => validateIsNumber(
                                value, 
                                setCustomHeartsError, 
                                999,
                                false,
                                {
                                    negativeError: "Počet srdíček musí být větší nežli 0",
                                }
                            )
                        }}  
                    />
                }
                {/* <TextArea/> */}
                

                <div>
                    <Button onClick={hide} type="button">
                        Zrušit
                    </Button>
                    <Button variant={ButtonVariant.BLUE} type="submit">
                        Přidat
                    </Button>
                </div>
            </Content>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 1;
    background: rgb(238,238,238,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Content = styled("form")`
    background-color: ${p => p.theme.background.primary};
    padding: 14px 28px;
    border-radius: 16px;
    box-shadow: rgba(0, 0, 0, 0.592) 0px 5px 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%; 

    > h2 {
        ${p => p.theme.fontStyles.h2};
    }

    > div:last-of-type {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
    }
`;

export default AddModal;