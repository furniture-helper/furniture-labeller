import {useEffect, useState} from 'react';
import {GetPageResponse} from "@/types/pages";

export default function usePage() {
    const [data, setData] = useState<GetPageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await fetch('/api/pages');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    return {data, loading, error};
}
