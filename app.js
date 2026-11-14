/* Suara Kata — Text to Speech Bahasa Indonesia
 * Dua mesin suara:
 *  1. Google Cloud Text-to-Speech (suara AI, Bahasa Indonesia, bisa diunduh MP3) — perlu API key milik pengguna
 *  2. Web Speech API bawaan browser (gratis, hanya putar, tergantung suara yang terpasang di perangkat)
 */
'use strict';

/* ---------- Karakter suara ----------
 * v    : akhiran nama suara Google (digabung dengan kode bahasa, mis. "id-ID-" + v)
 * rate : kecepatan bawaan, st : nada dalam semitone (-20..20)
 */
const PRESETS = [
  // PRIA
  {id:'m-narator', g:'m', name:'Bima',     cat:'Narator',      v:'Chirp3-HD-Charon',    rate:0.95, st:-2, desc:'Berat, tenang dan berwibawa. Untuk narasi dokumenter & video profil.'},
  {id:'m-story',   g:'m', name:'Arya',     cat:'Storytelling', v:'Chirp3-HD-Enceladus', rate:0.90, st:0,  desc:'Hangat dan ekspresif. Pas untuk cerita, cerpen & audiobook.'},
  {id:'m-berita',  g:'m', name:'Dimas',    cat:'Berita',       v:'Chirp3-HD-Alnilam',   rate:1.05, st:0,  desc:'Tegas, jelas dan netral. Untuk berita & pengumuman.'},
  {id:'m-iklan',   g:'m', name:'Rizky',    cat:'Iklan',        v:'Chirp3-HD-Puck',      rate:1.10, st:1,  desc:'Energik dan bersemangat. Untuk iklan, promo & konten sosmed.'},
  {id:'m-edu',     g:'m', name:'Pak Hadi', cat:'Edukasi',      v:'Chirp3-HD-Iapetus',   rate:0.95, st:-1, desc:'Sabar dan runtut seperti guru. Untuk tutorial & materi belajar.'},
  {id:'m-trailer', g:'m', name:'Gatot',    cat:'Trailer',      v:'Wavenet-B',           rate:0.85, st:-6, desc:'Sangat dalam dan dramatis. Untuk trailer film, intro epik & horor.'},
  {id:'m-podcast', g:'m', name:'Fajar',    cat:'Podcast',      v:'Chirp3-HD-Achird',    rate:1.00, st:0,  desc:'Santai dan bersahabat. Untuk podcast, vlog & obrolan.'},
  {id:'m-gaming',  g:'m', name:'Raka',     cat:'Gaming',       v:'Chirp3-HD-Fenrir',    rate:1.10, st:0,  desc:'Seru dan cepat. Untuk konten game, esports & highlight.'},
  {id:'m-puisi',   g:'m', name:'Yoga',     cat:'Puisi',        v:'Chirp3-HD-Orus',      rate:0.85, st:-1, desc:'Dalam dan penuh perasaan. Untuk puisi, renungan & kutipan.'},
  {id:'m-anak',    g:'m', name:'Kancil',   cat:'Anak-anak',    v:'Wavenet-C',           rate:1.05, st:6,  desc:'Ceria dan lincah. Untuk karakter kartun & dongeng anak.'},
  // WANITA
  {id:'f-narator', g:'f', name:'Sekar',    cat:'Narator',      v:'Chirp3-HD-Kore',       rate:0.95, st:0,  desc:'Lembut namun berwibawa. Untuk dokumenter & company profile.'},
  {id:'f-story',   g:'f', name:'Laras',    cat:'Storytelling', v:'Chirp3-HD-Sulafat',    rate:0.90, st:0,  desc:'Hangat dan menenangkan. Pas untuk dongeng & audiobook.'},
  {id:'f-berita',  g:'f', name:'Nadia',    cat:'Berita',       v:'Chirp3-HD-Erinome',    rate:1.05, st:0,  desc:'Profesional dan artikulatif. Untuk berita & laporan.'},
  {id:'f-iklan',   g:'f', name:'Citra',    cat:'Iklan',        v:'Chirp3-HD-Zephyr',     rate:1.10, st:1,  desc:'Cerah dan menarik. Untuk iklan produk, promo & reels.'},
  {id:'f-cs',      g:'f', name:'Ayu',      cat:'Layanan',      v:'Chirp3-HD-Achernar',   rate:1.00, st:1,  desc:'Ramah dan sopan. Untuk IVR, customer service & asisten virtual.'},
  {id:'f-meditasi',g:'f', name:'Dewi',     cat:'Meditasi',     v:'Chirp3-HD-Aoede',      rate:0.80, st:-1, desc:'Pelan dan lembut. Untuk meditasi, relaksasi & pengantar tidur.'},
  {id:'f-edu',     g:'f', name:'Bu Rina',  cat:'Edukasi',      v:'Chirp3-HD-Leda',       rate:0.95, st:0,  desc:'Jelas dan sabar. Untuk e-learning & presentasi.'},
  {id:'f-vlog',    g:'f', name:'Tari',     cat:'Vlog',         v:'Chirp3-HD-Laomedeia',  rate:1.05, st:0,  desc:'Santai dan kekinian. Untuk vlog, review & lifestyle.'},
  {id:'f-puisi',   g:'f', name:'Maya',     cat:'Puisi',        v:'Chirp3-HD-Despina',    rate:0.88, st:0,  desc:'Halus dan puitis. Untuk puisi, quotes & audiobook romantis.'},
  {id:'f-anak',    g:'f', name:'Peri',     cat:'Anak-anak',    v:'Wavenet-A',            rate:1.05, st:5,  desc:'Imut dan riang. Untuk konten anak & karakter peri.'},
];
PRESETS.forEach(p => { p.slot = PRESETS.filter(x => x.g === p.g).indexOf(p); });

