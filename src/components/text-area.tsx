import styled from "@emotion/styled";
import { ChangeEvent, ComponentProps, FC, useRef } from "react";
import { Control, useController, UseFormRegister } from "react-hook-form";

import ErrorMessage from "./error-message";
import { InputLabel, InputUnderInformation, MaxLengthDiv } from "./input";

interface TextAreaProps extends ComponentProps<"textarea"> {
    control: Control<any>
    name: string

    placeholder?: string
    defaultValue?: string | number
    rules?: any
    errored?: boolean
    customError?: string
    maxLength?: number
    label?: string
}

const TextArea: FC<TextAreaProps> = ({
    control,
    rules,
    defaultValue,
    errored,
    name,
    customError,
    maxLength,
    label,
    ...props }) => {
    const { field, fieldState } = useController({ name, rules, control, defaultValue });
    const inputValue: string = field?.value ?? "";

    return (
        <Wrapper>
            {label &&
                <InputLabel>
                    {label}
                </InputLabel>
            }

            <StyledTextArea
                maxLength={maxLength ? maxLength : 150}
                id={name}
                onChange={(e) => field.onChange(e.target.value)}
                errored={(!!fieldState.error || errored )}
                {...props}               
            />
            <InputUnderInformation>
                {((!!fieldState.error || errored) && fieldState?.error?.message) && <ErrorMessage>{fieldState.error.message}</ErrorMessage>}
                {((!!fieldState.error || errored) && (!fieldState?.error?.message && customError)) && <ErrorMessage>{customError}</ErrorMessage>}
                
                <MaxLengthDiv>
                    {inputValue?.length ?? 0} / {maxLength ? maxLength : 150}
                </MaxLengthDiv>
            </InputUnderInformation>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: relative;
    width: 100%;
`;

const StyledTextArea = styled("textarea") <{ errored?: boolean, hide?: boolean }>`
    padding: ${p => p.hide ? "0px 53px 0px 17px" : "0px 17px"};
    max-width: 100%;
    width: 100%;
    max-height: 250px;
    min-height: 100px;
    border-radius: 8px;
    height: 60px;
    background: ${p => p.theme.background.primary};
    color: ${p => p.theme.content.primary};
    border: 1px solid ${p => p.theme.background.secondary};
    outline: none;
    ${p => p.theme.fontStyles.items};

    &:focus{
        border: 2px solid ${p => p.theme.primitives.blue};
        padding: ${p => p.hide ? "0px 52px 0px 16px" : "0px 16px"};
    }
`;

export default TextArea;