import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./features/Home/Home.jsx"));
const Login = lazy(() => import("./features/Login/Login.jsx"));
const SignUp = lazy(() => import("./features/Signup/SignUp.jsx"));
const NewPost = lazy(() => import("./features/NewPost/NewPost.jsx"));
const UserPost = lazy(() => import("./features/UserPost/UserPost.jsx"));
const Post = lazy(() => import("./features/Post/Post.jsx"));
const AllPosts = lazy(() => import("./features/AllPosts/AllPosts.jsx"));
const UserComments = lazy(
  () => import("./features/UserComments/UserComments.jsx"),
);
const EditPost = lazy(() => import("./features/Post/EditPost.jsx"));

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/" element={<Home />}>
              <Route path="/" element={<AllPosts />} />

              <Route path="/post/create" element={<NewPost />} />
              <Route path="/user/posts" element={<UserPost />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route path="/user/comments" element={<UserComments />} />
              <Route path="/posts/:id/edit" element={<EditPost />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
