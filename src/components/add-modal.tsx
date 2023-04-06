
import styled from "@emotion/styled";
import { FC } from "react";
import Button, { ButtonVariant } from "./button";
import { useOpenAndClose } from "./search-input";
interface AddModalProps {
    hide: () => void
    submit: (data: any) => void
    children: JSX.Element | JSX.Element[]
}

const AddModal: FC<AddModalProps> = ({hide, submit, children}) => {
    useOpenAndClose(() => {}, hide);

    return (
        <Wrapper onClick={hide}>
            <Content 
                onSubmit={submit} 
                onClick={(e) => e.stopPropagation()}
            >
                {children}

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
    padding: 18px 28px;
    border-radius: 16px;
    box-shadow: rgba(0, 0, 0, 0.592) 0px 5px 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%; 
    overflow-y: auto;
    max-height: 100%;


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