document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,' + btoa('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5efe6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b6475" font-family="Inter" font-size="16">Image</text></svg>');
  });
});

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

const blogPosts = [
  {
    id: 'cozy-nook',
    title: 'Creating a Cozy Reading Nook',
    category: 'Interiors',
    excerpt: 'Small design moves that transform a corner into a calm, inviting retreat.',
    cover: '/assets/images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (4).png',
    image: '/assets/images/blog/content/cozy.png',
    content: [
      'A thoughtfully curated reading nook begins with texture and light. Choose a warm throw, a soft pillow, and a lamp with a gentle glow to anchor the space.',
      'Start with your favorite chair and layer it with tactile pieces like a woven blanket, a plush cushion, and an elegant side table. This encourages quiet moments and creates a sense of intention for the corner.',
      'Add a stack of books, a small plant, and a tray for your tea or coffee. The simplest accents often make the biggest difference in how the space feels.',
    ],
    links: [
      {
        text: 'Explore curated reading nook accessories',
        href: 'https://selar.com/m/tay-nova1'
      }
    ]
  },
  {
    id: 'sustainable-rituals',
    title: 'Sustainable Rituals for Daily Living',
    category: 'Wellness',
    excerpt: 'Everyday habits that make your home feel calm, balanced, and eco-conscious.',
    cover: '/assets/images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (2).png',
    image: '/assets/images/blog/content/4.png',
    content: [
      'Incorporating simple rituals into your routine can elevate the way you move through your home. Start with a morning stretch, a curated playlist, or a moment of gratitude by the window.',
      'Choose reusable kitchen items, gentle natural cleaners, and plants that help purify the air. These small changes create a softer, more sustainable rhythm for the day.',
      'A calm space is easier to maintain when you keep surfaces clear, designate resting places for everyday items, and let natural light guide your layout.',
    ],
    links: [
      {
        text: 'Shop sustainable home essentials',
        href: 'https://selar.com/m/tay-nova1'
      }
    ]
  },
  {
    id: 'holiday-home-guide',
    title: 'A Holiday Home Styling Guide',
    category: 'Guides',
    excerpt: 'A seasonal styling guide with easy updates and mood-setting details.',
    cover: '/assets/images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (3).png',
    image: '/assets/images/blog/content/lux 1.png',
    content: [
      'Refresh your home for the season using a limited palette and natural textures. Soft throws, warm lighting, and layered candles help create a welcoming atmosphere.',
      'Mix in a few statement pieces that feel personal—like a woven basket, a ceramic vase, or a favorite framed print—to keep the look grounded and memorable.',
      'Balance seasonal accents with everyday essentials so the space remains inviting beyond the holidays.',
    ],
    links: [
      {
        text: 'See our seasonal styling picks',
        href: 'https://selar.com/m/tay-nova1'
      }
    ]
  },
  {
    id: 'daily-decor',
    title: 'Everyday Decor Habits That Last',
    category: 'Lifestyle',
    excerpt: 'Build a home routine around thoughtful objects, consistent editing, and calm visual flow.',
    cover: '/assets/images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (5).png',
    image: '/assets/images/blog/content/3.png',
    content: [
      'Design systems are not only for interiors—they can also be part of your everyday habits. Choose a few dependable colors, textures, and containers that work with your life.',
      'Keep surfaces organized with baskets, trays, and simple labels. A small amount of editing each week helps maintain a serene environment.',
      'Allow your décor to evolve slowly. Select pieces that feel timeless and that you look forward to seeing each day.',
    ],
    links: [
      {
        text: 'Browse everyday essentials',
        href: 'https://selar.com/m/tay-nova1'
      }
    ]
  }
];

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

  if (!posts.length) {
    blogEmpty.classList.remove('hidden');
    return;
  }

  blogEmpty.classList.add('hidden');

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
      <img src="${post.cover}" alt="${post.title}" onerror="this.outerHTML='<div class=&quot;image-placeholder&quot;>Image coming soon</div>';">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <button type="button" class="btn btn-read" data-post="${post.id}">Read More</button>
    `;

    card.querySelector('[data-post]').addEventListener('click', (event) => {
      event.preventDefault();
      openBlogDetail(post.id);
    });

    blogGrid.appendChild(card);
  });
}

function getActiveCategory() {
  const active = document.querySelector('.filter-pill.active');
  return active ? active.dataset.category : 'All';
}

function filterBlogPosts() {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = getActiveCategory();

  const filtered = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchValue) || post.excerpt.toLowerCase().includes(searchValue);
    const matchesCategory = category === 'All' || post.category === category;
    return matchesSearch && matchesCategory;
  });

  renderBlogCards(filtered);
}

function openBlogDetail(id) {
  const post = blogPosts.find((item) => item.id === id);
  if (!post || !blogDetailSection) return;

  detailTitle.textContent = post.title;
  detailCategory.textContent = post.category;
  detailExcerpt.textContent = post.excerpt;
  detailImage.src = post.image;
  detailImage.alt = post.title;
  detailContent.innerHTML = post.content.map((paragraph) => `<p>${paragraph}</p>`).join('');
  detailLinks.innerHTML = post.links
    .map(
      (link) => `<a class="blog-detail-link" href="${link.href}" target="_blank" rel="noreferrer">${link.text}</a>`
    )
    .join('');

  blogDetailSection.classList.remove('hidden');
  blogGrid.closest('.blog-section').classList.add('hidden');
  document.getElementById('blog-search').classList.add('hidden');
  blogDetailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeBlogDetail() {
  if (!blogDetailSection) return;
  blogDetailSection.classList.add('hidden');
  blogGrid.closest('.blog-section').classList.remove('hidden');
  document.getElementById('blog-search').classList.remove('hidden');
  blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (blogGrid && searchInput) {
  renderBlogCards(blogPosts);
  searchInput.addEventListener('input', filterBlogPosts);
  blogFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      blogFilterButtons.forEach((buttonToReset) => buttonToReset.classList.remove('active'));
      button.classList.add('active');
      filterBlogPosts();
    });
  });
}

if (blogBackButton) {
  blogBackButton.addEventListener('click', closeBlogDetail);
}

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

  const inspoMediaItems = [
    {
      id: 'loft-glow',
      title: 'Loft Glow',
      type: 'image',
      src: '/assets/images/inspo/1.jpg',
      style: 'Modern',
      room: 'Living Room',
      category: 'Decor',
      link: '/assets/images/inspo/1.jpg'
    },
    {
      id: 'cozy-bedroom',
      title: 'Cozy Bedroom Mood',
      type: 'image',
      src: '/assets/images/inspo/12.png',
      style: 'Boho',
      room: 'Bedroom',
      category: 'Lighting',
      link: '/assets/images/inspo/12.png'
    },
    {
      id: 'minimal-kitchen',
      title: 'Minimal Kitchen Edit',
      type: 'image',
      src: '/assets/images/inspo/14.png',
      style: 'Minimal',
      room: 'Kitchen',
      category: 'Layout',
      link: '/assets/images/inspo/14.png'
    },
    {
      id: 'boho-luxe',
      title: 'Boho Luxe Living',
      type: 'image',
      src: '/assets/images/inspo/15.png',
      style: 'Boho',
      room: 'Living Room',
      category: 'Decor',
      link: '/assets/images/inspo/15.png'
    },
    {
      id: 'modern-office',
      title: 'Modern Office Flow',
      type: 'image',
      src: '/assets/images/inspo/2.png',
      style: 'Luxury',
      room: 'Office',
      category: 'Organization',
      link: '/assets/images/inspo/2.png'
    },
    {
      id: 'sunny-lounge',
      title: 'Japandi Lounge',
      type: 'image',
      src: '/assets/images/inspo/3.jpg',
      style: 'Japandi',
      room: 'Living Room',
      category: 'Lighting',
      link: '/assets/images/inspo/3.jpg'
    },
    {
      id: 'creative-reel-1',
      title: 'Creative Reel',
      type: 'video',
      src: '/assets/videos/reels/1.mp4',
      style: 'Modern',
      room: 'Living Room',
      category: 'Decor',
      link: '/assets/videos/reels/1.mp4'
    },
    {
      id: 'cozy-reel-2',
      title: 'Cozy Morning Reel',
      type: 'video',
      src: '/assets/videos/reels/2.mp4',
      style: 'Boho',
      room: 'Bedroom',
      category: 'Lighting',
      link: '/assets/videos/reels/2.mp4'
    },
    {
      id: 'modern-reel-3',
      title: 'Studio Reel',
      type: 'video',
      src: '/assets/videos/reels/3.mp4',
      style: 'Luxury',
      room: 'Office',
      category: 'Layout',
      link: '/assets/videos/reels/3.mp4'
    }
  ];

  const sanctuaryCollections = [
    {
      id: 'cozy-bedroom',
      title: 'Cozy Bedroom',
      description: 'Soft textures, warm lighting, and an intimate layer of comfort.',
      cover: '/assets/images/inspo/12.png',
      filters: ['Boho', 'Bedroom', 'Lighting']
    },
    {
      id: 'minimal-kitchen',
      title: 'Minimal Kitchen',
      description: 'Streamlined storage, thoughtful layout, and soft natural finishes.',
      cover: '/assets/images/inspo/14.png',
      filters: ['Minimal', 'Kitchen', 'Layout']
    },
    {
      id: 'modern-living',
      title: 'Modern Living Room',
      description: 'A crisp, layered space anchored by artful decor and calm structure.',
      cover: '/assets/images/inspo/1.jpg',
      filters: ['Modern', 'Living Room', 'Decor']
    },
    {
      id: 'luxury-office',
      title: 'Luxury Office',
      description: 'A focused workspace with polished finishes, mood lighting, and ease.',
      cover: '/assets/images/inspo/2.png',
      filters: ['Luxury', 'Office', 'Organization']
    }
  ];

  const activeFilters = {
    style: [],
    room: [],
    category: []
  };

  let selectedSanctuary = null;

  function setView(viewName) {
    if (!creativeView || !sanctuaryView) return;
    creativeView.classList.toggle('hidden', viewName !== 'creative');
    sanctuaryView.classList.toggle('hidden', viewName !== 'sanctuary');
    inspoToggleButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.view === viewName);
    });
  }

  function applyInspoFilters(items) {
    return items.filter((item) => {
      const matchesStyle = !activeFilters.style.length || activeFilters.style.includes(item.style);
      const matchesRoom = !activeFilters.room.length || activeFilters.room.includes(item.room);
      const matchesCategory = !activeFilters.category.length || activeFilters.category.includes(item.category);
      return matchesStyle && matchesRoom && matchesCategory;
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
      inspoMediaGrid.appendChild(card);
    });
  }

  function renderSanctuaryGrid() {
    if (!sanctuaryGrid) return;
    sanctuaryGrid.innerHTML = '';

    sanctuaryCollections.forEach((collection) => {
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
        const filteredItems = applyInspoFilters(inspoMediaItems);
window._allInspoItems = filteredItems;
renderMediaGrid(filteredItems);
        updateFilterTags();
      });
    });
  }

  function clearFilters() {
    activeFilters.style = [];
    activeFilters.room = [];
    activeFilters.category = [];
    selectedSanctuary = null;
    inspoFilterSelects.forEach((select) => {
      select.value = '';
    });
    updateFilterTags();
    const filteredItems = applyInspoFilters(inspoMediaItems);
window._allInspoItems = filteredItems;
renderMediaGrid(filteredItems);
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  function handleFilterChange(select) {
    const type = select.dataset.filterType;
    const value = select.value;
    activeFilters[type] = value ? [value] : [];

    selectedSanctuary = null;
    const filteredItems = applyInspoFilters(inspoMediaItems);
window._allInspoItems = filteredItems;
renderMediaGrid(filteredItems);
    updateFilterTags();
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  inspoToggleButtons.forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });

  inspoFilterSelects.forEach((select) => {
    select.addEventListener('change', () => handleFilterChange(select));
  });
  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', clearFilters);
  }

  if (sanctuaryBack) {
    sanctuaryBack.addEventListener('click', () => {
      selectedSanctuary = null;
      sanctuaryDetail.classList.add('hidden');
      sanctuaryGrid.classList.remove('hidden');
    });
  }

  renderSanctuaryGrid();
  updateFilterTags();
  const filteredItems = applyInspoFilters(inspoMediaItems);
window._allInspoItems = filteredItems;
renderMediaGrid(filteredItems);
  setView('creative');
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

  if (!products.length) {
    shopEmpty.classList.remove('hidden');
    return;
  }

  shopEmpty.classList.add('hidden');

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card shop-card';
    card.dataset.product = product.id;
    card.innerHTML = `
      <img src="${encodeURI(product.image)}" alt="${product.name}" />
      <div class="shop-card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="shop-card-footer">
          <div>
           <div style="text-align:center;margin-top:auto;padding-top:1rem">
              <a class="btn btn-read" href="${detailPath}" style="display:inline-flex;justify-content:center">Read More</a>
            </div> 
          </div>
      </div>
    `;

    card.addEventListener('click', () => openProductDetail(product.id));
    const button = card.querySelector('[data-action="shop-now"]');
    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        window.open(product.affiliate_link || '#', '_blank', 'noopener,noreferrer');
      });
    }

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
    const matchesSearch = [product.name, product.category, product.subcategory, product.type, product.description]
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

function openProductDetail(id) {
  const product = shopProducts.find((item) => item.id === id);
  if (!product || !shopDetailSection) return;

  if (detailTitleShop) detailTitleShop.textContent = product.name;
  if (detailCategoryShop) detailCategoryShop.textContent = `${product.category} · ${product.subcategory}`;
  if (detailDescription) detailDescription.textContent = product.description;
  if (detailimageshop) {
    detailimageshop.src = encodeURI(product.image);
    detailimageshop.alt = product.name;
  }
  if (detailPrice) detailPrice.textContent = `$${product.price.toFixed(2)}`;
  if (detailContentShop) {
    detailContentShop.innerHTML = product.details.map((paragraph) => `<p>${paragraph}</p>`).join('');
  }
  if (detailActionsShop) {
    detailActionsShop.innerHTML = `
      <a class="shop-detail-link" href="${product.link}" target="_blank" rel="noreferrer">Shop Now</a>
    `;
  }

  shopDetailSection.classList.remove('hidden');
  if (shopProductsSection) shopProductsSection.classList.add('hidden');
  if (shopFilterSection) shopFilterSection.classList.add('hidden');
  shopDetailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeProductDetail() {
  if (!shopDetailSection) return;

  shopDetailSection.classList.add('hidden');
  if (shopProductsSection) shopProductsSection.classList.remove('hidden');
  if (shopFilterSection) shopFilterSection.classList.remove('hidden');
  if (shopProductsSection) shopProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (shopGrid && shopSearchInput) {
  renderShopCards(shopProducts);
  shopSearchInput.addEventListener('input', filterShopProducts);
}

[filterCategory, filterSubcategory, filterPrice, filterType].forEach((selector) => {
  if (selector) {
    selector.addEventListener('change', filterShopProducts);
  }
});

if (shopBackButton) {
  shopBackButton.addEventListener('click', closeProductDetail);
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

  if (!ebooks.length) {
    ebookEmpty.classList.remove('hidden');
    return;
  }

  ebookEmpty.classList.add('hidden');

  ebooks.forEach((ebook) => {
    const card = document.createElement('article');
    card.className = 'ebook-card';
    card.dataset.ebook = ebook.id;
    card.innerHTML = `
      <img src="${encodeURI(ebook.cover)}" alt="${ebook.title}" onerror="this.outerHTML='<div class=&quot;image-placeholder&quot;>Cover image</div>';" />
      <div class="ebook-card-body">
        <h3>${ebook.title}</h3>
        <div class="ebook-card-footer">
          <span class="ebook-price">${ebook.price ? '$' + ebook.price : ''}</span>
          <a href="${ebook.link}" target="_blank" rel="noreferrer" class="btn-get-guide" onclick="event.stopPropagation();">Get the Guide</a>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openEbookDetail(ebook.id));
    ebookGrid.appendChild(card);
  });
}