const SAMPLES = {
  narasi:'Di ujung timur nusantara, matahari pertama menyapa bumi. Ribuan pulau terbentang, menyimpan kisah tentang manusia, alam, dan waktu yang terus berjalan.',
  dongeng:'Pada suatu hari, di tepi hutan yang rimbun, hiduplah seekor kancil yang sangat cerdik. Suatu pagi, ia merasa lapar dan memandang kebun mentimun milik Pak Tani. "Hmm, sepertinya lezat sekali," gumamnya pelan.',
  berita:'Selamat malam, pemirsa. Pemerintah hari ini meresmikan jalur kereta baru yang menghubungkan dua kota besar. Proyek ini diharapkan mempersingkat waktu tempuh hingga empat puluh persen.',
  iklan:'Mau kulit cerah dalam tujuh hari? Coba sekarang juga! Diskon lima puluh persen khusus hari ini. Jangan sampai kehabisan!',
  meditasi:'Tarik napas perlahan... rasakan udara mengisi dada Anda. Tahan sejenak... lalu hembuskan dengan lembut. Biarkan semua beban perlahan menghilang.'
};

/* ---------- Utilitas ---------- */
const $ = id => document.getElementById(id);
const load = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const escapeHtml = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const langName = l => { try { return new Intl.DisplayNames(['id'], {type:'language'}).of(l) + ' (' + l + ')'; } catch (e) { return l; } };

/* ---------- State ---------- */
const S = {
  engine: load('sk_engine', 'google'),
  key: load('sk_key', ''),
  selected: load('sk_preset', 'f-story'),
  overrides: JSON.parse(load('sk_over2', '{}')),
  filter: 'all',
  gVoices: null,          // daftar suara Google (setelah API key dites)
  bVoices: [],            // suara browser
  busy: false, abort: null,
  last: null,             // {sig, url, name}
  // browser playback
  queue: [], qi: 0, speaking: false, paused: false,
};
const synth = window.speechSynthesis;
const preset = () => PRESETS.find(p => p.id === S.selected) || PRESETS[0];

/* ================= GOOGLE CLOUD TTS ================= */
const G_API = 'https://texttospeech.googleapis.com/v1/';
const isChirp = name => /chirp/i.test(name || '');
const gQuality = n => /Chirp3-HD/.test(n) ? 4 : /Chirp/.test(n) ? 3 : /Neural2|Studio/.test(n) ? 2.5 : /Wavenet/.test(n) ? 2 : 1;

