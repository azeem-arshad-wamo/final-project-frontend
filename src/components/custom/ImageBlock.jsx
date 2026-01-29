import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageBlock({ src }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative my-4 rounded-lg overflow-hidden shadow-md">
      {!loaded && <Skeleton className="w-full h-64 rounded-lg" />}

      <img
        src={src}
        alt="Post image"
        onLoad={() => setLoaded(true)}
        className={`
          w-full object-cover max-h-96
          transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}
        `}
      />
    </div>
  );
}
