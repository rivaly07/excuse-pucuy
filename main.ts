import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputPath = `${outputDir}/entry.txt`;

mkdirSync(outputDir, { recursive: true });

const excuse =
  "I wrote the perfect excuse. The tokenizer ate it and burped 200 tokens of apology.";

writeFileSync(outputPath, excuse, "utf-8");
console.log(`Wrote ${excuse.length} chars to ${outputPath}`);