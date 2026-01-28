import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./features/Home/Home.jsx";
import Login from "./features/Login/Login.jsx";
import SignUp from "./features/Signup/SignUp.jsx";
import NewPost from "./features/NewPost/NewPost.jsx";
import UserPost from "./features/UserPost/UserPost.jsx";
import Post from "./features/Post/Post.jsx";
import AllPosts from "./features/AllPosts/AllPosts.jsx";
import UserComments from "./features/UserComments/UserComments.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Home />}>
            <Route path="/" element={<AllPosts />} />

            <Route path="/post/create" element={<NewPost />} />
            <Route path="/user/posts" element={<UserPost />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route path="/user/comments" element={<UserComments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
