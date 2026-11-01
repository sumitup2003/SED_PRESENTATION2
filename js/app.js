"use strict";

/* ==========================================================================
   1. DATA  (all text comes from "Ministry Presentation.docx")
   ========================================================================== */

const DOC = "Ministry Presentation (document)";
const IMG = { logo: "assets/logo.png" };

/* One entry per stage: label on the journey line, title, source section. */
const ST = [
  { n: "Curiosity", t: "Curiosity section", src: [DOC + ": Curiosity Section"] },
  { n: "Learning crisis", t: "The hidden learning crisis", src: [DOC + ": The Hidden Learning Crisis"] },
  { n: "A new layer", t: "Why current education needs a new layer", src: [DOC + ": Why Current Education Needs a New Layer?"] },
  { n: "Why diagnose", t: "Why schools need learning diagnostics", src: [DOC + ": Why Schools Need Learning Diagnostics?"] },
  { n: "Beyond access", t: "Education is no longer about access", src: [DOC + ": Education is No Longer About Access; Education is Changing"] },
  { n: "Meet SED", t: "Introducing SED", src: [DOC + ": Introducing Student Education Diagnostics (SED)"] },
  { n: "How SED works", t: "How SED works", src: [DOC + ": How SED Works"] },
  { n: "What is different", t: "What makes SED different", src: [DOC + ": What Makes SED Different?"] },
  { n: "Ecosystem", t: "An entire learning ecosystem", src: [DOC + ": An Entire Learning Ecosystem"] },
  { n: "Teachers", t: "Teacher development", src: [DOC + ": Teacher Development"] },
  { n: "Parents", t: "Parent empowerment", src: [DOC + ": Parent Empowerment"] },
  { n: "Our vision", t: "Our vision", src: [DOC + ": Our Vision"] },
  { n: "The future", t: "Final slide", src: [DOC + ": Final Slide"] },
];
const NSTAGES = ST.length;

const IC = {
  bubble: '<path d="M4 5h16v10H9l-5 4z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  focus:
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6M15 14c3 0 6 2 6 5"/>',
  board: '<path d="M3 4h18v12H3zM8 20l4-4 4 4"/>',
  school: '<path d="M3 10l9-6 9 6M5 10v10h14V10M9 20v-6h6v6"/>',
  brain:
    '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a3 3 0 0 0-3 0zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  book: '<path d="M3 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
  spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
};

const BRIEF_DATA =
  typeof BRIEFS !== "undefined"
    ? BRIEFS
    : { sed: [], eco: [] };

const SED_PARTS = BRIEF_DATA.sed.map((b) => b.title);
const ECO_PARTS = BRIEF_DATA.eco.map((b) => b.title);

/* Punch lines for the final page: they render one after another. */
const PUNCH = [
  { c: "p1", t: "Marks tell us <em>what</em> happened." },
  { c: "p2", t: "Student Education Diagnostics tells us <em>why</em> it happened." },
  { c: "p3", t: "For centuries, education has focused on teaching." },
  { c: "p4", t: "The next century will focus on <em>understanding</em>." },
  { c: "p5", t: "SED is building that future." },
  { c: "p6", t: "Understanding Every Learner.<br>Empowering Every Future." },
];
const PUNCH_GAP = 2300;

/* ==========================================================================
   2. SMALL HELPERS
   ========================================================================== */

const $ = (sel) => document.querySelector(sel);
const app = $("#app");
const stage = $("#stage");
const nav = $("#journey");
const brief = $("#brief");

