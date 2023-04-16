import { useState, useCallback, useEffect } from "react";
import InputWritten from "../components/common/forms-elements/InputWritten";

const TestHooks: React.FC = () => {
  const [test, settest] = useState("");

  const callback1 = (a: any) => {
    console.log("cb1", a);
  };

  const callback2 = useCallback(
    (a: any) => {
      console.log("cb2", a);
    },
    [test]
  );

  const callback3 = useCallback(
    (a: any) => {
      console.log("cb3", a);
    },
    [test]
  );

  const callback4 = useCallback((a: any) => {
    console.log("cb4", a);
  }, []);

  const callback5 = useCallback(
    (a: any) => {
      console.log("cb5", a, test);
    },
    [test]
  );

  //   useEffect(() => {
  //     [callback1, callback2, callback3, callback4].forEach((c, i) => {
  //       const when = c["when"];

  //       if (!when) {
  //         c["when"] = new Date().toLocaleTimeString();
  //       }
  //       //   console.log(i + 1, "  ", c["when"]);
  //       //   console.log(c);
  //     });

  //     // console.log();
  //   }, [test]);

  useEffect(() => {
    console.log("effect0");
  }, [test]);

  //   useEffect(() => {
  //     console.log("effect1");
  //     callback1(test);
  //   }, [test]);

  //   useEffect(() => {
  //     console.log("effect2");
  //     callback2(test);
  //   }, [test]);

  //   useEffect(() => {
  //     console.log("effect3");
  //     callback3(test);
  //   }, [callback3]);

  // useEffect(() => {
  //   console.log("effect4");
  //   callback4(test);
  // }, [test]);

  //   useEffect(() => {
  //     console.log("effect5");
  //   }, [callback5, test]);

  useEffect(() => {
    console.log("effect6");
    callback5(test);
  }, [callback5, test]);

  return (
    <>
      <InputWritten
        type="text"
        name="test"
        onChange={(e) => settest(e.target.value)}
        label="test"
        value={test}
      />
    </>
  );
};

export default TestHooks;

// useEffect0: with dependency on 'test' - without calling callback - does not trigger any callback.x
// useEffect1: with dependency on 'test' - triggers only callback1
// useEffect2: with dependency on 'test' - triggers only callback2

// useEffect3: with dependency on 'callback3' - triggers only callback 3
// useEffect4: with dependency on 'callback4' - indeed React is not re-creating it every render, yet its params are updated when 'test' changes inside useEffect4.
// useEffect5: with dependency on 'callback5' and 'test' - does not trigget any callback.
// useEffect6: with dependency on 'callback5' and 'test' - triggers only callback 5
