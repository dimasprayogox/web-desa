import { useState, useEffect, useRef } from "react";
import * as usersService from "../api/services/usersService";

export function useUsers({ params } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelTokenRef = useRef(null);

  useEffect(() => {
    // cancel previous request if any
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled due to new request.");
    }

    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersService.getUsers({ ...params, cancelToken: source.token });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel?.(err)) {
          // request cancelled
          console.log("request cancelled", err.message);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // cancel on unmount
      source.cancel("Component unmounted.");
    };
  }, [JSON.stringify(params)]); // hati-hati: stringify hanya untuk contoh; untuk objek besar gunakan stable deps

  return { data, loading, error, refetch: () => {/* could implement refetch logic */} };
}
