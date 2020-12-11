import "dotenv/config";
import { logger } from "./common/logger";
import { retrieveQuestion } from "./incoming/incoming.service";
import { replyStatus, retweetStatus } from "./outgoing/outgoing.service";
import { queueIncomingTweet } from "./queue/queue.service";

async function app() {
  logger.info("Application is starting...");

  retrieveQuestion();

  // Interval 72000 ms to prevent hitting Twitter's 300 per
  // 3 hours statuses/retweet and statuses/update limit
  setInterval(async () => {
    const incomingTweet = await queueIncomingTweet.shift();
    if (incomingTweet === null || incomingTweet === undefined) return;
    if (incomingTweet.text.includes("RT @")) return;
    if (incomingTweet.retweeted === true) return;
    logger.info("Executing actions on an incoming tweet...");
    // retweet
    try {
      retweetStatus(incomingTweet);
    } catch (error) {
      logger.error(error);
    }

    // reply
    if (
      process.env.TWITTER_REPLY_MESSAGE === undefined ||
      process.env.TWITTER_REPLY_MESSAGE === "" ||
      process.env.TWITTER_REPLY_MESSAGE === null
    ) {
      return;
    }

    try {
      replyStatus(incomingTweet, process.env.TWITTER_REPLY_MESSAGE);
    } catch (error) {
      logger.error(error);
    }
  }, Number.parseInt(process.env.ACTION_INTERVAL || "72000"));
}

(async () => {
  app();
})();
