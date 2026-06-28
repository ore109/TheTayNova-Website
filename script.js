document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,' + btoa('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5efe6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b6475" font-family="Inter" font-size="16">Image</text></svg>');
  });
});

// Global resource error watcher — helps surface 404s and missing assets
function showResourceError(url, type){
  console.warn('Resource failed to load:', type, url);
  try{ if(window.__lastResourceErrorTimeout) clearTimeout(window.__lastResourceErrorTimeout); }catch(e){}
  let badge = document.getElementById('resource-error-badge');
  if(!badge){
    badge = document.createElement('div'); badge.id = 'resource-error-badge';
    badge.style.cssText = 'position:fixed;right:1rem;bottom:1rem;background:#111;color:#fff;padding:.6rem .9rem;border-radius:8px;z-index:99999;font-size:13px;max-width:320px;box-shadow:0 6px 18px rgba(0,0,0,0.4)';
    const close = document.createElement('button'); close.textContent='×'; close.style.cssText='background:transparent;border:none;color:#fff;font-weight:800;float:right;margin-left:8px;font-size:16px'; close.onclick=()=>badge.remove(); badge.appendChild(close);
    const txt = document.createElement('div'); txt.id='resource-error-text'; txt.style.cssText='margin-right:18px'; badge.appendChild(txt);
    document.body.appendChild(badge);
  }
  const txt = document.getElementById('resource-error-text'); if(txt) txt.textContent = `${type}: ${url}`;
  window.__lastResourceErrorTimeout = setTimeout(()=>{ badge.remove(); }, 10000);
}

window.addEventListener('error', function(e){
  const t = e.target || e.srcElement;
  if(t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.tagName === 'SCRIPT' || t.tagName === 'LINK')){
    const url = t.currentSrc || t.src || t.href || '(unknown)';
    showResourceError(url, t.tagName);
  }
}, true);

window.addEventListener('unhandledrejection', function(ev){
  console.warn('Unhandled promise rejection:', ev.reason);
});

// PAGE SIZE FOR PAGINATION
const PAGE_SIZE = 12;
let blogPage = 1;
let shopPage = 1;
let ebookPage = 1;

const siteHeader = document.querySelector('.site-header');
const headerInner = document.querySelector('.header-inner');
const primaryNav = document.querySelector('.nav-primary');

if (siteHeader && headerInner && primaryNav) {
  const mobileToggle = document.createElement('button');
  mobileToggle.type = 'button';
  mobileToggle.className = 'mobile-nav-toggle';
  mobileToggle.setAttribute('aria-label', 'Open navigation menu');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.innerHTML = '<span></span><span></span><span></span>';

  const mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'mobile-nav-overlay';

  const mobileSidebar = document.createElement('aside');
  mobileSidebar.className = 'mobile-nav-sidebar';
  mobileSidebar.setAttribute('aria-label', 'Mobile navigation');

  const navLinks = Array.from(primaryNav.querySelectorAll('a'));
  const preferredLinks = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'shop.html', label: 'Shop Finds' },
    { href: 'ebooks.html', label: 'Ebooks' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'content.html', label: 'Content' },
    { href: 'inspiration.html', label: 'Inspiration Gallery' },
    { href: 'collab.html', label: 'Work With TayNova' }
  ];

  const mobileNavItems = preferredLinks
    .map((item) => {
      const matchingLink = navLinks.find((link) => link.getAttribute('href') === item.href);
      return matchingLink ? `<li><a href="${matchingLink.getAttribute('href')}">${item.label}</a></li>` : '';
    })
    .join('');

  const footerSocialList = document.querySelector('.footer-social ul');
  const sidebarSocial = footerSocialList ? footerSocialList.cloneNode(true).outerHTML : '';

  mobileSidebar.innerHTML = `
    <div class="mobile-nav-head">
      <a href="index.html" class="brand-logo-link">
        <div class="brand-lockup">
          <img src="/assets/images/logo/logo.png" alt="TayNova Logo" class="brand-logo">
          <h2 class="brand-name">TayNova</h2>
        </div>
      </a>
      <button type="button" class="mobile-nav-close" aria-label="Close navigation menu">&times;</button>
    </div>
    <nav class="mobile-nav-panel" aria-label="Mobile primary navigation">
      <ul>${mobileNavItems}</ul>
    </nav>
    <div class="mobile-nav-foot">
      ${sidebarSocial}
      <p>Simple Style. Cozy Spaces. Smart Finds.</p>
    </div>
  `;

  headerInner.appendChild(mobileToggle);
  document.body.append(mobileOverlay, mobileSidebar);

  const mobileClose = mobileSidebar.querySelector('.mobile-nav-close');
  const mobileSidebarLinks = mobileSidebar.querySelectorAll('a');

  function openMobileNav() {
    document.body.classList.add('mobile-nav-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileClose.focus();
  }

  function closeMobileNav() {
    document.body.classList.remove('mobile-nav-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle.addEventListener('click', openMobileNav);
  mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);
  mobileSidebarLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') === '#') return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Data arrays removed. Data will be fetched from Supabase at runtime.
let blogPosts = [];

async function fetchBlogs() {
  try {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

const blogGrid = document.getElementById('blog-list');
const searchInput = document.getElementById('blog-search-input');
const blogFilterButtons = document.querySelectorAll('#blog-search .filter-pill');
const blogEmpty = document.getElementById('blog-empty');
const blogDetailSection = document.getElementById('blog-detail');
const blogBackButton = document.getElementById('blog-back');
const detailTitle = document.getElementById('detail-title');
const detailCategory = document.getElementById('detail-category');
const detailExcerpt = document.getElementById('detail-excerpt');
const detailImage = document.getElementById('detail-image');
const detailContent = document.getElementById('detail-content');
const detailLinks = document.getElementById('detail-links');

function renderBlogCards(posts) {
  if (!blogGrid) return;
  blogGrid.innerHTML = '';

  if (posts.length > PAGE_SIZE * blogPage) {
    const seeMore = document.createElement('div');
    seeMore.style.textAlign = 'center';
    seeMore.style.marginTop = '2rem';
    seeMore.innerHTML = `<button class="btn btn-primary" onclick="blogPage++;renderBlogCards(blogPosts)">See More</button>`;
    blogGrid.after(seeMore);
  }

  blogEmpty.classList.add('hidden');

  // Helper to build a detail URL relative to the current folder
  function buildDetailUrl(page, id) {
    const base = location.origin + location.pathname.replace(/\/[^\/]*$/, '/');
    return base + `${page}?id=${encodeURIComponent(id)}`;
  }

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    const detailPath = buildDetailUrl('blog-post.html', post.id);
    card.innerHTML = `
      <img src="${post.cover_url || ''}" alt="${post.title}" onerror="this.outerHTML='<div class=&quot;image-placeholder&quot;>Image coming soon</div>';">
      <h3>${post.title}</h3>
      <p>${post.short_description || ''}</p>
      <div class="card-actions">
        <a class="btn btn-read" href="${detailPath}">Read More</a>
      </div>
    `;

    // Navigate when clicking the card (but allow buttons/links to handle their own actions)
    card.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button') return;
      if (tag === 'a') return;
      window.location.href = detailPath;
    });

    const shareBtn = card.querySelector('.btn-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = shareBtn.dataset.url;
        await shareLink(url);
      });
    }

    blogGrid.appendChild(card);
  });
}

// Share helper: uses Web Share API if available, otherwise falls back to clipboard
async function shareLink(url) {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const toast = document.createElement('div');
  toast.textContent = '🔗 Link copied!';
  toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#7c3aed;color:#fff;padding:0.75rem 1.25rem;border-radius:999px;font-weight:700;z-index:9999;font-size:0.9rem;animation:fadeIn 0.3s ease';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function getActiveCategory() {
  const active = document.querySelector('.filter-pill.active');
  return active ? active.dataset.category : 'All';
}

