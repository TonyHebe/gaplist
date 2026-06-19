# GapList

**GapList** is a read-only Reddit monitor that surfaces public posts where founders and operators describe problems, frustrations, and unmet needs — then displays them on an external dashboard for product research.

**Live site (in development):** [gaplist.vercel.app](https://gaplist.vercel.app)

## What it does

GapList is a **server-side, read-only** service. It does **not** interact with Reddit users on the platform.

1. **Fetch** — Every 15–30 minutes, retrieve new public posts from ~10 business subreddits.
2. **Filter** — Keep posts containing problem signals (e.g. "I wish", "looking for a tool", "is there an app", "frustrated with", "alternative to").
3. **Store** — Save minimal metadata: post ID, title, short text snippet, subreddit, permalink, timestamp.
4. **Display** — Show a curated feed on [gaplist.vercel.app](https://gaplist.vercel.app) with AI-generated summary tags (category, pain score). Each card links back to the original Reddit post.

## Subreddits monitored

- r/SaaS
- r/indiehackers
- r/startups
- r/microsaas
- r/sideproject
- r/entrepreneur
- r/smallbusiness
- r/AppIdeas
- r/SomebodyMakeThis
- r/freelance

## What it will NOT do

- No automated posting, commenting, or messaging
- No voting or karma manipulation
- No scraping private subreddits or user DMs
- No selling or licensing raw Reddit data
- No using Reddit data to train ML models

## Reddit API usage

| Detail | Value |
|--------|-------|
| OAuth app type | Script (server-side only) |
| Expected volume | ~10–20 requests per fetch cycle, well under 60 req/min |
| Operator account | u/GapListBot (dedicated bot account) |
| API | Reddit Data API (read-only) |

GapList is an **external web application**, not an in-subreddit app. It aggregates public posts across multiple subreddits into a standalone dashboard hosted on its own domain. This is a read-only data aggregation use case; [Reddit Devvit](https://developers.reddit.com/) is designed for apps that run inside Reddit (games, mod tools, widgets) and does not support hosting a standalone SaaS product with its own domain, auth, and payment system.

## Stack

- **Frontend / API:** Next.js (App Router)
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Scheduling:** Vercel Cron or similar
- **AI tagging:** OpenAI (category + pain score summaries)

## Development status

MVP in progress. Building with public `.json` endpoints while Reddit API access is pending approval.

## License

Private project. Reddit content remains subject to Reddit's terms; GapList only links back to original posts and does not redistribute raw Reddit data.
