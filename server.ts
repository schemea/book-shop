import Express from "express";
import Path from "path";
import requestPromise = require("request-promise");

const app = Express();
const port = process.env.PORT || 80;

app.use("/proxy", async (req, res, next) => {
  try {
    const query = Object.entries(req.query).map(([k, v]: [string, string]) => k + "=" + encodeURIComponent(v)).join("&");

    // const url = new URL(req.path.substr(1), "https://");
    // for (const k in req.query) {
    //   if (req.query.hasOwnProperty(k)) {
    //     url.searchParams.set(k, req.query[k]);
    //   }
    // }
    // if (!url.protocol) {
    //   url.protocol = "https:";
    // }
    let url = req.path.substr(1);
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    if (query) {
      url += "?" + query;
    }
    const data = await requestPromise(url);
    res.end(data);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.end(e.toString());
  }
});
app.get("/index.html", (req, res, next) => {
  req.url = "/";
  console.log("redirecting",  req.url, "to /");
  next();
});
app.use(Express.static(Path.join(__dirname, "dist/book-shop"), { index: false }));
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  const base = Path.join(__dirname, "dist/book-shop");
  const liveServer = require("livereload").createServer({
    debug: true
  });
  app.use("/", (req, res, next) => {
    const fs: typeof import("fs") = require("fs");
    const html = fs.readFileSync(Path.join(base, "index.html"));
    const headEnd = html.indexOf("</head>");
    res.write(html.subarray(0, headEnd));
    res.write("<script src=\"http://localhost:35729/livereload.js?snipver=1\" async></script>");
    res.end(html.subarray(headEnd, html.length));
  });
  liveServer.watch(base);
} else {
  app.use("/", (req, res, next) => {
    res.sendFile(Path.join(__dirname, "dist/book-shop/index.html"));
  });
}


const listener = app.listen(port, () => {
  console.log("Server is listening on port:", listener.address().port);
});
