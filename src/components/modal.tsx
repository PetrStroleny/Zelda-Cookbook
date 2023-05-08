import styled from "@emotion/styled";
import { FC, Fragment, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../utils/global-context";
import Button, { ButtonVariant } from "./button";
import { removeSpecialEffectFromName } from "./food-card";

interface LinkCard {
  name: string
  modalQuery: string
  imgSrc: string
}

interface ModalProps {
  setEditModalActive: () => void
}

const Modal: FC<ModalProps> = ({setEditModalActive}) => {
  const [active, setActive] = useState("");
  const {modalQuery, setModalQuery, ingredients, setIngredients, setRecipes, setLocations, recipes, locations} = useContext(GlobalContext);
  const [imgSrc, setImgSrc] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [onDeleteClick, setOnDeleteClick] = useState<{setter: (value: any) => void, newValue: any[]}>();
  const [linkCards, setLinkCards] = useState<{label: string, cards:LinkCard[]}[]>([{label: "", cards: []}]);

  useEffect(() => {
    if (active) {
        document.body.classList.add("scroll-disabled");
    } else {
        document.body.classList.remove("scroll-disabled");
    }
}, [active]);

  useEffect(() => {
    if (ingredients.length == 0 && recipes.length == 0 && locations.length == 0) return;

    const activeID = modalQuery.split("-")[modalQuery.split("-").length - 2];

    switch (modalQuery.split("-")[0]) {
      case "ingredient": {
        const activeIngredient = ingredients.filter(ingredient => ingredient.id == Number(activeID))[0];
        const recipeIcon = removeSpecialEffectFromName(activeIngredient.name, activeIngredient.specialEffect != null);

        setImgSrc(`public/ingredients/${recipeIcon}.png`);
        setLabel(activeIngredient.name);
        setDescription(activeIngredient.description);
        setOnDeleteClick({setter: setIngredients, newValue: ingredients.filter(ingredient => ingredient.id != activeIngredient.id)});
        setLinkCards([
          {
            label: "Lokace", 
            cards: locations.map(location => location.subLocations).flat(1).filter(subLocation => subLocation.id == Number(subLocation.id)).map(
              subLocation => ({
                    name: subLocation.name, 
                    modalQuery: `location-${subLocation.id}-1`, 
                    imgSrc: `public/locations/${subLocation.name.replaceAll(" ", "_")}.png`
                  })
              )
          },
          {
          label: "Možné recepty", 
          cards: recipes.filter(recipe => recipe.ingredients.flat(1).some(ingredientID => ingredientID == activeIngredient.id)).map(
              recipe => ({
                  name: recipe.name, 
                  modalQuery: `recipe-${recipe.id}-1`, 
                  imgSrc: `public/recipes/${removeSpecialEffectFromName(recipe.name, recipe.specialEffect != null)}.png`
                })
            )
        }]);
        return;
      }

      case "location": {
        for (const location of locations) {
          const activeLocaiton = location.subLocations.filter(subLocation => subLocation.id == Number(activeID))[0];  
          if (!activeLocaiton) continue;

          setImgSrc(`public/locations/${activeLocaiton.name.replaceAll(" ", "_")}.png`);
          setLabel(activeLocaiton.name);
          setDescription(activeLocaiton.description);
          setOnDeleteClick({
            setter: setLocations, 
            newValue: locations.map(location => ({...location, subLocations: location.subLocations.filter(subLocation => subLocation.id != activeLocaiton.id)})),
          });
          setLinkCards([{
            label: "Ingredience", 
            cards: ingredients.filter(ingredient => activeLocaiton.ingredients.includes(ingredient.id)).map(
                ingredient => ({
                    name: ingredient.name, 
                    modalQuery: `ingredient-${ingredient.id}-1`, 
                    imgSrc: `public/ingredients/${removeSpecialEffectFromName(ingredient.name, ingredient.specialEffect != null)}.png`
                  })
              )
          }]);
        }
        return;
      }

      case "recipe": {
        const activeRecipe = recipes.filter(recipe => recipe.id == Number(activeID))[0];
        const recipeIcon = removeSpecialEffectFromName(activeRecipe.name, activeRecipe.specialEffect != null);
        setImgSrc(`public/recipes/${recipeIcon}.png`);
        setLabel(activeRecipe.name);
        setDescription(activeRecipe.description);
        setOnDeleteClick({ setter: setRecipes,  newValue: recipes.filter(recipe => recipe.id != activeRecipe.id)});
        setLinkCards([{
          label: "Ingredience", 
          cards: ingredients.filter(ingredient => activeRecipe.ingredients.flat(1).includes(ingredient.id)).map(
            ingredient => ({
                name: ingredient.name, 
                modalQuery: `ingredient-${ingredient.id}-1`, 
                imgSrc: `public/ingredients/${removeSpecialEffectFromName(ingredient.name, ingredient.specialEffect != null)}.png`
              })
          )
        }]);
      }
    }
  }, [modalQuery, ingredients.length > 0 && recipes.length > 0 && locations.length > 0]);

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
                      onClick={() => {onDeleteClick?.setter(onDeleteClick.newValue); setModalQuery("")}}
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
                <h2>{label}</h2>
              </Header>
              <Description>{description}</Description>
              <Divider />
              {linkCards.map((specificLinkCards, i) =>
                specificLinkCards?.cards?.length > 0 && 
                <Fragment key={i}>
                  <LinkCardsLabel>
                    {specificLinkCards.label}
                  </LinkCardsLabel>
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
  justify-content: space-between;

  > h2 {
    font-size: 24px;
    font-weight: 700;
    padding-top: 58px;
    margin-bottom: 12px;
  }
`;

const Description = styled("p")`
  font-size: 18px;
  line-height: 1.05;
  padding-top: 20px;
  margin-bottom: 5px;
`;

const Divider = styled("div")`
  width: 100%;
  height: 2px;
  background: ${p => p.theme.background.quarternaly};
  border-radius: 2px;
  margin-top: 24px;
`;

const LinkCardsLabel = styled("p")`
  margin-top: 24px;
  color: ${p => p.theme.content.primary};
  ${p => p.theme.fontStyles.h4};
  margin-bottom: 10px;
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