"use client";

import usePage from "@/hooks/usePageHook";
import PageLabeller from "@/components/custom/page_labeller";

export default function LabelPage() {
    const {data, loading, error} = usePage([
        "homelux.lk",
        "bigdeals.lk",
        "strong.lk",
        "mysoftlogic.lk",
        "ugreen.lk",
        "buyabans.com",
        "singhagiri.lk",
        "pettahkade.lk",
        "finez.lk",
        "raesl.lk",
        "damro.lk",
        "fireworks.lk",
        "nanotek.lk",
        "simplytek.lk",
    ]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const signedUrl = data?.signedUrl || 'N/A';
    const minimizedSignedUrl = data?.minimizedSignedUrl || 'N/A';
    const scale = 1;

    return (
        <div className="flex flex-row h-screen p-5 space-x-10">
            <div className="flex flex-row w-full overflow-hidden rounded-md border-2 border-slate-700">
                <iframe
                    className="rounded-md"
                    src={signedUrl}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: `${50 / scale}%`,
                        height: `${100 / scale}%`,
                    }}
                />
                <iframe
                    className="rounded-md"
                    src={minimizedSignedUrl}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: `${50 / scale}%`,
                        height: `${100 / scale}%`,
                    }}
                />
            </div>

            <PageLabeller pageUrl={data!.url} s3_key={data!.s3_key}/>
        </div>
    );
}