// GENERATE REPO URL

let repoEnvs = [
  process.env.VERCEL_GIT_REPO_OWNER,
  process.env.VERCEL_GIT_REPO_SLUG,
  process.env.VERCEL_GIT_COMMIT_REF,
] as string[];

let REPO_URL = "";

if (repoEnvs[2] == "main") {
  REPO_URL = `https://github.com/${repoEnvs[0]}/${repoEnvs[1]}/`;
} else {
  REPO_URL = `https://github.com/${repoEnvs[0]}/${repoEnvs[1]}/tree/${repoEnvs[2]}`;
}

export const CONST_REPO_URL = REPO_URL;

// CONSTANTS

export const SITE_NAME = "グラニメフ(GURANIMEFU)";

export const SITE_DESC =
  "アニメの10段階評価と視聴者数を、海外(MyAnimeList)から毎日取得。順位と数値をグラフ化します。Automatically convert MAL ranking to line/bump charts every day.";

export const SITE_FULL_URL =
  process.env.HTTPS_URL ??
  "https://" + process.env.VERCEL_URL ??
  "https://guranimefu.aely.one";

export const VERCEL_GITHUB_REPOSITORY_TOP =
  "https://github.com/" +
  (process.env.VERCEL_GIT_REPO_OWNER ?? "") +
  "/" +
  (process.env.VERCEL_GIT_REPO_SLUG ?? "");
export const VERCEL_LAST_COMMIT =
  VERCEL_GITHUB_REPOSITORY_TOP +
  "/commit/" +
  (process.env.VERCEL_GIT_COMMIT_SHA ?? "");
export const VERCEL_LAST_COMMIT_MESSAGE =
  process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
