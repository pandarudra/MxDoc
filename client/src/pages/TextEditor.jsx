import Quill from "quill";
import { useRef, useState } from "react";
import { useEffect } from "react";
import "quill/dist/quill.snow.css";
import "../css/style.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Toolbar_options } from "../func/text_func";

export const TextEditor = () => {
  const wrapperRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const params = useParams();
  //socket connection
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);
  //Load and get document
  useEffect(() => {
    if (socket === null || quill === null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", params.id);
  }, [socket, quill, params.id]);
  //Save document
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  //Quill editor setup
  useEffect(() => {
    const editor = document.createElement("div");
    const wrapper = wrapperRef.current;
    if (wrapper === null) return;
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: Toolbar_options,
      },
    });
    q.disable();
    setQuill(q);
    return () => {
      wrapper.innerHTML = "";
    };
  }, []);

  //Text changes and send changes
  useEffect(() => {
    if (quill === null || socket === null) return;
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    });
    return () => {
      quill.off("text-change");
    };
  }, [quill, socket]);

  //Receive changes
  useEffect(() => {
    if (socket === null || quill === null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
  }, [quill, socket]);
  return (
    <div
      id="container"
      className="w-full h-screen box-border p-3 bg-gray-100"
      ref={wrapperRef}
    ></div>
  );
};
