export function safeUrl(value) {
  try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; }
}
// Keep fragments, meaningful query parameters, protocol and path case: they can identify different content.
export function canonicalUrl(value) {
  const valid = safeUrl(value); if (!valid) return null;
  const u = new URL(valid);
  for (const key of [...u.searchParams.keys()]) if (/^utm_/i.test(key) || ['fbclid', 'gclid'].includes(key)) u.searchParams.delete(key);
  return u.href;
}
export function suggestTags(title, url, folder = '') {
  const text = `${title} ${url} ${folder}`.toLowerCase();
  const rules = {Design:/design|figma|typograph|dribbble|ux\b|interface/, Tecnologia:/github|developer|javascript|python|software|programa|react/, Leitura:/article|artigo|blog|medium|read|substack/, Vídeos:/youtube|vimeo|video|vídeo/, Pesquisa:/research|arxiv|paper|pesquisa|science/, Inspiração:/inspir|behance|pinterest|art\b/};
  return Object.entries(rules).filter(([, re]) => re.test(text)).map(([tag]) => tag);
}
export function importEntries(entries, existing = [], {restore = false} = {}) {
  const known = new Set(existing.map(x => canonicalUrl(x.url))); const added = []; let duplicates = 0, invalid = 0;
  for (const raw of entries) {
    const url = canonicalUrl(raw?.url);
    if (!url) { invalid++; continue; }
    if (known.has(url)) { duplicates++; continue; }
    known.add(url);
    const title = String(raw.title || new URL(url).hostname).slice(0, 500);
    const folder = String(raw.folder || '').slice(0, 300);
    added.push({ id: crypto.randomUUID(), url, title, folder, tags: Array.isArray(raw.tags) ? [...new Set(raw.tags.filter(x=>typeof x === 'string').map(x=>x.trim().slice(0,80)).filter(Boolean))].slice(0,20) : suggestTags(title, url, folder), status: restore && ['library','inbox','archive'].includes(raw.status) ? raw.status : 'inbox', note: String(raw.note || '').slice(0,5000), createdAt: new Date().toISOString() });
  }
  return { added, duplicates, invalid };
}
export function parseHtml(html, Parser = DOMParser) {
  const doc = new Parser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('a[href]')].map(a => {
    const folders = []; let dl = a.closest('dl');
    while (dl) { const title = dl.previousElementSibling; if(title?.tagName === 'H3') folders.unshift(title.textContent); else if (dl.parentElement?.tagName === 'DT') { const h = dl.parentElement.querySelector(':scope > h3'); if(h) folders.unshift(h.textContent); } dl = dl.parentElement?.closest('dl'); }
    return {title:a.textContent.trim(),url:a.getAttribute('href'),folder:folders.join(' / ')};
  });
}
export function flattenTree(nodes, path = []) {
  return nodes.flatMap(n => n.url ? [{title:n.title,url:n.url,folder:path.join(' / ')}] : flattenTree(n.children || [], n.title ? [...path,n.title] : path));
}
export function connections(items) {
  const edges=[];
  for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++) {
    const a=items[i],b=items[j], tags=a.tags.filter(t=>b.tags.includes(t));
    const domain=new URL(a.url).hostname === new URL(b.url).hostname;
    if(tags.length || domain) edges.push({source:a.id,target:b.id,reason:tags.length?tags.join(', '):new URL(a.url).hostname});
  }
  return edges;
}
