import { useState, useEffect } from "react";
import { getFromLocalStorage } from "../api/forms";

const useFetch = (key: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getFromLocalStorage(key) || [];
                setData(result);
                // console.log("Fetched data: ", result);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [key]);

    return { data, isLoading, error };
};

export default useFetch;