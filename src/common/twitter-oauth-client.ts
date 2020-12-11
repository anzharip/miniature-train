import { logger } from "./logger";
import OAuth from "oauth-1.0a";
import * as crypto from "crypto";
import axios, { AxiosResponse } from "axios";
import { HttpMethod } from "./interface/http-method.interface";

export async function twitterOauthClient(
  url: string,
  method: HttpMethod,
  data: unknown
): Promise<AxiosResponse<unknown> | boolean> {
  if (process.env.TWITTER_API_KEY === undefined) {
    logger.error("TWITTER_API_KEY is not defined");
    return false;
  }
  if (process.env.TWITTER_API_SECRET_KEY === undefined) {
    logger.error("TWITTER_API_SECRET_KEY is not defined");
    return false;
  }
  if (process.env.TWITTER_ACCESS_TOKEN_KEY === undefined) {
    logger.error("TWITTER_ACCESS_TOKEN_KEY is not defined");
    return false;
  }
  if (process.env.TWITTER_ACCESS_TOKEN_SECRET_KEY === undefined) {
    logger.error("TWITTER_ACCESS_TOKEN_SECRET_KEY is not defined");
    return false;
  }

  const request_data = {
    url: url,
    method: method,
    data: data,
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
  return axios(request_data.url, {
    method: request_data.method,
    url: request_data.url,
    headers: oauth.toHeader(oauth.authorize(request_data, token)),
    data: request_data.data,
  });
}
