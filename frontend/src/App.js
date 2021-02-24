import MojeSlowka from './components/MojeSlowka/mojeSlowka';
import Nauka from './components/Nauka/Nauka';
import Kategorie from './components/Kategorie/Kategorie';
import LoginRegister from './components/LoginRegister/LoginRegister';
import './css/App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import React from 'react';
import Header from './components/Header/header'
import Footer from './components/Footer/Footer'
import { withAuthentication } from './components/Session';
import Exercise1 from "./components/Exercises/Exercise1"
import Exercise2 from "./components/Exercises/Exercise2"
import Exercise3 from "./components/Exercises/Exercise3"
import Exercise4 from "./components/Exercises/Exercise4"
import Exercise5 from "./components/Exercises/Exercise5"
import Exercise6 from "./components/Exercises/Exercise6"
import Exercise7 from "./components/Exercises/Exercise7"
import Exercise8 from "./components/Exercises/Exercise8"
import Category from "./components/Kategorie/Category"
const App = () => (
  <Router>
    <Header />
    <ScrollToTop />
    <Switch>
      <Route exact strict path="/MojeSlowka" component={MojeSlowka} />
      <Route exact strict path="/kategorie" component={Kategorie} />
      <Route exact strict path="/kategorie/:categoryName" component={Category} />
      <Route exact strict path="/nauka" component={Nauka} />
      <Route exact strict path="/nauka/exercise1" component={Exercise1} />
      <Route exact strict path="/nauka/exercise2" component={Exercise2} />
      <Route exact strict path="/nauka/exercise3" component={Exercise3} />
      <Route exact strict path="/nauka/exercise4" component={Exercise4} />
      <Route exact strict path="/nauka/exercise5" component={Exercise5} />
      <Route exact strict path="/nauka/exercise6" component={Exercise6} />
      <Route exact strict path="/nauka/exercise7" component={Exercise7} />
      <Route exact strict path="/nauka/exercise8" component={Exercise8} />
      <Route exact strict path="/" component={LoginRegister} />
      <Redirect to="/" />
    </Switch>
    <Footer />
  </Router>
)

class ScrollToTopRoute extends React.Component {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return <React.Fragment />
	}
}

const ScrollToTop = withRouter(ScrollToTopRoute)

export default withAuthentication(App);