const rv = (i) => `class="rv" style="--d:${i * 130}ms"`;
const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[name]}</svg>`;
const bigIcon = (name) => icon(name).replace('class="ico"', 'class="ico big"');
const listItems = (items, start = 2) => items.map((text, i) => `<li ${rv(i + start)}>${text}</li>`).join("");

/* Position (as left/top %) of item i of n on a circle of radius r. */
function onCircle(i, n, r) {
  const angle = ((-90 + (i * 360) / n) * Math.PI) / 180;
  return `left:${50 + r * Math.cos(angle)}%;top:${50 + r * Math.sin(angle)}%`;
}

const arrow = (delay) =>
  `<span class="farrow" aria-hidden="true"><svg viewBox="0 0 24 12">` +
  `<path style="--d:${delay}ms" d="M1 6h20M16 1l6 5-6 5"/></svg></span>`;

/* Flow chart: items are strings or { t, s, n, hot, cls, d }. */
function flow(items, delay0, vertical) {
  const boxes = items.map((item, i) => {
    const o = typeof item === "string" ? { t: item } : item;
    const d = o.d !== undefined ? o.d : delay0 + i * 350;
    return (
      (i ? arrow(d) : "") +
      `<div class="fnode rv ${o.hot ? "hot" : ""} ${o.cls || ""}" style="--d:${d}ms">` +
      (o.n ? `<span class="n">${o.n}</span>` : "") +
      o.t +
      (o.s ? `<small>${o.s}</small>` : "") +
      `</div>`
    );
  });
  return `<div class="flow ${vertical ? "v" : ""}">${boxes.join("")}</div>`;
}

/* Heading block used by every "part 2" (visual) view. */
const bhead = (title, caption) =>
  `<div class="bhead blurable"><h3 class="rv">${title}</h3>` +
  `<p class="rv" style="--d:150ms">${caption}</p></div>`;

/* Hub with satellites; each satellite opens a hover brief. */
function orbit(group, labels, delay0) {
  return `<div class="bvis">
    <div class="orb big">
      <div class="ring blurable"></div><div class="ring r2 blurable"></div>
      <div class="core blurable"><img src="${IMG.logo}" alt="Student Education Diagnostics logo"></div>
      ${labels
        .map(
          (label, i) => `
        <button class="sat blurable rv" data-brief="${group}:${i}"
                style="${onCircle(i, labels.length, 47)};--d:${delay0 + i * 160}ms">${label}</button>`,
        )
        .join("")}
    </div>
  </div>`;
}

/* ==========================================================================
   3. STAGE VIEWS
   PART_A = text (heading, key statements)
   PART_B = visuals (flow charts, orbits, diagrams)
   ========================================================================== */

const PART_A = [
  /* ---- 1. Curiosity ---- */
  () => `
    <div class="hero hero-1" style="grid-column:1/-1">
      <div class="sw">
        <p class="s1 rv" style="--d:300ms">SED transforms education from a</p>
        <p class="s2 rv" style="--d:900ms">marks-driven <br>system</p>
        <p class="s3 rv" style="--d:1500ms">to an</p>
        <p class="s4 rv" style="--d:2100ms">ability-driven <br>system</p>
      </div>
      <div>
        <p class="kick rv">A FRAMEWORK FOR FUTURE-READY EDUCATION</p>
        <h1 class="rv" style="--d:150ms">Every child deserves to be <em>understood</em> before they are evaluated.</h1>
        <p class="lede gap1 rv" style="--d:450ms">
          For generations, education has measured what students remember.
        </p>
        <p class="lede gap2 rv" style="--d:600ms">
          Very few systems measure
          <b style="color:#fff">how students learn, why they struggle, or what support they actually need.</b>
        </p>
      </div>
      <div class="cta-corner rv" style="--d:2700ms">
        <button class="cta" id="cta">Begin the journey <span aria-hidden="true">›</span></button>
      </div>
    </div>`,

  /* ---- 2. The hidden learning crisis ---- */
  () => `
    <div>
      <h2 class="rv">The hidden <em>learning crisis</em></h2>
      <p class="lede rv" style="--d:150ms">Every classroom contains students who:</p>
      <p class="stmt rv" style="--d:1500ms">Most of these students are labelled as “average” or “weak.”</p>
    </div>
    <ul class="cl panel-list">
      ${listItems([
        "Read without understanding",
        "Memorize without retaining",
        "Solve without reasoning",
        "Write without expressing",
        "Lose confidence despite working hard",
      ])}
    </ul>`,

  /* ---- 3. Why current education needs a new layer ---- */
  () => `
    <div>
      <h2 class="rv">Why current education needs a <em>new layer</em></h2>
      <p class="lede rv" style="--d:150ms">One critical stage is missing.</p>
      <p class="bigword rv" style="--d:600ms">Diagnosis</p>
    </div>
    <div class="stack">
      <blockquote class="quote rv" style="--d:400ms">
        Without identifying the underlying reason for poor performance, interventions often become
        repetitive, expensive and ineffective.
      </blockquote>
      <blockquote class="quote rv" style="--d:1000ms">Diagnostics reveal causes.</blockquote>
    </div>`,

  /* ---- 4. Why schools need learning diagnostics ---- */
  () => `
    <div>
      <h2 class="rv">Why schools need <em>learning diagnostics</em></h2>
      <p class="lede rv" style="--d:150ms">Imagine healthcare without diagnosis.</p>
    </div>
    <div class="stack">
      <blockquote class="quote rv" style="--d:400ms">Would a doctor prescribe treatment before diagnosis?</blockquote>
      <blockquote class="quote rv" style="--d:1300ms"><em class="neg">Never.</em></blockquote>
      <blockquote class="quote rv" style="--d:2200ms">Education does exactly that every day.</blockquote>
      <p class="stmt rv" style="--d:3100ms">Schools teach before understanding how a child learns.</p>
    </div>`,

  /* ---- 5. Education is no longer about access ---- */
  () => `
    <div>
      <h2 class="rv">Education is no longer about <em>access</em></h2>
      <p class="lede rv" style="--d:150ms">The challenge is understanding learning.</p>
    </div>
    <div class="stack">
      <blockquote class="quote big rv" style="--d:400ms">
        “Every child deserves a diagnosis before being taught.”
      </blockquote>
      <blockquote class="quote rv" style="--d:1100ms">
        Education is changing. <em class="gold">Assessment must change first.</em>
      </blockquote>
    </div>`,

  /* ---- 6. Introducing SED ---- */
  () => `
    <div class="hero" style="grid-column:1/-1">
      <div>
        <p class="kick rv">INTRODUCING</p>
        <h1 class="rv" style="--d:150ms">Student Education <em>Diagnostics</em> (SED)</h1>
        <p class="lede rv" style="--d:450ms">
          India’s first neuroscience-driven learning diagnostic platform. A neuroscience-informed learning
          intelligence platform designed to identify <b style="color:#fff">learning gaps, cognitive strengths and
          developmental needs</b> before personalized interventions begin.
        </p>
        <p class="stmt rv" style="--d:900ms">SED introduces scientific diagnosis before remediation.</p>
      </div>
      <div class="orb rv" style="--d:300ms">
        <div class="ring"></div><div class="ring r2"></div>
        <div class="core"><img src="${IMG.logo}" alt="Student Education Diagnostics logo"></div>
      </div>
    </div>`,

  /* ---- 7. How SED works ---- */
  () => `
    <div>
      <h2 class="rv">How <em>SED</em> works</h2>
      <p class="lede rv" style="--d:150ms">
        Three voices, one analysis, one personalized plan: a connected path from first screening to targeted training.
      </p>
    </div>
    <div class="stack">
      <div class="card stat rv" style="--d:300ms"><span class="big-num">3</span>
        <span><b>Voices</b>Student, parent and teacher</span></div>
      <div class="card stat rv" style="--d:550ms"><span class="big-num">8</span>
        <span><b>Connected steps</b>From screening to targeted training</span></div>
      <div class="card stat rv" style="--d:800ms"><span class="big-num">1</span>
        <span><b>Personalized action plan</b>For every learner</span></div>
    </div>`,

  /* ---- 8. What makes SED different ---- */
  () => `
    <div>
      <h2 class="rv">What makes SED <em>different</em></h2>
      <div class="card ask rv" style="--d:300ms"><b>Traditional education asks</b>
        “What score did the student achieve?”</div>
      <p class="stmt rv" style="--d:2200ms">SED transforms assessment into action.</p>
    </div>
    <div class="panel-list">
      <p class="lede rv" style="--d:500ms;margin:0 0 .6rem;color:var(--gold);font-weight:700">SED asks:</p>
      <ul class="cl" style="margin:0">
        ${listItems(
          [
            "Why did the student struggle?",
            "Which cognitive functions require support?",
            "Which learning strategies are most effective?",
            "What should teachers change?",
            "How can parents reinforce learning at home?",
          ],
          5,
        )}
      </ul>
    </div>`,

  /* ---- 9. An entire learning ecosystem ---- */
  () => `
    <div>
      <h2 class="rv">An entire <em>learning ecosystem</em></h2>
      <p class="lede rv" style="--d:150ms">SED provides:</p>
    </div>
    <ul class="cl panel-list">
      ${listItems(ECO_PARTS)}
    </ul>`,

  /* ---- 10. Teacher development ---- */
  () => `
    <div>
      <h2 class="rv">Teacher <em>development</em></h2>
      <p class="lede rv" style="--d:150ms">
        SED equips educators with neuroscience-informed instructional strategies.
      </p>
    </div>
    <div class="stack">
      <blockquote class="quote big rv" style="--d:400ms">
        Teachers remain the most important influence in every classroom.
      </blockquote>
    </div>`,

  /* ---- 11. Parent empowerment ---- */
  () => `
    <div>
      <h2 class="rv">Parent <em>empowerment</em></h2>
      <p class="lede rv" style="--d:150ms">Parents often want to help but lack practical guidance.</p>
    </div>
    <div class="stack">
      <div class="card rv" style="--d:400ms"><b>SED Parent Programs</b>
        Seven practical areas, from how children learn to home-based, neuroscience-informed learning practices.</div>
      <blockquote class="quote big rv" style="--d:900ms">Parents become active partners in education.</blockquote>
    </div>`,

  /* ---- 12. Our vision ---- */
  () => `
    <div>
      <h2 class="rv">Our <em>vision</em></h2>
      <p class="lede rv" style="--d:150ms">Every learner deserves to be understood.</p>
    </div>
    <div class="stack">
      <blockquote class="quote big rv" style="--d:400ms">
        We believe no child should be defined solely by examination scores.
      </blockquote>
    </div>`,

  /* ---- 13. Final slide ---- */
  () => `
    <div class="hero" style="grid-column:1/-1">
      <div>
        <p class="kick rv">THE FUTURE OF EDUCATION</p>
        <h1 class="rv" style="--d:150ms">The future of education begins with <em>understanding the learner</em></h1>
        <div class="rv" style="--d:700ms">
          <button class="cta" id="cta">Conclusion <span aria-hidden="true">›</span></button>
        </div>
      </div>
      <div class="orb rv" style="--d:300ms">
        <div class="ring"></div><div class="ring r2"></div>
        <div class="core"><img src="${IMG.logo}" alt="Student Education Diagnostics logo"></div>
      </div>
    </div>`,
];

const PART_B = [
  /* ---- 1. Curiosity: diagnose, then evaluate ---- */
  () =>
    bhead(
      "Imagine a school…",
      "…where every child receives a scientific learning diagnosis before being labelled as strong or weak.<br><br>Twenty years ago the challenge was getting children into schools.<br><br>Today the challenge is ensuring every child actually learns.",
    ) +
    `<div class="bvis"><div class="stack wide">
      ${flow(
        [
          { n: 1, t: "Scientific learning diagnosis", s: "for every child" },
          { n: 2, t: "Every child is understood", hot: 1 },
          { n: 3, t: "Then evaluated" },
        ],
        300,
      )}
      <div class="grid2">
        <div class="card rv" style="--d:1500ms"><b>Measured today</b>What students remember</div>
        <div class="card rv hot" style="--d:1800ms"><b>Rarely measured</b>
          How students learn, why they struggle, and what support they actually need</div>
      </div>
    </div></div>`,

  /* ---- 2. Iceberg ---- */
  () =>
    bhead(
      "Marks reveal outcomes",
      "Many students are experiencing hidden cognitive and learning gaps that traditional assessments never identify.",
    ) +
    `<div class="bvis">
      <svg class="berg" viewBox="0 0 620 440" role="img"
           aria-label="Iceberg: marks are visible above the surface; hidden cognitive and learning gaps lie below">
        <defs>
          <linearGradient id="bw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#2e418f" stop-opacity=".55"/><stop offset="1" stop-color="#080c26" stop-opacity=".2"/>
          </linearGradient>
        </defs>
        <rect x="0" y="150" width="620" height="290" fill="url(#bw)" rx="14"/>
        <path class="wave" d="M0 150 q 25 -9 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 20 0"
              fill="none" stroke="#e3bf68" stroke-width="2" stroke-opacity=".7"/>
        <g class="b-top">
          <polygon points="240,150 275,86 300,108 332,48 378,150" fill="#eef1ff"/>
          <polygon points="332,48 378,150 340,150" fill="#c9d1f2"/>
          <text x="420" y="92" class="bt-h">Marks</text>
          <text x="420" y="114" class="bt-s">what happened</text>
          <path d="M385 98 H412" stroke="#e3bf68" stroke-width="1.5"/>
        </g>
        <g class="b-bot">
          <polygon points="150,150 400,150 500,235 470,340 360,415 230,405 120,320 100,225"
                   fill="rgba(227,191,104,.13)" stroke="#e3bf68" stroke-width="1.6" stroke-dasharray="6 5"/>
          <text x="310" y="188" text-anchor="middle" class="bt-h gold">HIDDEN COGNITIVE &amp; LEARNING GAPS</text>
          <text x="310" y="210" text-anchor="middle" class="bt-s">that traditional assessments never identify</text>
          ${["Understanding", "Retention", "Reasoning", "Expression", "Confidence"]
            .map((t, i) => {
              const y = 238 + i * 33;
              return `<g class="btag" style="--d:${1000 + i * 250}ms">
                <rect x="225" y="${y}" width="170" height="26" rx="13"/>
                <text x="310" y="${y + 18}" text-anchor="middle">${t}</text></g>`;
            })
            .join("")}
        </g>
      </svg>
    </div>`,

  /* ---- 3. The missing layer (full width) ---- */
  () =>
    bhead(
      "The missing stage",
      "Today’s educational journey, and the one critical stage that is not there.",
    ) +
    `<div class="bvis"><div class="stack wide">
      <p class="cap rv">Today’s journey</p>
      ${flow(
        [
          "Teaching",
          "Testing",
          { t: "Marks", hot: 1 },
          { t: "Diagnosis", s: "missing", cls: "gap" },
          "Tuition",
          "More Testing",
        ],
        300,
      )}
      <div class="loop rv" style="--d:2400ms" aria-hidden="true">
        <svg viewBox="0 0 100 14" preserveAspectRatio="none"><path d="M96 0 V10 H4 V4"/></svg><i class="lh">▲</i>
        <span>repeat</span>
      </div>
      <div class="tags rv" style="--d:2900ms">
        <span class="pill neg">Repetitive</span><span class="pill neg">Expensive</span><span class="pill neg">Ineffective</span>
        <span class="pill pos">Diagnostics reveal causes</span>
      </div>
    </div></div>`,

  /* ---- 4. Healthcare vs education (full width) ---- */
  () =>
    bhead("Treatment follows diagnosis", "Healthcare never skips the diagnosis. Education does, every day.") +
    `<div class="bvis"><div class="lanes">
      <div class="lane rv" style="--d:200ms">
        <span class="ll">Healthcare</span>
        ${flow(["Symptoms", { t: "Diagnosis", hot: 1 }, "Treatment"], 400)}
      </div>
      <div class="lane rv" style="--d:1200ms">
        <span class="ll">Education today</span>
        ${flow(["Struggling student", { t: "Diagnosis", s: "skipped", cls: "skip" }, "Teaching and tuition"], 1400)}
      </div>
      <div class="lane rv" style="--d:2200ms">
        <span class="ll sed">Education with SED</span>
        ${flow(["Struggling student", { t: "Diagnosis", s: "SED", hot: 1 }, "Targeted intervention"], 2400)}
      </div>
    </div></div>`,

  /* ---- 5. Access to learning to understanding ---- */
  () =>
    bhead(
      "From access to understanding",
      "The challenge has moved, and the way we assess must move with it.",
    ) +
    `<div class="bvis"><div class="stack wide">
      ${flow(
        [
          { t: "Twenty years ago", s: "Getting children into schools" },
          { t: "Today", s: "Ensuring every child actually learns", hot: 1 },
          { t: "The next century", s: "Understanding every learner" },
        ],
        300,
      )}
      <p class="cap rv" style="--d:1500ms;margin-top:.4rem">Across the world, education is rapidly evolving through</p>
      <div class="rv" style="--d:1700ms">
        ${[
          "Artificial Intelligence",
          "Learning Analytics",
          "Cognitive Science",
          "Neuroscience",
          "Adaptive Learning Systems",
          "Personalized Education",
        ]
          .map((x) => `<span class="pill">${x}</span>`)
          .join("")}
      </div>
      <div class="card hotcard rv" style="--d:2300ms"><b>The future belongs to education systems that understand every learner individually.</b>
        SED is designed for this future.</div>
    </div></div>`,

  /* ---- 6. SED combines ---- */
  () => bhead("SED combines", "Hover over, or tap, any box to open its brief.") + orbit("sed", SED_PARTS, 400),

  /* ---- 7. How SED works: the flow (full width) ---- */
  () =>
    bhead("From screening to targeted training", "Eight connected steps, one pathway.") +
    `<div class="bvis"><div class="stack wide">
      <div class="grid3">
        <div class="card vcard rv" style="--d:300ms"><span class="nb">1</span>${bigIcon("user")}<b>Student Screening</b></div>
        <div class="card vcard rv" style="--d:550ms"><span class="nb">2</span>${bigIcon("users")}<b>Parent Insights</b></div>
        <div class="card vcard rv" style="--d:800ms"><span class="nb">3</span>${bigIcon("board")}<b>Teacher Observations</b></div>
      </div>
      <div class="vconn rv" style="--d:1100ms" aria-hidden="true">
        <svg viewBox="0 0 300 40" preserveAspectRatio="none">
          <path d="M50 0 C50 28 150 14 150 40"/><path d="M150 0 V40"/><path d="M250 0 C250 28 150 14 150 40"/>
          <path d="M144 33l6 7 6-7"/>
        </svg>
      </div>
      ${flow(
        [
          { n: 4, t: "Neuroscience and Psychology Analysis" },
          { n: 5, t: "Learning Gap Identification" },
          { n: 6, t: "Neuroscience-Based Reports" },
          { n: 7, t: "Personalized Action Plan" },
          { n: 8, t: "Targeted Student, Teacher and Parent Training", hot: 1 },
        ],
        1300,
      )}
    </div></div>`,

  /* ---- 8. Three dimensions (full width) ---- */
  () =>
    bhead("SED evaluates learning across multiple dimensions", "Fifteen areas, one connected picture of the learner.") +
    `<div class="bvis"><div class="stack wide">
      <div class="grid3">
        ${[
          ["book", "Academic Learning", ["Reading", "Writing", "Mathematics", "Science", "Communication"]],
          [
            "brain",
            "Cognitive Development",
            ["Attention", "Working Memory", "Executive Function", "Processing Speed", "Reasoning"],
          ],
          [
            "heart",
            "Human Skills",
            ["Emotional Intelligence", "Social Intelligence", "Adaptability", "Confidence", "Self-Regulation"],
          ],
        ]
          .map(
            ([ic, title, items], i) => `
          <div class="card dim rv" style="--d:${300 + i * 300}ms">
            ${bigIcon(ic)}<b>${title}</b>
            <div>${items.map((x) => `<span class="pill">${x}</span>`).join("")}</div>
          </div>`,
          )
          .join("")}
      </div>
      ${flow(
        [
          "Assessment",
          { t: "Why did it happen?" },
          { t: "Action", hot: 1 },
        ],
        1400,
      )}
    </div></div>`,

  /* ---- 9. Ecosystem ---- */
  () => bhead("One diagnosis, seven outputs", "Hover over, or tap, any box to open its brief.") + orbit("eco", ECO_PARTS, 400),

  /* ---- 10. Teacher staircase ---- */
  () =>
    bhead("Teachers are equipped to…", "Five steps from classroom engagement to measurable learning outcomes.") +
    `<div class="bvis"><div class="stairs">
      ${[
        "Improve classroom engagement",
        "Identify learning barriers",
        "Personalize instruction",
        "Build confidence in struggling learners",
        "Improve measurable learning outcomes",
      ]
        .map(
          (t, i) => `
        <div class="step rv" style="--h:${42 + i * 14.5}%;--d:${300 + i * 350}ms">
          <span class="nb">${i + 1}</span><b>${t}</b>
        </div>`,
        )
        .join("")}
    </div></div>`,

  /* ---- 11. Parent programs ---- */
  () =>
    bhead("SED Parent Programs teach", "Practical guidance, so parents become active partners in education.") +
    `<div class="bvis"><div class="pgrid">
      ${[
        ["brain", "How children learn"],
        ["layers", "Memory improvement strategies"],
        ["book", "Reading techniques"],
        ["focus", "Attention-building exercises"],
        ["heart", "Emotional regulation"],
        ["clock", "Study routines"],
        ["home", "Home-based neuroscience-informed learning practices"],
      ]
        .map(
          ([ic, t], i) =>
            `<div class="card pcard rv" style="--d:${250 + i * 170}ms">${icon(ic)}<b>${t}</b></div>`,
        )
        .join("")}
      <div class="card hotcard pcard rv" style="--d:${250 + 7 * 170}ms">
        ${icon("spark")}<b>Parents become active partners in education.</b>
      </div>
    </div></div>`,

  /* ---- 12. Vision pillars ---- */
  () =>
    bhead("Understanding for everyone", "A promise to the learner, the teacher, the parent and the school.") +
    `<div class="bvis"><div class="grid2 vgrid">
      ${[
        ["user", "Every learner", "deserves to be understood."],
        ["board", "Every teacher", "deserves scientific insight."],
        ["users", "Every parent", "deserves meaningful guidance."],
        ["school", "Every school", "deserves actionable intelligence."],
      ]
        .map(
          ([ic, h, p], i) =>
            `<div class="card vcard rv" style="--d:${250 + i * 250}ms">${bigIcon(ic)}<b>${h}</b><span class="soft">${p}</span></div>`,
        )
        .join("")}
    </div></div>`,

  /* ---- 13. Punch lines, one after another ---- */
  () => {
    const last = PUNCH.length - 1;
    const lines = PUNCH.map((p, i) => {
      const d = 400 + i * PUNCH_GAP + (i === last ? 300 : 0);
      return `<p class="pl ${p.c}" style="--d:${d}ms">${p.t}</p>`;
    }).join("");
    const endAt = 400 + last * PUNCH_GAP + 2200;
    return `<div class="punch" style="grid-column:1/-1">
      ${lines}
      <div class="acts close" style="--d:${endAt}ms">
        <button class="btn" id="pRe">Replay Conclusion</button>
        <button class="btn alt" id="pRs">Restart presentation</button>
      </div>
    </div>`;
  },
];

/* Stages whose visual view uses the full width (heading on top, chart below). */
const FULL_B = [2, 3, 6, 7, 12];

/* ==========================================================================
   4. JOURNEY (13 stage circles + 13 intermediate points on one wavy line)
   Step k = 0..25.  Even k = stage circle (part A), odd k = intermediate
   point (part B).
   ========================================================================== */

const STEPS = NSTAGES * 2;
const LAST = STEPS - 1;
const px = (k) => 4 + (k * 92) / (STEPS - 1);
const waveY = (x) => 42 - 13 * Math.sin((2 * Math.PI * (x - 4)) / 56 + 0.3);
const py = (k) => waveY(px(k));

function buildJourney() {
  let d = `M${px(0)},${waveY(px(0)).toFixed(2)}`;
  for (let x = px(0) + 0.25; x <= px(STEPS - 1) + 0.01; x += 0.25) {
    d += ` L${x.toFixed(2)},${waveY(x).toFixed(2)}`;
  }

  const line =
    `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">` +
    `<defs><linearGradient id="gl"><stop offset="0" stop-color="#FF7A8E"/>` +
    `<stop offset="1" stop-color="#E3BF68"/></linearGradient></defs>` +
    `<path class="bg-line" d="${d}"/>` +
    `<clipPath id="cp"><rect id="cr" x="0" y="-20" width="0" height="140"/></clipPath>` +
    `<path id="pgl" class="pg-line" d="${d}" clip-path="url(#cp)"/></svg>`;

  const stageNodes = ST.map(
    (s, i) => `
      <button class="node" data-step="${i * 2}" style="left:${px(i * 2)}%;top:${py(i * 2)}%"
              aria-label="Stage ${i + 1} of ${NSTAGES}: ${s.n}">
        <span class="dot">${i + 1}</span><span class="lab">${s.n}</span>
      </button>`,
  ).join("");

  const midNodes = ST.map(
    (s, i) => `
      <button class="mid" data-step="${i * 2 + 1}" style="left:${px(i * 2 + 1)}%;top:${py(i * 2 + 1)}%"
              aria-label="Stage ${i + 1}, part 2: visuals" title="${s.n}: visuals"></button>`,
  ).join("");

  nav.innerHTML = line + stageNodes + midNodes;
}

