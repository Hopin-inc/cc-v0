const { exec } = require("child_process");
const { loadEnvConfig } = require("@next/env");

const { NEXT_PUBLIC_SUPABASE_PROJECT_ID } = loadEnvConfig(
  process.cwd()
).combinedEnv;

const command = `npx supabase gen types typescript --project-id ${NEXT_PUBLIC_SUPABASE_PROJECT_ID} --schema public > types/supabase.ts`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.info(`stderr: ${stderr}`);
    return;
  }
  console.info(`stdout: ${stdout}`);
});
