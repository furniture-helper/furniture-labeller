import {PgClient} from "@/db_connector/pgClient";
import {GetPagePredictionResponse} from "@/types/pages";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const url = searchParams.get('url');

    const query = `SELECT type
                   FROM page_classifications
                   WHERE url = $1`;
    const values = [url];
    const queryResult = await PgClient.query(query, values);

    const pageType = queryResult.rows[0]?.type || null;
    const getPagePredictionResponse: GetPagePredictionResponse = {
        type: pageType,
    }

    if (pageType == "product") {
        const query = `SELECT product_title, product_price
                       FROM page_inferred_labels
                       WHERE url = $1;`
        const values = [url];
        const queryResult = await PgClient.query(query, values);

        const title = queryResult.rows[0]?.product_title || null;
        const price = queryResult.rows[0]?.product_price || null;

        getPagePredictionResponse.title = title;
        getPagePredictionResponse.price = price;
    }

    if (!pageType) {
        return new Response(JSON.stringify({error: 'Error when attempting to fetch a page type'}), {
            headers: {'Content-Type': 'application/json'},
            status: 500,
        });
    }
    
    return new Response(JSON.stringify(getPagePredictionResponse), {
        headers: {'Content-Type': 'application/json'},
    });
}
