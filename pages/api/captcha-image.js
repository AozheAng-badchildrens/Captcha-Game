// pages/api/captcha-image.js
import { getIronSession } from "iron-session";
import * as fs from "fs";
import * as path from "path";

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

const dogProbability = 0.5;

export function newCaptchaImages() {
  return new Array(9).fill(null).map(() => {
    const shouldBeDog = Math.random() < dogProbability;
    const number = Math.floor(Math.random() * (shouldBeDog ? 10 : 13)) + 1;
    const filename = (shouldBeDog ? "dog" : "muffin") + number + ".png";
    return `/dogs-and-muffins/${filename}`;
  });
}

export default async function handler(req, res) {
  const session = await getIronSession(req, res, sessionOptions);

  const index = parseInt(req.query.index);
  if (isNaN(index) || index < 0 || index > 8) {
    return res.status(400).send("Invalid index");
  }

  // Create a new set of images on first load
  if (!session.captchaImages) {
    session.captchaImages = newCaptchaImages();
    await session.save();
    return;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    session.captchaImages[index]
  );
  const imageBuffer = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "image/png");
  res.send(imageBuffer);
}
