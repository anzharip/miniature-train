import { Tweet } from "../common/interface/twitter/tweet.interface";
import { logger } from "../common/logger";
import { twitterClient } from "../common/twitter-client";
import { isTweetLooping } from "../common/twitter-is-looping";
import { queueIncomingTweet } from "../queue/queue.service";

export function retrieveQuestion(endRetries = 0): void {
  const client = twitterClient();

  const parameters = {
    track: process.env.TWITTER_TRACK_PHRASES || "",
  };

  client
    .stream("statuses/filter", parameters)
    .on("start", () => logger.info("Streaming start"))
    .on("data", async (data: Tweet) => {
      if (isTweetLooping(data)) return;
      if (
        queueIncomingTweet.length <
        Number.parseInt(process.env.MAX_QUEUE_LENGTH || "300")
      )
        queueIncomingTweet.push(data);
    })
    .on("ping", () => logger.info("Keepalive received"))
    .on("error", (error) => {
      logger.error(error);
      throw new Error(`Stream error: ${JSON.stringify(error)}`);
    })
    .on("end", (error) => {
      logger.error(`Stream error: ${JSON.stringify(error)}`);
      if (endRetries < 11) {
        endRetries += 1;
        setInterval(
          () => retrieveQuestion(endRetries),
          Math.pow(2, endRetries) * 1000
        );
      } else {
        retrieveQuestion(0);
      }
    });
}
