import {useEffect, useState} from 'react';
import {GetPagePredictionResponse} from "@/types/pages";

export default function usePagePrediction(pageUrl: string) {
    const [data, setData] = useState<GetPagePredictionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPagePrediction = async () => {
            try {
                const url = new URL('/api/pages/predict', window.location.origin);
                url.searchParams.set('url', pageUrl);
                const response = await fetch(url.toString());
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result: GetPagePredictionResponse = await response.json();
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
        if (pageUrl) fetchPagePrediction();
    }, [pageUrl]);

    return {data, loading, error};
}
