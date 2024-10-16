import express from "express";
const router = express.Router();

import api from "./api.js";

router.use("/api", api);

//Static routes
//Serve React build files in production
if (process.env["NODE_ENV"] === "production") {
  const path = require("path");
  //Serve the frontend's index.html file a the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(path.resolve("../frontend", "dist", "index.html"));
  });

  //Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/dist")));

  //serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(path.resolve("../frontend", "dist", "index.html"));
  });
}

//Add a XSRF-TOKEN cookie in development
if (process.env["NODE_ENV"] !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF_TOKEN", csrfToken);
    return res.json({ "XSRF-Token": csrfToken });
  });
}

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

export default router;
