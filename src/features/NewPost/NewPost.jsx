import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";

export default function NewPost() {
  const [blocks, setBlocks] = useState([]);
  const user = useSelector(selectCurrentUser);
  console.log("User Info: ");
  console.log(user);

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
      updated[index].editing = false;
      return updated;
    });
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
            <h1>Create Post Here Bitch</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {blocks.length === 0 && <p>Add Blocks to get Started</p>}

          {blocks.map((block, index) => (
            <div key={index}>
              {block.editing
                ? (block.type === "heading" && (
                    <input
                      type="text"
                      placeholder="Title"
                      value={block.data}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      onBlur={() => finishUpdating(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishUpdating(index);
                      }}
                    />
                  )) ||
                  (block.type === "sub-heading" && (
                    <input
                      type="text"
                      placeholder="Sub Heading"
                      value={block.data}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      onBlur={() => finishUpdating(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishUpdating(index);
                      }}
                    />
                  )) ||
                  (block.type === "text" && (
                    <input
                      type="text"
                      placeholder="Text"
                      value={block.data}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      onBlur={() => finishUpdating(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishUpdating(index);
                      }}
                    />
                  )) ||
                  (block.type === "image" && (
                    <input
                      type="text"
                      placeholder="Add image url"
                      value={block.data}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      onBlur={() => finishUpdating(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishUpdating(index);
                      }}
                    />
                  ))
                : (block.type === "heading" && (
                    <h1 className="text-4xl font-bold">{block.data}</h1>
                  )) ||
                  (block.type === "sub-heading" && (
                    <h2 className="text-3xl">{block.data}</h2>
                  )) ||
                  (block.type === "text" && <p>{block.data}</p>) ||
                  (block.type === "image" && (
                    <img src={block.data} alt="Image" />
                  ))}
            </div>
          ))}
        </div>
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
      </div>
    </>
  );
}
