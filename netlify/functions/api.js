import serverless from "serverless-http";
import { createServer } from "../../dist/server/index.mjs";

const app = createServer();

export const handler = serverless(app);
