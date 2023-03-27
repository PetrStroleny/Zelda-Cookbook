import styled from "@emotion/styled";
import { ChangeEvent, ComponentProps, FC, useRef } from "react";
import { Control, useController, UseFormRegister } from "react-hook-form";
import ErrorMessage from "./error-message";
import { InputLabel, InputUnderInformation, MaxLengthDiv } from "./input";

interface DropdownProps extends ComponentProps<"select"> {
    control: Control<any>
    name: string
    placeholder?: string
    defaultValue?: number
    rules?: any
    errored?: boolean
    customError?: string
    label?: string
    location?: {}
}

const Dropdown: FC<DropdownProps> = ({
    control,
    rules,
    errored,
    name,
    customError,
    label,
    location,
    ...props }) => {

    const { field, fieldState } = useController({ name, rules, control});

    return (
        <Wrapper>
            {label &&
                <InputLabel>
                    {label}
                </InputLabel>
            }

            <StyledDropdown
                id={name}
                onChange={(e) => field.onChange(Number(e.target.value))}
                errored={(!!fieldState.error || errored )}
                {...props}               
            >
                <option value={1}>Akkala Highlands</option>
                <option value={2}>Deep Akkkala</option>
                <option value={3}>Lanayru Great Spring</option>
                <option value={4}>Lanayru Sea</option>
                <option value={5}>Lanayru Wetlands</option>
                <option value={6}>Mount Lanayru</option>
                <option value={7}>East Necluda</option>
                <option value={8}>West Necluda</option>
                <option value={9}>Necluda Sea</option>
            </StyledDropdown>
            
            <InputUnderInformation>
                {((!!fieldState.error || errored) && fieldState?.error?.message) && <ErrorMessage>{fieldState.error.message}</ErrorMessage>}
                {((!!fieldState.error || errored) && (!fieldState?.error?.message && customError)) && <ErrorMessage>{customError}</ErrorMessage>}
                
            </InputUnderInformation>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: relative;
    width: 100%;
`;

const StyledDropdown = styled("select") <{ errored?: boolean, hide?: boolean }>`
    padding: ${p => p.hide ? "0px 53px 0px 17px" : "0px 17px"};
    width: 100%;
    border-radius: 8px;
    height: 60px;
    background: ${p => p.theme.background.primary};
    color: ${p => p.theme.content.primary};
    border: 1px solid ${p => p.theme.background.secondary};
    outline: none;
    ${p => p.theme.fontStyles.items};
    
    >option{
        font-size: 18px;
    }
    
`;

export default Dropdown;