import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { renderPage } from "vike/server";
import { root } from "./root.js";
const cors = require("cors");
import axios from "axios";
const config = require("../config.json");

const isProduction = process.env.NODE_ENV === "production";

startServer();

async function startServer() {
  const app = express();
  app.use(cookieParser());
  app.use(compression());

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };

  app.use(cors(corsOptions));

  if (isProduction) {
    const sirv = (await import("sirv")).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  // site map nees change
  // app.get("/sitemap.xml", async (req, res) => {
  //   const request = await axios.get("https://api.khanedaroo.com/sitemap");

  //   res.set("Content-Type", "text/xml");
  //   res.send(request.data);
  // });

  const lngs = ["fr", "en"];
  const lngDefault = lngs[0];
  function extractLanguage(url) {
    let lng = lngDefault;
    let lngId = 1;
    let urlWithoutLng = url;

    const urlSplited = url.split("/");

    lngs.forEach((code) => {
      if (urlSplited.indexOf(code) > -1) {
        lng = code;
        urlWithoutLng = url.replace("/" + code, "");
        if(lng == "en") {
          lngId = 2
        } else {
          lngId = 1
        }   
      }
      if (urlWithoutLng === "") {
        urlWithoutLng = "/";
      }
    });

    return { lng, urlWithoutLng, lngId };
  }

  app.get("*", async (req, res, next) => {
    const { lng, urlWithoutLng, lngId } = extractLanguage(req.originalUrl);
    var user = null;
    var settings = null;
    var sidebarPosts = null;

    var xAccessToken = req.cookies["x-access-token"];

    if (xAccessToken) {
      user = await getUser(xAccessToken);
    }

    settings = await getSettings(lngId);
    sidebarPosts = await getSidebarPosts(lngId);

    const pageContextInit = {
      urlOriginal: urlWithoutLng,
      data: {
        lng,
        lngId,
        xAccessToken,
        user,
        settings,
        sidebarPosts,
      },
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

async function getUser(xAccessToken) {
  var result = await axios
    .post(
      `${config.apiUrl}/account/get`,
      {
        "x-access-token": xAccessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      if (response.data.status == true) {
        return response.data.data.user;
      } else if (response.data.status == false) {
        return null;
      }
    })
    .catch(function (error) {});

  return result;
}

async function getSettings(lngId) {
  var result = await axios
    .post(
      `${config.apiUrl}/settings/get`,
      {
        query: {
          settingKey: "system",
          languageId: lngId
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      if (response.data.status == true) {
        return response.data.data.settings.items[0];
      } else if (response.data.status == false) {
        return null;
      }
    })
    .catch(function (error) {});

  return result;
}

async function getSidebarPosts(lngId) {
  var result = await axios
    .post(
      `${config.apiUrl}/posts/get`,
      {
        query: {
          postId: null,
          languageId: lngId
        },
        offset: null,
        limit: 4,
        order: "newest",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      if (response.data.status == true) {
        return response.data.data.posts.items;
      } else if (response.data.status == false) {
        return null;
      }
    })
    .catch(function (error) {});

  return result;
}
