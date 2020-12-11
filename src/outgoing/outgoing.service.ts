import { Tweet } from "../common/interface/twitter/tweet.interface";
import { logger } from "../common/logger";
import { twitterOauthClient } from "../common/twitter-oauth-client";
import * as querystring from "querystring";

export async function retweetStatus(status: Tweet): Promise<boolean> {
  if (status.id_str === undefined) {
    logger.error("Status update to be retweeted has no ID");
    return false;
  } else {
    const url =
      "https://api.twitter.com/1.1/statuses/retweet/" + status.id_str + ".json";
    try {
      await twitterOauthClient(url, "POST", {});
    } catch (error) {
      const axiosErrorLog = {
        status: error.response.status ? error.response.status : "",
        headers: error.response.headers ? error.response.headers : "",
        data: error.response.data ? error.response.data : "",
      };
      logger.error(axiosErrorLog);
      return false;
    }

    logger.info(`Status update ${status.id_str} retweeted`);
    return true;
  }
}

export async function replyStatus(
  status: Tweet,
  replyMessage: string
): Promise<boolean> {
  if (status.user.screen_name === undefined) {
    logger.error("Screen name of the tweet author is undefined");
    return false;
  } else if (status.id_str === undefined) {
    logger.error("Status update to be replied has no ID");
    return false;
  } else {
    const parameters = {
      status: replyMessage,
      auto_populate_reply_metadata: true, 
      in_reply_to_status_id: status.id_str,
    };
    const constUrlSafeParameters = querystring.stringify(parameters);
    const url =
      "https://api.twitter.com/1.1/statuses/update.json" +
      "?" +
      constUrlSafeParameters;
    try {
      await twitterOauthClient(url, "POST", {});
    } catch (error) {
      const axiosErrorLog = {
        status: error.response.status ? error.response.status : "",
        headers: error.response.headers ? error.response.headers : "",
        data: error.response.data ? error.response.data : "",
      };
      logger.error(axiosErrorLog);
      return false;
    }

    logger.info(`Status update ${status.id_str} replied`);
    return true;
  }
}