function filterBlogPosts() {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = getActiveCategory();

  const filtered = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchValue) || (post.short_description || '').toLowerCase().includes(searchValue);
    const matchesCategory = category === 'All' || post.category === category;
    return matchesSearch && matchesCategory;
  });

  renderBlogCards(filtered);
}

// Detail navigation handled on separate detail pages (no in-page modals)

if (blogGrid && searchInput) {
  (async () => {
    blogPosts = await fetchBlogs();
    await loadBlogCategories();
    renderBlogCards(blogPosts);
    searchInput.addEventListener('input', filterBlogPosts);
    blogFilterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        blogFilterButtons.forEach((buttonToReset) => buttonToReset.classList.remove('active'));
        button.classList.add('active');
        filterBlogPosts();
      });
    });
  })();
}

if (blogBackButton) blogBackButton.addEventListener('click', () => window.location.href = 'blog.html');


if (document.body.classList.contains('inspo-page')) {
  const inspoToggleButtons = document.querySelectorAll('.view-toggle .toggle-pill');
  const creativeView = document.getElementById('creative-view');
  const sanctuaryView = document.getElementById('sanctuary-view');
  const inspoMediaGrid = document.getElementById('inspo-media-grid');
  const inspoEmpty = document.getElementById('inspo-empty');
  const sanctuaryGrid = document.getElementById('sanctuary-grid');
  const sanctuaryDetail = document.getElementById('sanctuary-detail');
  const sanctuaryResultTitle = document.getElementById('sanctuary-result-title');
  const sanctuaryResultInfo = document.getElementById('sanctuary-result-info');
  const sanctuaryResults = document.getElementById('sanctuary-results');
  const sanctuaryBack = document.getElementById('sanctuary-back');
  const activeFiltersWrap = document.getElementById('active-filters');
  const filterSummary = document.getElementById('filter-summary');
  const clearFiltersButton = document.getElementById('clear-filters');
  const inspoFilterSelects = document.querySelectorAll('.inspo-filters select');

  // Hardcoded items (kept as fallback)
  const inspoMediaItems = [
    { id: 'loft-glow', title: 'Loft Glow', type: 'image', src: '/assets/images/inspo/1.jpg', style: 'Modern', style_tags: ['Modern'], room: 'Living Room', room_tags: ['Living Room'], category: 'Decor', category_tags: ['Decor'], sanctuary: 'Warm Minimal Living', link: '/assets/images/inspo/1.jpg' },
    { id: 'cozy-bedroom', title: 'Cozy Bedroom Mood', type: 'image', src: '/assets/images/inspo/12.png', style: 'Boho', style_tags: ['Boho'], room: 'Bedroom', room_tags: ['Bedroom'], category: 'Lighting', category_tags: ['Lighting'], sanctuary: 'Rest & Reset Bedrooms', link: '/assets/images/inspo/12.png' },
    { id: 'minimal-kitchen', title: 'Minimal Kitchen Edit', type: 'image', src: '/assets/images/inspo/14.png', style: 'Minimal', style_tags: ['Minimal'], room: 'Kitchen', room_tags: ['Kitchen'], category: 'Layout', category_tags: ['Layout'], sanctuary: 'Cozy Kitchen Sanctuaries', link: '/assets/images/inspo/14.png' },
    { id: 'boho-luxe', title: 'Boho Luxe Living', type: 'image', src: '/assets/images/inspo/15.png', style: 'Boho', style_tags: ['Boho'], room: 'Living Room', room_tags: ['Living Room'], category: 'Decor', category_tags: ['Decor'], sanctuary: 'Warm Minimal Living', link: '/assets/images/inspo/15.png' },
    { id: 'modern-office', title: 'Modern Office Flow', type: 'image', src: '/assets/images/inspo/2.png', style: 'Luxury', style_tags: ['Luxury'], room: 'Office', room_tags: ['Office'], category: 'Organization', category_tags: ['Organization'], sanctuary: 'Feminine Workspace', link: '/assets/images/inspo/2.png' },
    { id: 'sunny-lounge', title: 'Japandi Lounge', type: 'image', src: '/assets/images/inspo/3.jpg', style: 'Japandi', style_tags: ['Japandi'], room: 'Living Room', room_tags: ['Living Room'], category: 'Lighting', category_tags: ['Lighting'], sanctuary: 'Warm Minimal Living', link: '/assets/images/inspo/3.jpg' },
    { id: 'creative-reel-1', title: 'Creative Reel', type: 'video', src: '/assets/videos/reels/1.mp4', style: 'Modern', style_tags: ['Modern'], room: 'Living Room', room_tags: ['Living Room'], category: 'Decor', category_tags: ['Decor'], sanctuary: 'Warm Minimal Living', link: '/assets/videos/reels/1.mp4' },
    { id: 'cozy-reel-2', title: 'Cozy Morning Reel', type: 'video', src: '/assets/videos/reels/2.mp4', style: 'Boho', style_tags: ['Boho'], room: 'Bedroom', room_tags: ['Bedroom'], category: 'Lighting', category_tags: ['Lighting'], sanctuary: 'Soft Morning Rituals', link: '/assets/videos/reels/2.mp4' },
    { id: 'modern-reel-3', title: 'Studio Reel', type: 'video', src: '/assets/videos/reels/3.mp4', style: 'Luxury', style_tags: ['Luxury'], room: 'Office', room_tags: ['Office'], category: 'Layout', category_tags: ['Layout'], sanctuary: 'Feminine Workspace', link: '/assets/videos/reels/3.mp4' }
  ];

  const sanctuaryCollections = [
    { id: 'soft-morning', title: 'Soft Morning Rituals', cover: '/assets/images/inspo/12.png' },
    { id: 'cozy-kitchen', title: 'Cozy Kitchen Sanctuaries', cover: '/assets/images/inspo/14.png' },
    { id: 'warm-minimal', title: 'Warm Minimal Living', cover: '/assets/images/inspo/1.jpg' },
    { id: 'feminine-workspace', title: 'Feminine Workspace', cover: '/assets/images/inspo/2.png' },
    { id: 'rest-reset', title: 'Rest & Reset Bedrooms', cover: '/assets/images/inspo/12.png' }
  ];

  const activeFilters = { style: [], room: [], category: [] };
  let allItems = [...inspoMediaItems];
  let allSanctuaries = [...sanctuaryCollections];
  window._allInspoItems = allItems;

  // ── FILTERS ──────────────────────────────────────────────
  function applyInspoFilters(items) {
    return items.filter((item) => {
      const itemStyles = item.style_tags || (item.style ? [item.style] : []);
      const itemRooms = item.room_tags || (item.room ? [item.room] : []);
      const itemCats = item.category_tags || (item.category ? [item.category] : []);
      const matchesStyle = !activeFilters.style.length || activeFilters.style.some(f => itemStyles.includes(f));
      const matchesRoom = !activeFilters.room.length || activeFilters.room.some(f => itemRooms.includes(f));
      const matchesCategory = !activeFilters.category.length || activeFilters.category.some(f => itemCats.includes(f));
      return matchesStyle && matchesRoom && matchesCategory;
    });
  }

  // ── LIGHTBOX ─────────────────────────────────────────────
  function openLightbox(item, items) {
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    const src = item.src || item.file_url || '';
    const type = item.type || item.file_type || 'image';
    const title = item.title || '';
    const sanctuary = item.sanctuary || item.room || '';
    const tags = item.style_tags || (item.style ? [item.style] : []);

    document.getElementById('lightbox-media').innerHTML = type === 'video'
      ? `<video src="${src}" autoplay muted loop playsinline controls style="max-height:85vh;max-width:100%;border-radius:12px;object-fit:contain"></video>`
      : `<img src="${src}" alt="${title}" style="max-height:85vh;max-width:100%;border-radius:12px;object-fit:contain" onerror="this.style.display='none'" />`;

    document.getElementById('lightbox-title').textContent = title;
    document.getElementById('lightbox-sanctuary').innerHTML = sanctuary
      ? `<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(201,162,39,0.15);color:var(--color-purple);font-size:0.8rem;font-weight:700">${sanctuary}</span>`
      : '';
    document.getElementById('lightbox-tags').innerHTML = tags.map(t =>
      `<span class="chip">${t}</span>`).join('');

    // More from same sanctuary
    const others = (items || window._allInspoItems || [])
      .filter(i => (i.src || i.file_url) !== src)
      .filter(i => !sanctuary || (i.sanctuary || i.room) === sanctuary)
      .slice(0, 5);

    const moreEl = document.getElementById('lightbox-more');
    if (others.length) {
      moreEl.innerHTML = others.map(i => {
        const s = i.src || i.file_url || '';
        const t = i.type || i.file_type || 'image';
        return `<div class="more-thumb" onclick="openLightbox(${JSON.stringify(i).replace(/"/g, '&quot;')}, window._allInspoItems)">
          ${t === 'video'
            ? `<video src="${s}" muted loop playsinline autoplay style="width:100%;height:100%;object-fit:cover"></video>`
            : `<img src="${s}" alt="${i.title||''}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'" />`}
        </div>`;
      }).join('');
      document.getElementById('lightbox-more-wrap').style.display = 'block';
    } else {
      document.getElementById('lightbox-more-wrap').style.display = 'none';
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Lightbox close
  const lbBack = document.getElementById('lightbox-back');
  if (lbBack) lbBack.addEventListener('click', () => {
    document.getElementById('lightbox-overlay').style.display = 'none';
    document.body.style.overflow = '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const o = document.getElementById('lightbox-overlay');
      if (o) { o.style.display = 'none'; document.body.style.overflow = ''; }
    }
  });

  // Lightbox share
  const lbShare = document.getElementById('lightbox-share');
  if (lbShare) lbShare.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {
      const ta = document.createElement('textarea'); ta.value = window.location.href;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    const orig = lbShare.textContent;
    lbShare.textContent = '✓ Link copied!';
    setTimeout(() => lbShare.textContent = orig, 2000);
  });

  // ── CREATIVE VIEW ────────────────────────────────────────
  function renderMediaGrid(items) {
    if (!inspoMediaGrid) return;
    inspoMediaGrid.innerHTML = '';
    inspoMediaGrid.style.cssText = 'columns:4;column-gap:1rem';

    if (!items.length) {
      if (inspoEmpty) inspoEmpty.classList.remove('hidden');
      return;
    }
    if (inspoEmpty) inspoEmpty.classList.add('hidden');

    items.forEach((item) => {
      const src = item.src || item.file_url || '';
      const type = item.type || item.file_type || 'image';
      if (!src) return;

      const card = document.createElement('div');
      card.style.cssText = 'break-inside:avoid;margin-bottom:1rem;border-radius:16px;overflow:hidden;cursor:pointer;background:#f0ebe3';
      card.addEventListener('click', () => openLightbox(item, window._allInspoItems));

      if (type === 'video') {
        card.innerHTML = `
          <div class="inspo-media-wrapper">

            <video 
              src="${src}"
              muted
              autoplay
              loop
              playsinline
              class="inspo-media">
            </video>


            <img 
              src="/assets/images/logo/logo.png"
              class="taynova-watermark"
              alt="TayNova">

          </div>
        `;


      } else {


        card.innerHTML = `
          <div class="inspo-media-wrapper">

            <img 
              src="${src}"
              alt="${item.title || ''}"
              class="inspo-media">


            <img 
              src="/assets/images/logo/logo.png"
              class="taynova-watermark"
              alt="TayNova">

          </div>
        `;

}

      inspoMediaGrid.appendChild(card);
    });
  }

  // ── SANCTUARY VIEW ───────────────────────────────────────
  function renderSanctuaryGrid(collections) {
    if (!sanctuaryGrid) return;
    sanctuaryGrid.innerHTML = '';
    const toRender = collections || sanctuaryCollections;

    toRender.forEach((collection) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sanctuary-card';
      card.innerHTML = `
        <div class="media-preview"></div>
        <div class="sanctuary-copy">
          <h3>${collection.title}</h3>
          <p>${allItems.filter(i => (i.sanctuary || i.room) === collection.title).length} Nook${allItems.filter(i => (i.sanctuary || i.room) === collection.title).length !== 1 ? 's' : ''}</p>
        </div>
      `;

      const image = document.createElement('img');
      image.src = collection.cover || collection.cover_url || '/assets/images/inspo/1.jpg';
      image.alt = collection.title;
      image.onerror = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'content-placeholder';
        placeholder.textContent = 'Image coming soon';
        image.replaceWith(placeholder);
      };

      card.querySelector('.media-preview')?.appendChild(image);
      card.addEventListener('click', () => openSanctuaryDetail(collection, toRender));
      sanctuaryGrid.appendChild(card);
    });
  }
  function openSanctuaryDetail(sanctuary, allSanctuaryList) {
    if (!sanctuaryDetail || !sanctuaryGrid) return;
    sanctuaryGrid.classList.add('hidden');
    sanctuaryDetail.classList.remove('hidden');

    if (sanctuaryResultTitle) sanctuaryResultTitle.textContent = sanctuary.title;
    if (sanctuaryResultInfo) sanctuaryResultInfo.textContent = '';

    // Filter items for this sanctuary
    const matched = allItems.filter(i => (i.sanctuary || i.room) === sanctuary.title);

    if (!sanctuaryResults) return;
    sanctuaryResults.innerHTML = '';
    sanctuaryResults.style.cssText = 'columns:4;column-gap:1rem;margin-top:1.5rem';

    if (!matched.length) {
      sanctuaryResults.innerHTML = '<div style="text-align:center;padding:2rem;color:#888">No nooks in this sanctuary yet.</div>';
      return;
    }

    matched.forEach(item => {
      const src = item.src || item.file_url || '';
      const type = item.type || item.file_type || 'image';
      if (!src) return;

      const card = document.createElement('div');
      card.style.cssText = 'break-inside:avoid;margin-bottom:1rem;border-radius:12px;overflow:hidden;cursor:pointer';
      card.addEventListener('click', () => openLightbox(item, matched));

      card.innerHTML = type === 'video'
        ? `<video src="${src}" muted autoplay loop playsinline style="width:100%;display:block;border-radius:12px" onerror="this.style.display='none'"></video>`
        : `<img src="${src}" alt="${item.title||''}" style="width:100%;display:block;border-radius:12px" onerror="this.style.display='none'" loading="lazy" />`;

      sanctuaryResults.appendChild(card);
    });
  }

  // ── VIEW TOGGLE ──────────────────────────────────────────
  function setView(viewName) {
    if (!creativeView || !sanctuaryView) return;
    creativeView.classList.toggle('hidden', viewName !== 'creative');
    sanctuaryView.classList.toggle('hidden', viewName !== 'sanctuary');
    inspoToggleButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
  }

  if (typeof inspoToggleButtons !== 'undefined' && inspoToggleButtons) {
  inspoToggleButtons.forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
}
 
  // ── FILTERS ──────────────────────────────────────────────
  function handleFilterChange(select) {
    const type = select.dataset.filterType;
    const value = select.value;
    activeFilters[type] = value ? [value] : [];
    renderMediaGrid(applyInspoFilters(allItems));
    updateFilterTags();
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  function updateFilterTags() {
    if (!activeFiltersWrap || !filterSummary) return;
    const selections = [];
    Object.keys(activeFilters).forEach(group => {
      activeFilters[group].forEach(value => selections.push({ type: group, value }));
    });
    if (!selections.length) { filterSummary.classList.add('hidden'); activeFiltersWrap.innerHTML = ''; return; }
    filterSummary.classList.remove('hidden');
    activeFiltersWrap.innerHTML = selections.map(f =>
      `<button type="button" class="filter-tag" data-filter-type="${f.type}" data-filter-value="${f.value}">${f.value} ×</button>`
    ).join('');
    activeFiltersWrap.querySelectorAll('.filter-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilters[btn.dataset.filterType] = activeFilters[btn.dataset.filterType].filter(i => i !== btn.dataset.filterValue);
        const sel = document.querySelector(`.inspo-filters select[data-filter-type="${btn.dataset.filterType}"]`);
        if (sel) sel.value = '';
        renderMediaGrid(applyInspoFilters(allItems));
        updateFilterTags();
      });
    });
  }

  function clearFilters() {
    activeFilters.style = []; activeFilters.room = []; activeFilters.category = [];
    inspoFilterSelects.forEach(s => s.value = '');
    updateFilterTags();
    renderMediaGrid(applyInspoFilters(allItems));
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  inspoFilterSelects.forEach(select => select.addEventListener('change', () => handleFilterChange(select)));
  if (clearFiltersButton) clearFiltersButton.addEventListener('click', clearFilters);
  if (sanctuaryBack) sanctuaryBack.addEventListener('click', () => {
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  });

  // ── RESPONSIVE GRID ──────────────────────────────────────
  function applyResponsiveGrid() {
    const cols = window.innerWidth <= 600 ? 2 : window.innerWidth <= 900 ? 3 : 4;
    if (inspoMediaGrid) inspoMediaGrid.style.columns = cols;
    if (sanctuaryResults) sanctuaryResults.style.columns = cols;
  }
  window.addEventListener('resize', applyResponsiveGrid);
  applyResponsiveGrid();

  // ── INITIAL RENDER ───────────────────────────────────────
  renderSanctuaryGrid();
  updateFilterTags();
  renderMediaGrid(applyInspoFilters(allItems));
  setView('creative');

  // ── LOAD FROM SUPABASE ───────────────────────────────────
  (async () => {
    try {
      if (!window.supabaseClient) return;

      const { data: inspoData } = await window.supabaseClient
        .from('inspiration')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (inspoData && inspoData.length) {
        const supabaseItems = inspoData.map(item => ({
          id: item.id,
          title: item.title || 'Untitled',
          type: item.file_type || 'image',
          src: item.file_url || '',
          link: item.file_url || '',
          style: (item.style_tags && item.style_tags[0]) || '',
          style_tags: item.style_tags || [],
          room: (item.room_tags && item.room_tags[0]) || '',
          room_tags: item.room_tags || [],
          category: (item.category_tags && item.category_tags[0]) || '',
          category_tags: item.category_tags || [],
          sanctuary: item.sanctuary || '',
          featured: item.featured || false
        }));

        allItems = [...supabaseItems, ...inspoMediaItems];
        window._allInspoItems = allItems;
        renderMediaGrid(applyInspoFilters(allItems));
      }

      const { data: sanctuaryData } = await window.supabaseClient
        .from('sanctuaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (sanctuaryData && sanctuaryData.length) {
        const supabaseSanctuaries = sanctuaryData.map(s => ({
          id: s.id,
          title: s.name,
          cover: s.cover_url || '/assets/images/inspo/1.jpg'
        }));
        const hardcodedFiltered = sanctuaryCollections.filter(h =>
          !supabaseSanctuaries.find(s => s.title === h.title)
        );
        allSanctuaries = [...supabaseSanctuaries, ...hardcodedFiltered];
        renderSanctuaryGrid(allSanctuaries);
      }

    } catch (e) {
      console.error('Supabase inspo load failed:', e);
    }
  })();

}