/* ==========================================================================
   5. NAVIGATION STATE
   ========================================================================== */

let step = 0;
let busy = false;

const levelOf = (k) => k >> 1;
const partOf = (k) => k & 1;

function paint() {
  const level = levelOf(step);

  document.querySelectorAll(".node").forEach((node, i) => {
    node.classList.toggle("done", i < level);
    node.classList.toggle("active", i === level);
    node.setAttribute("aria-current", i === level ? "step" : "false");
  });

  document.querySelectorAll(".mid").forEach((mid, i) => {
    const k = i * 2 + 1;
    mid.classList.toggle("done", step > k);
    mid.classList.toggle("active", step === k);
  });

  $("#cr").style.width = px(step) + "%";
  $("#count").textContent = `Stage ${level + 1} of ${NSTAGES} · Part ${partOf(step) + 1} of 2`;
  $("#bNext").disabled = step === LAST;
  $("#bPrev").disabled = step === 0;
  const srcLine = $("#srcline");
  if (srcLine) srcLine.textContent = "Source: " + ST[level].src[0];

  fillSourcePanel();
}

function fillSourcePanel() {
  const s = ST[levelOf(step)];
  $("#panel").innerHTML =
    
    `<div class="contact">
      <h4>Get in touch with us</h4>
      <p><span>Visit at</span>
        <a href="https://usaeducationdiagnostics.com" target="_blank" rel="noopener">usaeducationdiagnostics.com</a></p>
      <p><span>Contact Us</span>
        <a href="tel:18008908733">18008908733</a></p>
      <p><span>Email Address</span>
        <a href="mailto:info@thesed.com">info@thesed.com</a></p>
    </div>`;
}

