import './style.css';
import { marked } from 'marked';

document.querySelector('#year').textContent = new Date().getFullYear();

const files = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const dateFormat = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const posts = Object.entries(files).map(([path, source]) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Thiếu phần đầu Markdown: ${path}`);
  const metadata = Object.fromEntries(match[1].split(/\r?\n/).map((line) => {
    const separator = line.indexOf(':');
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  if (!metadata.title || !metadata.excerpt || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || Number.isNaN(Date.parse(metadata.date))) {
    throw new Error(`Phần đầu Markdown không hợp lệ: ${path}`);
  }
  return { ...metadata, slug: path.split('/').pop().replace(/\.md$/, ''), body: match[2] };
}).sort((a, b) => b.date.localeCompare(a.date));

const main = document.querySelector('main');
const postGrid = document.querySelector('.post-grid');
const normalizeSearch = (value) => value.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase('vi-VN').trim();
const search = document.createElement('div');
search.className = 'post-search';
search.innerHTML = '<label for="post-search">Tìm bài viết</label><input id="post-search" type="search" placeholder="Nhập tiêu đề hoặc mô tả…" aria-controls="post-results" /><p class="search-status" role="status" aria-live="polite"></p>';
postGrid.id = 'post-results';
postGrid.before(search);
function renderPosts(query = '') {
  const normalizedQuery = normalizeSearch(query);
  const matches = posts.filter((post) => normalizeSearch(`${post.title} ${post.excerpt}`).includes(normalizedQuery));
  postGrid.innerHTML = matches.map((post, index) => `
  <article class="post">
    <div class="post-meta"><span>HỌC AI TỪ ĐẦU</span><time datetime="${post.date}">${dateFormat.format(new Date(post.date))}</time></div>
    <h3><a href="#/bai/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
    <p>${escapeHtml(post.excerpt)}</p>
    <a class="text-link" href="#/bai/${encodeURIComponent(post.slug)}">Đọc bài viết <span aria-hidden="true">→</span></a>
    <span class="post-number">${String(index + 1).padStart(2, '0')} / HỌC MỖI NGÀY</span>
  </article>`).join('');
  search.querySelector('.search-status').textContent = matches.length ? (normalizedQuery ? `${matches.length} bài viết phù hợp` : '') : 'Chưa có bài phù hợp';
}
search.querySelector('input').addEventListener('input', (event) => renderPosts(event.target.value));
renderPosts();
document.querySelector('.section-heading > span').textContent = `${posts.length} ghi chép nhỏ`;
const home = document.createElement('div');
home.append(...main.childNodes);
main.append(home);
const articleView = document.createElement('section');
articleView.className = 'article-view';
articleView.hidden = true;
main.append(articleView);

function renderRoute() {
  const isArticle = location.hash.startsWith('#/');
  home.hidden = isArticle;
  articleView.hidden = !isArticle;
  document.title = 'Góc nhỏ của mình';
  if (!isArticle) return;
  let slug;
  try { slug = decodeURIComponent(location.hash.match(/^#\/bai\/([^/]+)$/)?.[1] ?? ''); } catch { slug = ''; }
  const post = posts.find((item) => item.slug === slug);
  articleView.innerHTML = '<a class="text-link" href="#bai-viet">← Quay lại danh sách bài viết</a>';
  if (post) {
    document.title = `${post.title} | Góc nhỏ của mình`;
    articleView.innerHTML += `<article><header><p class="eyebrow">HỌC AI TỪ ĐẦU</p><h1 tabindex="-1">${escapeHtml(post.title)}</h1><time datetime="${post.date}">${dateFormat.format(new Date(post.date))}</time><p class="article-excerpt">${escapeHtml(post.excerpt)}</p></header><div class="markdown-body">${marked.parse(post.body)}</div></article>`;
  } else {
    articleView.innerHTML += '<h1 tabindex="-1">Không tìm thấy bài viết</h1><p>Bài viết này không tồn tại. Bạn có thể quay lại để đọc những bài khác.</p>';
  }
  articleView.querySelector('h1').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
