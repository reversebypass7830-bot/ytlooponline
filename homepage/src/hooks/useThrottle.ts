import { useEffect, useRef, useState } from "react";
import useUnmount from "./useUnmount";

const useThrottle = <T>(value: T, ms: number = 200) => {
  const [state, setState] = useState<T>(value);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const nextValue = useRef<T>(value);
  const hasNextValue = useRef(false);

  useEffect(() => {
    if (timeout.current) {
      nextValue.current = value;
      hasNextValue.current = true;
    } else {
      setState(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setState(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = null;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
};

export default useThrottle;
