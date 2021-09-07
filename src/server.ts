import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res
        .status(422)
        .send({ auth: true, message: "image_url is required." });
    }

    let filteredPath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredPath, () => {
      deleteLocalFiles([filteredPath]);
    });
  });
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
