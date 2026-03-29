import {PgClient} from "@/db_connector/pgClient";
import {s3Client} from "@/storage_connector/s3Client";
import {GetPageResponse} from "@/types/pages";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const domainsParam = searchParams.get('domains');
    const domainFilter: string[] | null = domainsParam
        ? domainsParam.split(',').map((d) => d.trim()).filter(Boolean)
        : null;

    let domains: string[];
    if (domainFilter && domainFilter.length > 0) {
        domains = domainFilter;
    } else {
        const domainsQuery = "SELECT DISTINCT domain FROM pages";
        const domainsResult = await PgClient.query(domainsQuery);
        domains = domainsResult.rows.map((row) => row.domain);
    }

    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    const query = "SELECT url, s3_key FROM pages WHERE s3_key != 'NOT_CRAWLED' AND domain = $1 ORDER BY RANDOM() LIMIT 1";
    const queryResult = await PgClient.query(query, [randomDomain]);

    const url = queryResult.rows[0]?.url || null;
    const s3Key = queryResult.rows[0]?.s3_key || null;

    if (!url || !s3Key) {
        return new Response(JSON.stringify({error: 'Error when attempting to fetch a page'}), {
            headers: {'Content-Type': 'application/json'},
            status: 500,
        });
    }

    const signedUrl = await s3Client.getSignedUrl(s3Key);

    let minimizedSignedUrl = ""
    try {
        minimizedSignedUrl = await s3Client.getMinimizedSignedUrl(s3Key);
    } catch (error) {
        console.error(error);
        minimizedSignedUrl = "error";
    }

    const getPageResponse: GetPageResponse = {
        url: url,
        signedUrl: signedUrl,
        minimizedSignedUrl: minimizedSignedUrl,
        s3_key: s3Key
    }

    return new Response(JSON.stringify(getPageResponse), {
        headers: {'Content-Type': 'application/json'},
    });
}