const lbBackBtn = document.getElementById('lightbox-back');
if (lbBackBtn) {
  lbBackBtn.addEventListener('click', () => {
    document.getElementById('lightbox-overlay').style.display = 'none';
    document.body.style.overflow = '';
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const o = document.getElementById('lightbox-overlay');
    if (o) { o.style.display = 'none'; document.body.style.overflow = ''; }
  }
});

const lbShareBtn = document.getElementById('lightbox-share');
if (lbShareBtn) {
  lbShareBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {
      const ta = document.createElement('textarea'); ta.value = window.location.href;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    const orig = lbShareBtn.textContent;
    lbShareBtn.textContent = '✓ Link copied!';
    setTimeout(() => lbShareBtn.textContent = orig, 2000);
  });
}

function renderMediaGrid(items) {
    if (!inspoMediaGrid) return;
    inspoMediaGrid.innerHTML = '';
    if (!items.length) {
      inspoEmpty.classList.remove('hidden');
      return;
    }
    inspoEmpty.classList.add('hidden');

    items.forEach((item) => {
      const card = document.createElement('div');
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openLightbox(item, allItems));
      card.target = '_blank';
      card.rel = 'noreferrer';
      card.className = 'media-card';

      const media = document.createElement('div');
      media.className = 'media-preview';
      if (item.type === 'video') {
        media.innerHTML = `<video src="${item.src}" muted autoplay loop playsinline></video><div class="play-icon">▶</div>`;
      } else {
        media.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.outerHTML='<div class=\"content-placeholder\">Image coming soon</div>'">`;
      }

      const meta = document.createElement('div');
      meta.className = 'media-meta';
      meta.innerHTML = `<h3>${item.title}</h3><p>${item.style} • ${item.room}</p>`;

      card.append(media, meta);
      inspoMediaGrid.appendChild(card);
    });
  }

