import { Tweet } from "./interface/twitter/tweet.interface";


export function isTweetLooping(tweet: Tweet): boolean {
  // check if in reply to of the incoming tweets is replying to the bot or not
  return tweet.in_reply_to_screen_name ===
    (process.env.BOT_SCREEN_NAME as string || "").replace("@", "")
    ? true
    : false;
}
