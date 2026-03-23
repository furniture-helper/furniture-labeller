import {useEffect, useState} from 'react';
import {GetPageResponse} from "@/types/pages";

export default function usePage(domains?: string[]) {
    const [data, setData] = useState<GetPageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const domainsKey = domains ? domains.join(',') : '';

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const url = new URL('/api/pages', window.location.origin);
                if (domainsKey) {
                    url.searchParams.set('domains', domainsKey);
                }
                const response = await fetch(url.toString());
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
    }, [domainsKey]);

    return {data, loading, error};
}
