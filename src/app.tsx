import styled from '@emotion/styled'
import { Route, Router, Switch } from 'wouter'
import Header from './components/header';
import ErrorPage from './pages/error-page';
import Ingredients from './pages/ingredients';
import Recipes from './pages/recipes';
import Locations from './pages/locations';

function App() {
  return (
    <Router>
      <Header/>
      <Page>
          <Switch>
            <Route path="/" component={Ingredients}/>

            <Route path="/recepty" component={Recipes}/>

            <Route path="/lokace" component={Locations}/>

            <Route component={ErrorPage} />
          </Switch>
      </Page>
    </Router>
  )
}

const Page = styled("div")`
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    padding: 0px 40px 160px 40px;
`;

export default App;
