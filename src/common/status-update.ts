import "dotenv/config";
import OAuth from "oauth-1.0a";
import * as crypto from "crypto";
import axios from "axios";
import { logger } from "./logger";

async function app() {
  if (process.env.TWITTER_API_KEY === undefined) {
    logger.error("TWITTER_API_KEY is not defined");
    return;
  }
  if (process.env.TWITTER_API_SECRET_KEY === undefined) {
    logger.error("TWITTER_API_SECRET_KEY is not defined");
    return;
  }
  if (process.env.TWITTER_ACCESS_TOKEN_KEY === undefined) {
    logger.error("TWITTER_ACCESS_TOKEN_KEY is not defined");
    return;
  }
  if (process.env.TWITTER_ACCESS_TOKEN_SECRET_KEY === undefined) {
    logger.error("TWITTER_ACCESS_TOKEN_SECRET_KEY is not defined");
    return;
  }

  const statusId = "1336906489294884866";
  const url =
    "https://api.twitter.com/1.1/statuses/retweet/" + statusId + ".json";
  const request_data: {
    url: string;
    method:
      | "POST"
      | "get"
      | "GET"
      | "delete"
      | "DELETE"
      | "head"
      | "HEAD"
      | "options"
      | "OPTIONS"
      | "post"
      | "put"
      | "PUT"
      | "patch"
      | "PATCH"
      | "purge"
      | "PURGE"
      | "link"
      | "LINK"
      | "unlink"
      | "UNLINK";
  } = {
    url: url,
    method: "POST",
  };
  const token = {
    key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_KEY,
  };
  const oauth = new OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY,
      secret: process.env.TWITTER_API_SECRET_KEY,
    },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });

  axios(url, {
    method: request_data.method,
    url: url,
    headers: oauth.toHeader(oauth.authorize(request_data, token)),
  });
}

app();
