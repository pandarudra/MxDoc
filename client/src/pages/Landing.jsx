import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../css/style.css";
import { useState } from "react";

export const Landing = () => {
  const [docid, setDocid] = useState("");
  const navigate = useNavigate();
  const onOpendoc = () => {
    if (docid.trim() !== "") {
      navigate(`/doc/${docid}`);
    } else {
      alert("Please enter a valid document ID");
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center imgbg">
      <div className="w-96 h-auto bg-white shadow-xl rounded-lg flex flex-col p-6 gap-5">
        <Link
          className="bg-blue-600 gfont hover:bg-blue-700 text-white text-center font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
          to={`/doc/${uuidv4()}`}
        >
          Create a New Document
        </Link>
        <h3 className="text-center gfont text-gray-700 text-lg font-bold">
          OR
        </h3>
        <input
          className="border-2 gfont border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
          type="text"
          value={docid}
          onChange={(e) => setDocid(e.target.value)}
          placeholder="Enter Document ID"
        />
        <button
          className="bg-blue-600 gfont hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md mt-3"
          onClick={onOpendoc}
        >
          Open Document
        </button>
      </div>
    </div>
  );
};
