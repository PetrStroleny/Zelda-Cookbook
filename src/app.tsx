import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { Route, Router, Switch, } from 'wouter';
import { useLocation as useWouterLocation } from "wouter";
import Header from './components/header';
import ErrorPage from './pages/error-page';
import Ingredients, { Ingredient } from './pages/ingredients';
import Recipes, { Recipe } from './pages/recipes';
import Locations, { IngredienceLocation } from './pages/locations';
import Filters from './components/filters';
import { useEffect, useState } from 'react';
import { GlobalContext } from './utils/global-context';
import Modal from './components/modal';
import AddOrEditIngredient from './components/add-or-edit-ingredient';
import { InitialDataType, ingredientInitialValues, locationInitialValues, recipeInitialValues, } from './utils/form';
import AddOrEditRecipe from './components/add-or-edit-recipe';
import AddOrEditLocation from './components/add-or-edit-location';

export const useLocation = () => {
  const [location, setLocation] = useWouterLocation();
  return [location, setLocation, window.location.search];
}

export function getModalValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "modal") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getSpecialEffectValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "special-effect") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getSearchValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "q") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getLocationValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "location") {
          return  decodeURI(query.split("=")[1]);
      }
  }

  return "";
}

function App() {
  const [specialEffectQuery, setSpecialEffectQuery] = useState(getSpecialEffectValue());
  const [searchQuery, setSearchQuery] = useState(getSearchValue());
  const [locationQuery, setLocationQuery] = useState(getLocationValue());
  const [modalQuery, setModalQuery] = useState(getModalValue());
  const [ignoreModalQueryChange, setIgnoreModalQueryChange] = useState(false);
  const [ignoreQueryChange, setIgnoreQueryChange] = useState(false);
  const [location, _] = useLocation();

  const [errored, setErrored] = useState(false);
  const [locations, setLocations] = useState<IngredienceLocation[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [editModalActive, setEditModalActive] = useState(false);

  useEffect(() => {
    const getData = async () => {
        await fetchData()
    };

    getData();
  }, []);

  useEffect(() => {
    if (ignoreModalQueryChange) {
      setIgnoreModalQueryChange(false);
      return;
    }
    window.history.pushState({}, "", `${window.location.pathname}${(locationQuery || searchQuery || specialEffectQuery || modalQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${specialEffectQuery ? `special-effect=${encodeURI(specialEffectQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}${modalQuery ? `modal=${encodeURI(modalQuery)}` : ""}`);
  }, [modalQuery])

  useEffect(() => {
    if (ignoreQueryChange) {
      setIgnoreQueryChange(false);
      return;
    }
    window.history.replaceState({}, "", `${window.location.pathname}${(locationQuery || searchQuery || specialEffectQuery || modalQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${specialEffectQuery ? `special-effect=${encodeURI(specialEffectQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}${modalQuery ? `modal=${encodeURI(modalQuery)}` : ""}`);
  }, [searchQuery, locationQuery, location, specialEffectQuery]);


  function handleLocationChange() {
    setIgnoreModalQueryChange(true);
    setIgnoreQueryChange(true);
    setSpecialEffectQuery(getSpecialEffectValue());
    setSearchQuery(getSearchValue());
    setLocationQuery(getLocationValue());
    setModalQuery(getModalValue());
  }

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, []);

  async function fetchData() {
      try {
          const localStorageLocations = JSON.parse(localStorage.getItem("locations"));
          const localStorageRecipes = JSON.parse(localStorage.getItem("recipes"));
          const localStorageIngredients = JSON.parse(localStorage.getItem("ingredients"));

          if (localStorageLocations) {
            setLocations(localStorageLocations);
          } else {
            const resLoc = await fetch("../server/locations.json");
            const jsonLoc = await resLoc.json();
            setLocations(jsonLoc);
          }

          if (localStorageRecipes) {
            setRecipes(localStorageRecipes);
          } else {
            const resRec = await fetch("../server/recipes.json");
            const jsonRec = await resRec.json();
            setRecipes(jsonRec);
          }

          if (localStorageIngredients) {
            setIngredients(localStorageIngredients);
          } else {
            const resIngr = await fetch("../server/ingredients.json");
            const jsonIngr= await resIngr.json();
            setIngredients(jsonIngr);
          }
      } catch (e) {
          console.error(e);
          setErrored(true);
      }
  }

  useEffect(() => {
    recipes.length > 0 && localStorage.setItem("recipes", JSON.stringify(recipes))
  }, [recipes]);

  useEffect(() => {
    ingredients.length > 0 && localStorage.setItem("ingredients", JSON.stringify(ingredients))
  }, [ingredients]);

  useEffect(() => {
    locations.length > 0 && localStorage.setItem("locations", JSON.stringify(locations))
  }, [locations.map(location => location.subLocations).flat(1)]);

  return (
    <Router>
      <GlobalContext.Provider value={{
        searchQuery, setSearchQuery,
        locationQuery, setLocationQuery,
        modalQuery, setModalQuery,
        specialEffectQuery, setSpecialEffectQuery,
        locations, setLocations, recipes, setRecipes, ingredients, setIngredients
      }}>
        <Header/>
        <Page>
            {!editModalActive ?
                <Modal setEditModalActive={() => {setEditModalActive(true)}}/>
                :
                modalQuery.split("-")[0] == "ingredient" ? 
                  <AddOrEditIngredient 
                    initialValues={ingredientInitialValues(Number(modalQuery.split("-")[modalQuery.split("-").length - 2]), ingredients, locations)} 
                    hide={() => setEditModalActive(false)}
                  />
                :
                modalQuery.split("-")[0] == "recipe" ? 
                  <AddOrEditRecipe 
                    initialValues={recipeInitialValues(Number(modalQuery.split("-")[modalQuery.split("-").length - 2]), recipes)} 
                    hide={() => setEditModalActive(false)}
                  />
                : 
                  <AddOrEditLocation 
                    initialValues={locationInitialValues(Number(modalQuery.split("-")[modalQuery.split("-").length - 2]), locations)} 
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
              searchQuery={searchQuery} 
              setSearch={setSearchQuery} 
              specialEffectQuery={specialEffectQuery}
              setSpecialEffectQuery={setSpecialEffectQuery}
              locationQuery={locationQuery} 
              setLocation={setLocationQuery}
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
