# miniature-train

A twitter bot written in Typescript. Features:

- Track multiple phrases (env variable `TWITTER_TRACK_PHRASES`).
- Retweet the tracked phrases.
- Reply the tracked phrases (env variable `TWITTER_REPLY_MESSAGE`).

![Screen Shot 2020-12-11 at 11 45 47](https://user-images.githubusercontent.com/10259593/101864159-8b250080-3ba6-11eb-96da-a41cb94015bf.png)

## How it works:

1. Reply to a tweet of the user that you want to analyze, and mention the user defined in the `TWITTER_ACCOUNT_TO_LISTEN` environment variable.
2. The account set with `TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_ACCESS_TOKEN_KEY, TWITTER_ACCESS_TOKEN_SECRET_KEY, TWITTER_BEARER_TOKEN` will reply to the your tweet with the information.

## Environment Variables

```bash
TWITTER_API_KEY=xxxxxxxxx
TWITTER_API_SECRET_KEY=xxxxxxxxx
TWITTER_ACCESS_TOKEN_KEY=xxxxxxxxx
TWITTER_ACCESS_TOKEN_SECRET_KEY=xxxxxxxxx
TWITTER_BEARER_TOKEN=xxxxxxxxx
TWITTER_TRACK_PHRASES=javascript,typescript,nodejs,programming,software,100daysofcode,wedevelopment
TWITTER_REPLY_MESSAGE="check this out"
MAX_QUEUE_LENGTH=300
ACTION_INTERVAL=72000
BOT_SCREEN_NAME=techrtbotpls
```

Notes:

- `ACTION_INTERVAL`: don't set this lower than 72000 ms, or you will hit your twitter api rate limit.
- `BOT_SCREEN_NAME`: this env variable is used to prevent looping when replying to another bot, set it to your bot twitter account handle (e.g techrtbotpls).

## Running the app

```
# development
$ npm run start:dev

# production mode
$ npm run build && npm run start
```
