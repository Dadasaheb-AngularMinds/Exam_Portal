import Index from './Index/Index'
import Test from "./Test/Test";
import Finish from "./Finish/Finish";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index />}/>
          <Route path="/test" element={<Test />} />
          <Route path="/finish" element={<Finish />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
