import { Client, Environment, LogLevel } from "@paypal/paypal-server-sdk";
import dotenv from "dotenv";
import { ENV } from "./env.conf.js";
dotenv.config();

const clientId = ENV.PAYPAL_CLIENT_ID;
const clientSecret = ENV.PAYPAL_CLIENT_SECRET;

export const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: clientId,
    oAuthClientSecret: clientSecret,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});
