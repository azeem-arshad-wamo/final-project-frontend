import React, { useEffect } from "react";
import { selectCurrentUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUserComments,
  selectCurrentUserComments,
} from "../../store/commentSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{comment.post.title}</CardTitle>
        <CardDescription>Post ID: {comment.post.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{comment.content}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/posts/${comment.postId}`)}
        >
          View Post
        </Button>
      </CardFooter>
    </Card>
  );
}
