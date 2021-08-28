module.exports = {
  env: {
    API_URL: process.env.API_URL,
    HTTPS_URL: process.env.HTTPS_URL,
    BROKEN_DATA: process.env.BROKEN_DATA,
    REVALIDATE: process.env.REVALIDATE,
    VERCEL_GIT_REPO_OWNER: process.env.VERCEL_GIT_REPO_OWNER,
    VERCEL_GIT_REPO_SLUG: process.env.VERCEL_GIT_REPO_SLUG,
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    FUNCTION_AUTH: process.env.FUNCTION_AUTH,
  },
  images: {
    domains: ['cdn.myanimelist.net'],
  },
};
