import { Input } from "@/components/ui/input.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  selectCurrentSelectedPost,
  selectPostLoading,
  updatePost,
} from "../../store/postSlice";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector(selectPostLoading);
  const post = useSelector(selectCurrentSelectedPost);
  const [blocks, setBlocks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [title, setTitle] = useState({
    data: null,
    editing: false,
  });
  const initialized = useRef(false);
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post && String(post.id) === String(id) && !initialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlocks(post.blocks.map((block) => ({ ...block, editing: false })));
      setTitle({ data: post.title, editing: false });
      initialized.current = true;
    }
  }, [post, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl text-muted-foreground">Loading post…</h1>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl">Could not find the post</h1>
        </div>
      </>
    );
  }

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
    setDirty(true);
  }

  function updateBlock(index, value) {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index].data = value;
      return updated;
    });
    setDirty(true);
  }

  function changeToEditing(index) {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index].editing = true;
      return updated;
    });
  }

  function finishUpdating(index) {
    setBlocks((prev) => {
      const updated = [...prev];
      if (!updated[index].data) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], editing: false };
      }
      return updated;
    });
    setDirty(true);
  }

  async function handleSave() {
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
        postId: post.id,
        title: title.data,
        blocks,
      };
      await dispatch(updatePost(formData)).unwrap();
      navigate("/user/posts");
    } catch (error) {
      console.log(error);
      setErrors(error || "Failed to create post");
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-10 px-5 text-gray-100">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="text-1xl font-bold">
                Editing
              </Badge>
            </div>
            {title.editing ? (
              <Input
                value={title.data || ""}
                onChange={(e) => {
                  setTitle((prev) => ({ ...prev, data: e.target.value }));
                  setDirty(true);
                }}
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
              <div
                onClick={() => setTitle((prev) => ({ ...prev, editing: true }))}
                className="cursor-text"
              >
                <h1 className="text-5xl font-extrabold text-white">
                  {title.data || "Untitled Post"}
                </h1>
                <p className="text-gray-400 text-sm">Post ID: {post.id}</p>
                <hr className="border-gray-700 mt-2" />
              </div>
            )}
            {errors && (
              <p className="text-red-400 text-sm mt-1 bg-red-900 p-2 rounded-md">
                {errors}
              </p>
            )}
          </div>

          {dirty && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl">
              <div className="flex items-center justify-between  backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-md border border-gray-700">
                <span className="text-sm font-medium">Unsaved changes</span>
                <Button size="sm" variant="default" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {blocks && blocks.length > 0 ? (
              blocks.map((block, index) => {
                switch (block.type) {
                  case "heading":
                    if (block.editing) {
                      return (
                        <Input
                          type="text"
                          key={`block-${index}`}
                          placeholder="Heading"
                          value={block.data}
                          className="text-4xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md py-1 bg-gray-700 text-white w-full"
                          onChange={(e) => updateBlock(index, e.target.value)}
                          onBlur={() => finishUpdating(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") finishUpdating(index);
                          }}
                        />
                      );
                    } else {
                      return (
                        <p
                          className="text-4xl font-bold text-white"
                          key={index}
                          onClick={() => changeToEditing(index)}
                        >
                          {block.data}
                        </p>
                      );
                    }

                  case "sub-heading":
                    if (block.editing) {
                      return (
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
                      );
                    } else {
                      return (
                        <p
                          className="text-2xl font-semibold text-gray-200"
                          key={index}
                          onClick={() => changeToEditing(index)}
                        >
                          {block.data}
                        </p>
                      );
                    }

                  case "text":
                    if (block.editing) {
                      return (
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
                      );
                    } else {
                      return (
                        <p
                          className="text-gray-300 leading-relaxed text-lg"
                          key={index}
                          onClick={() => changeToEditing(index)}
                        >
                          {block.data}
                        </p>
                      );
                    }

                  case "image":
                    if (block.editing) {
                      return (
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
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="my-4 rounded-lg overflow-hidden shadow-md"
                          onClick={() => changeToEditing(index)}
                        >
                          <img
                            src={block.data}
                            alt="Post Image"
                            className="w-full object-cover max-h-96"
                          />
                        </div>
                      );
                    }

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
          </div>
        </div>
      </div>
    </>
  );
}
