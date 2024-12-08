import Quill from "quill";
import { useRef, useState } from "react";
import { useEffect } from "react";
import "quill/dist/quill.snow.css";
import "../css/style.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Toolbar_options, url } from "../func/text_func";
import { FaInfoCircle } from "react-icons/fa";

export const TextEditor = () => {
  const wrapperRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const params = useParams();
  const [show, setShow] = useState(false);
  const [lock, setLock] = useState(false);

  //socket connection
  useEffect(() => {
    const s = io(url);
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

  //lock

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.on("lock", () => {
      quill.disable();
      setLock(true);
    });
    socket.on("unlock", () => {
      quill.enable();
      setLock(false);
    });
    return () => {
      socket.off("lock", () => {
        quill.disable();
        setLock(true);
      });
      socket.off("unlock", () => {
        quill.enable();
        setLock(false);
      });
    };
  }, [lock, socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, sources) => {
      if (sources === "user") return;
      socket.emit("lock");
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    quill.on("selection-change", (range) => {
      if (range == null) {
        socket.emit("unlock");
      }
    });
    return () => {
      quill.off("selection-change", socket.emit("unlock"));
    };
  }, [socket, quill]);
  const onShow = () => {
    setShow(!show);
  };
  return (
    <>
      <div
        id="container"
        className="w-full h-screen box-border p-3 bg-gray-100"
        ref={wrapperRef}
      ></div>
      {show && (
        <div className="fixed bottom-5 right-5 bg-gray-600 hover:bg-gray-500 text-white font-semibold h-20  w-72 flex justify-center items-center rounded-md transition-all duration-300 transform  shadow-md">
          <h1 className="text-center gfont">
            {params.id} <br />
          </h1>
        </div>
      )}
      <button
        onClick={onShow}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9  w-9 flex justify-center items-center rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        <FaInfoCircle className="inline-block mr-2" />
      </button>
    </>
  );
};
