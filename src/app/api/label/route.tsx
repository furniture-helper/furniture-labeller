import {PageLabelRequest} from "@/types/labeller";
import {PgClient} from "@/db_connector/pgClient";
import {s3Client} from "@/storage_connector/s3Client";

export async function POST(request: Request) {
    const payload: PageLabelRequest = await request.json();

    if (payload.otherBrand) {
        console.log("Inserting new brand:", payload.otherBrand);
        const insertBrandQuery = `
            INSERT INTO brands (name)
            VALUES ($1)
            RETURNING id
        `;
        const {rows} = await PgClient.query(insertBrandQuery, [payload.otherBrand]);
        payload.brandId = rows[0].id;
        console.log("Inserted brand:", payload.brandId);
    }

    const pageHtml = await s3Client.getObject(payload.s3_key);

    const insertLabelQuery = `
        INSERT INTO page_labels (url, content, type, product_title, product_image, product_price, brand_id, in_stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await PgClient.query(insertLabelQuery, [
        payload.pageUrl,
        pageHtml,
        payload.pageType,
        payload.productTitle || null,
        payload.productImage || null,
        payload.productPrice || null,
        payload.brandId || null,
        payload.inStock !== undefined ? payload.inStock : null,
    ]);

    return new Response(JSON.stringify({success: true}), {
        headers: {"Content-Type": "application/json"},
    });
}