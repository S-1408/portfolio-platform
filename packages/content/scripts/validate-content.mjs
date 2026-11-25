// Build-time content check. Kept out of the library so importing
// @repo/content never runs zod (or ships it to the browser).
import { parsePortfolioContent } from "../dist/validate.js";

parsePortfolioContent();
