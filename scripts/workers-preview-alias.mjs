const candidates = [
  process.env.WORKERS_CI_BRANCH,
  process.env.CF_PAGES_BRANCH,
  process.env.GITHUB_HEAD_REF,
  process.env.GITHUB_REF_NAME,
  process.env.BRANCH,
  process.env.CI_COMMIT_REF_NAME,
].filter(Boolean);

const source = String(candidates[0] ?? "local-preview").toLowerCase();

let alias = source
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/-+/g, "-");

if (!alias) {
  alias = "preview";
}

if (!/^[a-z]/.test(alias)) {
  alias = `a-${alias}`;
}

// Conservative limit to keep preview aliases short and predictable.
if (alias.length > 48) {
  alias = alias.slice(0, 48).replace(/-+$/g, "");
}

process.stdout.write(alias);
