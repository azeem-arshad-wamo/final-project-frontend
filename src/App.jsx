import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./features/Home/Home.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
