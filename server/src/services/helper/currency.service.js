import axios from "axios";
import { Decimal } from "decimal.js";
import { ENV } from "../../config/envConfig.js";

const FALLBACK_RATE = 92.0;

export const fetchRealTimeRate = async (targetCurrency = "INR") => {
  const API_KEY = ENV.CURRENCY_API_KEY;
  const URL = ENV.OPEN_EXCHANGES_RATE_URL;

  try {
    const response = await axios.get(URL, {
      params: {
        app_id: API_KEY,
        symbols: targetCurrency,
      },
      timeout: 5000,
    });

    const rate = response.data?.rates?.[targetCurrency];

    if (rate && rate > 0) {
      return new Decimal(rate);
    }

    throw new Error("API returned invalid rate data.");
  } catch (error) {
    console.error(
      `🚨 Currency API Failure: Using Fallback Rate of ${FALLBACK_RATE}`
    );
    return new Decimal(FALLBACK_RATE);
  }
};
