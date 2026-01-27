import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById, selectCurrentSelectedPost } from "../../store/postSlice";
import { useEffect } from "react";

export default function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentSelectedPost);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [id, dispatch]);

  if (!post) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">Could not find the post</h1>
        </div>
      </>
    );
  }
  console.log(`ID from params: ${id}`);
  console.log(post.blocks);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-10 px-5">
        <div className="w-full max-w-3xl flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-5xl font-bold">{post.title}</p>
            <p>Post ID: {post.id}</p>
          </div>
          <div>
            {post.blocks && post.blocks.length > 0 ? (
              <div>
                {post.blocks.map((block, index) => {
                  switch (block.type) {
                    case "heading":
                      return (
                        <p className="text-4xl" key={index}>
                          {block.data}
                        </p>
                      );
                    case "sub-heading":
                      return (
                        <p className="text-2xl" key={index}>
                          {block.data}
                        </p>
                      );
                    case "text":
                      return <p key={index}>{block.data}</p>;
                    case "image":
                      return <img key={index} src={block.data} alt="image" />;
                    default:
                      return null;
                  }
                })}
              </div>
            ) : (
              <p className="text-3xl font-bold">No Blocks Found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
