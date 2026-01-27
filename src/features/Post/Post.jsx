import React from "react";
import { useParams } from "react-router-dom";

export default function Post() {
  const { id } = useParams();

  console.log(`ID from params: ${id}`);

  return (
    <>
      <div>
        <h1>Singe Post Page</h1>
      </div>
    </>
  );
}
