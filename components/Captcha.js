import React, { useEffect } from "react";
import { useState } from "react";

const Captcha = ({ onChange, captchaKey }) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  useEffect(() => {
    onChange(selectedIndexes);
  }, [selectedIndexes]);
  useEffect(() => {
    setSelectedIndexes([]);
  }, [captchaKey]);
  const imageLocations = new Array(9).fill(null).map((undefined, index) => {
    return `/api/captcha-image?index=${index}.png&key=${captchaKey}`;
  });
  function toggleIndex(index) {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((v) => v !== index);
      } else {
        return [...prev, index];
      }
    });
  }
  return (
    <div className="captcha">
      <h2>Select All dogs:</h2>
      <div className="captcha-images">
        {imageLocations.map((imageUrl, index) => (
          <div
            onClick={() => toggleIndex(index)}
            className={selectedIndexes.includes(index) ? "selected" : ""}
          >
            <img src={imageUrl} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Captcha;
