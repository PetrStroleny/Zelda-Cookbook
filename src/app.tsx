import styled from '@emotion/styled'
import { Route, Router, Switch } from 'wouter'
import Header from './components/header';
import ErrorPage from './pages/error-page';
import Ingredients from './pages/ingredients';
import Recipes from './pages/recipes';

function App() {
  return (
    <Router>
      <Header/>
      <Page>
          <Switch>
            <Route path="/" component={Ingredients}/>

            <Route path="/recepty" component={Recipes}/>

            <Route component={ErrorPage} />
          </Switch>
      </Page>
    </Router>
  )
}

const Page = styled("div")`
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 100px;
`;

export default App;
