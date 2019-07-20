import Express from "express";
import Path from "path";
import requestPromise = require("request-promise");
const app = Express();

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
app.use("/", Express.static(Path.join(__dirname, "dist/book-shop")));
app.use("/", (req, res, next) => {
  res.sendFile(Path.join(__dirname, "dist/book-shop/index.html"));
});


const listener = app.listen(process.env.PORT || 80, () => {
  console.log("Server is listening on port:", listener.address().port);
});