function renderSanctuaryGrid(collections) {
  if (!sanctuaryGrid) return;
  sanctuaryGrid.innerHTML = '';
  const toRender = collections || sanctuaryCollections;

  toRender.forEach((collection) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'sanctuary-card';
      card.innerHTML = `
        <div class="media-preview"></div>
        <div class="sanctuary-copy">
          <h3>${collection.title}</h3>
          <p>${collection.description}</p>
        </div>
      `;

      const image = document.createElement('img');
      image.src = collection.cover;
      image.alt = collection.title;
      image.onerror = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'content-placeholder';
        placeholder.textContent = 'Image coming soon';
        image.replaceWith(placeholder);
      };

      card.querySelector('.media-preview')?.appendChild(image);
      card.addEventListener('click', () => openSanctuary(collection.id));
      sanctuaryGrid.appendChild(card);
    });
  }

  function openSanctuary(id) {
    selectedSanctuary = id;
    const collection = sanctuaryCollections.find((item) => item.id === id);
    if (!collection || !sanctuaryDetail) return;

    sanctuaryGrid.classList.add('hidden');
    sanctuaryDetail.classList.remove('hidden');
    sanctuaryResultTitle.textContent = collection.title;
    sanctuaryResultInfo.textContent = collection.description;

    const filtered = inspoMediaItems.filter((item) =>
      collection.filters.some((tag) => item.style === tag || item.room === tag || item.category === tag)
    );

    sanctuaryResults.innerHTML = '';
    if (!filtered.length) {
      sanctuaryResults.innerHTML = '<div class="empty-state">No inspiration found for this sanctuary. Try another mood.</div>';
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('a');
      card.href = item.link;
      card.target = '_blank';
      card.rel = 'noreferrer';
      card.className = 'media-card';

      const media = document.createElement('div');
      media.className = 'media-preview';

      if (item.type === 'video') {
        media.innerHTML = `<video src="${item.src}" muted autoplay loop playsinline></video><div class="play-icon">▶</div>`;
      } else {
        media.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.outerHTML='<div class=\"content-placeholder\">Image coming soon</div>'">`;
      }

      const meta = document.createElement('div');
      meta.className = 'media-meta';
      meta.innerHTML = `<h3>${item.title}</h3><p>${item.style} • ${item.room}</p>`;

      card.append(media, meta);
      sanctuaryResults.appendChild(card);
    });
  }
    const activeFiltersWrap = document.getElementById('active-filters');
    const filterSummary = document.getElementById('filter-summary');

    const activeFilters = {
      style: [],
      room: [],
      category: []
    };
  function updateFilterTags() {
    if (!activeFiltersWrap || !filterSummary) return;
    const selections = [];
    Object.keys(activeFilters).forEach((group) => {
      activeFilters[group].forEach((value) => selections.push({ type: group, value }));
    });

    if (!selections.length) {
      filterSummary.classList.add('hidden');
      activeFiltersWrap.innerHTML = '';
      return;
    }

    filterSummary.classList.remove('hidden');
    activeFiltersWrap.innerHTML = selections
      .map(
        (filter) =>
          `<button type="button" class="filter-tag" data-filter-type="${filter.type}" data-filter-value="${filter.value}">${filter.value} ×</button>`
      )
      .join('');

    activeFiltersWrap.querySelectorAll('.filter-tag').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.filterType;
        const value = button.dataset.filterValue;
        activeFilters[type] = activeFilters[type].filter((item) => item !== value);
        const selectElement = document.querySelector(`.inspo-filters select[data-filter-type="${type}"]`);
        if (selectElement) selectElement.value = '';
        renderMediaGrid(applyInspoFilters(window.mergedInspo || inspoMediaItems));
        updateFilterTags();
      });
    });
  }

  const inspoFilterSelects = document.querySelectorAll('.inspo-filters select');

  function clearFilters() {
    activeFilters.style = [];
    activeFilters.room = [];
    activeFilters.category = [];
    selectedSanctuary = null;
    inspoFilterSelects.forEach((select) => {
      select.value = '';
    });
    updateFilterTags();
    renderMediaGrid(applyInspoFilters(window.mergedInspo || inspoMediaItems));
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  function handleFilterChange(select) {
    const type = select.dataset.filterType;
    const value = select.value;
    activeFilters[type] = value ? [value] : [];

    selectedSanctuary = null;
    renderMediaGrid(applyInspoFilters(window.mergedInspo || inspoMediaItems));
    updateFilterTags();
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  inspoFilterSelects.forEach((select) => {
    select.addEventListener('change', () => handleFilterChange(select));
  });


  if (document.body.classList.contains('inspo-page')) {

  const inspoFilterSelects = document.querySelectorAll('.inspo-filters select');

  const clearFiltersButton = document.getElementById('clear-filters');

  const activeFiltersWrap = document.getElementById('active-filters');

  const filterSummary = document.getElementById('filter-summary');

}
  const sanctuaryBack = document.getElementById('sanctuary-back');
  const sanctuaryDetail = document.getElementById('sanctuary-detail');
  const sanctuaryGrid = document.getElementById('sanctuary-grid');

  let selectedSanctuary = null;

  if (sanctuaryBack) {
    sanctuaryBack.addEventListener('click', () => {
      selectedSanctuary = null;
      sanctuaryDetail.classList.add('hidden');
      sanctuaryGrid.classList.remove('hidden');
    });
  }

  // Load from Supabase and merge
  (async () => {
  try {

    let supabaseItems = [];
    let supabaseSanctuaries = [];


    // Load inspiration items
    const { data: inspoData, error: inspoError } =
      await supabaseClient
      .from('inspiration')
      .select('*')
      .eq('status', 'published');


    if (inspoError) throw inspoError;


    supabaseItems = (inspoData || []).map(item => ({
      id: item.id,
      title: item.title,
      src: item.file_url,
      type: item.file_type || 'image',
      style: item.style || '',
      room: item.room || '',
      category: item.category || ''
    }));



    // Load sanctuary items
    const { data: sanctuaryData, error: sanctuaryError } =
      await supabaseClient
      .from('sanctuaries')
      .select('*');


    if (sanctuaryError) throw sanctuaryError;


    supabaseSanctuaries = sanctuaryData || [];



    // Render
    window._allInspoItems = supabaseItems;

    renderMediaGrid(
      applyInspoFilters(supabaseItems)
    );


    renderSanctuaryGrid(
      supabaseSanctuaries
    );


    updateFilterTags();


    setView('creative');


  } catch(e) {

    console.error(
      'Supabase inspo load failed:',
      e
    );

  }

})();



// Initialize inspiration items (merge hardcoded + supabase if available) and render
async function initInspo(){
  // normalize hardcoded items
  function normalizeHard(item){ return { id: item.id||item.src, title: item.title, type: item.type, src: item.src, style: item.style, room: item.room, category: item.category, link: item.link, tags: item.style? [item.style] : [] } }
  let merged = (inspoMediaItems||[]).map(normalizeHard);
  // fetch supabase items if client available
  try{
    if(window.supabaseClient){
      const res = await window.supabaseClient.from('inspiration').select('*').order('created_at',{ascending:false});
      if(res && res.data){
        const fetched = res.data.map(it=>({ id: it.id, title: it.title||'', type: it.file_type||'image', src: it.file_url, style: (it.style_tags && it.style_tags[0])||'', room: it.sanctuary||'', category: '', link: it.file_url, tags: it.style_tags||[] }));
        // merge with fetched items appended
        merged = merged.concat(fetched);
      }
    }
  }catch(e){ console.warn('Could not fetch inspo from Supabase', e); }

  // store merged globally for lightbox navigation
  window.mergedInspo = merged;
  // render initial grid
  renderMediaGrid(applyInspoFilters(window.mergedInspo));
}

// Render media grid: open lightbox on click (no navigation)
function renderMediaGrid(items) {
  if (!inspoMediaGrid) return;
  inspoMediaGrid.innerHTML = '';
  if (!items.length) {
    inspoEmpty.classList.remove('hidden');
    return;
  }
  inspoEmpty.classList.add('hidden');

  items.forEach((item, idx) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'media-card';
    card.dataset.index = idx;

    const media = document.createElement('div');
    media.className = 'media-preview';
      if (item.type === 'video') {
        media.innerHTML = `<video src="${item.src}" muted loop playsinline></video><div class="play-icon">▶</div>`;
        const v = media.querySelector('video');
        if(v){ v.addEventListener('error', ()=> showResourceError(item.src, 'VIDEO')); }
      } else {
        media.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.outerHTML='<div class=\"content-placeholder\">Image coming soon</div>'">`;
        const im = media.querySelector('img');
        if(im) im.addEventListener('error', ()=> showResourceError(item.src, 'IMG'));
      }

    const meta = document.createElement('div');
    meta.className = 'media-meta';
    meta.innerHTML = `<h3>${item.title}</h3><p>${item.style} • ${item.room}</p>`;

    card.append(media, meta);
    card.addEventListener('click', (e)=>{ e.preventDefault(); openLightboxForItem(item); });
    inspoMediaGrid.appendChild(card);
  });
}

// Lightbox functions
function openLightboxForItem(item){
  const overlay = document.getElementById('lightbox-overlay');
  const mediaWrap = document.getElementById('lightbox-media');
  const title = document.getElementById('lightbox-title');
  const sanctuary = document.getElementById('lightbox-sanctuary');
  const tagsWrap = document.getElementById('lightbox-tags');
  const more = document.getElementById('lightbox-more');
  if(!overlay) return;
  document.body.style.overflow='hidden';
  overlay.style.display='flex';

  // media
  mediaWrap.innerHTML='';
  if(item.type==='video'){
    mediaWrap.innerHTML = `<video src="${item.src}" controls autoplay muted loop playsinline style="max-height:85vh;border-radius:12px;object-fit:contain"></video>`;
  } else {
    mediaWrap.innerHTML = `<img src="${item.src}" alt="${item.title}" style="max-height:85vh;border-radius:12px;object-fit:contain">`;
  }
  title.textContent = item.title || '';
  sanctuary.innerHTML = item.sanctuary ? `<div class="chip">${item.sanctuary}</div>` : '';
  tagsWrap.innerHTML = (item.tags||[]).slice(0,5).map(t=>`<span class="chip" style="background:var(--color-purple);">${t}</span>`).join(' ');

  // more items
  more.innerHTML='';
  const pool = (window.mergedInspo||[]).filter(x=>x.src !== item.src).slice(0,5);
  pool.forEach(other=>{
    const d = document.createElement('div'); d.className='more-thumb'; d.innerHTML = `<img src="${other.src}"><div style="position:absolute;right:8px;top:8px">${other.type==='video'?'<span style="background:rgba(0,0,0,0.5);color:#fff;padding:4px 6px;border-radius:6px;font-size:12px">▶</span>':''}</div>`;
    d.addEventListener('click', ()=>{ openLightboxForItem(other); });
    more.appendChild(d);
  });

  // share button
  const shareBtn = document.getElementById('lightbox-share');
  if(shareBtn){ shareBtn.onclick = async ()=>{ try{ await navigator.clipboard.writeText(window.location.href); }catch{ const ta=document.createElement('textarea'); ta.value=window.location.href; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } const t=document.createElement('div'); t.textContent='Link copied!'; t.style.cssText='position:fixed;bottom:2rem;right:2rem;background:#7c3aed;color:#fff;padding:0.75rem 1.25rem;border-radius:999px;font-weight:700;z-index:9999;'; document.body.appendChild(t); setTimeout(()=>t.remove(),2500); }; }

  // close handlers
  document.getElementById('lightbox-back').onclick = closeLightbox;
  document.addEventListener('keydown', lightboxKeyHandler);
}

function closeLightbox(){ const overlay=document.getElementById('lightbox-overlay'); if(!overlay) return; overlay.style.display='none'; document.body.style.overflow=''; document.removeEventListener('keydown', lightboxKeyHandler); }
function lightboxKeyHandler(e){ if(e.key === 'Escape') closeLightbox(); }

let shopProducts = [];

async function fetchProducts() {
  try {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

const shopGrid = document.getElementById('shop-grid');
const shopSearchInput = document.getElementById('shop-search-input');
const filterCategory = document.getElementById('filter-category');
const filterSubcategory = document.getElementById('filter-subcategory');
const filterPrice = document.getElementById('filter-price');
const filterType = document.getElementById('filter-type');
const shopEmpty = document.getElementById('shop-empty');
const shopDetailSection = document.getElementById('product-detail');
const shopBackButton = document.getElementById('shop-back');
const shopFilterSection = document.getElementById('shop-filters');
const shopProductsSection = document.getElementById('shop-products');
const detailTitleShop = document.getElementById('detail-title');
const detailCategoryShop = document.getElementById('detail-category');
const detailDescription = document.getElementById('detail-description');
const detailimageshop = document.getElementById('detail-image');
const detailPrice = document.getElementById('detail-price');
const detailContentShop = document.getElementById('detail-content');
const detailActionsShop = document.getElementById('detail-actions');

function renderShopCards(products) {
  if (!shopGrid) return;
  shopGrid.innerHTML = '';

  if (products.length > PAGE_SIZE * shopPage) {
  const seeMore = document.createElement('div');
  seeMore.style.textAlign = 'center';
  seeMore.style.marginTop = '2rem';
  seeMore.innerHTML = `<button class="btn btn-primary" onclick="shopPage++;renderShopCards(shopProducts)">See More</button>`;
  shopGrid.after(seeMore);
}

  shopEmpty.classList.add('hidden');

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card shop-card';
    card.dataset.product = product.id;
    const base = location.origin + location.pathname.replace(/\/[^\/]*$/, '/');
    const detailPath = base + `product-detail.html?id=${encodeURIComponent(product.id)}`;
    const isFree = !product.price || product.price == 0;
    card.innerHTML = `
      <div style="position:relative">
        <img src="${product.image_url || ''}" alt="${product.name}" />
        ${isFree ? `<span style="position:absolute;top:10px;left:10px;background:var(--color-purple);color:#000;padding:0.3rem 0.75rem;border-radius:999px;font-weight:800;font-size:0.8rem">🏷️ FREE</span>` : ''}
      </div>
      <div class="shop-card-body">
        <h3>${product.name}</h3>
        <div class="shop-card-footer">
          <div style="text-align:center;margin-top:auto;padding-top:1rem">
            <a class="btn btn-read" href="${detailPath}" style="display:inline-flex;justify-content:center">Read More</a>
          </div>
          <div class="card-actions">
            <button type="button" class="btn-shop-now" data-action="shop-now">Shop Now</button>
          </div>
        </div>
      </div>
    `;

    // Card click navigates to detail
    card.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a') return;
      window.location.href = detailPath;
    });

    const shopNowBtn = card.querySelector('[data-action="shop-now"]');
    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        window.open(product.affiliate_link || '#', '_blank', 'noopener,noreferrer');
      });
    }

    // share button removed from shop cards — omit share handler

    shopGrid.appendChild(card);
  });
}

