import cookie from "cookie";            // NPM.js Docs Link -> https://www.npmjs.com/package/cookie
                                        // MDN Docs Link -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

const MAX_AGE = 7*24*60*60;

export const setTokenCookie = (token, res) => {

    const setCookie = cookie.serialize("token", token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        secure: false,

        path: "/",

    });

    res.setHeader("Set-Cookie", setCookie);
};

export const removeTokenCookie = (res) => {
    const val = cookie.serialize("token", "", {
      maxAge: -1,
      path: "/",
    });
  
    res.setHeader("Set-Cookie", val);
  };