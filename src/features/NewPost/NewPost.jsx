import React from "react";
import { Button } from "@/components/ui/button";

export default function NewPost() {
  return (
    <>
      <div className="flex flex-col items-center justify-between h-full p-5">
        <div>
          <p>All Displayed Items go here</p>
        </div>
        <div className="flex gap-4 border border-gray-700 p-4 rounded-lg">
          <Button variant="outline">Heading</Button>
          <Button variant="outline">Sub-Heading</Button>
          <Button variant="outline">Text</Button>
          <Button variant="outline">Image</Button>
        </div>
      </div>
    </>
  );
}
