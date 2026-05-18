import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { config } from "dotenv";

config(); // load .env

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = "assets";
const FILE_PATH = "src/assets/mmi-logo.png";
const OBJECT_NAME = "mmi-logo.png";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Create bucket if it doesn't exist
const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
  public: true,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
});
if (bucketError && !bucketError.message.includes("already exists")) {
  console.error("Bucket error:", bucketError.message);
  process.exit(1);
}

// Upload the logo
const file = readFileSync(FILE_PATH);
const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(OBJECT_NAME, file, {
    contentType: "image/png",
    upsert: true,
  });

if (uploadError) {
  console.error("Upload error:", uploadError.message);
  process.exit(1);
}

// Get public URL
const { data } = supabase.storage.from(BUCKET).getPublicUrl(OBJECT_NAME);
console.log("\n✅ Logo uploaded successfully!");
console.log("Public URL:", data.publicUrl);
console.log("\nAdd this to your .env and .dev.vars:");
console.log(`LOGO_URL="${data.publicUrl}"`);
