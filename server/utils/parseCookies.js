/**
 * Parses cookies from the Express request object.
 * Shared utility to avoid duplicating cookie-parsing logic across middleware.
 * @param {import("express").Request} req
 * @returns {Record<string, string>}
 */
const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  return req.headers.cookie.split(";").reduce((acc, cookie) => {
    const parts = cookie.trim().split("=");
    const key = parts[0];
    const value = parts.slice(1).join("=");
    acc[key] = value;
    return acc;
  }, {});
};

module.exports = { parseCookies };
