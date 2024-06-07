import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home/Home';
import Tsukuba from './routes/Tsukuba/Tsukuba';
import Asagiri from './routes/Asagiri/Asagiri';
import AsagiriMajor from './routes/AsagiriMajor/AsagiriMajor';
import Shirataka from './routes/Shirataka/Shirataka';
import Tonamino from './routes/Tonamino/Tonamino';
import Dateh from './routes/Dateh/Dateh';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tsukuba' element={<Tsukuba />}></Route>
        <Route path='/asagiri' element={<Asagiri />}></Route>
        <Route path='/asagiri_major' element={<AsagiriMajor />}></Route>
        <Route path='/shirataka' element={<Shirataka />}></Route>
        <Route path='/tonamino' element={<Tonamino />}></Route>
        <Route path='/dateh' element={<Dateh />}></Route>
      </Routes>
    </Router>
  )
}

export default App;
