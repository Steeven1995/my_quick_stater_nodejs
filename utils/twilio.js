const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const verifySid = process.env.VERIFY_ID || "";

const client = require("twilio")(accountSid, authToken);

function sendsms(phone) {
  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: "sms" })
    .then((verification) => { return verification.sid })
    .catch((error) => {return error});
}

async function verifyPhone(otpCode , phone) {
  try {
    const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code: otpCode,
    });

    console.log(verificationCheck.status);

    return verificationCheck.status === 'approved';

  } catch (error) {
    console.error(error);
    return false;
  }
}


module.exports = {sendsms, verifyPhone};