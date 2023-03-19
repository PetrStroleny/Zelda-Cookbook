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

`;

export default TextArea;