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
import { selectCurrentUser } from "../../store/userSlice";

export default function UserPost() {
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentUserPosts);
  const user = useSelector(selectCurrentUser);
  console.log(post.posts);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {post && post.posts && post.posts.length > 0 ? (
          post.posts.map((post, index) => (
            // Something here
            <CardSmall post={post} index={index} />
            // Something also here
          ))
        ) : (
          <div>
            <h1>No Post Here</h1>
          </div>
        )}
      </div>
    </>
  );
}

export function CardSmall({ post, index }) {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>Post No: {index + 1}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total Number of blocks inside this post: {post.blocks.length}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
