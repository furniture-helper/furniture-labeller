import {PgClient} from "@/db_connector/pgClient";
import {s3Client} from "@/storage_connector/s3Client";
import {GetPageResponse} from "@/types/pages";

export async function GET() {

    const query = "SELECT url, s3_key FROM pages WHERE s3_key IS NOT 'NOT_CRAWLED' ORDER BY RANDOM() LIMIT 1";
    const queryResult = await PgClient.query(query);

    const url = queryResult.rows[0]?.url || null;
    const s3Key = queryResult.rows[0]?.s3_key || null;

    if (!url || !s3Key) {
        return new Response(JSON.stringify({error: 'Error when attempting to fetch a page'}), {
            headers: {'Content-Type': 'application/json'},
            status: 500,
        });
    }

    const signedUrl = await s3Client.getSignedUrl(s3Key);
    const getPageResponse: GetPageResponse = {
        url: url,
        signedUrl: signedUrl,
        s3_key: s3Key
    }

    return new Response(JSON.stringify(getPageResponse), {
        headers: {'Content-Type': 'application/json'},
    });
}
