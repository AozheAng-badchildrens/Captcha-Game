import { getIronSession } from "iron-session";
import { newCaptchaImages } from "./captcha-image";
const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export default async function handler(req, res) {
  const session = await getIronSession(req, res, sessionOptions);
  const { message, selectedIndexes } = req.body;
  const dogsIndexes = session.captchaImages
    .map((path, index) => {
      return path.includes("/dogs-and-muffins/dog") ? index : -1;
    })
    .filter((index) => index >= 0);

  const captchaIsOk =
    JSON.stringify(dogsIndexes) === JSON.stringify(selectedIndexes.sort());

  session.captchaImages = newCaptchaImages();
  await session.save();

  // send
  const sent = captchaIsOk;

  // send for real
  res.json({
    captchaIsOk,
    sent,
  });
}
