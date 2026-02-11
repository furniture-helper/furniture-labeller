import {useEffect, useState} from 'react';
import {Brand} from "@/types/brands";

export default function useBrands() {
    const [brands, setBrands] = useState<Brand[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const response = await fetch('http://localhost:3000/api/brands');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result: Brand[] = await response.json();

                result.sort((a, b) => a.name.localeCompare(b.name));

                result.push({
                    id: -1,
                    name: 'Other',
                })
                setBrands(result);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
            setLoading(false);
        }

        fetchBrands();
    }, [])

    return {brands, loading, error};
}
