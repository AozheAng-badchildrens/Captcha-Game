import Captcha from "@/components/Captcha";
import Timer from "@/components/Timer";
import { getIronSession } from "iron-session";
import { newCaptchaImages } from "./api/captcha-image";
import { useState } from "react";
import { useTimerStore } from "@/stores/timerStore";

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export default function Home({ defaultCaptchaKey }) {
  const [message, setMessage] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [captchaKey, setCaptchaKey] = useState(defaultCaptchaKey);
  function send() {
    fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        message,
        selectedIndexes,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json().then((json) => {
        if (json.sent) {
          setCaptchaKey(new Date().getTime());
          alert("Success");
          setMessage("");
          useTimerStore.getState().stop();
        }
        if (!json.captchaIsOk) {
          setCaptchaKey(new Date().getTime());
          // alert("wrong captcha. try again");
          useTimerStore.getState().flashColor("red", 1000);
        }
      });
    });
  }
  return (
    <main>
      <Timer></Timer>
      <Captcha captchaKey={captchaKey} onChange={setSelectedIndexes}></Captcha>
      <button onClick={send}>Send</button>
    </main>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getIronSession(req, res, sessionOptions);
  if (session.captchaImages.length === 0) {
    session.captchaImages = newCaptchaImages();
    await session.save();
  }
  return {
    props: {
      defaultCaptchaKey: new Date().getTime(),
    },
  };
}
