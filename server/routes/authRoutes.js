const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const googleClient = new OAuth2Client();
const SESSION_COOKIE = "tournament_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

function getAuthConfiguration(res) {
  const { GOOGLE_CLIENT_ID, AUTH_SESSION_SECRET } = process.env;

  if (!GOOGLE_CLIENT_ID || !AUTH_SESSION_SECRET || AUTH_SESSION_SECRET.length < 32) {
    res.status(503).json({
      message:
        "Authentication is not configured. Set GOOGLE_CLIENT_ID and an AUTH_SESSION_SECRET of at least 32 characters.",
    });
    return null;
  }

  return { clientId: GOOGLE_CLIENT_ID, sessionSecret: AUTH_SESSION_SECRET };
}

router.post("/google", async (req, res) => {
  const configuration = getAuthConfiguration(res);
  if (!configuration) return;

  const { credential } = req.body;
  if (typeof credential !== "string" || !credential) {
    return res.status(400).json({ message: "A Google credential is required." });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: configuration.clientId,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: "The Google credential could not be verified." });
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    return res.status(401).json({ message: "A verified Google account is required." });
  }

  const user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture || null,
  };
  const session = jwt.sign(user, configuration.sessionSecret, {
    expiresIn: "7d",
    issuer: "tournament-intelligence",
  });

  res.cookie(SESSION_COOKIE, session, {
    ...getCookieOptions(),
    maxAge: SESSION_DURATION_MS,
  });
  return res.json({ user });
});

router.get("/me", (req, res) => {
  const configuration = getAuthConfiguration(res);
  if (!configuration) return;

  const session = req.cookies?.[SESSION_COOKIE];
  if (!session) return res.status(401).json({ message: "Sign in to continue." });

  try {
    const user = jwt.verify(session, configuration.sessionSecret, {
      issuer: "tournament-intelligence",
    });
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
      throw error;
    }

    res.clearCookie(SESSION_COOKIE, getCookieOptions());
    return res.status(401).json({ message: "Your session has expired. Sign in again." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE, getCookieOptions());
  return res.status(204).end();
});

module.exports = router;
