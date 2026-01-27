import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { Input } from "@/components/ui/input";

export default function NewPost() {
  const [blocks, setBlocks] = useState([]);
  const [title, setTitle] = useState({
    data: null,
    editing: true,
  });
  const [errors, setErrors] = useState(null);
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

  function handleSubmit() {
    if (!title.data) {
      setErrors("Title is needed");
    }
    if (blocks.length <= 0) {
      setErrors("Cannot create post with zero blocks");
    }
    console.log(blocks);
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
      <div className="flex flex-col items-center justify-between h-full p-5">
        <div>
          <div>
            <h1 className="text-4xl">Create New Post</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start min-w-96 w-full max-w-3xl ">
          <div className="my-2">
            {title.editing ? (
              <Input
                onChange={(e) =>
                  setTitle((prev) => ({ ...prev, data: e.target.value }))
                }
                placeholder="Title of the post"
                onBlur={() => {
                  if (title.data) {
                    setTitle((prev) => ({ ...prev, editing: false }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && title.data) {
                    setTitle((prev) => ({ ...prev, editing: false }));
                  }
                }}
              />
            ) : (
              <p className="text-5xl font-bold">{title.data}</p>
            )}
            {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
          </div>

          {blocks.length === 0 && <p>Add Blocks to get Started</p>}

          {blocks.map((block, index) => (
            <div key={index}>
              {block.editing
                ? (block.type === "heading" && (
                    <Input
                      type="text"
                      placeholder="Title"
                      value={block.data}
                      className="text-4xl font-bold leading-tight py-0 w-full"
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
                      placeholder="Sub Heading"
                      value={block.data}
                      className="text-3xl font-semibold leading-snug py-0 w-full"
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
                      className="text-base leading-normal py-0 w-full"
                      value={block.data}
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
                        className="w-full"
                      />

                      <span className="text-gray-500 text-sm">OR</span>

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
                        className="w-full"
                      />

                      {block.data && (
                        <AspectRatio
                          ratio={16 / 9}
                          className="w-full rounded-lg overflow-hidden"
                        >
                          <img
                            src={block.data}
                            alt="Image"
                            className="object-cover w-full h-full max-h-100"
                          />
                        </AspectRatio>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => finishUpdating(index)}
                        className="mt-2"
                      >
                        Done
                      </Button>
                    </div>
                  ))
                : (block.type === "heading" && (
                    <h1 className="text-4xl ">{block.data}</h1>
                  )) ||
                  (block.type === "sub-heading" && (
                    <h2 className="text-2xl">{block.data}</h2>
                  )) ||
                  (block.type === "text" && <p>{block.data}</p>) ||
                  (block.type === "image" && (
                    <img src={block.data} alt="Image" />
                  ))}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex gap-4 border border-gray-700 p-4 rounded-lg">
            <Button variant="outline" onClick={() => addBlocks("heading")}>
              Heading
            </Button>
            <Button variant="outline" onClick={() => addBlocks("sub-heading")}>
              Sub-Heading
            </Button>
            <Button variant="outline" onClick={() => addBlocks("text")}>
              Text
            </Button>
            <Button variant="outline" onClick={() => addBlocks("image")}>
              Image
            </Button>
          </div>
          <div className="flex gap-4 border border-gray-700 p-4 rounded-lg">
            <Button variant="outline" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
