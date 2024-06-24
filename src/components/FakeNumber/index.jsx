import { useEffect, useState } from "react";

const FakeNumber = () => {
  const [random, setRandom] = useState();
  const [change, setChange] = useState();
  useEffect(() => {
    setRandom(Math.floor(Math.random() * 900) + 100);
  }, [change]);
  setInterval(() => {
    setChange(Math.random());
  }, 100);

  return <div>{random}</div>;
};

export default FakeNumber;
