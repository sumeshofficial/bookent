export const loadPayPalScript = (clientId) => {
  return new Promise((resolve) => {
    if (document.getElementById("paypal-script")) return resolve();

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.id = "paypal-script";
    script.onload = resolve;
    document.body.appendChild(script);
  });
};