async function gFetch(path, opts = {}) {
  const r = await fetch(G_API + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': S.key, ...(opts.headers || {}) }
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(j.error?.message || ('HTTP ' + r.status));
    e.status = r.status; throw e;
  }
  return j;
}

async function gLoadVoices(silent) {
  if (!S.key) { setKeyStatus('', ''); return false; }
  if (!silent) setKeyStatus('Menghubungkan…', '');
  try {
    const j = await gFetch('voices');
    S.gVoices = (j.voices || []).map(v => ({ name: v.name, langs: v.languageCodes, g: v.ssmlGender === 'MALE' ? 'm' : v.ssmlGender === 'FEMALE' ? 'f' : '?' }));
    const nId = S.gVoices.filter(v => v.langs.includes('id-ID')).length;
    setKeyStatus(`✓ Terhubung · ${nId} suara Bahasa Indonesia`, 'ok');
    return true;
  } catch (e) {
    S.gVoices = null;
    setKeyStatus('✗ ' + friendlyError(e), 'err');
    return false;
  }
}

function gVoiceFor(p, lang) {
  const ov = S.overrides['g|' + p.id + '|' + lang];
  if (ov && (!S.gVoices || S.gVoices.some(v => v.name === ov))) return ov;
  const pref = lang + '-' + p.v;
  if (!S.gVoices) return pref;
  const pool = S.gVoices.filter(v => v.langs.includes(lang));
  const hit = pool.find(v => v.name === pref);
  if (hit && (hit.g === p.g || hit.g === '?')) return pref;
  // cadangan: suara dengan gender sama, kualitas terbaik, bervariasi per karakter
  const same = pool.filter(v => v.g === p.g).sort((a, b) => gQuality(b.name) - gQuality(a.name) || a.name.localeCompare(b.name));
  const list = same.length ? same : pool;
  return list.length ? list[p.slot % list.length].name : pref;
}

