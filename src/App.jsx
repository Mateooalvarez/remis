import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import ReservaForm from './ReservaForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReservaForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
