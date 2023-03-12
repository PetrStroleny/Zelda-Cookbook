
import { useState } from "react";
import styled from "@emotion/styled";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      <CloseButton onClick={toggleModal} className="btn-modal">
        Jablko
      </CloseButton>

      {modal && (
        <Wrapper onClick={toggleModal}>
          <Content>
            <h2>Nazev polozky na kterou jsem kliknul</h2>
            <p>
              I guess tady je ten popis surovinky atd, nalevo nejspis nejaky obrazek kterej sem neumim dat
            </p>
            <ModalButton onClick={toggleModal}>
              X
            </ModalButton>
          </Content>
        </Wrapper>
      )}

    </>
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

const Content = styled("div")`
  border-radius: 20px;
  background-color: ${p => p.theme.background.primary};
  padding: 14px 28px;
  border-radius: 16px;
  max-width: 600px;
  min-width: 300px;
  box-shadow: rgba(0, 0, 0, 0.592) 0px 5px 15px;
`;

const ModalButton = styled("button")`
  padding: 10px 20px;
  display: block;
  margin: 100px auto 0;
  font-size: 30px;
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