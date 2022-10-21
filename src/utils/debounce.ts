import React from "react";

function useDebounce<T>(
  initialData: T,
  callBackFunction: (data: T) => void,
  delay: number
): [data: T, updateData: (data: T) => void] {
  const [timeoutRef, setTimeoutRef] = React.useState<NodeJS.Timeout>();
  const [data, setData] = React.useState<T>(initialData);
  function update(d: T) {
    setData(d);
    clearTimeout(timeoutRef);
    const timeout = setTimeout(() => {
      callBackFunction(data);
    }, delay);
    setTimeoutRef(timeout);
  }
  return [data, update];
}

export default useDebounce;