/* Move to a step. `force` re-renders the same step (replay / restart). */
function go(target, force) {
  const sameStep = target === step && !force && stage.firstChild;
  if (target < 0 || target > LAST || sameStep || busy) return;

  busy = true;
  closeBrief(true);

  const current = stage.firstElementChild;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (current) current.classList.add("out");

  setTimeout(
    () => {
      step = target;
      paint();
      renderStep();
      busy = false;
    },
    current && !reduced ? 230 : 0,
  );
}

function renderStep() {
  const level = levelOf(step);
  const isB = partOf(step) === 1;
  const html = isB ? PART_B[level]() : PART_A[level]();
  const fullWidth = isB && FULL_B.includes(level);
  const fin = isB && level === NSTAGES - 1;
  stage.innerHTML = `<div class="view ${isB ? "vb" : "va"} ${fullWidth ? "full" : ""} ${fin ? "fin" : ""}">${html}</div>`;
  wireView();
}

/* ==========================================================================
   6. PER-VIEW BEHAVIOUR
   ========================================================================== */

function wireView() {
  const cta = $("#cta");
  if (cta) cta.onclick = next;

  const pRe = $("#pRe");
  if (pRe) pRe.onclick = () => go(step, true);
  const pRs = $("#pRs");
  if (pRs) pRs.onclick = () => go(0, true);
}

