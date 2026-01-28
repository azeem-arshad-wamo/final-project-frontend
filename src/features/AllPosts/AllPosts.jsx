import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  selectAllPosts,
  selectPostPagination,
} from "../../store/postSlice";
import Pagination from "@/components/custom/Pagination";

export default function AllPosts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const pagination = useSelector(selectPostPagination);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllPosts({ page, limit: 20 }));
  }, [dispatch, page]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  if (!posts) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">Cannot find posts!</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {posts && posts && posts.length > 0 ? (
          posts.map((post, index) => <CardSmall post={post} key={index} />)
        ) : (
          <div>
            <h1>No Post Here</h1>
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export function CardSmall({ post }) {
  const navigate = useNavigate();

  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>Post Id: {post.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total Number of blocks inside this post: {post.blocks.length}</p>
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
