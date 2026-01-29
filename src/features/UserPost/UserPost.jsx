import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserPosts,
  selectCurrentUserPosts,
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

import { Pencil, Trash2 } from "lucide-react";
import { selectCurrentUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserPost() {
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentUserPosts);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getCurrentUserPosts());
  }, [dispatch]);

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">You must be logged in to view your posts</h1>
        </div>
      </>
    );
  }

  if (!post.posts.length > 0) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">You have not created any posts yet</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {post &&
          post.posts &&
          post.posts.length > 0 &&
          post.posts.map((post, index) => (
            // Something here
            <CardSmall post={post} index={index} />
            // Something also here
          ))}
      </div>
    </>
  );
}

function DeletePostDialog({ post }) {
  return (
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
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post
            <span className="font-semibold"> “{post.title}” </span>
            will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CardSmall({ post, index }) {
  const navigate = useNavigate();

  return (
    <Card className="relative group mx-auto w-full max-w-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-3 right-3 flex gap-1 rounded-md bg-background/70 backdrop-blur-sm p-1 opacity-0 group-hover:opacity-100 transition-all">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-muted transition-colors"
          onClick={() => navigate(`/posts/${post.id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <DeletePostDialog
          post={post}
          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
        />
      </div>

      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>Post No: {index + 1}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>Total blocks: {post.blocks.length}</p>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/posts/${post.id}`)}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
