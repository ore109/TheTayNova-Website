document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,' + btoa('<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f5efe6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b6475" font-family="Inter" font-size="16">Image</text></svg>');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function(e) {
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
    cover: 'assets/Images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (4).png',
    image: 'assets/Images/blog/content/cozy.png',
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
    cover: 'assets/Images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (2).png',
    image: 'assets/Images/blog/content/4.png',
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
    cover: 'assets/Images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (3).png',
    image: 'assets/Images/blog/content/lux 1.png',
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
    cover: 'assets/Images/blog/cover/Green Clean and Corporate Move Pinterest Video Pin Blog Substack (5).png',
    image: 'assets/Images/blog/content/3.png',
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
      src: 'assets/Images/inspo/1.jpg',
      style: 'Modern',
      room: 'Living Room',
      category: 'Decor',
      link: 'assets/Images/inspo/1.jpg'
    },
    {
      id: 'cozy-bedroom',
      title: 'Cozy Bedroom Mood',
      type: 'image',
      src: 'assets/Images/inspo/12.png',
      style: 'Boho',
      room: 'Bedroom',
      category: 'Lighting',
      link: 'assets/Images/inspo/12.png'
    },
    {
      id: 'minimal-kitchen',
      title: 'Minimal Kitchen Edit',
      type: 'image',
      src: 'assets/Images/inspo/14.png',
      style: 'Minimal',
      room: 'Kitchen',
      category: 'Layout',
      link: 'assets/Images/inspo/14.png'
    },
    {
      id: 'boho-luxe',
      title: 'Boho Luxe Living',
      type: 'image',
      src: 'assets/Images/inspo/15.png',
      style: 'Boho',
      room: 'Living Room',
      category: 'Decor',
      link: 'assets/Images/inspo/15.png'
    },
    {
      id: 'modern-office',
      title: 'Modern Office Flow',
      type: 'image',
      src: 'assets/Images/inspo/2.png',
      style: 'Luxury',
      room: 'Office',
      category: 'Organization',
      link: 'assets/Images/inspo/2.png'
    },
    {
      id: 'sunny-lounge',
      title: 'Japandi Lounge',
      type: 'image',
      src: 'assets/Images/inspo/3.jpg',
      style: 'Japandi',
      room: 'Living Room',
      category: 'Lighting',
      link: 'assets/Images/inspo/3.jpg'
    },
    {
      id: 'creative-reel-1',
      title: 'Creative Reel',
      type: 'video',
      src: 'assets/videos/reels/1.mp4',
      style: 'Modern',
      room: 'Living Room',
      category: 'Decor',
      link: 'assets/videos/reels/1.mp4'
    },
    {
      id: 'cozy-reel-2',
      title: 'Cozy Morning Reel',
      type: 'video',
      src: 'assets/videos/reels/2.mp4',
      style: 'Boho',
      room: 'Bedroom',
      category: 'Lighting',
      link: 'assets/videos/reels/2.mp4'
    },
    {
      id: 'modern-reel-3',
      title: 'Studio Reel',
      type: 'video',
      src: 'assets/videos/reels/3.mp4',
      style: 'Luxury',
      room: 'Office',
      category: 'Layout',
      link: 'assets/videos/reels/3.mp4'
    }
  ];

  const sanctuaryCollections = [
    {
      id: 'cozy-bedroom',
      title: 'Cozy Bedroom',
      description: 'Soft textures, warm lighting, and an intimate layer of comfort.',
      cover: 'assets/Images/inspo/12.png',
      filters: ['Boho', 'Bedroom', 'Lighting']
    },
    {
      id: 'minimal-kitchen',
      title: 'Minimal Kitchen',
      description: 'Streamlined storage, thoughtful layout, and soft natural finishes.',
      cover: 'assets/Images/inspo/14.png',
      filters: ['Minimal', 'Kitchen', 'Layout']
    },
    {
      id: 'modern-living',
      title: 'Modern Living Room',
      description: 'A crisp, layered space anchored by artful decor and calm structure.',
      cover: 'assets/Images/inspo/1.jpg',
      filters: ['Modern', 'Living Room', 'Decor']
    },
    {
      id: 'luxury-office',
      title: 'Luxury Office',
      description: 'A focused workspace with polished finishes, mood lighting, and ease.',
      cover: 'assets/Images/inspo/2.png',
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
        renderMediaGrid(applyInspoFilters(inspoMediaItems));
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
    renderMediaGrid(applyInspoFilters(inspoMediaItems));
    if (sanctuaryDetail) sanctuaryDetail.classList.add('hidden');
    if (sanctuaryGrid) sanctuaryGrid.classList.remove('hidden');
  }

  function handleFilterChange(select) {
    const type = select.dataset.filterType;
    const value = select.value;
    activeFilters[type] = value ? [value] : [];

    selectedSanctuary = null;
    renderMediaGrid(applyInspoFilters(inspoMediaItems));
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
  renderMediaGrid(applyInspoFilters(inspoMediaItems));
  setView('creative');
}

const shopProducts = [
  {
    id: 'ceramic-cups',
    name: 'Elegant Ceramic Cups',
    category: 'Kitchen',
    subcategory: 'Tableware',
    type: 'Decor',
    price: 25,
    discount: '10% off',
    image: 'assets/Images/products/cups.jpg',
    description: 'A sculptural set of ceramic cups for elevated everyday rituals.',
    details: [
      'Handcrafted-inspired curves designed to brighten every morning coffee.',
      'Perfect for tabletop styling and thoughtful everyday use.',
      'Pairs beautifully with warm neutrals, soft linens, and layered textures.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'decorative-basket',
    name: 'Decorative Basket',
    category: 'Living Room',
    subcategory: 'Storage',
    type: 'Storage',
    price: 35,
    discount: '15% off',
    image: 'assets/Images/products/basket.jpg',
    description: 'A woven accent basket to keep cozy throws and curated essentials close at hand.',
    details: [
      'Natural texture adds warmth and quiet luxury to a seating area.',
      'Great for storing blankets, magazines, or fresh market finds.',
      'Works beautifully next to sofas, entry benches, and bedroom corners.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'luxury-towels',
    name: 'Luxury Towels Set',
    category: 'Bathroom',
    subcategory: 'Textiles',
    type: 'Decor',
    price: 45,
    discount: null,
    image: 'assets/Images/products/towels.jpeg',
    description: 'Soft, absorbent towels designed to elevate everyday bathroom moments.',
    details: [
      'Generous size and plush texture for a boutique hotel feel.',
      'Neutral palette that complements both modern and classic schemes.',
      'Easy care fabric made for daily luxury and comfort.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'wooden-tray',
    name: 'Wooden Serving Tray',
    category: 'Kitchen',
    subcategory: 'Tableware',
    type: 'Decor',
    price: 30,
    discount: null,
    image: 'assets/Images/products/wood.jpg',
    description: 'A warm wooden tray for styled tabletops, breakfast in bed, and thoughtful serving moments.',
    details: [
      'Smooth finish with an organic shape that feels editorial and elevated.',
      'Perfect for styled trays, catchalls, and centerpieces.',
      'Pairs well with ceramic vessels, candles, and linen details.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'soft-throw',
    name: 'Soft Woven Throw',
    category: 'Living Room',
    subcategory: 'Textiles',
    type: 'Decor',
    price: 48,
    discount: '20% off',
    image: 'assets/Images/products/unnamed.jpg',
    description: 'A luxe throw made for layered comfort and quiet visuals.',
    details: [
      'Soft, tactile weave in a neutral shade for timeless styling.',
      'Ideal for draping over a sofa, bed, or reading chair.',
      'Adds instant warmth and a designer-finished look.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'modern-lamp',
    name: 'Modern Table Lamp',
    category: 'Bedroom',
    subcategory: 'Lighting',
    type: 'Lighting',
    price: 68,
    discount: null,
    image: 'assets/Images/products/light.jpg',
    description: 'A sculptural lamp with polished details for a soft, ambient glow.',
    details: [
      'Clean form with a luxe finish that complements modern interiors.',
      'Perfect for bedside, desk, or styled living room surfaces.',
      'Designed to bring gentle mood lighting to quiet spaces.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'glass-soap-dispenser',
    name: 'Glass Soap Dispenser',
    category: 'Bathroom',
    subcategory: 'Decor',
    type: 'Decor',
    price: 18,
    discount: null,
    image: 'assets/Images/products/soap dispensr.png',
    description: 'A refined glass dispenser for stylish bathroom and kitchen counters.',
    details: [
      'Minimal, transparent form for a clean and polished look.',
      'Ideal for hand soap, lotion, or gentle hand wash blends.',
      'A simple styling detail that elevates daily rituals.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'dinner-plate-set',
    name: 'Ceramic Dinner Plate Set',
    category: 'Kitchen',
    subcategory: 'Tableware',
    type: 'Decor',
    price: 52,
    discount: null,
    image: 'assets/Images/products/plate.jpg',
    description: 'A neutral plate set with subtle texture for an editorial table setting.',
    details: [
      'Smooth ceramic finish that feels both modern and timeless.',
      'Perfect for styled dinners, brunches, and everyday dining.',
      'Pairs seamlessly with layered linens and wooden trays.'
    ],
    link: 'https://selar.com/m/tay-nova1'
  }
];

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
const detailImageShop = document.getElementById('detail-image');
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
            <span class="shop-price">$${product.price.toFixed(2)}</span>
            ${product.discount ? `<span class="discount-badge">${product.discount}</span>` : ''}
          </div>
          <button type="button" class="btn-shop-now" data-action="shop-now">Shop Now</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openProductDetail(product.id));
    const button = card.querySelector('[data-action="shop-now"]');
    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openProductDetail(product.id);
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
  if (detailImageShop) {
    detailImageShop.src = encodeURI(product.image);
    detailImageShop.alt = product.name;
  }
  if (detailPrice) detailPrice.textContent = `$${product.price.toFixed(2)}`;
  if (detailContentShop) {
    detailContentShop.innerHTML = product.details.map((paragraph) => `<p>${paragraph}</p>`).join('');
  }
  if (detailActionsShop) {
    detailActionsShop.innerHTML = `
      <a class="shop-detail-link" href="${product.link}" target="_blank" rel="noreferrer">View Product</a>
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

const ebookData = [
  {
    id: 'study-sleep',
    title: 'Study & Sleep: Creating Your Perfect Sanctuary',
    description: 'A comprehensive guide to designing a bedroom and study nook that promotes restful sleep, deep focus, and peaceful mornings. Learn spatial layouts, color theory, lighting strategies, and textural elements that work together to create your personal sanctuary.',
    price: '$12.99',
    category: 'Productivity & Wellness',
    cover: 'assets/Images/ebooks/covers/Study and sleep.jpg',
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'smart-home',
    title: 'Smart Home Rest: Modern Living Made Mindful',
    description: 'Discover how to integrate smart home technology with intentional design. This guide walks you through creating spaces that feel both modern and calm, using technology to enhance—not dominate—your daily rituals.',
    price: '$10.99',
    category: 'Aesthetic Living',
    cover: 'assets/Images/ebooks/covers/Smart home rest.jpg',
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'reset-home',
    title: 'Reset Your Home: A 30-Day Transformation',
    description: 'A step-by-step guide to curating, editing, and redesigning your home in 30 days. Perfect for those ready to declutter, reimagine their space, and create an environment that truly reflects their lifestyle.',
    price: '$14.99',
    category: 'Home Styling',
    cover: 'assets/Images/ebooks/covers/reset home.jpg',
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'blog-page-guide',
    title: 'Building Your Blog Page: A Creator\'s Guide',
    description: 'Learn how to design a blog page that reflects your brand and keeps readers engaged. From layout strategies to content organization, this guide covers everything you need to launch a beautiful editorial presence.',
    price: '$9.99',
    category: 'Creator Growth',
    cover: 'assets/Images/ebooks/covers/blog page.png',
    link: 'https://selar.com/m/tay-nova1'
  },
  {
    id: 'home-variation',
    title: 'Home Variation: A Year of Seasonal Updates',
    description: 'Explore how to refresh your home seasonally without a full redesign. Discover styling tips, color transitions, and textile swaps that keep your space feeling new throughout the year.',
    price: '$11.99',
    category: 'Lifestyle Guides',
    cover: 'assets/Images/ebooks/covers/2 variation.jpg',
    link: 'https://selar.com/m/tay-nova1'
  }
];

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
          <span class="ebook-price">${ebook.price}</span>
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


