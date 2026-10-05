(() => {
  'use strict';
  const data = window.DEMO_DATA;
  const main = document.querySelector('#main');
  const KEY = 'menstruation-web-demo-v1';
  const defaults = () => ({ favorites: [], posts: [], records: [], applications: [], joins: [], school: '演示中学' });
  let state = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') {
      for (const key of ['favorites', 'posts', 'records', 'applications', 'joins']) if (Array.isArray(saved[key])) state[key] = saved[key].filter(item => key === 'favorites' ? typeof item === 'string' : item && typeof item === 'object').slice(0, 200);
      if (typeof saved.school === 'string') state.school = saved.school.slice(0, 40);
    }
  } catch { /* Private browsing / invalid saved data: start a clean local session. */ }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const date = () => new Date().toLocaleDateString('sv-SE');
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  let memoryOnly = false;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { memoryOnly = true; toast('浏览器不能保存数据，本次体验仅在页面打开期间有效。'); } }
  let toastTimer;
  function toast(text) { const box = document.querySelector('#toast'); box.textContent = text; box.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('show'), 4000); }
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-3-1-6-2-10 1Z"/>',
    chat: '<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0Z"/><path d="M7 10h10M7 14h6"/>',
    heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 10 8 15 7-5 12-11 8-15Z"/>',
    box: '<path d="M3 7 12 3l9 4v13H3Z"/><path d="M3 7h18M12 7v13M8 3l9 4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h2M15 15h2"/>',
    phone: '<path d="M5 3h4l2 5-3 2c2 4 3 5 7 7l2-3 5 2v4c-1 4-7 2-12-2S0 4 5 3Z"/>',
    shield: '<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
    leaf: '<path d="M20 3c0 9-3 16-10 16a7 7 0 0 1-7-7C3 5 11 3 20 3Z"/><path d="m3 21 12-12"/>',
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
  const link = (route, label, type = 'secondary') => `<a class="${type}" href="#${route}">${label}</a>`;
  const button = (action, label, type = 'secondary', id = '') => `<button type="button" class="${type}" data-action="${action}" data-id="${esc(id)}">${label}</button>`;
  const back = route => `<a class="back" href="#${route}">← 返回</a>`;
  const head = (title, description, parent = '') => `${parent ? back(parent) : ''}<div class="page-head"><div class="eyebrow">经心守护 / 交互演示</div><h1>${title}</h1><p class="lead">${description}</p></div>`;
  const entry = (route, title, description, glyph) => `<a class="card entry" href="#${route}"><span class="icon-box">${icon(glyph)}</span><div><h3>${title}</h3><p>${description}</p></div><span class="arrow" aria-hidden="true">›</span></a>`;
  const empty = text => `<div class="empty">${text}</div>`;
  const note = text => `<div class="safe-note">${text}</div>`;
  const tag = (text, green = false) => `<span class="tag${green ? ' green' : ''}">${esc(text)}</span>`;
  const stats = () => `<div class="stats">${data.carePackage.stats.map(item => `<div class="stat"><strong>${esc(item.value)}</strong><span>${esc(item.label)}</span></div>`).join('')}</div>`;
  let knowledgeTab = 'articles', search = '', category = '全部';
  let communityTab = 'square';
  const views = {
    home() {
      return `<section class="hero"><div class="eyebrow">一份安心的经期支持</div><h1>认识身体，<br>也照顾自己的感受。</h1><p class="lead">在这里阅读科学知识、安心提问，<br>了解校园支持与关怀包。</p><div class="actions">${link('about', '先去了解', 'primary')}${link('community/ask', '匿名提问')}</div><span class="hero-symbol">${icon('leaf')}</span></section>
      <div class="section-title"><h2>你现在需要什么？</h2><a href="#hotline">查看求助方式 →</a></div><div class="grid">${entry('knowledge', '经期科普', '把疑问读明白，把误解说清楚。', 'book')}${entry('care', '关怀包', '了解物资内容，体验申请与查询。', 'box')}${entry('community', '同伴互助', '匿名交流，找到被理解的感觉。', 'chat')}${entry('period', '经期记录', '记录日期与感受，只保存在本机。', 'calendar')}</div>
      <div class="section-title"><h2>看见每一份关怀</h2><a href="#distribution">公开分发情况 →</a></div><div class="card">${stats()}<p class="muted" style="font-size:12px;margin:16px 0 0;text-align:center">虚构统计，仅用于展示公开分发界面</p></div>
      <div class="grid">${entry('products', '用品选购指南', '按使用场景了解选择思路，不推荐品牌。', 'shield')}${entry('projects', '公益项目', '了解项目与志愿参与方向。', 'heart')}</div>`;
    },
    about() { return `${head('关于经心守护', '一个连接经期知识、同伴支持与校园关怀的小程序。', 'home')}<div class="card"><h2>你可以在这里做什么</h2><p>从科普阅读开始，了解经期变化、日常护理与常见误解；遇到一般性疑问时，可以通过匿名互助交流；有物资支持需求时，可以了解关怀包与申请流程。</p><p>经期不是需要隐藏的错误。你可以按照自己的节奏了解知识，也可以向可信任的人寻求帮助。</p></div><div class="grid">${entry('knowledge','读懂经期','科普、辟谣、选购和记录。','book')}${entry('community','安心交流','匿名提问、我的帖子与回复提醒。','chat')}${entry('care','了解关怀','申请、编号查询与公开分发。','box')}${entry('projects','参与公益','项目介绍和模拟意向登记。','heart')}</div>${note('此网页是独立演示，不是微信小程序正式版。无需登录，不连接云数据库；审核、回复、申请进度均为模拟。演示页面不会实际寄送物资、接通热线或收取款项。')}`; },
    knowledge() {
      const tabs = [['articles', '知识卡片'], ['rumors', '辟谣专区'], ['favorites', `我的收藏 (${state.favorites.length})`]];
      let items = knowledgeTab === 'rumors' ? data.rumors : data.knowledge;
      if (knowledgeTab === 'favorites') items = [...data.knowledge, ...data.rumors].filter(item => state.favorites.includes(item.id));
      items = items.filter(item => (category === '全部' || knowledgeTab !== 'articles' || item.category === category) && [item.title, item.summary, item.content, item.detail, item.truth].join(' ').toLowerCase().includes(search.toLowerCase()));
      return `${head('经期科普', '用清楚的文字回答疑问。18 篇科普与 10 篇辟谣可完整阅读。')}<div class="grid">${entry('products', '用品选购指南', '按场景认识合适的用品。', 'shield')}${entry('period', '经期记录与自测', '日期、感受与求助提示。', 'calendar')}</div><div class="filters" role="group" aria-label="内容类型">${tabs.map(([value, label]) => `<button class="chip ${knowledgeTab === value ? 'active' : ''}" data-action="knowledge-tab" data-id="${value}" aria-pressed="${knowledgeTab === value}">${label}</button>`).join('')}</div><form id="search-form" class="search-row"><label class="sr-only" for="search">搜索科普与辟谣</label><input id="search" type="search" placeholder="搜索关键词，如：初潮、护理" value="${esc(search)}"><button class="secondary">搜索</button></form>${knowledgeTab === 'articles' ? `<div class="filters" role="group" aria-label="知识分类">${['全部', '基础知识', '经期护理', '选购指南', '常见问题'].map(value => `<button class="chip ${category === value ? 'active' : ''}" data-action="category" data-id="${value}" aria-pressed="${category === value}">${value}</button>`).join('')}</div>` : '<div style="height:20px"></div>'}<div class="grid">${items.map(item => `<a href="#article/${esc(item.id)}" class="card article-link">${tag(item.category || '辟谣专区')}<h2>${esc(item.title)}</h2><p>${esc(item.summary || item.truth)}</p><div class="meta"><span>阅读详情 →</span>${state.favorites.includes(item.id) ? '<span>已收藏</span>' : ''}</div></a>`).join('')}</div>${items.length ? '' : empty('还没有符合条件的内容。试试其他关键词或分类。')}`;
    },
    article(id) {
      const item = [...data.knowledge, ...data.rumors].find(item => item.id === id);
      if (!item) return notFound();
      const sections = String(item.content || item.detail || '').split(/^##\s+/m).filter(Boolean).map(text => { const [title, ...body] = text.trim().split('\n'); return { title, body: body.join('\n').trim() }; });
      const source = item.source && /^https:\/\//.test(item.source.url || '') ? `<a class="source-link" href="${esc(item.source.url)}" target="_blank" rel="noopener noreferrer">${esc(item.source.name)}（新窗口） ↗</a>` : '暂无来源链接';
      return `<div class="article">${head(esc(item.title), esc(item.summary || item.truth), 'knowledge')}<div class="actions">${button('favorite', state.favorites.includes(id) ? '取消收藏' : '收藏到本机', 'secondary', id)}${tag(item.category || '辟谣专区')}</div><div class="card" style="margin-top:20px">${item.truth ? `<h2>先看结论</h2><p>${esc(item.truth)}</p>` : ''}<nav class="toc" aria-label="阅读目录"><h3>阅读提要 · 点击直达</h3>${sections.map((section, i) => `<a href="#section-${i}" data-section="section-${i}">${i + 1}. ${esc(section.title)}</a>`).join('')}</nav>${sections.map((section, i) => `<section id="section-${i}"><h2>${esc(section.title)}</h2>${section.body.split('\n\n').map(text => `<p>${esc(text)}</p>`).join('')}</section>`).join('')}<div class="safe-note">来源核对：${source}<br>内容沿用小程序知识库；不表示来源机构背书，也不替代专业诊疗。</div></div>${link('hotline', '需要帮助？查看求助方式')}</div>`;
    },
    products() { return `${head('用品选购指南', '不推荐品牌、不提供购物交易，按场景了解选择思路。', 'knowledge')}<form id="product-form" class="card"><div class="field"><label for="scenario">你的使用场景</label><select id="scenario"><option value="day">白天上课或日常活动</option><option value="night">夜间休息</option><option value="away">外出或不便及时更换</option></select></div><div class="field"><label for="priority">你更关注什么</label><select id="priority"><option value="comfort">穿着舒适与透气</option><option value="coverage">覆盖范围与吸收量</option><option value="carry">便于携带与更换</option></select></div><button class="primary">查看选择思路</button><div id="product-result" role="status" aria-live="polite"></div></form><div class="card"><h2>选购前的小检查</h2><ul class="checklist"><li>查看包装是否完整，以及产品信息、有效期和使用说明。</li><li>根据使用场景、流量和舒适度选择规格。</li><li>按照说明及时更换；不适时停止使用并寻求专业帮助。</li></ul>${link('article/shopping', '阅读完整选购知识')}</div>`; },
    period() { return `${head('经期记录与自测', '仅保存在当前浏览器。演示时请填写虚构日期和感受。', 'knowledge')}<div class="grid"><form id="period-form" class="card"><h2>添加一条记录</h2><div class="field-row"><div class="field"><label for="period-date">开始日期</label><input type="date" id="period-date" max="${date()}" value="${date()}" required></div><div class="field"><label for="duration">持续天数（1—15 天）</label><input type="number" id="duration" min="1" max="15" required placeholder="例如 5"></div></div><div class="field"><label for="feeling">本次感受</label><select id="feeling"><option>未选择感受</option><option>轻微不适</option><option>影响日常活动</option><option>想咨询专业人士</option></select></div><div class="error" id="period-error" role="alert"></div><button class="primary">保存到本机</button></form><div class="card"><h2>我的演示记录</h2>${state.records.length ? state.records.slice().sort((a,b) => String(b.date).localeCompare(String(a.date))).map(record => `<div class="record"><div><strong>${esc(record.date)} · ${esc(record.duration)} 天</strong><small>${esc(record.feeling)}</small></div>${button('remove-record','删除','text-button',record.id)}</div>`).join('') : empty('还没有记录，试着添加一条虚构记录。')}<p class="muted" style="font-size:13px;margin-top:16px">记录用于生活参考，不预测排卵、不用于避孕，也不生成诊断。</p></div></div><form id="check-form" class="card"><h2>需要进一步求助吗？</h2><p>以下是求助提示演示，不是医学测评或诊断。</p><label class="check"><input type="checkbox" name="concern">我的不适影响上课、睡眠或日常生活。</label><label class="check"><input type="checkbox" name="concern">我对这次变化感到担心，想找可信任的人咨询。</label><button class="secondary">查看提示</button><div id="check-result" role="status" aria-live="polite"></div></form>${note('如果存在明显或严重不适，请及时向可信任成年人、校医或正规医院求助，不要等待线上回复。')}`; },
    community(sub) {
      if (sub === 'ask') return askView();
      const posts = [...data.questions.map(item => ({ ...item, status: '已公开', demo: true })), ...state.posts.filter(item => item.status === '已公开')];
      let items = communityTab === 'mine' ? state.posts : communityTab === 'school' ? posts.filter(item => item.school === state.school) : communityTab === 'messages' ? state.posts.filter(item => item.reply) : communityTab === 'featured' ? posts.filter(item => item.featured) : posts;
      return `${head('同伴互助', '匿名不等于无人负责。尊重他人，不公开身份和私密信息。')}<div class="actions">${link('community/ask', '匿名提问', 'primary')}<label class="sr-only" for="school">演示学校</label><select id="school" style="width:auto;max-width:100%"><option${state.school === '演示中学' ? ' selected' : ''}>演示中学</option><option${state.school === '希望中学' ? ' selected' : ''}>希望中学</option></select></div><div class="filters">${[['square','全校广场'],['school','本校专区'],['featured','精选问答'],['mine',`我的帖子 (${state.posts.length})`],['messages',`回复消息 (${state.posts.filter(item => item.reply).length})`]].map(([value,label]) => `<button class="chip ${communityTab === value ? 'active' : ''}" data-action="community-tab" data-id="${value}" aria-pressed="${communityTab === value}">${label}</button>`).join('')}</div>${items.map(item => `<a class="card article-link" href="#question/${esc(item.id)}">${tag(item.status || '演示回复', item.status === '已公开')}<h2>${esc(item.title)}</h2><p>${esc(communityTab === 'messages' ? item.reply : item.body || item.answer || '模拟帖子，点击查看详情。')}</p><div class="meta"><span>匿名同学 · ${esc(item.school || '广场')}</span><span>${item.demo ? '虚构问答' : '本机演示帖子'}</span></div></a>`).join('')}${items.length ? '' : empty('这里暂时没有内容。可以发布一条演示提问，或切换其他专区。')}${note('发布后先在“我的帖子”查看待审核内容；通过详情页的“模拟审核通过并回复”按钮体验公开和消息流程。这只是演示，不是真实内容审核。')}`;
    },
    question(id) {
      const item = state.posts.find(post => post.id === id) || data.questions.find(post => post.id === id);
      if (!item) return notFound();
      const mine = state.posts.some(post => post.id === id);
      return `${head(esc(item.title), '匿名同学 · 本机模拟问答', 'community')}<div class="card">${tag(item.status || '已公开', item.status === '已公开')}<p>${esc(item.body || item.answer)}</p>${mine && item.status === '待审核' ? `${note('此帖子未显示在广场。你可通过下方按钮体验模拟审核和回复。')} ${button('approve-post', '模拟审核通过并回复', 'primary', id)}` : ''}${mine ? `<div class="actions" style="margin-top:16px">${button('remove-post','删除我的演示帖子','secondary',id)}</div>` : ''}</div><div class="card"><h2>回复</h2><p>${esc(item.reply || item.answer || '还没有回复，模拟审核通过后会出现一条演示回复。')}</p><span class="muted">仅作流程展示，不构成专业诊疗建议。</span></div>${mine ? '' : button('report-post','模拟举报这条帖子','secondary',id)}`;
    },
    care(sub) {
      if (sub === 'apply') return applyView();
      return `${head('经期关怀包', '了解物资与流程，体验有隐私保护的支持方式。', 'home')}<div class="card"><div class="eyebrow">关怀内容</div><h2>一份用品，一份安心</h2><ul class="checklist">${data.carePackage.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul><div class="actions">${link('care/apply','模拟申请关怀包','primary')}${link('distribution','公开分发情况')}</div></div><div class="card"><h2>我的申请与进度</h2>${state.applications.length ? state.applications.map(item => applicationCard(item)).join('') : empty('还没有演示申请。提交后可在这里查看编号和进度。')}<form id="query-form" class="search-row"><label class="sr-only" for="query-code">演示申请编号</label><input id="query-code" required placeholder="输入当前浏览器内的申请编号"><button class="secondary">查询</button></form><div id="query-result" aria-live="polite"></div></div>${note('这是虚构申请流程，不会寄送物资。网页不收集真实姓名、手机号、详细住址或证明材料，编号只在当前浏览器有效。')}`;
    },
    distribution() {
      return `${head('公开分发与参与登记', '让物资去向更清楚。以下批次、数字均为虚构演示。', 'care')}<div class="card">${stats()}</div><div class="grid"><div class="card"><div class="batch"><div>${tag('演示批次')}<h2>秋季校园关怀</h2></div>${icon('box')}</div><p class="muted">演示编号 DEMO-2026-09 · 3 所模拟学校</p><div class="progress" role="img" aria-label="演示批次领取进度 75%"><span></span></div><div class="batch"><strong>48 / 64 份</strong><span class="muted">演示领取进度 75%</span></div><p class="muted" style="font-size:13px;margin-top:16px">模拟备货 → 核验 → 匿名领取点签收 → 编号更新</p></div><div class="card"><h2>分配与费用构成</h2>${data.carePackage.costs.map(item => `<div class="record"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`).join('')}<p class="muted" style="font-size:13px;margin-top:16px">比例为界面演示，不是真实资金账目。</p></div></div><div class="card"><h2>月度演示记录</h2>${data.carePackage.monthly.map(item => `<div class="record"><div><strong>${esc(item.month)}</strong><small>${esc(item.note)}</small></div><span>${esc(item.count)}</span></div>`).join('')}</div>${joinForm()}${note('当前不收款、不处理真实物资募集，也不公开申请者身份。正式服务需另行公布运营主体、真实记录和参与规则。')}`;
    },
    projects() { return `${head('公益项目', '了解经期健康支持与校园参与方向。')}<div class="grid">${data.projects.map(item => `<a class="card article-link" href="#project/${esc(item.id)}">${tag(item.category)}<h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><div class="meta"><span>${item.demo ? '虚构项目展示' : '项目设想，未正式招募'}</span><span>查看详情 →</span></div></a>`).join('')}</div>${note('这些资料用于演示项目展示能力，不代表已开展的合作或真实报名入口。')}`; },
    project(id) { const item = data.projects.find(item => item.id === id); if (!item) return notFound(); return `${head(esc(item.title), esc(item.summary), 'projects')}<div class="card">${tag(item.demo ? '虚构项目' : '项目设计设想')}<h2>项目介绍</h2><p>${esc(item.detail)}</p><p>资料来源：${esc(item.source)}</p><p class="muted">${esc(item.action)}</p></div>${joinForm(item.title)}`; },
    hotline() { return `${head('求助与倾听', '有疑问或不适时，不必独自承担。', 'home')}<div class="card"><span class="icon-box">${icon('phone')}</span><h2 style="margin-top:20px">志愿者倾听热线</h2>${tag('待正式配置')}<p>当前未配置真实热线号码和服务时间，因此不能拨打或留言。</p><button class="secondary" disabled>热线尚未开放</button></div><div class="card"><h2>可以先向谁求助</h2><ul class="checklist"><li>可信任的家长、老师或其他成年人。</li><li>学校校医或正规医疗机构。</li><li>一般知识疑问可以阅读科普，或体验匿名提问。</li></ul>${link('community/ask','体验匿名提问')}</div>${note('此网页不能提供急救或实时咨询。明显或严重不适时，请及时线下求助；不要等待演示消息。')}`; },
    privacy() { return `${head('隐私与演示说明', '清楚了解这里会保存什么，以及如何清理。', 'home')}<div class="card"><h2>这是独立的网页演示</h2><p>不用微信登录，不取得 OpenID，不连接微信云数据库；不提交申请、帖子或参与登记给运营方。演示数据没有真实审核、寄送、报名、付款或消息推送能力。</p><h2>哪些内容保存在本机</h2><p>收藏、模拟提问、虚构经期记录、模拟申请与参与意向保存于当前浏览器的 localStorage。不同设备不共享，清理浏览器数据后可能丢失。共享设备上的其他使用者可能看见这些内容，所以请勿填写真实隐私。</p><h2>健康信息的边界</h2><p>科普内容沿用小程序知识库并附有来源。经期记录和求助提示只作生活参考，不构成诊断、治疗或避孕建议。需要帮助时，请联系可信任成年人、校医或正规医院。</p><h2>清除本机演示数据</h2><p>只清除这个网页的演示数据，不会影响微信小程序或云端数据。</p>${button('clear-data','清除本机演示数据','danger')}</div>${memoryOnly ? note('当前浏览器无法持久保存数据；本次体验使用临时内存。') : ''}`; },
  };
  function askView() { return `${head('匿名提问', '只提出一般知识问题，演示时请使用虚构内容。', 'community')}<form id="ask-form" class="card"><div class="field"><label for="post-title">问题标题（5—80 字）</label><input id="post-title" required minlength="5" maxlength="80" placeholder="例如：上课时突然来月经，可以向谁求助？"></div><div class="field"><label for="post-body">补充说明（5—600 字）</label><textarea id="post-body" required minlength="5" maxlength="600" aria-describedby="post-help"></textarea><small id="post-help">不要填写姓名、电话、详细住址或私密信息。演示敏感词规则不等同于正式审核。</small></div><div class="field"><label for="post-tag">问题分类</label><select id="post-tag"><option>基础知识</option><option>护理</option><option>选购</option><option>心理</option></select></div><label class="check"><input id="post-consent" type="checkbox" required>我了解这只是演示，并会尊重隐私和他人。</label><div id="post-error" class="error" role="alert"></div><div class="actions"><button class="primary">发布演示提问</button>${link('community','取消')}</div></form>`; }
  function applyView() { return `${head('模拟申请关怀包', '不收集真实身份和地址，也不会实际寄送物资。', 'care')}<form id="apply-form" class="card"><div class="field"><label for="apply-alias">演示称呼（2—20 字）</label><input id="apply-alias" maxlength="20" minlength="2" required placeholder="例如：演示同学"></div><div class="field"><label for="apply-school">模拟领取点</label><select id="apply-school"><option>演示中学 · 匿名领取点</option><option>希望中学 · 匿名领取点</option></select></div><div class="field"><label for="apply-reason">模拟申请说明（5—200 字）</label><textarea id="apply-reason" required minlength="5" maxlength="200" placeholder="仅填写虚构说明"></textarea></div><label class="check"><input type="checkbox" required>我了解这是模拟申请，编号不用于真实领取。</label><div id="apply-error" class="error" role="alert"></div><button class="primary">提交模拟申请</button></form>`; }
  function applicationCard(item) { const stages = ['待审核', '待领取', '已领取']; return `<div class="card" style="box-shadow:none"><strong>演示编号 ${esc(item.code)}</strong><p class="muted">${esc(item.school)} · ${esc(item.created)}</p><ol class="timeline">${stages.map((text,i) => `<li class="${i === item.stage ? 'current' : ''}">${text}${i === item.stage ? '（当前模拟状态）' : ''}</li>`).join('')}</ol>${item.stage < 2 ? button('advance-application', '模拟推进下一步', 'secondary', item.id) : tag('模拟流程完成', true)}</div>`; }
  function joinForm(project = '关怀包支持') { return `<form id="join-form" class="card" data-project="${esc(project)}"><h2>体验参与意向登记</h2><p class="muted">不收款、不发送报名，不填写联系方式。</p><div class="field"><label for="join-type">我想了解的方向</label><select id="join-type"><option>校园志愿服务</option><option>物资整理与支持</option><option>科普内容共创</option></select></div><button class="secondary">保存模拟参与意向</button><div id="join-result" role="status" aria-live="polite">${state.joins.length ? `<p class="muted" style="margin-top:16px">本机已保存 ${state.joins.length} 条模拟意向。</p>` : ''}</div></form>`; }
  function notFound() { return `${head('没有找到这个页面','该演示内容可能已清除或链接不正确。')}${link('home','返回首页','primary')}`; }
  function render(focus = true) {
    const oldFocus = document.activeElement;
    const restore = main.contains(oldFocus) ? { id: oldFocus.id, action: oldFocus.dataset.action, dataId: oldFocus.dataset.id, form: oldFocus.closest('form')?.id } : null;
    const route = location.hash.slice(1) || 'home';
    const [page, id] = route.split('/');
    main.innerHTML = Object.hasOwn(views, page) && typeof views[page] === 'function' ? views[page](id) : notFound();
    const active = ['article','products','period'].includes(page) ? 'knowledge' : page === 'question' ? 'community' : page === 'project' ? 'projects' : ['care','distribution','about','hotline','privacy'].includes(page) ? 'home' : page;
    document.querySelector('#navigation').innerHTML = [['home','首页','home'],['knowledge','科普','book'],['community','互助','chat'],['projects','公益','heart']].map(([route,label,glyph]) => `<a class="nav-link ${active === route ? 'active' : ''}" href="#${route}" ${active === route ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${label}</span></a>`).join('');
    document.title = `${main.querySelector('h1')?.textContent || '经心守护'} · 网页演示`;
    main.dataset.route = route;
    if (focus) { window.scrollTo(0,0); main.focus({ preventScroll: true }); }
    else if (restore) {
      const target = restore.id ? document.getElementById(restore.id) : restore.action ? [...main.querySelectorAll('[data-action]')].find(control => control.dataset.action === restore.action && control.dataset.id === restore.dataId) : restore.form ? main.querySelector(`#${CSS.escape(restore.form)} button`) : null;
      (target || main).focus({ preventScroll: true });
    }
  }
  function go(route) { if (location.hash === `#${route}`) render(); else location.hash = route; }
  function invalid(form, id, message, field) { form.querySelector(`#${id}`).textContent = message; field?.focus(); }
  function privacyRisk(text) { return /1[3-9]\d{9}|\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b|身份证|详细住址|微信号|加我微信/.test(text); }
  document.addEventListener('click', event => {
    const section = event.target.closest('[data-section]');
    if (section) { event.preventDefault(); const target=main.querySelector(`#${section.dataset.section}`); target?.scrollIntoView({behavior:'auto'}); target?.setAttribute('tabindex','-1'); target?.focus({preventScroll:true}); return; }
    const control = event.target.closest('button[data-action]');
    if (!control) return;
    const { action, id } = control.dataset;
    if (action === 'knowledge-tab') { search = document.querySelector('#search')?.value || search; knowledgeTab = id; render(false); }
    else if (action === 'category') { search = document.querySelector('#search')?.value || search; category = id; render(false); }
    else if (action === 'community-tab') { communityTab = id; render(false); }
    else if (action === 'favorite') { if(state.favorites.includes(id)) state.favorites=state.favorites.filter(value=>value!==id); else state.favorites.push(id); save(); render(false); toast(state.favorites.includes(id)?'已收藏到当前浏览器':'已取消收藏'); }
    else if (action === 'approve-post') { const post=state.posts.find(item=>item.id===id); if(post){post.status='已公开';post.reply='这是一条模拟回复：可以从可信任的成年人或校医开始，提出你想了解的一两件事。明显不适时请及时线下求助。';save();render(false);toast('模拟审核完成，广场和回复消息已更新。');} }
    else if (action === 'remove-post' || action === 'remove-record') { if(!window.confirm('删除这条本机演示内容？删除后无法恢复。'))return; if(action==='remove-post'){state.posts=state.posts.filter(item=>item.id!==id);communityTab='mine';save();go('community');}else{state.records=state.records.filter(item=>item.id!==id);save();render(false);}toast('演示内容已删除'); }
    else if (action === 'report-post') toast('已模拟举报。没有提交真实举报记录或通知管理员。');
    else if (action === 'advance-application') {const item=state.applications.find(item=>item.id===id);if(item){item.stage=Math.min(2,item.stage+1);save();render(false);toast('仅更新了本机的模拟进度。');}}
    else if (action === 'clear-data') document.querySelector('#confirm-dialog').showModal();
  });
  document.addEventListener('change', event => { if(event.target.id==='school'){state.school=event.target.value;save();render(false);} });
  document.addEventListener('submit', event => {
    const form=event.target;
    if(!form.id || form.id==='confirm-dialog') return;
    event.preventDefault();
    if(form.id==='search-form'){search=form.querySelector('#search').value.trim();render(false);}
    else if(form.id==='product-form'){
      const tips={day:'白天上课时，可根据流量与舒适度选择日用规格，并准备备用用品；按照说明及时更换。',night:'夜间可关注覆盖范围与贴合度，按自己的需要了解夜用规格；睡前和起床后检查、更换。',away:'外出时提前准备独立包装备用用品，确认能更换的地点；吸收量大不等于可以无限延长使用时间。'};
      const extra={comfort:'留意材质和穿着感受；出现刺激或不适时停止使用并寻求专业帮助。',coverage:'选择适合场景的长度和吸收量，不必追求越长、越厚越好。',carry:'准备便携收纳袋和备用内裤，并查看包装与使用说明。'};
      document.querySelector('#product-result').innerHTML=note(esc(tips[form.querySelector('#scenario').value])+'<br>'+esc(extra[form.querySelector('#priority').value]));
    }
    else if(form.id==='period-form'){
      const start=form.querySelector('#period-date'), duration=form.querySelector('#duration');
      if(!start.value||start.value>date())return invalid(form,'period-error','请选择今天或之前的开始日期。',start);
      if(!Number.isInteger(Number(duration.value))||Number(duration.value)<1||Number(duration.value)>15)return invalid(form,'period-error','请输入 1—15 的整数天数。',duration);
      if(state.records.some(record=>record.date===start.value))return invalid(form,'period-error','这个开始日期已有记录，请先删除旧记录再修改。',start);
      state.records.push({id:uid('record'),date:start.value,duration:Number(duration.value),feeling:form.querySelector('#feeling').value});save();render(false);toast('虚构记录已保存在本机。');
    }
    else if(form.id==='check-form') document.querySelector('#check-result').innerHTML=note(form.querySelector('input:checked')?'你可以向可信任成年人、校医或正规医院咨询。明显或严重不适时，请及时线下求助。':'可以继续了解科普和记录变化。有担心时，即使没有勾选上述项目，也可以主动求助。这不是健康状态判定。');
    else if(form.id==='ask-form'){
      const title=form.querySelector('#post-title').value.trim(),body=form.querySelector('#post-body').value.trim();
      if(title.length<5||body.length<5)return invalid(form,'post-error','标题和补充说明都请填写至少 5 个非空白字符。',form.querySelector('#post-title'));
      if(privacyRisk(title+body))return invalid(form,'post-error','请移除电话、邮箱或身份信息，仅填写虚构问题。',form.querySelector('#post-body'));
      if(/辱骂|傻逼|色情|赌博/.test(title+body))return invalid(form,'post-error','此演示内容触发基础敏感词规则，请修改后重试。',form.querySelector('#post-body'));
      state.posts.unshift({id:uid('post'),title,body,tag:form.querySelector('#post-tag').value,school:state.school,status:'待审核',time:date()});save();communityTab='mine';go('community');toast('已发布演示提问，可在“我的帖子”查看待审核内容。');
    }
    else if(form.id==='apply-form'){
      const alias=form.querySelector('#apply-alias').value.trim(),reason=form.querySelector('#apply-reason').value.trim();
      if(alias.length<2||reason.length<5)return invalid(form,'apply-error','称呼至少 2 字，虚构申请说明至少 5 字。',form.querySelector('#apply-alias'));
      if(privacyRisk(alias+reason))return invalid(form,'apply-error','请移除个人身份或联系信息，改用虚构说明。',form.querySelector('#apply-reason'));
      state.applications.unshift({id:uid('application'),code:`DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,5).toUpperCase()}`,alias,school:form.querySelector('#apply-school').value,stage:0,created:date()});save();go('care');toast('已生成演示编号；不会提交真实申请或寄送物资。');
    }
    else if(form.id==='query-form'){const item=state.applications.find(item=>item.code===form.querySelector('#query-code').value.trim().toUpperCase());document.querySelector('#query-result').innerHTML=item?applicationCard(item):empty('没有找到此编号。只能查询当前浏览器内生成的演示申请。');}
    else if(form.id==='join-form'){state.joins.push({project:form.dataset.project,type:form.querySelector('#join-type').value,created:date()});save();document.querySelector('#join-result').innerHTML=note(`已在本机保存“${esc(form.querySelector('#join-type').value)}”模拟意向。没有提交真实报名。`);toast('模拟意向已保存，未发送给项目方。');}
  });
  document.querySelector('#confirm-dialog').addEventListener('close',event=>{if(event.target.returnValue==='confirm'){state=defaults();save();render(false);toast('已清除本机演示数据，不影响微信或云端。');}});
  window.addEventListener('hashchange',()=>render());
  render(false);
})();
