import PocketBase from "../lib/pocketbase.es.mjs";
import { baseUrl } from "../config/apiConfig.js";

export const pb = new PocketBase(`${baseUrl}`);