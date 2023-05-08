import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Route, Router, Switch, useLocation as useWouterLocation, } from 'wouter';
import AddOrEditIngredient from './components/add-or-edit-modals/add-or-edit-ingredient';
import AddOrEditLocation from './components/add-or-edit-modals/add-or-edit-location';
import AddOrEditRecipe from './components/add-or-edit-modals/add-or-edit-recipe';
import Filters from './components/filters';
import Header from './components/header';
import Modal from './components/modal';
import ErrorPage from './pages/error-page';
import Ingredients from './pages/ingredients';
import Locations from './pages/locations';
import Recipes from './pages/recipes';
import { ingredientInitialValues, locationInitialValues, recipeInitialValues } from './utils/form';
import useGlobalContext, { GlobalContext, GlobalContextSpecialEffect } from './utils/global-context';

export const useLocation = () => {
  const [location, setLocation] = useWouterLocation();
  return [location, setLocation, window.location.search];
}

function App() {
  const [globalContextValue] = useGlobalContext();
  const [editModalActive, setEditModalActive] = useState(false);
  const [errored, setErrored] = useState(false);
  const [specialEffects, setSpecialEffects] = useState<GlobalContextSpecialEffect[]>([]);

  useEffect(() => {fetchData()}, []);

  async function fetchData() {
    try {
        const localStorageLocations = JSON.parse(localStorage.getItem("locations") ?? "");
        const localStorageRecipes = JSON.parse(localStorage.getItem("recipes") ?? "");
        const localStorageIngredients = JSON.parse(localStorage.getItem("ingredients") ?? "");

        if (localStorageLocations) {
          globalContextValue.setLocations(localStorageLocations);
        } else {
          const resLoc = await fetch("../server/locations.json");
          const jsonLoc = await resLoc.json();
          globalContextValue.setLocations(jsonLoc);
        }

        if (localStorageRecipes) {
          globalContextValue.setRecipes(localStorageRecipes);
        } else {
          const resRec = await fetch("../server/recipes.json");
          const jsonRec = await resRec.json();
          globalContextValue.setRecipes(jsonRec);
        }

        if (localStorageIngredients) {
          globalContextValue.setIngredients(localStorageIngredients);
        } else {
          const resIngr = await fetch("../server/ingredients.json");
          const jsonIngr= await resIngr.json();
          globalContextValue.setIngredients(jsonIngr);
        }

        const specialEffects = await fetch("../server/special-effects.json");
        const jsonSpec = await specialEffects.json();
        setSpecialEffects(jsonSpec);
    } catch (e) {
        console.error(e);
        setErrored(true);
    }
}

  return (
    <Router>
      <GlobalContext.Provider value={{...globalContextValue, specialEffects}}>
        <Header/>
        <Page>
            {!editModalActive ?
                <Modal setEditModalActive={() => {setEditModalActive(true)}}/>
                :
                globalContextValue.modalQuery.split("-")[0] == "ingredient" ? 
                  <AddOrEditIngredient 
                    initialValues={
                      ingredientInitialValues(
                        Number(globalContextValue.modalQuery.split("-")[globalContextValue.modalQuery.split("-").length - 2]), 
                        globalContextValue.ingredients, 
                        globalContextValue.locations
                      )} 
                    hide={() => setEditModalActive(false)}
                  />
                :
                globalContextValue.modalQuery.split("-")[0] == "recipe" ? 
                  <AddOrEditRecipe 
                    initialValues={
                      recipeInitialValues(
                        Number(globalContextValue.modalQuery.split("-")[globalContextValue.modalQuery.split("-").length - 2]), 
                        globalContextValue.recipes
                      )} 
                    hide={() => setEditModalActive(false)}
                  />
                : 
                  <AddOrEditLocation 
                    initialValues={
                      locationInitialValues(
                        Number(globalContextValue.modalQuery.split("-")[globalContextValue.modalQuery.split("-").length - 2]), 
                        globalContextValue.locations
                      )} 
                    hide={() => setEditModalActive(false)}
                  />
            }

            {errored ? <ErrorPage/> :
              <Switch>
                <Route path="/" component={Ingredients}/>

                <Route path="/recepty" component={Recipes}/>

                <Route path="/lokace" component={Locations}/>

                <Route component={ErrorPage} />
              </Switch>
            }
            <Filters 
              searchQuery={globalContextValue.searchQuery} 
              setSearch={globalContextValue.setSearchQuery} 
              specialEffectQuery={globalContextValue.specialEffectQuery}
              setSpecialEffectQuery={globalContextValue.setSpecialEffectQuery}
              locationQuery={globalContextValue.locationQuery} 
              setLocation={globalContextValue.setLocationQuery}
            />
        </Page>
      </GlobalContext.Provider>
    </Router>
  );
}

const Page = styled("div")`
    display: flex;
    flex-direction: column;
    padding: 0px 40px 160px 40px;
`;

export default App;