function filterEbooks() {
  if (!ebookGrid) return;

  const searchValue = ebookSearchInput ? ebookSearchInput.value.trim().toLowerCase() : '';
  const activeCategory = getActiveEbookCategory();

  const filtered = ebookData.filter((ebook) => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchValue) || ebook.description.toLowerCase().includes(searchValue);
    const matchesCategory = activeCategory === 'All' || ebook.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  renderEbookCards(filtered);
}

function openEbookDetail(id) {
  const ebook = ebookData.find((item) => item.id === id);
  if (!ebook || !ebookDetailSection) return;

  detailEbookTitle.textContent = ebook.title;
  detailEbookDescription.textContent = ebook.description;
  detailEbookPrice.textContent = ebook.price;
  detailEbookImage.src = encodeURI(ebook.cover);
  detailEbookImage.alt = ebook.title;
  detailEbookActions.innerHTML = `
    <a class="ebook-detail-link" href="${ebook.link}" target="_blank" rel="noreferrer">Get the Guide</a>
  `;

  ebookDetailSection.classList.remove('hidden');
  if (ebookListSection) ebookListSection.classList.add('hidden');
  if (ebookSearchSection) ebookSearchSection.classList.add('hidden');
  if (ebookFilterSection) ebookFilterSection.classList.add('hidden');
  ebookDetailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeEbookDetail() {
  if (!ebookDetailSection) return;
  ebookDetailSection.classList.add('hidden');
  if (ebookListSection) ebookListSection.classList.remove('hidden');
  if (ebookSearchSection) ebookSearchSection.classList.remove('hidden');
  if (ebookFilterSection) ebookFilterSection.classList.remove('hidden');
  if (ebookListSection) ebookListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (ebookGrid && ebookSearchInput) {
  renderEbookCards(ebookData);
  ebookSearchInput.addEventListener('input', filterEbooks);
}

ebookFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    ebookFilterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    filterEbooks();
  });
});

if (ebookBackButton) {
  ebookBackButton.addEventListener('click', closeEbookDetail);
}

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


