import {PgClient} from "@/db_connector/pgClient";
import {Brand} from "@/types/brands";

export async function GET() {

    const query = "SELECT id, name FROM brands";
    const queryResult = await PgClient.query(query);

    const brands: Brand[] = queryResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
    }));

    return new Response(JSON.stringify(brands), {
        headers: {'Content-Type': 'application/json'},
    });
}
