import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './routes/Main/Main';
import Sub from './routes/Sub/Sub';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/sub' element={<Sub />}></Route>
      </Routes>
    </Router>
  )
}

export default App;
