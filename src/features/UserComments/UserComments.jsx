import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  fetchCurrentUserComments,
  selectCurrentUserComments,
  updateComment,
} from "../../store/commentSlice";
import { selectCurrentUser } from "../../store/userSlice";

import { Button } from "@/components/ui/button.jsx";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { deleteComment, updateComment } from "../../store/commentSlice";

export default function UserComments() {
  const user = useSelector(selectCurrentUser);
  const comments = useSelector(selectCurrentUserComments) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchCurrentUserComments());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">
            You must be logged in to view your comments
          </h1>
        </div>
      </>
    );
  }

  if (comments.length <= 0) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">You have not made any comments yet</h1>
        </div>
      </>
    );
  }

  console.log(comments);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {comments.map((comment) => (
          <CardSmall key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
}

export function CardSmall({ comment }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    if (!content.trim()) return setError("Comment cannot be empty");

    try {
      await dispatch(
        updateComment({
          commentId: comment.id,
          postId: comment.postId,
          content,
        }),
      ).unwrap();
      setIsEditing(false);
      dispatch(fetchCurrentUserComments());
    } catch (err) {
      setError(err.message || "Failed to update comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await dispatch(deleteComment(comment.id)).unwrap();
      dispatch(fetchCurrentUserComments());
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm relative group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <CardHeader>
        <CardTitle>{comment.post.title}</CardTitle>
        <CardDescription>Post ID: {comment.post.id}</CardDescription>
      </CardHeader>

      <CardContent>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-primary"
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUpdate}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <Check className="h-4 w-4" /> Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setContent(comment.content);
                setError(null);
              }}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate(`/posts/${comment.postId}`)}
          >
            View Post
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
