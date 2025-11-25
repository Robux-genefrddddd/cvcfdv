import express from "express";

export function createServer() {
  const app = express();
  app.use(express.json());

  // ----- ROUTE 1 : GET IP -----
  app.get("/api/get-ip", (req, res) => {
    res.json({
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        "unknown",
    });
  });

  // ----- ROUTE 2 : AI chat -----
  app.post("/api/ai/chat", async (req, res) => {
    const msg = req.body?.message || "empty";

    res.json({
      ok: true,
      message: "Server received: " + msg,
    });
  });

  return app; // NE SURTOUT PAS mettre app.listen()
}
