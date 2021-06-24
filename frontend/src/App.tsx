import { React } from './common'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './screens/homepage'

function App() {
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
