export const helmetConfig = (env) => ({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        ...(env.ALLOW_OAUTH_INLINE === "true" ? ["'unsafe-inline'"] : []),
        "https://accounts.google.com",
        "https://apis.google.com",
      ],

      frameSrc: ["'self'", "https://accounts.google.com"],

      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
        "https://apis.google.com",
      ],

      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});