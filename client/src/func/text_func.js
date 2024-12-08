export const Toolbar_options = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["blockquote", "code-block"],
  [{ header: "1" }, { header: "2" }],
  [{ table: [] }],

  ["clean"],
];
export const url = import.meta.env.VITE_BASE_URL;
