import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createNewComment,
  fetchCurrentPostComments,
  selectCurrentComments,
} from "../../store/commentSlice";
import {
  getPostById,
  selectCurrentSelectedPost,
  selectPostLoading,
} from "../../store/postSlice";

export default function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector(selectPostLoading);
  const post = useSelector(selectCurrentSelectedPost);
  const comments = useSelector(selectCurrentComments) || [];
  const [newComment, setNewComment] = useState("");
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
      dispatch(fetchCurrentPostComments(id));
    }
  }, [id, dispatch]);

  async function handleAddComment() {
    if (newComment.trim() === "") return;

    try {
      const dispatchResult = await dispatch(
        createNewComment({ postId: id, content: newComment }),
      );

      if (createNewComment.fulfilled.match(dispatchResult)) {
        dispatch(fetchCurrentPostComments(id));
        setNewComment("");
      } else {
        setErrors(dispatchResult.payload || "Could not post comment");
      }
    } catch (error) {
      setErrors(error.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl text-muted-foreground">Loading post…</h1>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">Could not find the post</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-10 px-5 text-gray-100">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-extrabold text-white">{post.title}</h1>
            <p className="text-gray-400 text-sm">Post ID: {post.id}</p>
            <hr className="border-gray-700 mt-2" />
          </div>

          <div className="flex flex-col gap-2">
            {post.blocks && post.blocks.length > 0 ? (
              post.blocks.map((block, index) => {
                switch (block.type) {
                  case "heading":
                    return (
                      <p className="text-4xl font-bold text-white" key={index}>
                        {block.data}
                      </p>
                    );
                  case "sub-heading":
                    return (
                      <p
                        className="text-2xl font-semibold text-gray-200"
                        key={index}
                      >
                        {block.data}
                      </p>
                    );
                  case "text":
                    return (
                      <p
                        className="text-gray-300 leading-relaxed text-lg"
                        key={index}
                      >
                        {block.data}
                      </p>
                    );
                  case "image":
                    return (
                      <div
                        key={index}
                        className="my-4 rounded-lg overflow-hidden shadow-md"
                      >
                        <img
                          src={block.data}
                          alt="Post Image"
                          className="w-full object-cover max-h-96"
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })
            ) : (
              <p className="text-2xl font-bold text-gray-400">
                No Blocks Found
              </p>
            )}
          </div>
          <div className="w-full max-w-3xl mt-10 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Comments</h2>

            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                  }
                }}
              />
              <Button onClick={handleAddComment}>Post</Button>
              {errors && (
                <p className="text-red-400 text-sm mt-1 bg-red-900 p-2 rounded-md">
                  {errors}
                </p>
              )}
            </div>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader>
                    <CardTitle className="text-white">
                      {comment.author.fullName}
                    </CardTitle>
                    {comment.createdAt && (
                      <p className="text-gray-400 text-sm">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    {comment.content}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-400 mt-2">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
