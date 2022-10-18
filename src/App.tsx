import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import pages from "./pages";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route index element={<Home/>}/>
                    {pages.map(page => (
                        <Route path={page.path} element={<page.component/>}/>
                    ))}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
