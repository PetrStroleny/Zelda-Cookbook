import { FC, useState } from "react";
import styled from "@emotion/styled";
import LocationCard from "./location-card";

export interface ModalProps {
  label: string;
  description: string;
  close: () => void;
  imgSrc?: string;
}



const Modal: FC<ModalProps> = ({ label, description, imgSrc, close }) => (
    <Wrapper onClick={close}>
      <Content>
        <Image src={imgSrc} alt="LocationImg" />
        <ModalDetails>
          <Label>{label}</Label>
          <Description>{description}</Description>
          <RedStripe />
          <Ingredients>Ingredients:</Ingredients>
          <IngredientsList>
            <li>Japko</li>
            <li>Raytshe</li>
            <li>груша</li>
          </IngredientsList>
          
        </ModalDetails>
        
      </Content>
    </Wrapper>
);

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1;
  background: rgba(238, 238, 238, 0.5);
  z-index: 1;
  background: rgb(238,238,238,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled("div")`
  border-radius: 20px;
  background-color: ${p => p.theme.background.primary};
  padding: 20px;
  border-radius: 12px;
  max-width: 1200px;
  min-width: 900px;
  box-shadow: rgba(0, 0, 0, 0.592) 0px 5px 15px;
  display: flex;
  align-items: flex-start;
`;

const Image = styled("img")`
  width: 50%;
  height: 360px;
  border-radius: 17px;
  object-fit: contain;
`;

const ModalDetails = styled("div")`
  width: 50%;
  margin-left: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled("h2")`
  font-size: 24px;
  font-weight: 700;
  padding-top: 40px;
  margin-bottom: 12px;
`;

const Description = styled("p")`
  font-size: 18px;
  line-height: 1.05;
  padding-top: 20px;
  margin-bottom: 5px;
`;

const Ingredients = styled("p")`
  font-size: 18px;
  font-weight: 700;
  padding-top: 20px;
  margin-bottom: 10px;
`;

const IngredientsList = styled("ul")`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const RedStripe = styled("div")`
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #686A6C , #8d1006);
  margin-top: 20px;
`;

const CloseButton = styled("button")`
  border: 0;
  font-size: 1rem;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.6) 0px 5px 15px;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 7px;

  :hover {
    color: red;
  }
`;





export default Modal;