import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById, selectCurrentSelectedPost } from "../../store/postSlice";
import { useEffect } from "react";

export default function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentSelectedPost);

  console.log(`ID from params: ${id}`);
  console.log(post);

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <div>
        <h1>Singe Post Page</h1>
      </div>
    </>
  );
}
