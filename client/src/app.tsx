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

  return (
    <Router>
      <GlobalContext.Provider value={{...globalContextValue}}>
        <Header/>
        <Page>
            {!editModalActive ?
                <Modal setEditModalActive={() => {setEditModalActive(true)}}/>
                :
                globalContextValue.modalQuery.split("-")[0] == "ingredient" ? 
                  <AddOrEditIngredient 
                    edit
                    hide={() => setEditModalActive(false)}
                  />
                :
                globalContextValue.modalQuery.split("-")[0] == "recipe" ? 
                  <AddOrEditRecipe 
                    edit
                    hide={() => setEditModalActive(false)}
                  />
                : 
                  <AddOrEditLocation 
                    edit
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