/* ==========================================================================
   7. HOVER BRIEFS
   Hover (mouse), focus (keyboard) or tap/click (touch) a box with a
   data-brief="group:index" attribute. Everything else blurs and a brief
   box opens, filled from BRIEFS in js/content.js.
   ========================================================================== */

let pinned = null;
let closeTimer = null;
let activeEl = null;

function openBrief(el) {
  clearTimeout(closeTimer);
  if (activeEl && activeEl !== el) activeEl.classList.remove("on");

  const [group, index] = el.dataset.brief.split(":");
  const data = BRIEF_DATA[group][+index];
  activeEl = el;

  brief.innerHTML =
    `<h4>${data.title}</h4><div class="rule"></div>` +
    `<div class="bb">${data.body || '<span class="empty">Your content goes here (js/content.js)</span>'}</div>`;

  const from = el.getBoundingClientRect();
  const to = brief.getBoundingClientRect();
  brief.style.transformOrigin = `${from.left + from.width / 2 - to.left}px ${from.top + from.height / 2 - to.top}px`;

  el.classList.add("on");
  app.classList.add("dim");
  brief.classList.add("on");
}

function closeBrief(force) {
  if (pinned && !force) return;
  clearTimeout(closeTimer);
  pinned = null;
  if (activeEl) activeEl.classList.remove("on");
  activeEl = null;
  app.classList.remove("dim");
  brief.classList.remove("on");
}