function getShopFilters() {
  return {
    search: shopSearchInput ? shopSearchInput.value.trim().toLowerCase() : '',
    category: filterCategory ? filterCategory.value : 'All',
    subcategory: filterSubcategory ? filterSubcategory.value : 'All',
    price: filterPrice ? filterPrice.value : 'All',
    type: filterType ? filterType.value : 'All'
  };
}

function filterShopProducts() {
  if (!shopGrid) return;

  const { search, category, subcategory, price, type } = getShopFilters();

  const filtered = shopProducts.filter((product) => {
    const matchesSearch = [product.name, product.category, product.subcategory, product.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));

    const matchesCategory = category === 'All' || product.category === category;
    const matchesSubcategory = subcategory === 'All' || product.subcategory === subcategory;
    const matchesType = type === 'All' || product.type === type;

    let matchesPrice = true;
    if (price === 'under-30') {
      matchesPrice = product.price < 30;
    } else if (price === '30-60') {
      matchesPrice = product.price >= 30 && product.price <= 60;
    } else if (price === '60-100') {
      matchesPrice = product.price > 60 && product.price <= 100;
    } else if (price === 'above-100') {
      matchesPrice = product.price > 100;
    }

    return matchesSearch && matchesCategory && matchesSubcategory && matchesType && matchesPrice;
  });

  renderShopCards(filtered);
}

