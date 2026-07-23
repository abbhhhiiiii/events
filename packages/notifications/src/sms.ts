export async function sendSmsOTP(
  mobile: string,
  code: string,
  forumSlug = "sme"
): Promise<void> {
  const apiKey = process.env.SMS_API_KEY;
  const gatewayUrl = process.env.SMS_GATEWAY_URL;

  const sender =
    forumSlug === "marathi-business-forum"
      ? process.env.SMS_SENDER_ID_MARATHI_BUSINESS_FORUM
      // : forumSlug === "rajasthan-business-forum"
      // ? process.env.SMS_SENDER_ID_RAJASTHAN_BUSINESS_FORUM
      // : forumSlug === "dubai-business-forum"
      // ? process.env.SMS_SENDER_ID_DUBAI_BUSINESS_FORUM
      : process.env.SMS_SENDER_ID;

  // Same Entity ID for all forums
  const entityId = process.env.SMS_ENTITY_ID;

  if (!apiKey || !sender || !entityId || !gatewayUrl) {
    throw new Error(
      "SMS config missing: SMS_GATEWAY_URL, SMS_API_KEY, SMS_SENDER_ID, SMS_ENTITY_ID"
    );
  }

  const normalised = mobile.replace(/^\+/, "");

  const message =
    forumSlug === "marathi-business-forum"
      ? `${code} is the OTP for the registration process for MIDAIN - Small and Medium Business Development Chamber of India`
      // : forumSlug === "rajasthan-business-forum"
      // ? `${code} is the OTP for the registration process for Rajasthan Business Forum`
      // : forumSlug === "dubai-business-forum"
      // ? `${code} is the OTP for the registration process for Dubai Business Forum`
      : `${code} is the OTP for the registration process - SMECHM`;


  const params = new URLSearchParams({
    apikey: apiKey,
    type: "TEXT",
    sender,
    entityId,
    mobile: normalised,
    message,
  });

  let res: Response;

  try {
    res = await fetch(`${gatewayUrl}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (err) {
    throw new Error(
      `SMS gateway unreachable: ${
        err instanceof Error ? err.message : err
      }`
    );
  }

  if (!res.ok) {
    throw new Error(
      `SMS gateway HTTP error: ${res.status} ${res.statusText}`
    );
  }

  const text = await res.text();

  if (/error/i.test(text) || text.startsWith("1002")) {
    throw new Error(`SMS gateway rejected: ${text}`);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[SMS] OTP sent to ${normalised} | response: ${text}`);
  }
}
