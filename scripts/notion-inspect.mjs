const token = process.env.NOTION_API_KEY;
const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID;

async function notion(path, init = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2025-09-03',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json };
}

const page = await notion(`/pages/${rootPageId}`);
console.log('PAGE', JSON.stringify(page, null, 2));
const children = await notion(`/blocks/${rootPageId}/children?page_size=100`);
console.log('CHILDREN', JSON.stringify(children, null, 2));
const search = await notion('/search', { method: 'POST', body: JSON.stringify({ query: 'blog' }) });
console.log('SEARCH', JSON.stringify(search, null, 2));
