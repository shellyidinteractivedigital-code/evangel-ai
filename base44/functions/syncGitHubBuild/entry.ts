import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const GH_API = "https://api.github.com";
const MAX_FILES = 100;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file for bundled Scripture corpora
const MAX_MESSAGE = 1000;

// GitHub owner/org login: alphanumeric + hyphens, 1-39 chars
const OWNER_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/;
// Repo name: letters, digits, . _ -, 1-100 chars
const REPO_RE = /^[a-zA-Z0-9._-]{1,100}$/;
// Branch / ref name: git ref-safe characters
const BRANCH_RE = /^(?!.*\/$)(?!.*\/\.\/)[a-zA-Z0-9._/-]{1,255}$/;

function bad(message) {
  return Response.json({ error: message }, { status: 400 });
}

async function gh(token, method, path, body) {
  const res = await fetch(`${GH_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { /* non-json */ }
  return { status: res.status, data };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body) return bad('Invalid JSON body');

    const { repoOwner, repoName, branch = 'main', commitMessage, files = [] } = body;

    if (!repoOwner || !OWNER_RE.test(repoOwner)) return bad('Invalid repoOwner');
    if (!repoName || !REPO_RE.test(repoName)) return bad('Invalid repoName');
    if (!branch || !BRANCH_RE.test(branch)) return bad('Invalid branch');
    if (!commitMessage || typeof commitMessage !== 'string') return bad('commitMessage required');
    if (commitMessage.length > MAX_MESSAGE) return bad(`commitMessage too long (max ${MAX_MESSAGE})`);
    if (!Array.isArray(files) || files.length === 0) return bad('files array required');
    if (files.length > MAX_FILES) return bad(`Too many files (max ${MAX_FILES})`);

    // Normalize + validate each file entry
    const entries = [];
    for (const f of files) {
      if (!f || typeof f.path !== 'string' || !f.path) return bad('Each file needs a path');
      if (f.path.length > 500) return bad(`Path too long: ${f.path}`);
      if (f.path.includes('..') || f.path.startsWith('/')) return bad(`Invalid path: ${f.path}`);
      const encoding = f.encoding === 'base64' ? 'base64' : 'utf-8';
      let content = f.content ?? f.contentBase64;
      if (typeof content !== 'string') return bad(`Missing content for ${f.path}`);
      // Rough size guard (base64 length approximates bytes for our limits)
      if (content.length > MAX_FILE_BYTES) return bad(`File too large: ${f.path}`);
      entries.push({ path: f.path, content, encoding });
    }

    // Use the app builder's shared GitHub connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');
    if (!accessToken) return Response.json({ error: 'GitHub not connected' }, { status: 500 });

    const repoPath = `/repos/${repoOwner}/${repoName}`;

    // 1. Resolve current branch ref (may not exist on a fresh/empty repo)
    let parentSha = null;
    let baseTreeSha = null;
    const refRes = await gh(accessToken, 'GET', `/git/refs/heads/${encodeURIComponent(branch)}`);
    if (refRes.status === 200 && refRes.data && refRes.data.object) {
      parentSha = refRes.data.object.sha;
      const commitRes = await gh(accessToken, 'GET', `/git/commits/${parentSha}`);
      if (commitRes.status === 200 && commitRes.data && commitRes.data.tree) {
        baseTreeSha = commitRes.data.tree.sha;
      }
    } else if (refRes.status !== 404) {
      return Response.json({ error: `Could not read branch ref: ${refRes.status}`, details: refRes.data }, { status: 502 });
    }

    // 2. Create a blob per file
    const treeEntries = [];
    for (const e of entries) {
      const blobRes = await gh(accessToken, 'POST', '/git/blobs', {
        content: e.content,
        encoding: e.encoding,
      });
      if (blobRes.status !== 201 || !blobRes.data || !blobRes.data.sha) {
        return Response.json({ error: `Blob create failed for ${e.path}`, details: blobRes.data }, { status: 502 });
      }
      treeEntries.push({ path: e.path, mode: '100644', type: 'blob', sha: blobRes.data.sha });
    }

    // 3. Build a tree on top of the base tree (if any)
    const treeBody = { tree: treeEntries };
    if (baseTreeSha) treeBody.base_tree = baseTreeSha;
    const treeRes = await gh(accessToken, 'POST', '/git/trees', treeBody);
    if (treeRes.status !== 201 || !treeRes.data || !treeRes.data.sha) {
      return Response.json({ error: 'Tree create failed', details: treeRes.data }, { status: 502 });
    }
    const treeSha = treeRes.data.sha;

    // 4. Create the commit
    const commitBody = { message: commitMessage, tree: treeSha };
    if (parentSha) commitBody.parents = [parentSha];
    const commitRes = await gh(accessToken, 'POST', '/git/commits', commitBody);
    if (commitRes.status !== 201 || !commitRes.data || !commitRes.data.sha) {
      return Response.json({ error: 'Commit create failed', details: commitRes.data }, { status: 502 });
    }
    const commitSha = commitRes.data.sha;

    // 5. Fast-forward the branch ref (or create it if it didn't exist)
    let refUpdate;
    if (parentSha) {
      refUpdate = await gh(accessToken, 'PATCH', `/git/refs/heads/${encodeURIComponent(branch)}`, { sha: commitSha });
    } else {
      refUpdate = await gh(accessToken, 'POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commitSha });
    }
    if ((refUpdate.status !== 200 && refUpdate.status !== 201) || !refUpdate.data) {
      return Response.json({ error: 'Ref update failed', commitSha, details: refUpdate.data }, { status: 502 });
    }

    return Response.json({
      ok: true,
      commitSha,
      commitUrl: `https://github.com/${repoOwner}/${repoName}/commit/${commitSha}`,
      branch,
      files: entries.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}