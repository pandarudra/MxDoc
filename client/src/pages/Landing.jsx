import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
export const Landing = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        to={`/doc/${uuidv4()}`}
      >
        Create a new document
      </Link>
    </div>
  );
};