// Detail pages use separate detail HTML; in-page product detail functions removed.

if (shopGrid && shopSearchInput) {
  (async () => {
    shopProducts = await fetchProducts();
     await loadShopCategories();
    renderShopCards(shopProducts);
    shopSearchInput.addEventListener('input', filterShopProducts);
  })();
}

[filterCategory, filterSubcategory, filterPrice, filterType].forEach((selector) => {
  if (selector) {
    selector.addEventListener('change', filterShopProducts);
  }
});

if (shopBackButton) shopBackButton.addEventListener('click', () => window.location.href = 'shop.html');

let ebookData = [];

async function fetchEbooks() {
  try {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient
      .from('ebooks')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching ebooks:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

const ebookGrid = document.getElementById('ebook-grid');
const ebookSearchInput = document.getElementById('ebook-search-input');
const ebookEmpty = document.getElementById('ebook-empty');
const ebookDetailSection = document.getElementById('ebook-detail');
const ebookBackButton = document.getElementById('ebook-back');
const detailEbookTitle = document.getElementById('detail-ebook-title');
const detailEbookImage = document.getElementById('detail-ebook-image');
const detailEbookDescription = document.getElementById('detail-ebook-description');
const detailEbookPrice = document.getElementById('detail-ebook-price');
const detailEbookActions = document.getElementById('detail-ebook-actions');
const ebookListSection = document.getElementById('ebooks-list');
const ebookSearchSection = document.getElementById('ebook-search');
const ebookFilterSection = document.getElementById('ebook-filters');
const ebookFilterButtons = document.querySelectorAll('.ebook-filter-pill');

function getActiveEbookCategory() {
  const activeFilter = document.querySelector('.ebook-filter-pill.active');
  return activeFilter ? activeFilter.dataset.category : 'All';
}

function renderEbookCards(ebooks) {
  if (!ebookGrid) return;
  ebookGrid.innerHTML = '';

  if (ebooks.length > PAGE_SIZE * ebookPage) {
  const seeMore = document.createElement('div');
  seeMore.style.textAlign = 'center';
  seeMore.style.marginTop = '2rem';
  seeMore.innerHTML = `<button class="btn btn-primary" onclick="ebookPage++;renderEbookCards(ebookData)">See More</button>`;
  ebookGrid.after(seeMore);
}

  ebookEmpty.classList.add('hidden');

  ebooks.forEach((ebook) => {
    const card = document.createElement('article');
    card.className = 'ebook-card';
    card.dataset.ebook = ebook.id;
    const base = location.origin + location.pathname.replace(/\/[^\/]*$/, '/');
    const detailPath = base + `ebook-detail.html?id=${encodeURIComponent(ebook.id)}`;
    const isFree = !ebook.price || ebook.price == 0;
    card.innerHTML = `
      <div style="position:relative">
        <img src="${ebook.cover_url || ''}" alt="${ebook.title}" />
        ${isFree ? `<span style="position:absolute;top:10px;left:10px;background:var(--color-purple);color:#000;padding:0.3rem 0.75rem;border-radius:999px;font-weight:800;font-size:0.8rem">🏷️ FREE</span>` : ''}
      </div>
      <div class="ebook-card-body">
        <h3>${ebook.title}</h3>
        <div class="ebook-card-footer">
          <div class="card-actions">
            <div style="text-align:center;margin-top:auto;padding-top:1rem">
              <a class="btn btn-read" href="${detailPath}" style="display:inline-flex;justify-content:center">Read More</a>
            </div>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a') return;
      window.location.href = detailPath;
    });

    const shareBtn = card.querySelector('.btn-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await shareLink(shareBtn.dataset.url);
      });
    }

    ebookGrid.appendChild(card);
  });
}

function filterEbooks() {
  if (!ebookGrid) return;

  const searchValue = ebookSearchInput ? ebookSearchInput.value.trim().toLowerCase() : '';
  const activeCategory = getActiveEbookCategory();

  const filtered = ebookData.filter((ebook) => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchValue) || (ebook.description ? ebook.description.toLowerCase().includes(searchValue) : false);
    const matchesCategory = activeCategory === 'All' || ebook.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  renderEbookCards(filtered);
}


if (ebookGrid && ebookSearchInput) {
  (async () => {
    ebookData = await fetchEbooks();
    await loadEbookCategories();
    renderEbookCards(ebookData);
    ebookSearchInput.addEventListener('input', filterEbooks);
  })();
}

ebookFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ebookFilterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    filterEbooks();
  });
});

if (ebookBackButton) ebookBackButton.addEventListener('click', () => window.location.href = 'ebooks.html');

async function loadBlogCategories() {
  if (!window.supabaseClient) return;
  const { data } = await window.supabaseClient.from('blog_posts').select('category').eq('status', 'published');
  const categories = ['All', ...new Set((data || []).map(p => p.category).filter(Boolean))];
  const filterPanel = document.querySelector('#blog-search .filter-panel');
  if (!filterPanel) return;
  filterPanel.innerHTML = categories.map(cat =>
    `<button type="button" class="filter-pill ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');
  document.querySelectorAll('#blog-search .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#blog-search .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBlogPosts();
    });
  });
}

async function loadEbookCategories() {
  if (!window.supabaseClient) return;
  const { data } = await window.supabaseClient.from('ebooks').select('category').eq('status', 'published');
  const categories = ['All', ...new Set((data || []).map(e => e.category).filter(Boolean))];
  const filterPills = document.querySelector('.ebook-filter-pills');
  if (!filterPills) return;
  filterPills.innerHTML = categories.map(cat =>
    `<button type="button" class="ebook-filter-pill ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');
  document.querySelectorAll('.ebook-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ebook-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterEbooks();
    });
  });
}

async function loadShopCategories() {
  if (!window.supabaseClient) return;
  const { data } = await window.supabaseClient.from('products').select('category').eq('status', 'published');
  const categories = ['All', ...new Set((data || []).map(p => p.category).filter(Boolean))];
  const select = document.getElementById('filter-category');
  if (!select) return;
  select.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`
  ).join('');
}

// Privacy links use normal navigation; removed modal-based privacy display.

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchSingle(table, id) {
  try {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient.from(table).select('*').eq('id', id).single();
    if (error) {
      console.error(`Error fetching ${table} id=${id}:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

(async function loadDetailIfNeeded() {
  const id = getIdFromUrl();
  if (!id) return;

  // Blog detail page
  if (document.getElementById('blog-detail') || window.location.pathname.endsWith('blog-post.html')) {
    const post = await fetchSingle('blog_posts', id);
    if (post) {
      if (detailTitle) detailTitle.textContent = post.title || '';
      if (detailCategory) detailCategory.textContent = post.category || '';
      if (detailExcerpt) detailExcerpt.textContent = post.short_description || '';
      if (detailImage) {
        detailImage.src = post.cover_url || '';
        detailImage.alt = post.title || '';
      }
      if (detailContent) {
        detailContent.innerHTML = 
          post.content || '';
          post.founder_note || ''
      }
      if (detailLinks) {
        if (post.links && Array.isArray(post.links)) {
          detailLinks.innerHTML = post.links
            .map((link) => `<a class="blog-detail-link" href="${link.href}" target="_blank" rel="noreferrer">${link.text}</a>`)
            .join('');
        } else {
          detailLinks.innerHTML = '';
        }
      }

      // Back and share
      if (blogBackButton) blogBackButton.addEventListener('click', () => history.back());
      if (blogDetailSection) {
        const shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.title = 'Share';
        shareBtn.style.cssText = 'position:fixed;top:7rem;right:1.5rem;width:44px;height:44px;border-radius:50%;background:#7c3aed;color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(124,58,237,0.3);z-index:50';
        shareBtn.innerHTML = '🔗';
        shareBtn.addEventListener('click', async () => await shareLink(window.location.href));
        document.body.appendChild(shareBtn);
      }
    }
  }
// Product detail page
  if (document.getElementById('product-detail') || window.location.pathname.endsWith('product-detail.html')) {
    const product = await fetchSingle('products', id);
    if (product) {
      if (detailTitleShop) detailTitleShop.textContent = product.name || '';
      if (detailCategoryShop) detailCategoryShop.textContent = `${product.category || ''} · ${product.subcategory || ''}`;
      if (detailDescription) detailDescription.innerHTML = product.description || '';
      if (detailimageshop) {
        detailimageshop.src = product.image_url || '';
        detailimageshop.alt = product.name || '';
      }
      if (detailPrice) {
        const isFree = !product.price || product.price == 0;
        detailPrice.innerHTML = isFree
          ? '<span style="color:var(--color-purple);font-weight:800;font-size:1.5rem">FREE</span>'
          : `<span style="font-weight:800;font-size:1.5rem">₦${Number(product.price).toLocaleString()}</span>${product.discount ? ` <span style="background:rgba(201,162,39,0.15);color:var(--color-purple);padding:0.3rem 0.75rem;border-radius:999px;font-size:0.85rem;font-weight:700">${product.discount}% OFF</span>` : ''}`;
      }
      if (detailContentShop) {
        if (Array.isArray(product.details)) {
          detailContentShop.innerHTML = product.details.map((p) => `<p>${p}</p>`).join('');
        } else {
          detailContentShop.innerHTML = product.details || '';
        }
      }
      if (detailActionsShop) {
        detailActionsShop.innerHTML = `<a class="shop-detail-link" href="${product.affiliate_link || '#'}" target="_blank" rel="noreferrer">Shop Now</a>`;
        const shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.title = 'Share';
        shareBtn.style.cssText = 'position:fixed;top:7rem;right:1.5rem;width:44px;height:44px;border-radius:50%;background:#7c3aed;color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(124,58,237,0.3);z-index:50';
        shareBtn.innerHTML = '🔗';
        shareBtn.addEventListener('click', async () => await shareLink(window.location.href));
        document.body.appendChild(shareBtn);
      }
      if (shopBackButton) shopBackButton.addEventListener('click', () => history.back());
    }
  }

  // Ebook detail page
  if (document.getElementById('ebook-detail') || window.location.pathname.endsWith('ebook-detail.html')) {
    const ebook = await fetchSingle('ebooks', id);
    if (ebook) {
      if (detailEbookTitle) detailEbookTitle.textContent = ebook.title || '';
      if (detailEbookDescription) detailEbookDescription.innerHTML = ebook.description || '';
      if (detailEbookPrice) {
        const isFree = !ebook.price || ebook.price == 0;
        detailEbookPrice.innerHTML = isFree
          ? '<span style="color:var(--color-purple);font-weight:800;font-size:1.5rem">FREE</span>'
          : `<span style="font-weight:800;font-size:1.5rem">₦${Number(ebook.price).toLocaleString()}</span>`;
      }
      if (detailEbookImage) {
        detailEbookImage.src = ebook.cover_url || '';
        detailEbookImage.alt = ebook.title || '';
      }
      if (detailEbookActions) {
        detailEbookActions.innerHTML = `<a class="ebook-detail-link" href="${ebook.link}" target="_blank" rel="noreferrer">Get the Guide</a>`;
        const shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.title = 'Share';
        shareBtn.style.cssText = 'position:fixed;top:7rem;right:1.5rem;width:44px;height:44px;border-radius:50%;background:#7c3aed;color:#fff;border:none;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(124,58,237,0.3);z-index:50';
        shareBtn.innerHTML = '🔗';
        shareBtn.addEventListener('click', async () => await shareLink(window.location.href));
        detailEbookActions.prepend(shareBtn);
      }
      if (ebookBackButton) ebookBackButton.addEventListener('click', () => history.back());
    }
  }
})();

const privacyPolicyLinks = document.querySelectorAll('.footer-policy a');

if (privacyPolicyLinks.length) {
  const privacyModal = document.createElement('div');
  privacyModal.className = 'privacy-modal';
  privacyModal.setAttribute('role', 'dialog');
  privacyModal.setAttribute('aria-modal', 'true');
  privacyModal.setAttribute('aria-labelledby', 'privacy-modal-title');
  privacyModal.innerHTML = `
    <div class="privacy-modal-card" role="document">
      <button type="button" class="privacy-modal-close" aria-label="Close Privacy Policy">×</button>
      <h2 id="privacy-modal-title">Privacy Policy</h2>
      <h3>Privacy Policy for TayNova</h3>
      <p>At TayNova, accessible from [yourwebsite.com], your privacy is important to us. This Privacy Policy document outlines the types of information that is collected and recorded by TayNova and how we use it.</p>
      <p>We may collect personal information such as your name and email address when you voluntarily subscribe to our newsletter, contact us, or interact with our website. This information is used to communicate with you, improve our content, and provide relevant recommendations.</p>
      <p>Like many websites, TayNova uses log files. These files log visitors when they visit websites. The information collected may include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. This information is used to analyze trends, administer the site, and track user movement.</p>
      <p>We may use cookies to store information about visitors' preferences and optimize the user experience by customizing our web page content based on visitors' browser type or other information.</p>
      <p>TayNova may also participate in affiliate marketing programs, which means we may earn commissions on purchases made through links on this site. These affiliate links do not affect your purchase price.</p>
      <p>Third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites. These cookies enable ad networks to provide advertisements that are relevant to your interests.</p>
      <p>You can choose to disable cookies through your individual browser options. More detailed information about cookie management can be found in your browser’s settings.</p>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      <p>If you have additional questions, feel free to contact us at:<br><a href="mailto:oreoluwaoluwadre@gmail.com">oreoluwaoluwadre@gmail.com</a></p>
    </div>
  `;

  document.body.appendChild(privacyModal);

  const privacyCloseButton = privacyModal.querySelector('.privacy-modal-close');

  function openPrivacyModal(event) {
    event.preventDefault();
    privacyModal.classList.add('is-open');
    document.body.classList.add('privacy-modal-open');
    privacyCloseButton.focus();
  }

  function closePrivacyModal() {
    privacyModal.classList.remove('is-open');
    document.body.classList.remove('privacy-modal-open');
  }

  privacyPolicyLinks.forEach((link) => {
    link.addEventListener('click', openPrivacyModal);
  });

  privacyCloseButton.addEventListener('click', closePrivacyModal);

  privacyModal.addEventListener('click', (event) => {
    if (event.target === privacyModal) {
      closePrivacyModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && privacyModal.classList.contains('is-open')) {
      closePrivacyModal();
    }
  });
}
  // HOMEPAGE SECTIONS
async function loadHomepageSections() {
  if (!window.supabaseClient) return;

  // Latest 3 blogs
  const homeBlogGrid = document.getElementById('home-blog-grid');
  if (homeBlogGrid) {
    const { data: posts } = await window.supabaseClient
      .from('blog_posts')
      .select('id, title, short_description, cover_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);
    if (posts && posts.length) {
      homeBlogGrid.innerHTML = posts.map(post => `
        <article class="blog-card">
          <img src="${post.cover_url || ''}" alt="${post.title}" onerror="this.outerHTML='<div class=&quot;image-placeholder&quot;>Image coming soon</div>';" />
          <h3>${post.title}</h3>
          <p>${post.short_description ? post.short_description.slice(0,100) + '...' : ''}</p>
          <a href="blog-post.html?id=${post.id}" class="btn btn-read">Read More</a>
        </article>
      `).join('');
    }
      homeBlogGrid.insertAdjacentHTML('afterend', '...');
  }

  // Latest 3 products
  const homeProductsGrid = document.getElementById('home-products-grid');
  if (homeProductsGrid) {
    const { data: products } = await window.supabaseClient
      .from('products')
      .select('id, name, image_url, price, discount, affiliate_link')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);
    if (products && products.length) {
      homeProductsGrid.innerHTML = products.map(p => {
        const discounted = p.discount > 0 ? (p.price - p.price * p.discount / 100).toFixed(2) : null;
        return `
          <div class="product-card">
            <img src="${p.image_url || ''}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p class="price">${discounted ? `<s>$${p.price}</s> $${discounted}` : `$${p.price}`}</p>
            <a href="product-detail.html?id=${p.id}" class="btn btn-shop">View Product</a>
          </div>
        `;
      }).join('');
    }
    homeProductsGrid.insertAdjacentHTML('afterend', '...');
  }

  // Latest 3 ebooks
  const homeEbooksGrid = document.getElementById('home-ebooks-grid');
  if (homeEbooksGrid) {
    const { data: ebooks } = await window.supabaseClient
      .from('ebooks')
      .select('id, title, cover_url, price, purchase_link')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);
    if (ebooks && ebooks.length) {
      homeEbooksGrid.innerHTML = ebooks.map(eb => `
        <div class="ebook-card">
          <img src="${eb.cover_url || ''}" alt="${eb.title}" />
          <h4>${eb.title}</h4>
          <a href="ebook-detail.html?id=${eb.id}" class="btn btn-ebook">Get the Guide</a>
        </div>
      `).join('');
    }
    homeEbooksGrid.insertAdjacentHTML('afterend', '...');
  }
}
loadHomepageSections();