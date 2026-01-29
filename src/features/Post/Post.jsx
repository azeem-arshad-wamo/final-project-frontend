import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, Pencil, Trash2 } from "lucide-react";
// import { updateComment, deleteComment } from "../../store/commentSlice";

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
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postId={id}
                  dispatch={dispatch}
                />
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

function CommentCard({ comment, postId, dispatch }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState(null);

  async function handleSave() {
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await dispatch(
        updateComment({ commentId: comment.id, content }),
      ).unwrap();
      setEditing(false);
      dispatch(fetchCurrentPostComments(postId));
    } catch (err) {
      setError(err.message || "Failed to update comment");
    }
  }

  async function handleDelete() {
    try {
      await dispatch(deleteComment(comment.id)).unwrap();
      dispatch(fetchCurrentPostComments(postId));
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  }

  return (
    <Card className="relative group w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-3 right-3 flex gap-1 rounded-md bg-background/70 backdrop-blur-sm p-1 opacity-0 group-hover:opacity-100 transition-all">
        {editing ? (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-green-400 hover:text-green-500"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-muted transition-colors"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The comment will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} variant="destructive">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader>
        <CardTitle className="text-white">User: {comment.userId}</CardTitle>
      </CardHeader>

      <CardContent className="text-gray-300">
        {editing ? (
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-700 text-white placeholder:text-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        ) : (
          <p>{comment.content}</p>
        )}
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </CardContent>
    </Card>
  );
}
