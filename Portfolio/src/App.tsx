import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'; // Your main page component
import AboutMe from './pages/AboutMe'; // The new About Me page component
import Education from './pages/Education';
import Resume from './pages/Resume';
import Extracurriculars from './pages/Extracurriculars';
import Experience from './pages/Experience';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/education" element={<Education />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/extracurriculars" element={<Extracurriculars />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </Router>
  );
}

export default App;
