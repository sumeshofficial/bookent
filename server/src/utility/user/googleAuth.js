export const validateGoogleUser = (user) => {
  if (!user) {
    return { error: "User not found" };
  }
  if (user.status === "blocked") {
    return { error: "You are blocked by the admin" };
  }
  return null;
};

export const sendPopupResponse = (res, payload, FRONTEND_URL) => {
  return res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage(${JSON.stringify(payload)}, "${FRONTEND_URL}");
          window.close();
        </script>
      </body>
    </html>
  `);
};
