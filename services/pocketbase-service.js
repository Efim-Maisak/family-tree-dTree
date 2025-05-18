import PocketBase from "../lib/pocketbase.es.js";
import { baseUrl } from "../config/apiConfig.js";

export const pb = new PocketBase(`${baseUrl}`);