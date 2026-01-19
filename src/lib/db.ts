import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
    // Warn instead of throw to allow build to pass without env vars
    console.warn("DATABASE_URL missing - DB calls will fail");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export async function query(sql: string, params: any[] = []) {
    const client = await pool.connect();
    try {
        return await client.query(sql, params);
    } finally {
        client.release();
    }
}

export default pool;
