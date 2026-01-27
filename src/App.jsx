import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./features/Home/Home.jsx";
import Login from "./features/Login/Login.jsx";
import SignUp from "./features/Signup/SignUp.jsx";
import NewPost from "./features/NewPost/NewPost.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Home />}>
            <Route path="/post/create" element={<NewPost />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
