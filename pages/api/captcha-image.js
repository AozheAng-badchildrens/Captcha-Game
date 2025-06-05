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
  const dogUsed = new Set();
  const muffinUsed = new Set();

  const generateUniqueNumber = (usedSet, max) => {
    if (usedSet.size >= max) return null; // all numbers used
    let number;
    do {
      number = Math.floor(Math.random() * max) + 1;
    } while (usedSet.has(number));
    usedSet.add(number);
    return number;
  };

  return new Array(9).fill(null).map(() => {
    const shouldBeDog = Math.random() < dogProbability;

    if (shouldBeDog) {
      const number = generateUniqueNumber(dogUsed, 10); // dog1.png to dog10.png
      return number === null ? null : `/dogs-and-muffins/dog${number}.png`;
    } else {
      const number = generateUniqueNumber(muffinUsed, 13); // muffin1.png to muffin13.png
      return number === null ? null : `/dogs-and-muffins/muffin${number}.png`;
    }
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
