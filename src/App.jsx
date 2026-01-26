import { BrowserRouter, Route, Router } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Router>
          <Route path="/" element={""} />
        </Router>
      </BrowserRouter>
    </>
  );
}
