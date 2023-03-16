import styled from '@emotion/styled';
import { Route, Router, Switch, } from 'wouter';
import { useLocation as useWouterLocation } from "wouter";
import Header from './components/header';
import ErrorPage from './pages/error-page';
import Ingredients from './pages/ingredients';
import Recipes from './pages/recipes';
import Locations from './pages/locations';
import Modal from './components/modal';
import FoodFilters from './components/food-filters';
import { useEffect, useState } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useWouterLocation();
  return [location, setLocation, window.location.search];
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
  const [searchQuery, setSearchQuery] = useState(getSearchValue());
  const [locationQuery, setLocationQuery] = useState(getLocationValue());
  const [location, _] = useLocation();

  useEffect(() => {
    window.history.replaceState({}, "", `${window.location.pathname}${(locationQuery || searchQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}`)
  }, [searchQuery, locationQuery, location]);

  return (
    <Router>
      <Modal/>
      <Header/>
      <Page>
          <Switch>
            <Route path="/" component={() => Ingredients({searchQuery, locationQuery})}/>

            <Route path="/recepty" component={() => Recipes({searchQuery, locationQuery})}/>

            <Route path="/lokace" component={() => Locations({searchQuery})}/>

            <Route component={ErrorPage} />
          </Switch>
          <FoodFilters searchQuery={searchQuery} setSearch={setSearchQuery} locationQuery={locationQuery} setLocation={setLocationQuery}/>
      </Page>
    </Router>
  )
}

const Page = styled("div")`
    display: flex;
    flex-direction: column;
    padding: 0px 40px 160px 40px;
`;

export default App;
