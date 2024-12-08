const express = require("express");
const connectDB = require("./db/db.config");
const Doc = require("./model/doc.model");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const findOrCreateDocument = async (id) => {
  if (id == null) return;
  const document = await Doc.findById(id);

  if (document) return document;

  return await Doc.create({ _id: id, data: "" });
};

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);

    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
    socket.on("save-document", async (data) => {
      await Doc.findByIdAndUpdate(documentId, { data });
    });
  });
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
