import styled from "@emotion/styled";
import { FC, Fragment, useContext, useEffect, useState } from "react";
import { deleteData } from "../network";
import { GlobalContext } from "../utils/global-context";
import Button, { ButtonVariant } from "./button";
import { formatDuration } from "./food-card";
import { useModalActions } from "./modal-actions";

export interface LinkCard {
  name: string
  modalQuery: string
  imgSrc: string
}

interface ModalProps {
  setEditModalActive: () => void
}


const Modal: FC<ModalProps> = ({setEditModalActive}) => {
  const [active, setActive] = useState("");
  const {modalQuery, setModalQuery} = useContext(GlobalContext);

  const {imgSrc, label, description, price, specialEffect, linkCards, deleteIngredient, deleteLocation, deleteRecipe} = useModalActions();
  
  useEffect(() => {
      if (active) {
          document.body.classList.add("scroll-disabled");
      } else {
          document.body.classList.remove("scroll-disabled");
      }
  }, [active]);

  useEffect(() => {
    if (modalQuery.length > 0) {
      if (modalQuery.includes("location")) {
        setActive("location");
        return;
      }
      if (modalQuery.includes("ingerient")) {
        setActive("ingerient");
        return;
      }

      setActive("recipe");
      return;
    }

    setActive("");
  }, [modalQuery.length > 0])

  return (
       active ? <Wrapper onClick={() => setModalQuery("")}>
          <Content onClick={(e) => e.stopPropagation()}>
            <Buttons>
              {modalQuery.split("-")[modalQuery.split("-").length-1] == "1" ?
                <Button 
                  style={{zIndex: 4}}
                  onClick={() => history.back()}
                  variant={ButtonVariant.PRIMARY} 
                  rounded
                >
                    <img src="public/icons/back.svg"/>
                </Button> : <div/>}
                <div style={{display: "flex", gap: "8px"}}>
                    <Button 
                      onClick={setEditModalActive}
                      variant={ButtonVariant.BLUE} 
                      rounded
                    >
                      <img src="public/icons/edit.svg"/>
                  </Button>
                  <Button 
                      onClick={async () => {
                        switch(modalQuery.split("-")[0]) {
                          case "ingredient": {
                            await deleteIngredient();
                            return;
                          }
                  
                          case "location": {
                            await deleteLocation();
                            return;
                          }
                  
                          case "recipe": {
                            await deleteRecipe();
                            setModalQuery("");
                          }
                        }
                      }}
                      variant={ButtonVariant.RED} 
                      rounded
                    >
                      <img src="public/icons/delete.svg"/>
                  </Button>
                  <Button 
                    onClick={() => setModalQuery("")}
                    variant={ButtonVariant.PRIMARY} 
                    rounded
                  >
                      <img src="public/icons/close.svg"/>
                  </Button>
                </div>
            </Buttons>

            <Image 
              src={imgSrc} 
              loacationActive={active == "location"}
            />
            <ModalDetails loacationActive={active == "location"}>
              <Header>
                <h5>
                  {label}
                </h5>
                  {(price != undefined || specialEffect != undefined) &&
                  <div>
                    {price != undefined && <>
                      {price}
                      <img src="public/icons/rupee.webp"/>
                    </>}
                    {specialEffect != undefined && <>
                        <img style={{margin: "0px 10px"}} src={specialEffect.imgSrc}/>
                        {formatDuration(specialEffect.duration)}
                      </>
                    }
                  </div>
                  }
              </Header>
              <Description>{description}</Description>
              <Divider />
              {linkCards.map((specificLinkCards, i) =>
                specificLinkCards?.cards?.length > 0 && 
                <Fragment key={i}>
                  <LinkCardsLabel>
                    {specificLinkCards.label}
                  </LinkCardsLabel>
                  <Divider />
                  <LinkCardsWrapper>
                    {specificLinkCards.cards.map((linkCard, i) => 
                      <LinkCard onClick={() => setModalQuery(linkCard.modalQuery)} key={i}>
                          <img style={{objectFit: linkCard.imgSrc.includes("location") ? "cover" : "contain"}} src={linkCard.imgSrc}/>
                          <p>{linkCard.name}</p>
                      </LinkCard>  
                    )}
                  </LinkCardsWrapper>
                </Fragment>
              )}
            </ModalDetails>
          </Content>
        </Wrapper> : <></>
  );
}

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(238,238,238,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
`;

const Content = styled("div")`
  border-radius: 20px;
  background-color: ${p => p.theme.background.primary};
  padding: 20px;
  width: 1000px;
  border-radius: 12px;
  max-height: calc(100% - 80px);
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.592) 0px 5px 15px;
  display: flex;
  position: relative;
  align-items: flex-start;

  @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
    max-height: 100%;
    height: 100%;
    box-shadow: unset;
    flex-direction: column;
    border-radius: unset;
  }
`;

const Image = styled("img")<{loacationActive: boolean}>`
  height: 380px;
  border-radius: 17px;
  object-fit: ${p => p.loacationActive ? "cover" : "contain"};
  width: ${p => p.loacationActive ? "50%" : "20%"};
  height: ${p => p.loacationActive ? "380px" : "180px"};
  position: sticky;
  margin-top: 58px;
  
  @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
    width: 100%;
    position: unset;
  }
`;

const ModalDetails = styled("div")<{loacationActive: boolean}>`
  width: ${p => p.loacationActive ? "50%" : "80%"};
  margin-left: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
    width: 100%;
    margin-left: unset;
  }
`;

const Header = styled("div")`
  display: flex;
  padding-top: 58px;
  flex-direction: column;
  
  > h5 {
    ${p => p.theme.fontStyles.h5};
  }

  > div {
    display: flex;
    align-items: center;
    margin-top: 10px;
    ${p => p.theme.fontStyles.b2};
    > img {
      margin-left: 10px;
      height: 21px;
    }
  }
`;

const Description = styled("p")`
  padding-top: 20px;
  ${p => p.theme.fontStyles.b2};
`;

const Divider = styled("div")`
  width: 100%;
  height: 2px;
  background: ${p => p.theme.background.quarternaly};
  border-radius: 2px;
  margin: 24px 0px;
`;

const LinkCardsLabel = styled("p")`
  color: ${p => p.theme.content.primary};
  ${p => p.theme.fontStyles.h4};
`;

const LinkCardsWrapper = styled("div")`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-auto-rows: auto;
  padding-bottom: 25px;

  @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
      gap: 13px;
  }
`;

const LinkCard = styled("div")`
  cursor: pointer;
  display: flex;
  flex-direction: column;

  > img {
    min-height: 100px;
    max-height: 100px;
    border-radius: 20px;
    margin-bottom: 4px;
  }

  > p {
    text-align: center;
  }

  &:hover {
      opacity: 0.8;
  }

  &:active {
      opacity: 0.6;
  }
`;

const Buttons = styled("div")`
  position: absolute;
  top: 10px;
  display: flex;
  justify-content: space-between;
  min-width: calc(100% - 40px);
  max-width: calc(100% - 40px);
`;

export default Modal;