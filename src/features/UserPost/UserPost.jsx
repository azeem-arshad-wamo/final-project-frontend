import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserPosts,
  selectCurrentUserPosts,
} from "../../store/postSlice";

export default function UserPost() {
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentUserPosts);
  console.log(post);

  useEffect(() => {
    dispatch(getCurrentUserPosts());
  }, [dispatch]);

  return (
    <>
      <div>
        <h1>Posts Here</h1>
        {post &&
          post.posts.length > 0 &&
          post.posts.map((post) => (
            <div>
              <p>Title: {post.title}</p>
              <p>Blocks</p>
              {/* <p>{post.blocks}</p> */}
            </div>
          ))}
      </div>
    </>
  );
}
