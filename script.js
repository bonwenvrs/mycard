// Replace or extend these entries at any time. Place your photos in images/.
const stans = [
  { name: "seakeen", image: "images/seakeen.jpg", main: true },
  { name: "williamest", image: "images/williamest.jpg", main: true },
  { name: "surfjava", image: "images/surfjava.jpg", main: true },
  { name: "forcebook", image: "images/forcebook.jpg" },
  { name: "teshowping", image: "images/teshowping.jpg" },
  { name: "yujeenyugene", image: "images/yujeenyugene.jpg" },
  { name: "lukemick", image: "images/lukemick.jpg" },
  { name: "taynew", image: "images/taynew.jpg" },
];

const launcher = document.getElementById('launcher');
const cardWindow = document.getElementById('card-window');
const launchBtn = document.getElementById('launch-btn');
const backdrop = document.getElementById('modal-backdrop');
const dialog = backdrop.querySelector('.modal-window');
const modalContent = document.getElementById('modal-content');
const modalFilename = document.getElementById('modal-filename');
const modalClose = document.getElementById('modal-close');
let previousFocus = null;

function showCard() {
  launcher.hidden = true;
  cardWindow.hidden = false;
  document.querySelector('[data-open="about"]').focus({preventScroll:true});
}
function hideCard() {
  if (!backdrop.hidden) closeModal();
  cardWindow.hidden = true;
  launcher.hidden = false;
  launchBtn.focus({preventScroll:true});
}
launchBtn.addEventListener('click', showCard);
document.getElementById('minimize-btn').addEventListener('click', hideCard);
document.getElementById('window-close-btn').addEventListener('click', hideCard);

function photoSlot(stan) {
  const slot = document.createElement('div');
  slot.className = 'photo-slot';
  const fallback = document.createElement('div');
  fallback.className = 'photo-fallback';
  fallback.innerHTML = '<span aria-hidden="true">▧</span><small>NO IMAGE</small>';
  const img = document.createElement('img');
  img.alt = `${stan.name} photo`;
  img.loading = 'lazy';
  img.addEventListener('load', () => slot.classList.add('has-image'));
  img.addEventListener('error', () => img.remove());
  slot.append(fallback, img);
  img.src = stan.image;
  return slot;
}

function createStanCard(stan, index, featured = false) {
  const card = document.createElement(featured ? 'button' : 'article');
  card.className = featured ? 'featured-card' : `stan-card${stan.main ? ' main' : ''}${index === 0 ? ' first' : ''}`;
  if (featured) {
    card.type = 'button';
    card.setAttribute('aria-label', `Open stanlist for ${stan.name}`);
    card.addEventListener('click', () => openModal('stanlist'));
  } else {
    card.style.setProperty('--delay', `${index * 38}ms`);
  }
  card.append(photoSlot(stan));
  const name = document.createElement('strong');
  name.textContent = stan.name;
  card.append(name);
  if (!featured) {
    const subtitle = document.createElement('small');
    subtitle.textContent = stan.main ? 'main' : 'side';
    card.append(subtitle);
    if (stan.main) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = '★ pinned';
      card.append(star);
    }
  }
  return card;
}
stans.filter(stan => stan.main).slice(0, 3).forEach((stan, index) => {
  document.getElementById('featured-grid').append(createStanCard(stan, index, true));
});

const content = {
  about: `
    <h2 class="modal-heading">about_me</h2>
    <p class="modal-intro">nickname: bonie/bon &nbsp;·&nbsp; pronouns: he/him &nbsp;·&nbsp; filipino &nbsp;·&nbsp; december '05 baby</p>
    <div class="info-stack">
      <section class="note-card"><h3>profile / 001</h3><p>big-time otaku aside from being a bl fan. sometimes i'm watching anime, and other times i'm catching up on a series or two.</p></section>
      <section class="note-card"><h3>fav animes</h3><div class="tag-cloud"><span>jujutsu kaisen</span><span>black clover</span><span>fairy tail</span><span>attack on titan</span></div></section>
      <section class="note-card"><h3>music genre list:</h3><p>r&b, pop, and alternative, and i'm especially into</p><div class="tag-cloud"><span>paramore</span><span>my chemical romance</span><span>hale</span><span>cueshe</span></div></section>
    </div>`,
  byf: `
    <h2 class="modal-heading">read_before_following</h2>
    <p class="modal-intro">a few things to know before you follow.</p>
    <div class="info-stack">
      <section class="note-card"><h3>byf / before you follow</h3><ul><li>i tweet mainly about bl and my favorite pairings.</li><li>i'm filipino, so i sometimes use tagalog in my posts.</li><li>i might also post about anime and bl unrelated content.</li><li>i plan on posting dance covers, too.</li></ul></section>
      <section class="note-card"><h3>dni / do not interact if</h3><p>you're homophobic, racist, or generally just a nuisance to others.</p></section>
    </div>`
};

function openModal(type) {
  if (cardWindow.hidden) return;
  previousFocus = document.activeElement;
  modalFilename.textContent = type === 'stanlist' ? 'stan_archive.dir' : type === 'byf' ? 'read_before_following.txt' : 'about_me.txt';
  modalContent.replaceChildren();
  if (type === 'stanlist') {
    const title = document.createElement('h2');
    title.className = 'modal-heading';
    title.id = 'modal-title';
    title.textContent = 'stan_archive.dir';
    const note = document.createElement('p');
    note.className = 'modal-intro';
    note.textContent = 'some of the pairing i stan. i love all of them.';
    const grid = document.createElement('div');
    grid.className = 'stan-grid';
    const ordered = [...stans.filter(s => s.main), ...stans.filter(s => !s.main)];
    ordered.forEach((stan, index) => grid.append(createStanCard(stan, index)));
    modalContent.append(title, note, grid);
  } else {
    modalContent.innerHTML = content[type];
    modalContent.querySelector('h2').id = 'modal-title';
  }
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  modalContent.scrollTop = 0;
  modalClose.focus();
}
function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = '';
  previousFocus?.focus({preventScroll:true});
}
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', event => {
  if (backdrop.hidden) return;
  if (event.key === 'Escape') { closeModal(); return; }
  if (event.key === 'Tab') {
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
    if (!controls.length) { event.preventDefault(); dialog.focus(); return; }
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

