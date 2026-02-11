import {Pool} from 'pg';

const HOST = process.env.PG_HOST || 'localhost';
const PORT = process.env.PG_PORT || '5432';
const USER = process.env.PG_USER || 'postgres';
const PASSWORD = process.env.PG_PASSWORD || 'password';
const DATABASE = process.env.PG_DATABASE || 'postgres';

export class PgClient {

    private static pool: Pool | null = null;

    static async query(text: string, params?: (string | number | boolean | null)[]) {
        const pool = await PgClient.connect();
        return pool.query(text, params);
    }

    private static async connect() {
        if (!PgClient.pool) {
            PgClient.pool = new Pool({
                host: HOST,
                port: parseInt(PORT, 10),
                user: USER,
                password: PASSWORD,
                database: DATABASE,
                ssl: process.env.DISABLE_DB_SSL == 'true' ? false : {rejectUnauthorized: false},
            });
        }
        return PgClient.pool;
    }
}