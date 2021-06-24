import { React, useState } from './common'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css"
import { Home } from './screens/homepage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
        <Route path="/">
          <Home />
        </Route>
      </Router>
    </div>
  )
}

export default App