function b64ToBytes(b64) {
  const bin = atob(b64); const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gSynth(text, voice, lang, rate, st, signal) {
  const body = { input: { text }, voice: { languageCode: lang, name: voice }, audioConfig: { audioEncoding: 'MP3', speakingRate: rate } };
  if (!isChirp(voice)) body.audioConfig.pitch = st;
  try {
    const j = await gFetch('text:synthesize', { method: 'POST', body: JSON.stringify(body), signal });
    return b64ToBytes(j.audioContent);
  } catch (e) {
    // beberapa suara menolak parameter kecepatan/nada → coba lagi tanpa parameter tersebut
    if (e.status === 400 && /rate|pitch/i.test(e.message)) {
      delete body.audioConfig.speakingRate; delete body.audioConfig.pitch;
      const j = await gFetch('text:synthesize', { method: 'POST', body: JSON.stringify(body), signal });
      return b64ToBytes(j.audioContent);
    }
    throw e;
  }
}

function friendlyError(e) {
  const m = e.message || String(e);
  if (e.name === 'AbortError') return 'Dibatalkan.';
  if (/API key not valid/i.test(m)) return 'API key tidak valid.';
  if (/has not been used|is disabled|SERVICE_DISABLED/i.test(m)) return 'Cloud Text-to-Speech API belum diaktifkan di project Google Cloud Anda.';
  if (/billing/i.test(m)) return 'Project Google Cloud belum terhubung ke akun billing.';
  if (/referer|referrer/i.test(m)) return 'Key dibatasi untuk website lain (cek Website restrictions).';
  if (/quota|rate limit/i.test(m)) return 'Kuota habis / terlalu banyak permintaan. Coba lagi nanti.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Gagal terhubung. Periksa koneksi internet.';
  return m;
}

/* Gabungkan kalimat jadi potongan ≤ 4500 byte (batas Google 5000 byte/permintaan) */
function packChunks(sentences, max = 4500) {
  const enc = new TextEncoder(); const out = []; let cur = '';
  for (const s of sentences) {
    const next = cur ? cur + ' ' + s : s;
    if (enc.encode(next).length > max && cur) { out.push(cur); cur = s; } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

async function gGenerate() {
  const text = $('text').value.trim();
  if (!text) { $('text').focus(); return; }
  if (!S.key) { setProg('Masukkan Google Cloud API key terlebih dahulu (bagian atas halaman).', true); $('apiKey').focus(); return; }

  const p = preset(), lang = $('lang').value, voice = gVoiceFor(p, lang);
  const rate = +$('rate').value, st = +$('pitch').value;
  const sig = [text, voice, lang, rate, isChirp(voice) ? 0 : st].join('|');
  if (S.last && S.last.sig === sig) { playAudio(); return; }

  const chunks = packChunks(splitSentences(text));
  S.busy = true; S.abort = new AbortController(); setUI();
  const parts = [];
  try {
    for (let i = 0; i < chunks.length; i++) {
      setProg(`Membuat audio… bagian ${i + 1} dari ${chunks.length}`);
      $('bar').style.width = (i / chunks.length * 100) + '%';
      parts.push(await gSynth(chunks[i], voice, lang, rate, st, S.abort.signal));
    }
    $('bar').style.width = '100%';
    const blob = new Blob(parts, { type: 'audio/mpeg' });
    if (S.last) URL.revokeObjectURL(S.last.url);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
    const fname = `suara-kata-${p.name.toLowerCase().replace(/\s+/g, '-')}-${stamp}.mp3`;
    S.last = { sig, url: URL.createObjectURL(blob), name: fname };
    $('audio').src = S.last.url;
    $('dlBtn').href = S.last.url; $('dlBtn').download = fname;
    $('outBox').hidden = false;
    setProg(`Selesai · ${(blob.size / 1024).toFixed(0)} KB · suara ${shortG(voice)}`);
    playAudio();
  } catch (e) {
    setProg('Gagal: ' + friendlyError(e), true);
    $('bar').style.width = '0';
  } finally {
    S.busy = false; S.abort = null; setUI();
  }
}
function playAudio() { const a = $('audio'); a.volume = +$('vol').value; a.currentTime = 0; a.play().catch(() => {}); }
const shortG = n => n.replace(/^[a-z]{2,3}-[A-Z]{2}-/, '').replace('Chirp3-HD-', '') + (isChirp(n) ? ' ✦HD' : '');

/* ================= BROWSER (Web Speech API) ================= */
const FEMALE = ['female','wanita','gadis','damayanti','aria','jenny','michelle','ana','emma','ava','sonia','libby','maisie','natasha','clara','zira','hazel','susan','heera','samantha','karen','moira','tessa','fiona','victoria','allison','serena','catherine','neerja','elsa','katja','denise','sara','nancy','amber','ashley','cora','elizabeth','monica','salma','aditi','isabella','mia','linda','helena','laura'];
const MALE = ['male','pria','ardi','andika','guy','christopher','eric','roger','steffan','andrew','brian','ryan','thomas','william','david','mark','george','daniel','alex','fred','rishi','prabhat','liam','davis','tony','jason','james','richard','ravi','oliver','arthur','aaron','gordon','tom','reed','ralph','bruce','albert','connor','duncan','elliot','ken','kai','stefan','jorge','raul','hemant'];
const bGender = v => { const n = v.name.toLowerCase(); const has = k => new RegExp('\\b' + k + '\\b').test(n); return FEMALE.some(has) ? 'f' : MALE.some(has) ? 'm' : '?'; };
const bQuality = v => { const n = v.name.toLowerCase(); return (n.includes('natural') ? 10 : 0) + (n.includes('online') ? 4 : 0) + (/neural|premium|enhanced/.test(n) ? 6 : 0) + (n.includes('google') ? 3 : 0); };
const normLang = l => l.replace('_', '-');

function bPool(lang) {
  let pool = S.bVoices.filter(v => normLang(v.lang) === lang);
  if (!pool.length) pool = S.bVoices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  return pool.sort((a, b) => bQuality(b) - bQuality(a));
}
function bVoiceFor(p, lang) {
  const ov = S.overrides['b|' + p.id + '|' + lang];
  if (ov) { const v = S.bVoices.find(x => x.voiceURI === ov); if (v) return v; }
  const pool = bPool(lang);
  const same = pool.filter(v => bGender(v) === p.g);
  const list = same.length ? same : pool.filter(v => bGender(v) === '?').concat(pool);
  return list.length ? list[p.slot % list.length] : null;
}
const bShort = n => n.replace(/^Microsoft /, '').replace(/ - .*$/, '').replace(/\s*\(Natural\)/, ' ✦').replace(/ Online/, '');
const stToPitch = st => Math.min(2, Math.max(0.1, 1 + st * 0.08));

function makeUtter(text, p, rate, st) {
  const u = new SpeechSynthesisUtterance(text);
  const lang = $('lang').value, v = bVoiceFor(p, lang);
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = lang;
  u.rate = rate; u.pitch = stToPitch(st); u.volume = +$('vol').value;
  return u;
}
function bPlay() {
  const text = $('text').value.trim();
  if (!text) { $('text').focus(); return; }
  if (!synth) { setProg('Browser ini tidak mendukung suara bawaan.', true); return; }
  if (S.paused) { synth.resume(); S.paused = false; setUI(); return; }
  stopAll();
  S.queue = splitSentences(text); S.qi = 0; S.speaking = true;
  $('reader').style.display = 'block';
  $('reader').innerHTML = S.queue.map((s, i) => `<span class="s" data-i="${i}">${escapeHtml(s)}</span> `).join('');
  setProg(''); setUI(); bNext();
}
function bNext() {
  if (!S.speaking) return;
  if (S.qi >= S.queue.length) { S.speaking = false; $('bar').style.width = '100%'; markReader(); setUI(); return; }
  const u = makeUtter(S.queue[S.qi], preset(), +$('rate').value, +$('pitch').value);
  markReader();
  u.onend = () => { S.qi++; $('bar').style.width = (S.qi / S.queue.length * 100) + '%'; setTimeout(bNext, 120); };
  u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') { S.qi++; bNext(); } };
  synth.speak(u);
}
function markReader() {
  document.querySelectorAll('#reader .s').forEach(el => {
    const i = +el.dataset.i; el.className = 's' + (i < S.qi ? ' done' : i === S.qi ? ' now' : '');
    if (i === S.qi) el.scrollIntoView({ block: 'nearest' });
  });
}

/* ================= Teks ================= */
function splitSentences(t) {
  const parts = t.replace(/\s+/g, ' ').trim().match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) || [];
  const out = [];
  parts.forEach(s => {
    s = s.trim(); if (!s) return;
    while (s.length > 220) {   // kalimat sangat panjang dipecah (bug Chrome & batas Google per kalimat)
      let cut = s.lastIndexOf(',', 220); if (cut < 80) cut = s.lastIndexOf(' ', 220); if (cut < 1) cut = 220;
      out.push(s.slice(0, cut + 1).trim()); s = s.slice(cut + 1).trim();
    }
    if (s) out.push(s);
  });
  return out;
}

/* ================= Preview per karakter ================= */
const previewCache = new Map(); let previewAudio = null;
async function preview(id, btn) {
  stopAll();
  const p = PRESETS.find(x => x.id === id), lang = $('lang').value;
  const en = lang.startsWith('en');
  const t = en ? `Hi, I'm ${p.name}. This is my ${p.cat.toLowerCase()} voice.` : `Halo, saya ${p.name}. Ini suara saya untuk ${p.cat.toLowerCase()}.`;
  if (S.engine === 'browser') { if (synth) synth.speak(makeUtter(t, p, p.rate, p.st)); return; }
  if (!S.key) { setProg('Masukkan API key Google untuk mendengar contoh suara AI.', true); $('apiKey').focus(); return; }
  const voice = gVoiceFor(p, lang), k = voice + '|' + p.rate + '|' + p.st + '|' + lang;
  try {
    btn && btn.classList.add('busy');
    if (!previewCache.has(k)) {
      const bytes = await gSynth(t, voice, lang, p.rate, p.st);
      previewCache.set(k, URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' })));
    }
    previewAudio = new Audio(previewCache.get(k)); previewAudio.volume = +$('vol').value; previewAudio.play();
  } catch (e) { setProg('Gagal memutar contoh: ' + friendlyError(e), true); }
  finally { btn && btn.classList.remove('busy'); }
}

/* ================= Kontrol ================= */
function play() { S.engine === 'google' ? gGenerate() : bPlay(); }
function pause() {
  if (S.engine === 'google') { const a = $('audio'); a.paused ? a.play() : a.pause(); return; }
  if (!S.speaking) return;
  if (S.paused) { synth.resume(); S.paused = false; } else { synth.pause(); S.paused = true; }
  setUI();
}
function stopAll() {
  if (S.abort) S.abort.abort();
  $('audio').pause();
  if (previewAudio) previewAudio.pause();
  S.speaking = false; S.paused = false; synth && synth.cancel();
  setUI();
}
function setUI() {
  const g = S.engine === 'google', a = $('audio');
  const audioOn = g && S.last && !$('outBox').hidden;
  $('playBtn').disabled = S.busy;
  $('playBtn').innerHTML = S.busy ? '⏳ Membuat audio…' : g ? '▶ Buat &amp; Putar' : S.paused ? '▶ Lanjutkan' : S.speaking ? '↻ Putar ulang' : '▶ Putar';
  $('pauseBtn').disabled = g ? !audioOn : !S.speaking;
  $('pauseBtn').innerHTML = (g ? a.paused : S.paused) ? '▶ Lanjut' : '❚❚ Jeda';
  $('stopBtn').disabled = g ? !(S.busy || audioOn) : !S.speaking;
}
function setProg(msg, err) { $('progText').textContent = msg; $('progText').style.color = err ? 'var(--err)' : ''; }
function setKeyStatus(msg, cls) { $('keyStatus').textContent = msg; $('keyStatus').className = 'status ' + cls; }

/* ================= Render ================= */
function buildLangs() {
  const sel = $('lang'), saved = load('sk_lang_' + S.engine, 'id-ID');
  let langs;
  if (S.engine === 'google') {
    langs = S.gVoices ? [...new Set(S.gVoices.flatMap(v => v.langs))].sort() : ['id-ID', 'en-US', 'en-GB'];
  } else {
    langs = [...new Set(S.bVoices.map(v => normLang(v.lang)).concat('id-ID'))].sort();
  }
  sel.innerHTML = langs.map(l => `<option value="${l}">${langName(l)}</option>`).join('');
  sel.value = langs.includes(saved) ? saved : (langs.includes('id-ID') ? 'id-ID' : langs[0]);
}

const CATS = ['all', 'm', 'f', ...new Set(PRESETS.map(p => p.cat))];
function renderTabs() {
  const label = c => c === 'all' ? 'Semua' : c === 'm' ? 'Pria' : c === 'f' ? 'Wanita' : c;
  $('tabs').innerHTML = CATS.map(c => `<button class="chip ${c === S.filter ? 'on' : ''}" data-f="${c}">${label(c)}</button>`).join('');
}
function engineLabel(p) {
  const lang = $('lang').value;
  if (S.engine === 'google') return shortG(gVoiceFor(p, lang));
  const v = bVoiceFor(p, lang); return v ? bShort(v.name) : 'suara default perangkat';
}
function renderVoices() {
  const list = PRESETS.filter(p => S.filter === 'all' || p.g === S.filter || p.cat === S.filter);
  $('voiceCount').textContent = `${PRESETS.filter(p => p.g === 'm').length} pria · ${PRESETS.filter(p => p.g === 'f').length} wanita`;
  $('voices').innerHTML = list.map(p => {
    const ini = p.name.replace(/^(Pak|Bu) /, '').slice(0, 2).toUpperCase();
    return `<div class="voice ${p.g} ${p.id === S.selected ? 'sel' : ''}" data-id="${p.id}" role="button" tabindex="0" aria-pressed="${p.id === S.selected}">
      <button class="prev" data-prev="${p.id}" title="Dengar contoh" aria-label="Dengar contoh ${p.name}">▶</button>
      <div class="top"><div class="av">${ini}</div>
        <div><b>${p.name}</b><span class="tag">${p.g === 'm' ? 'Pria' : 'Wanita'} · ${p.cat}</span></div></div>
      <p>${p.desc}</p>
      <div class="engine">🎙 ${escapeHtml(engineLabel(p))}</div>
    </div>`;
  }).join('');
}
function syncVoiceSelect() {
  const p = preset(), lang = $('lang').value, sel = $('voiceSel');
  let opts, cur, key;
  if (S.engine === 'google') {
    key = 'g|' + p.id + '|' + lang;
    const pool = (S.gVoices || []).filter(v => v.langs.includes(lang)).sort((a, b) => gQuality(b.name) - gQuality(a.name) || a.name.localeCompare(b.name));
    opts = pool.map(v => [v.name, shortG(v.name) + (v.g === 'm' ? ' · pria' : v.g === 'f' ? ' · wanita' : '')]);
    cur = shortG(gVoiceFor(p, lang));
  } else {
    key = 'b|' + p.id + '|' + lang;
    opts = bPool(lang).map(v => [v.voiceURI, bShort(v.name) + (bGender(v) === 'm' ? ' · pria' : bGender(v) === 'f' ? ' · wanita' : '')]);
    const v = bVoiceFor(p, lang); cur = v ? bShort(v.name) : '—';
  }
  sel.innerHTML = `<option value="">Otomatis (${escapeHtml(cur)})</option>` + opts.map(([v, l]) => `<option value="${escapeHtml(v)}">${escapeHtml(l)}</option>`).join('');
  sel.value = opts.some(o => o[0] === S.overrides[key]) ? S.overrides[key] : '';
  sel.dataset.key = key;
  $('rate').value = p.rate; $('pitch').value = p.st; updatePitchState(); showVals();
}
function updatePitchState() {
  const chirp = S.engine === 'google' && isChirp(gVoiceFor(preset(), $('lang').value));
  $('pitch').disabled = chirp; $('pitchWrap').classList.toggle('off', chirp); $('pitchNote').hidden = !chirp;
}
function showVals() {
  $('rateV').textContent = (+$('rate').value).toFixed(2) + '×';
  const st = +$('pitch').value; $('pitchV').textContent = (st > 0 ? '+' : '') + st + ' st';
  $('volV').textContent = Math.round($('vol').value * 100) + '%';
}
function updateNotice() {
  const n = $('notice'), lang = $('lang').value;
  if (S.engine === 'google') {
    n.innerHTML = S.key
      ? '✦HD = suara Chirp 3 HD (paling natural). Teks panjang otomatis dipecah dan digabung menjadi satu file MP3. Setiap karakter memakai suara AI Google yang berbeda.'
      : '<b>Masukkan Google Cloud API key</b> di bagian atas untuk memakai 20 suara AI Bahasa Indonesia dan mengunduh MP3. Belum punya? Klik “Cara membuat API key”. Tanpa key, Anda tetap bisa memakai mode <b>Suara Browser</b>.';
    return;
  }
  if (!synth) { n.innerHTML = '<b>Browser ini tidak mendukung suara bawaan.</b> Gunakan Edge atau Chrome terbaru, atau mode Suara AI Google.'; return; }
  const pool = S.bVoices.filter(v => normLang(v.lang) === lang);
  let msg = '';
  if (!pool.length && lang === 'id-ID') {
    msg = `<b>Perangkat ini belum punya suara Bahasa Indonesia</b>, jadi teks akan dibaca dengan logat asing. Solusi:
      <ol><li>Pakai mode <b>☁ Suara AI Google</b> (disarankan, bisa unduh MP3), atau</li>
      <li>Buka halaman ini di <b>Microsoft Edge</b> (ada suara Indonesia “Ardi” & “Gadis” online), atau</li>
      <li>Windows: <b>Settings → Time &amp; language → Language &amp; region → Add a language → Indonesia</b>, centang <i>Speech</i>, lalu muat ulang halaman ini.</li></ol>`;
  } else {
    msg = `Tersedia <b>${pool.length}</b> suara perangkat untuk ${langName(lang)}. Karakter dibedakan lewat kombinasi suara, kecepatan &amp; nada. `;
    msg += 'Mode browser <b>tidak bisa diunduh</b> — gunakan mode Suara AI Google untuk MP3.';
  }
  n.innerHTML = msg;
}
function setEngine(e) {
  stopAll();
  S.engine = e; save('sk_engine', e);
  $('engGoogle').setAttribute('aria-selected', e === 'google');
  $('engBrowser').setAttribute('aria-selected', e === 'browser');
  $('googleSetup').hidden = e !== 'google';
  $('outBox').hidden = e !== 'google' || !S.last;
  $('reader').style.display = 'none'; $('bar').style.width = '0'; setProg('');
  refreshAll();
}
function refreshAll() { buildLangs(); renderVoices(); syncVoiceSelect(); updateNotice(); setUI(); }

/* ================= Events ================= */
function selectPreset(id) { S.selected = id; save('sk_preset', id); renderVoices(); syncVoiceSelect(); }
$('voices').addEventListener('click', e => {
  const pv = e.target.closest('[data-prev]');
  if (pv) { e.stopPropagation(); selectPreset(pv.dataset.prev); preview(pv.dataset.prev, document.querySelector(`[data-prev="${pv.dataset.prev}"]`)); return; }
  const c = e.target.closest('.voice'); if (c) selectPreset(c.dataset.id);
});
$('voices').addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('voice')) { e.preventDefault(); selectPreset(e.target.dataset.id); }
});
$('tabs').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; S.filter = b.dataset.f; renderTabs(); renderVoices(); });
document.querySelectorAll('[data-sample]').forEach(b => b.addEventListener('click', () => {
  $('text').value = SAMPLES[b.dataset.sample]; countChars(); save('sk_text', $('text').value);
}));
$('lang').addEventListener('change', () => { save('sk_lang_' + S.engine, $('lang').value); renderVoices(); syncVoiceSelect(); updateNotice(); });
$('voiceSel').addEventListener('change', () => {
  const key = $('voiceSel').dataset.key;
  if ($('voiceSel').value) S.overrides[key] = $('voiceSel').value; else delete S.overrides[key];
  save('sk_over2', JSON.stringify(S.overrides)); renderVoices(); syncVoiceSelect();
});
['rate', 'pitch'].forEach(id => $(id).addEventListener('input', showVals));
$('vol').addEventListener('input', () => { showVals(); $('audio').volume = +$('vol').value; });
function countChars() {
  const t = $('text').value, words = t.split(/\s+/).filter(Boolean).length;
  $('count').textContent = `${t.length} karakter · ±${Math.max(1, Math.round(words / 150))} menit`;
}
$('text').addEventListener('input', () => { countChars(); save('sk_text', $('text').value); });
$('playBtn').onclick = play; $('pauseBtn').onclick = pause;
$('stopBtn').onclick = () => { stopAll(); if (S.engine === 'google') $('audio').currentTime = 0; };
['play', 'pause', 'ended'].forEach(ev => $('audio').addEventListener(ev, setUI));
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); play(); } });
$('engGoogle').onclick = () => setEngine('google');
$('engBrowser').onclick = () => setEngine('browser');
$('toggleKey').onclick = () => { const i = $('apiKey'); i.type = i.type === 'password' ? 'text' : 'password'; };
$('howKey').onclick = e => { e.preventDefault(); $('howto').hidden = !$('howto').hidden; };
$('saveKey').onclick = async () => {
  S.key = $('apiKey').value.trim(); save('sk_key', S.key);
  previewCache.clear(); S.last = null;
  if (!S.key) { S.gVoices = null; setKeyStatus('Key dihapus.', ''); refreshAll(); return; }
  await gLoadVoices(); refreshAll();
};
$('apiKey').addEventListener('keydown', e => { if (e.key === 'Enter') $('saveKey').click(); });
$('themeBtn').onclick = () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark'; save('sk_theme', r.dataset.theme);
};

/* ================= Init ================= */
(() => { const t = load('sk_theme', ''); if (t) document.documentElement.dataset.theme = t; })();
$('text').value = load('sk_text', SAMPLES.dongeng); countChars();
$('apiKey').value = S.key;
renderTabs();
if (synth) {
  const upd = () => { S.bVoices = synth.getVoices(); if (S.engine === 'browser') refreshAll(); };
  upd(); synth.onvoiceschanged = upd; setTimeout(upd, 700);
}
setEngine(S.engine);
if (S.key) gLoadVoices(true).then(() => { if (S.engine === 'google') refreshAll(); });