stage.addEventListener("mouseover", (e) => {
  const el = e.target.closest("[data-brief]");
  if (el && !pinned) openBrief(el);
});

stage.addEventListener("mouseout", (e) => {
  const el = e.target.closest("[data-brief]");
  if (el && !el.contains(e.relatedTarget)) closeTimer = setTimeout(() => closeBrief(), 160);
});

stage.addEventListener("focusin", (e) => {
  const el = e.target.closest("[data-brief]");
  if (el && !pinned) openBrief(el);
});

stage.addEventListener("focusout", (e) => {
  if (e.target.closest("[data-brief]")) closeTimer = setTimeout(() => closeBrief(), 160);
});

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-brief]");
  if (el) {
    if (pinned === el) {
      closeBrief(true);
    } else {
      pinned = null;
      openBrief(el);
      pinned = el;
    }
  } else if (pinned && !e.target.closest("#brief")) {
    closeBrief(true);
  }
});

/* ==========================================================================
   8. CONTROLS AND KEYBOARD
   ========================================================================== */

const next = () => go(Math.min(step + 1, LAST));
const prev = () => go(Math.max(step - 1, 0));

nav.addEventListener("click", (e) => {
  const target = e.target.closest("[data-step]");
  if (target) go(+target.dataset.step);
});

$("#bNext").onclick = next;
$("#bPrev").onclick = prev;
$("#bRe").onclick = () => go(step, true);
$("#bRst").onclick = () => go(0, true);

$("#bSrc").onclick = () => {
  const open = $("#panel").classList.toggle("open");
  $("#bSrc").setAttribute("aria-pressed", open);
};

$("#bFs").onclick = () => {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } catch (err) {
    /* Fullscreen is not available in every browser. */
  }
};

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;

  switch (e.key) {
    case "ArrowRight":
    case "PageDown":
      next();
      break;
    case "ArrowLeft":
    case "PageUp":
      prev();
      break;
    case "Home":
      go(0);
      break;
    case "End":
      go(LAST);
      break;
    case "Escape":
      $("#panel").classList.remove("open");
      $("#bSrc").setAttribute("aria-pressed", "false");
      closeBrief(true);
      break;
    case "r":
    case "R":
      go(step, true);
      break;
    case "s":
    case "S":
      $("#bSrc").click();
      break;
    case "f":
    case "F":
      $("#bFs").click();
      break;
  }
});

/* ==========================================================================
   9. START
   ========================================================================== */

buildJourney();
go(0, true);
