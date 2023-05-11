import styled from "@emotion/styled";
import { ComponentProps, FC } from "react";
import { Control, useController } from "react-hook-form";
import ErrorMessage from "./error-message";
import { InputLabel, InputUnderInformation } from "./input";

export interface DropdownItem {
    value: any
    label: string
}

interface DropdownProps extends ComponentProps<"select"> {
    control: Control<any>
    name: string
    placeholder?: string
    defaultValue?: number
    rules?: any
    customError?: string
    label?: string
    items: DropdownItem[]
}

const Dropdown: FC<DropdownProps> = ({
    control,
    rules,
    name,
    customError,
    label,
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
                onChange={(e) =>  {
                    if (props.multiple) {
                        let activeOptions = [];
                        for (const option of e.target.options) {
                            if (option.selected) {
                                activeOptions.push(isNaN(Number(option.value)) ? option.value : Number(option.value));
                            }
                        }
                    
                        field.onChange(activeOptions);
                        return;
                    }

                    field.onChange(isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value))}
                }
                errored={Boolean(fieldState.error)}
                value={field.value}
                {...props}               
            >   
                {props.items.map((item, index) =>
                    <option 
                        key={index} 
                        //selected={props.multiple ? field.value.includes(item.value) : field.value == item.value} 
                        value={item.value}
                    >
                        {item.label}
                    </option>
                )}
            </StyledDropdown>
            
            <InputUnderInformation>
                {(!!fieldState.error && fieldState?.error?.message) && <ErrorMessage>{fieldState.error.message}</ErrorMessage>}
                {(!!fieldState.error && (!fieldState?.error?.message && customError)) && <ErrorMessage>{customError}</ErrorMessage>}
                
            </InputUnderInformation>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: relative;
    width: 100%;
`;

const StyledDropdown = styled("select") <{ errored?: boolean, hide?: boolean, multiple?: boolean }>`
    padding: ${p => p.hide ? "0px 53px 0px 17px" : "0px 17px"};
    width: 100%;
    height: ${p => p.multiple ? "180px" : "60px"};
    border-radius: 8px;
    background: ${p => p.theme.background.primary};
    color: ${p => p.theme.content.primary};
    border: 1px solid ${p => p.errored ? p.theme.primitives.red : p.theme.background.secondary};
    outline: none;
    ${p => p.theme.fontStyles.items};
    
    > option {
        font-size: 18px;
        height: ${p => p.multiple ? "30px" : "60px"};
        display: flex;
        align-items: center;
        border-radius: 10px;
        padding: 5px;
        &:not(:last-of-type) {
            margin-bottom: 1px;
        }
    }
    
`;

export default Dropdown;