const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const cookieValue = req.cookies?.[cookieName];
    // console.log("cookieName", cookieValue);
    if (!cookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(cookieValue);
      req.user = userPayload;
    } catch (e) {}

    return next();
  };
}

function strictValidation(cookieName) {
  return function (req, res, next) {
    const cookie = req.cookies[cookieName];

    if (!cookie)
      return res.render("signin", {
        error: "You must signin to view that Page",
      });

    const user = validateToken(cookie);

    if (!user)
      return res.render("signin", {
        error: "You must signin to view that Page",
      });

    return next();
  };
}

module.exports = { checkForAuthenticationCookie, strictValidation };
