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
        </div>
      </div>
    </>
  );
}
