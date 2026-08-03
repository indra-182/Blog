# Automated article publication

The article publisher selects the first `pending` item in
`content/article-queue.json`, asks GitHub Models for only an Indonesian
excerpt and body, validates the result, and opens a pull request. Queue
metadata controls the title, slug, date, taxonomy, and source notes.

## Required repository setup

Create a GitHub App dedicated to this repository and store:

- `ARTICLE_BOT_APP_ID` as a repository Actions secret.
- `ARTICLE_BOT_PRIVATE_KEY` as a repository Actions secret.
- `ARTICLE_BOT_LOGIN` as a repository Actions variable containing the App's bot login.

Install the App on this repository only. Grant exactly `Contents: Read and
write` and `Pull requests: Read and write`. Do not grant bypass access for
branch protection. The workflow uses the default `GITHUB_TOKEN` only for the
GitHub Models request and the short-lived, repository-scoped App token for
the branch push, pull request, and merge request.

## Branch protection and billing

Protect `main` and require the `article-gate` status check. Require branches
to be up to date before merging, allow squash merging, and keep auto-merge
enabled. The App must not bypass these rules.

Enable GitHub Models for the repository or account, but keep paid overage
disabled. Free usage is rate-limited and stops when the included quota is
exhausted. A missed publication is an acceptable outcome. Billing is an
account or organization setting and cannot be enforced by repository code.

The schedule is `17:10 UTC`, equivalent to `00:10 WIB` on the following local
date. Scheduled workflows can be delayed by GitHub and public repositories
with no recent activity may have schedules disabled, so manual dispatch is
also available.

## Recovery

- An open `automation/article/*` pull request causes the next scheduled run to stop before any model call.
- A stale branch or failed gate should be closed or deleted by a maintainer; the queue remains pending until a valid pull request merges.
- Network and transient model failures retry at most twice after the first attempt. Quota, billing, authentication, malformed output, and validation failures do not retry and do not mutate `main`.
- If an article pull request is closed without merging, delete its branch. The next run will generate the same first pending queue item again.
- If a queue item must be changed, edit its metadata and source notes in the queue file, then run `bun run validate:articles` before opening a PR.

## Local commands

```sh
bun run validate:articles
bun run generate:article
bun run lint
bun run test
bun run build
```

`bun run generate:article` needs `GITHUB_TOKEN` and makes a real GitHub Models
request. Tests inject the model and filesystem and never fetch source URLs.
