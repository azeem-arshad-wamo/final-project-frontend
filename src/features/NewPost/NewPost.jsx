import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { Input } from "@/components/ui/input";
import { createPost } from "../../store/postSlice";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const [blocks, setBlocks] = useState([]);
  const [title, setTitle] = useState({
    data: null,
    editing: true,
  });
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  function addBlocks(type) {
    switch (type) {
      case "heading":
        setBlocks((prev) => [
          ...prev,
          { type: "heading", data: "", editing: true },
        ]);
        break;
      case "sub-heading":
        setBlocks((prev) => [
          ...prev,
          { type: "sub-heading", data: "", editing: true },
        ]);
        break;
      case "text":
        setBlocks((prev) => [
          ...prev,
          { type: "text", data: "", editing: true },
        ]);
        break;
      case "image":
        setBlocks((prev) => [
          ...prev,
          { type: "image", data: "", editing: true },
        ]);
        break;
    }
  }

  function updateBlock(index, value) {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index].data = value;
      return updated;
    });
  }

  function finishUpdating(index) {
    setBlocks((prev) => {
      const updated = [...prev];
      if (!updated[index].data.trim()) {
        updated.splice(index, 1);
      } else {
        updated[index].editing = false;
      }
      return updated;
    });
  }

  async function handleSubmit() {
    setErrors(null);

    if (!title.data) {
      setErrors("Title is needed");
      return;
    }
    if (blocks.length <= 0) {
      setErrors("Cannot create post with zero blocks");
      return;
    }
    try {
      const formData = {
        title: title.data,
        blocks,
      };
      await dispatch(createPost(formData)).unwrap();
      navigate("/");
    } catch (error) {
      console.log(error);
      setErrors(error || "Failed to create post");
    }
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">You must be logged in to create a post</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-10 px-5">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <div>
            <div>
              <h1 className="text-5xl font-extrabold text-white">
                Create New Post
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start min-w-96 w-full max-w-3xl ">
            <div className="my-2 w-full">
              {title.editing ? (
                <Input
                  value={title.data || ""}
                  onChange={(e) =>
                    setTitle((prev) => ({ ...prev, data: e.target.value }))
                  }
                  placeholder="Enter the title..."
                  className="text-5xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-gray-800 text-white"
                  onBlur={() => {
                    if (title.data)
                      setTitle((prev) => ({ ...prev, editing: false }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && title.data)
                      setTitle((prev) => ({ ...prev, editing: false }));
                  }}
                />
              ) : (
                <p className="text-5xl font-extrabold text-white">
                  {title.data}
                </p>
              )}

              {errors && (
                <p className="text-red-400 text-sm mt-1 bg-red-900 p-2 rounded-md">
                  {errors}
                </p>
              )}
            </div>

            {blocks.length === 0 && (
              <p className="text-gray-400">Add Blocks to get Started</p>
            )}

            {blocks.map((block, index) => (
              <div
                key={index}
                flex
                flex-col
                gap-2
                p-4
                bg-gray-800
                rounded-lg
                shadow-md
              >
                {block.editing
                  ? (block.type === "heading" && (
                      <Input
                        type="text"
                        placeholder="Heading"
                        value={block.data}
                        className="text-4xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md py-1 bg-gray-700 text-white w-full"
                        onChange={(e) => updateBlock(index, e.target.value)}
                        onBlur={() => finishUpdating(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") finishUpdating(index);
                        }}
                      />
                    )) ||
                    (block.type === "sub-heading" && (
                      <Input
                        type="text"
                        placeholder="Sub-heading"
                        value={block.data}
                        className="text-3xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md py-1 bg-gray-700 text-white w-full"
                        onChange={(e) => updateBlock(index, e.target.value)}
                        onBlur={() => finishUpdating(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") finishUpdating(index);
                        }}
                      />
                    )) ||
                    (block.type === "text" && (
                      <Input
                        type="text"
                        placeholder="Text"
                        value={block.data}
                        className="text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md py-1 bg-gray-700 text-white w-full"
                        onChange={(e) => updateBlock(index, e.target.value)}
                        onBlur={() => finishUpdating(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") finishUpdating(index);
                        }}
                      />
                    )) ||
                    (block.type === "image" && (
                      <div className="flex flex-col gap-2 w-full">
                        <Input
                          type="text"
                          placeholder="Add image URL"
                          value={block.data}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          className="w-full bg-gray-700 text-white placeholder:text-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />

                        <span className="text-gray-400 text-sm">OR</span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = () => {
                                updateBlock(index, reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-white"
                        />

                        {block.data && (
                          <AspectRatio
                            ratio={16 / 9}
                            className="w-full rounded-lg overflow-hidden shadow-md"
                          >
                            <img
                              src={block.data}
                              alt="Image"
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => finishUpdating(index)}
                          className="mt-2 border-white text-white hover:bg-indigo-600 hover:text-white"
                        >
                          Done
                        </Button>
                      </div>
                    ))
                  : (block.type === "heading" && (
                      <h1 className="text-4xl font-bold ">{block.data}</h1>
                    )) ||
                    (block.type === "sub-heading" && (
                      <h2 className="text-2xl font-semibold">{block.data}</h2>
                    )) ||
                    (block.type === "text" && <p>{block.data}</p>) ||
                    (block.type === "image" && (
                      <img src={block.data} alt="Image" />
                    ))}
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            <div className="flex gap-4 border border-gray-600 p-4 rounded-lg flex-wrap">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-600 hover:text-white"
                onClick={() => addBlocks("heading")}
              >
                Heading
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-600 hover:text-white"
                onClick={() => addBlocks("sub-heading")}
              >
                Sub-Heading
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-600 hover:text-white"
                onClick={() => addBlocks("text")}
              >
                Text
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-600 hover:text-white"
                onClick={() => addBlocks("image")}
              >
                Image
              </Button>
            </div>

            <div className="flex gap-4 border border-gray-600 p-4 rounded-lg">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-indigo-600 hover:text-white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
