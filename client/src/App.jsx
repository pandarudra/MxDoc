import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TextEditor } from "./pages/TextEditor";
import { Landing } from "./pages/Landing";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="doc/:id" element={<TextEditor />} />
      </Routes>
    </BrowserRouter>
  );
};
