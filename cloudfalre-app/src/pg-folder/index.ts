import { Client } from 'pg';
import env from 'dotenv';
env.config();
// interface ClientConfig {
//   user?: string;
//   password?: string;
//   host?: string;
//   port?: number;
//   database?: string;
// }
// create a new Client instance using explicit parameters
export const getClient = (databaseUrl: string) => {
  return new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Cloudflare often requires SSL
    },
  });
};
