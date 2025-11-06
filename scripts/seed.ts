import path from 'node:path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SERVICE_KEY ??
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing SUPABASE_URL. Add it to .env.local or your shell environment.');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '❌ Missing SUPABASE_SERVICE_ROLE_KEY. Generate it in the Supabase dashboard and add it to .env.local.'
  );
  process.exit(1);
}

type Resource = {
  type: 'book' | 'article' | 'video' | 'tool' | 'paper' | 'podcast';
  title: string;
  author?: string;
  url: string;
};

type Section = {
  title: string;
  content: string;
};

type EpisodeInput = {
  podcast_name: string;
  podcast_host: string;
  podcast_category: string[];
  podcast_artwork_url: string;
  episode_title: string;
  episode_number: number;
  episode_date: string;
  episode_duration_minutes: number;
  guest_name: string;
  guest_title: string;
  guest_bio: string;
  guest_avatar_url: string;
  summary: string[];
  key_takeaways: string[];
  full_notes: Section[];
  resources_mentioned: Resource[];
  tags: string[];
  read_time_minutes: number;
  view_count: number;
  published_at: string;
};

type EpisodeSeed = Omit<EpisodeInput, 'summary' | 'full_notes'> & {
  summary: string;
  full_notes: string;
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const RESET_EPISODES = process.env.RESET_EPISODES === 'true';
const usingAnonKey =
  SUPABASE_SERVICE_ROLE_KEY === process.env.VITE_SUPABASE_ANON_KEY ||
  SUPABASE_SERVICE_ROLE_KEY === process.env.SUPABASE_ANON_KEY;

if (usingAnonKey) {
  console.warn(
    '⚠️ Using anon key for seeding. Inserts may fail if Row Level Security is enabled. Prefer SUPABASE_SERVICE_ROLE_KEY.'
  );
}

function createEpisode(input: EpisodeInput): EpisodeSeed {
  return {
    ...input,
    summary: input.summary.join('\n\n'),
    full_notes: input.full_notes
      .map((section) => `## ${section.title}\n${section.content}`)
      .join('\n\n'),
  };
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const episodes: EpisodeSeed[] = [
  createEpisode({
    podcast_name: 'Lex Fridman Podcast',
    podcast_host: 'Lex Fridman',
    podcast_category: ['Technology', 'Artificial Intelligence', 'Philosophy'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/lex-fridman-cover.jpg?auto=compress,format',
    episode_title: 'Demis Hassabis: DeepMind, AlphaFold, and Building Scientific AI',
    episode_number: 425,
    episode_date: '2024-09-18T10:00:00Z',
    episode_duration_minutes: 158,
    guest_name: 'Demis Hassabis',
    guest_title: 'Co-founder & CEO, Google DeepMind',
    guest_bio:
      'Demis Hassabis is a neuroscientist and entrepreneur whose work on AlphaGo, AlphaZero, and AlphaFold has redefined the frontier of artificial intelligence.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/demis-hassabis.jpg?auto=compress,format',
    summary: [
      `Lex and Demis retrace the arc of DeepMind from a London townhouse to an organization shipping research that rewrites textbooks. Demis reflects on the original mission—build learning systems that rival human flexibility—and the cultural choices that preserved curiosity while delivering breakthroughs.`,
      `They spend extended time on AlphaFold, the open-source release, and how the team translated a scientific milestone into a product that thousands of biologists use daily. The conversation ends with honest reflections on alignment, personal burnout, and why Demis still plays piano to reset his mind.`,
    ],
    key_takeaways: [
      `DeepMind's north star remains advancing intelligence to accelerate scientific discovery, not just building consumer apps.`,
      `AlphaFold succeeded because an interdisciplinary team merged reinforcement learning intuition with deep protein expertise.`,
      `Demis believes alignment research must progress in parallel with capability research, not trail years behind.`,
      `Culture rituals—science salons, reading groups, internal hackathons—helped DeepMind keep a research soul.`,
      `AlphaZero was a psychological turning point that proved self-learning systems could master domains without human heuristics.`,
      `Future AI agents will need to reason about experiments and physical constraints, not just language tokens.`,
      `DeepMind is partnering with labs on climate science, fusion, and drug discovery to anchor AI in real-world impact.`,
      `Open sourcing AlphaFold was a deliberate bet that wide access would compound discovery faster than closed models.`,
      `Demis schedules recovery weeks every quarter to avoid decision fatigue and keep creative energy high.`,
      `He remains cautiously optimistic that international evaluation standards can keep frontier models accountable.`,
      `Lex and Demis agree that studying the brain still inspires architecture choices in modern AI systems.`,
      `Predictions for AGI timelines require humility; Demis resists declaring precise years.`,
    ],
    full_notes: [
      {
        title: 'Origins of DeepMind',
        content: `Demis walks through recruiting the founding team, early experiments with Atari, and why they stayed independent until Google provided compute.`,
      },
      {
        title: 'AlphaFold and Scientific Infrastructure',
        content: `Detailed breakdown of the engineering pipeline, partnerships with EMBL-EBI, and how release planning balanced openness with responsibility.`,
      },
      {
        title: 'Alignment and Governance',
        content: `Demis advocates for third-party red teaming, interpretability research, and shared safety baselines across labs.`,
      },
      {
        title: 'Leadership Lessons',
        content: `Personal rituals, maintaining focus, and creating an environment where brilliant generalists and specialists can thrive together.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'paper',
        title: 'Mastering the game of Go without human knowledge',
        author: 'Silver et al.',
        url: 'https://www.nature.com/articles/nature24270',
      },
      {
        type: 'article',
        title: 'AlphaFold reveals the structure of the protein universe',
        author: 'Nature Editorial',
        url: 'https://www.nature.com/articles/d41586-021-02696-1',
      },
      {
        type: 'book',
        title: 'The Master Algorithm',
        author: 'Pedro Domingos',
        url: 'https://www.penguinrandomhouse.com/books/316180/the-master-algorithm-by-pedro-domingos/',
      },
    ],
    tags: ['DeepMind', 'AlphaFold', 'AI Research', 'Scientific Computing', 'Leadership'],
    read_time_minutes: 12,
    view_count: 0,
    published_at: '2024-09-18T10:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Lex Fridman Podcast',
    podcast_host: 'Lex Fridman',
    podcast_category: ['Technology', 'Artificial Intelligence', 'Society'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/lex-fridman-cover.jpg?auto=compress,format',
    episode_title: 'Fei-Fei Li: Human-Centered AI, Healthcare, and Designing for Dignity',
    episode_number: 427,
    episode_date: '2024-10-09T10:00:00Z',
    episode_duration_minutes: 142,
    guest_name: 'Dr. Fei-Fei Li',
    guest_title: 'Co-Director, Stanford Human-Centered AI Institute',
    guest_bio:
      'Fei-Fei Li is a pioneering computer vision researcher who created ImageNet and now leads efforts to ensure AI systems amplify human potential.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/fei-fei-li.jpg?auto=compress,format',
    summary: [
      `Fei-Fei reflects on the decade since ImageNet kicked off the deep learning renaissance and what "human-centered AI" actually looks like in practice. She explains how carefully curated datasets and participatory design guardrails can produce tools that respect cultural nuance.`,
      `Lex and Fei-Fei dive into healthcare deployments, education pilots, and the policy conversations she has in Washington. The dialogue balances optimism about technical progress with pragmatism about guardrails, accountability, and the need for diverse voices in AI governance.`,
    ],
    key_takeaways: [
      `ImageNet's success stemmed from a community effort that married ambition with meticulous labeling and taxonomy work.`,
      `Fei-Fei frames AI as a new electricity—powerful yet requiring infrastructure, standards, and public trust.`,
      `Healthcare AI must be co-designed with clinicians, patients, and ethicists to deliver equitable outcomes.`,
      `Education is ripe for AI tutors that scaffold curiosity rather than replace teachers.`,
      `Participatory design workshops with affected communities surface edge cases early in the development process.`,
      `Fei-Fei is investing in AI tools that help caregivers and reduce physician burnout.`,
      `Policy briefings focus on interpretability, liability, and equitable access to compute.`,
      `She mentors young researchers to cultivate courage, compassion, and cross-disciplinary literacy.`,
      `Immigrant experiences shaped her empathy and resilience as a leader navigating public scrutiny.`,
      `Lex and Fei-Fei agree that aligning values across Silicon Valley, academia, and government is the defining challenge.`,
      `Public-private partnerships will determine whether AI benefits reach rural hospitals and public schools.`,
      `Fei-Fei advocates for measuring success by human well-being metrics, not just model benchmarks.`,
    ],
    full_notes: [
      {
        title: 'From ImageNet to Foundation Models',
        content: `Fei-Fei shares lessons from scaling datasets, the costs of bias, and how self-supervised learning changes data strategy.`,
      },
      {
        title: 'Human-Centered Design Principles',
        content: `Key pillars: respect for human dignity, inclusion, agency, and shared prosperity.`,
      },
      {
        title: 'Healthcare and Education Case Studies',
        content: `Real-world deployments including radiology triage, eldercare monitoring, and AI-assisted tutoring.`,
      },
      {
        title: 'Policy and Bridges Between Worlds',
        content: `Fei-Fei details her work with lawmakers and why narrative storytelling matters when explaining AI.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'The Worlds I See',
        author: 'Fei-Fei Li',
        url: 'https://us.macmillan.com/books/9781250874991/theworldsisee',
      },
      {
        type: 'paper',
        title: 'ImageNet: A Large-Scale Hierarchical Image Database',
        author: 'Deng et al.',
        url: 'http://www.image-net.org/papers/imagenet_cvpr09.pdf',
      },
      {
        type: 'article',
        title: 'Creating People-Centered AI',
        author: 'Stanford HAI Policy Brief',
        url: 'https://hai.stanford.edu/policy-briefs',
      },
    ],
    tags: ['ImageNet', 'AI Policy', 'Healthcare', 'Education', 'Ethics'],
    read_time_minutes: 11,
    view_count: 0,
    published_at: '2024-10-09T10:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Lex Fridman Podcast',
    podcast_host: 'Lex Fridman',
    podcast_category: ['Technology', 'Economics', 'Futurism'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/lex-fridman-cover.jpg?auto=compress,format',
    episode_title: 'Marc Andreessen: Techno-Optimism, AI Scaling, and Building Civilization',
    episode_number: 429,
    episode_date: '2024-11-05T10:00:00Z',
    episode_duration_minutes: 164,
    guest_name: 'Marc Andreessen',
    guest_title: 'Co-founder, Andreessen Horowitz',
    guest_bio:
      'Marc Andreessen is an entrepreneur and investor who co-created the Mosaic browser, co-founded Netscape, and now backs ambitious founders through Andreessen Horowitz.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/marc-andreessen.jpg?auto=compress,format',
    summary: [
      `Marc unpacks his techno-optimist manifesto, the backlash it triggered, and why he believes accelerating innovation is both moral and practical. He outlines investment theses around AI-native infrastructure, energy abundance, and new industrial policy.`,
      `Lex presses Marc on governance, alignment, and what responsibility venture capitalists carry as capital allocators. The dialogue balances bold ambition with sober assessments of geopolitical risk and supply chain fragility.`,
    ],
    key_takeaways: [
      `Techno-optimism frames innovation as the path to abundance, lifting billions through compounding progress.`,
      `AI scaling laws suggest continuous returns on compute; investors should back teams pushing hardware and software frontiers.`,
      `Marc cautions against regulatory capture that locks incumbents in place and stifles creative destruction.`,
      `Semiconductor supply chains are the new geopolitics; sovereign compute strategies will define national competitiveness.`,
      `Founders should craft narratives that feel like science fiction come alive—storytelling recruits talent and capital.`,
      `Venture fundamentals still matter: real customers, differentiated technology, and defensibility.`,
      `Marc sees new innovation hubs forming around energy-rich geographies partnering with research universities.`,
      `He remains skeptical of AI doomism that lacks empirical grounding in deployed systems.`,
      `Personal operating system: aggressive reading schedule, note cards, and weekly founder roundtables.`,
      `Marc urges founders to build civilization-scale companies rather than incremental SaaS tools.`,
      `Policy conversations need builders present; otherwise, risk-averse voices dominate rulemaking.`,
      `Lex and Marc agree that history shows progress is messy but necessary.`,
    ],
    full_notes: [
      {
        title: 'Manifesto Origins',
        content: `Marc explains why he wrote the techno-optimist essay, how he handled criticism, and the values he wanted to signal.`,
      },
      {
        title: 'AI Investment Landscape',
        content: `Discussion of infrastructure layers, open vs closed models, and where a16z is writing checks in 2025.`,
      },
      {
        title: 'Geopolitics and Supply Chains',
        content: `Analysis of the CHIPS Act, TSMC expansion, and the race to secure energy for data centers.`,
      },
      {
        title: 'Founder Mindset',
        content: `Marc shares his filters for evaluating founders and the habits that keep him intellectually sharp.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'The Techno-Optimist Manifesto',
        author: 'Marc Andreessen',
        url: 'https://a16z.com/the-techno-optimist-manifesto/',
      },
      {
        type: 'book',
        title: 'Where Is My Flying Car?',
        author: 'J. Storrs Hall',
        url: 'https://store.strangematters.co/products/where-is-my-flying-car',
      },
      {
        type: 'podcast',
        title: 'American Dynamism: Building for National Resilience',
        author: 'Andreessen Horowitz',
        url: 'https://a16z.com/podcast/',
      },
    ],
    tags: ['Techno-Optimism', 'Venture Capital', 'Semiconductors', 'Policy', 'AI'],
    read_time_minutes: 13,
    view_count: 0,
    published_at: '2024-11-05T10:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Tim Ferriss Show',
    podcast_host: 'Tim Ferriss',
    podcast_category: ['Health', 'Performance', 'Lifestyle'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/tim-ferriss-cover.jpg?auto=compress,format',
    episode_title: 'Peter Attia: Updating the Centenarian Decathlon for 2025',
    episode_number: 739,
    episode_date: '2024-09-12T07:00:00Z',
    episode_duration_minutes: 152,
    guest_name: 'Dr. Peter Attia',
    guest_title: 'Physician & Author of Outlive',
    guest_bio:
      'Peter Attia is a longevity physician focused on the applied science of extending healthspan through exercise, nutrition, and emotional fitness.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/peter-attia.jpg?auto=compress,format',
    summary: [
      `Tim and Peter revisit the Centenarian Decathlon framework with new protocols for strength, metabolic health, and emotional resilience. Peter shares updated research, case studies from his practice, and the scripts he uses to help high performers navigate burnout.`,
      `They dive into VO2 max, protein targets, lab testing cadence, and the softer side of longevity—friendships, purpose, and joy. The episode is equal parts tactical checklists and candid conversation.`,
    ],
    key_takeaways: [
      `Longevity planning should anchor on future physical tasks—what you want to do at age 90 dictates today's training.`,
      `VO2 max remains the strongest modifiable predictor of lifespan; Peter recommends periodized zone 2 and zone 5 blocks.`,
      `Strength standards include unilateral stability and eccentric control, not just two-legged powerlifting numbers.`,
      `Continuous glucose monitors are temporary teaching tools; wear them for insight, not addiction.`,
      `Protein: target 1 gram per pound of goal body weight, spread across three meals.`,
      `Emotional health audits each quarter catch simmering burnout among founders and executives.`,
      `Sleep consistency outranks total hours when schedules get messy.`,
      `Advanced supplementation should be customized; creatine, omega-3s, and magnesium remain staples.`,
      `Psychedelic-assisted therapy can be transformative but requires expert guidance and integration.`,
      `Weekly “joy audits” ensure longevity plans enhance rather than constrict life.`,
      `Tim shares how he restructured mornings to protect creative time before digital noise.`,
      `Peter encourages building longevity teams: coaches, therapists, physicians, and accountability buddies.`,
    ],
    full_notes: [
      {
        title: 'Revisiting the Centenarian Decathlon',
        content: `Updated event list, training blocks, and diagnostics Peter uses with patients in 2024-2025.`,
      },
      {
        title: 'Metabolic Health Stack',
        content: `Lab tests, continuous glucose monitoring, and supplement considerations for insulin sensitivity.`,
      },
      {
        title: 'Emotional Fitness',
        content: `Why therapy, community, and joy matter as much as deadlifts and cold plunges.`,
      },
      {
        title: 'Implementation Tactics',
        content: `Negotiating training time with family, calendar design, and data tracking tools.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Outlive: The Science & Art of Longevity',
        author: 'Peter Attia',
        url: 'https://peterattiamd.com/outlive/',
      },
      {
        type: 'article',
        title: 'The Four Horsemen of Chronic Disease',
        author: 'Peter Attia',
        url: 'https://peterattiamd.com/fourhorsemen/',
      },
      {
        type: 'tool',
        title: 'Zone 2 Training Calculator',
        url: 'https://peterattiamd.com/zone2/',
      },
    ],
    tags: ['Longevity', 'VO2 Max', 'Strength Training', 'Metabolic Health', 'Mindset'],
    read_time_minutes: 12,
    view_count: 0,
    published_at: '2024-09-12T07:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Tim Ferriss Show',
    podcast_host: 'Tim Ferriss',
    podcast_category: ['Business', 'Technology', 'Creativity'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/tim-ferriss-cover.jpg?auto=compress,format',
    episode_title: 'Chris Dixon: Read Write Own, Crypto Product Cycles, and AI Agents',
    episode_number: 744,
    episode_date: '2024-10-17T07:00:00Z',
    episode_duration_minutes: 138,
    guest_name: 'Chris Dixon',
    guest_title: 'General Partner, Andreessen Horowitz',
    guest_bio:
      'Chris Dixon leads a16z Crypto and writes about how new computing cycles reshape the internet and encourage bottoms-up innovation.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/chris-dixon.jpg?auto=compress,format',
    summary: [
      `Chris shares lessons from the year since releasing "Read Write Own," detailing where crypto builders are quietly shipping products despite market noise. He outlines how AI agents will require wallets, identity, and verifiable provenance.`,
      `Tim probes the creative routines that keep Chris curious, the sci-fi novels that inform his investing lens, and what he tells founders about surviving long bear markets.`,
    ],
    key_takeaways: [
      `Computing cycles follow a pattern: new hardware, new infrastructure, new killer apps.`,
      `Decentralized physical infrastructure networks (DePIN) are seeing real usage—from wireless to compute.`,
      `AI agents will need on-chain identities to coordinate payments, data access, and reputation.`,
      `Regulatory clarity is improving thanks to bipartisan frameworks for digital assets introduced in 2024.`,
      `Great crypto products hide complexity—users should benefit from trustlessness without touching jargon.`,
      `Storytelling remains a superpower; founders must explain why their protocol matters in human terms.`,
      `Chris keeps a curiosity stack: monthly research topics, sci-fi reading, and weekend coding projects.`,
      `Community ownership works when tokens align incentives with long-term value creation.`,
      `He expects gaming economies to blend with productivity software via interoperable assets.`,
      `Analog routines—long walks, notebooks, music—help Chris think clearly away from screens.`,
      `Builders should focus on user experience before obsessing over governance minutiae.`,
      `Tim and Chris agree that the next wave will blend AI reasoning with decentralized coordination.`,
    ],
    full_notes: [
      {
        title: 'State of Crypto in Late 2024',
        content: `Developer metrics, infrastructure maturity, and why speculation is giving way to utility.`,
      },
      {
        title: 'AI x Web3 Intersections',
        content: `Agentic workflows, decentralized compute markets, and the role of zero-knowledge proofs.`,
      },
      {
        title: 'Creative Process',
        content: `Chris explains his note-taking system, research sprints, and how he collaborates with researchers.`,
      },
      {
        title: 'Advice for Builders',
        content: `Product mindset, community design, and staying solvent during multi-year winters.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Read Write Own',
        author: 'Chris Dixon',
        url: 'https://readwriteown.com/',
      },
      {
        type: 'article',
        title: 'Why Decentralization Matters',
        author: 'Chris Dixon',
        url: 'https://cdixon.org/2018/02/why-decentralization-matters/',
      },
      {
        type: 'paper',
        title: 'On the Emergence of Agentic AI',
        author: 'a16z Crypto Research',
        url: 'https://a16zcrypto.com/research/',
      },
    ],
    tags: ['Crypto', 'Web3', 'AI Agents', 'Product Strategy', 'Venture Capital'],
    read_time_minutes: 11,
    view_count: 0,
    published_at: '2024-10-17T07:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Tim Ferriss Show',
    podcast_host: 'Tim Ferriss',
    podcast_category: ['Business', 'Investing', 'Personal Development'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/tim-ferriss-cover.jpg?auto=compress,format',
    episode_title: 'Morgan Housel: Same as Ever, Decision-Making in Uncertain Times, and Writing Clearly',
    episode_number: 748,
    episode_date: '2024-11-07T07:00:00Z',
    episode_duration_minutes: 131,
    guest_name: 'Morgan Housel',
    guest_title: 'Partner at Collaborative Fund & Bestselling Author',
    guest_bio:
      'Morgan Housel writes about investing and human behavior. His books "The Psychology of Money" and "Same as Ever" explore timeless patterns that govern markets and life decisions.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/morgan-housel.jpg?auto=compress,format',
    summary: [
      `Morgan and Tim discuss why understanding unchanging human behavior is more important than obsessing over short-term macro forecasts. Morgan shares frameworks for staying calm when the world feels chaotic, along with his creative rituals for writing essays that resonate.`,
      `They trade parenting lessons, talk about money scripts passed down across generations, and explain how to cultivate a temperament that survives volatility. Morgan brings candid stories from investing mistakes and from crafting his latest book.`,
    ],
    key_takeaways: [
      `The most important forces in finance—greed, fear, incentives—change far slower than technology.`,
      `Morgan frames investing as a game of survival: staying in the game matters more than maximizing every cycle.`,
      `Volatility is a fee for outsized returns, not a fine to be avoided.`,
      `Writing is thinking; Morgan refuses to publish an essay unless it has a single actionable takeaway.`,
      `He keeps a daily walking habit without headphones to let ideas crystallize.`,
      `Personal finance should optimize for independence and optionality rather than status.`,
      `Money scripts from childhood silently shape adult decisions—bring them into the light.`,
      `Diversification is protection against being wrong, not a bet against being right.`,
      `Morgan journals each evening about surprises from the day to sharpen pattern recognition.`,
      `He reads vintage newspapers to understand how people actually felt during past crises.`,
      `Tim and Morgan agree that boredom tolerance is an investing superpower.`,
      `Raising resilient kids means modeling patience, generosity, and curiosity more than lecturing.`,
    ],
    full_notes: [
      {
        title: 'Same as Ever Themes',
        content: `Morgan explains why focusing on unchanging human nature gives investors a durable edge.`,
      },
      {
        title: 'Temperament Over Tactics',
        content: `Mental models for staying calm, building cash buffers, and making decisions under uncertainty.`,
      },
      {
        title: 'Craft of Writing',
        content: `Morgan shares his note-taking system, editing flow, and why he aims for conversational tone.`,
      },
      {
        title: 'Family & Money Scripts',
        content: `How he talks about money with his kids and lessons he wishes he had learned earlier.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Same as Ever',
        author: 'Morgan Housel',
        url: 'https://www.morganhousel.com/books/same-as-ever',
      },
      {
        type: 'book',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        url: 'https://www.morganhousel.com/books/psychology-of-money',
      },
      {
        type: 'article',
        title: 'The Seduction of Pessimism',
        author: 'Morgan Housel',
        url: 'https://collabfund.com/blog/the-seduction-of-pessimism/',
      },
    ],
    tags: ['Investing', 'Behavioral Finance', 'Writing', 'Decision Making', 'Habits'],
    read_time_minutes: 10,
    view_count: 0,
    published_at: '2024-11-07T07:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Huberman Lab',
    podcast_host: 'Andrew Huberman',
    podcast_category: ['Health', 'Neuroscience', 'Performance'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/huberman-lab-cover.jpg?auto=compress,format',
    episode_title: 'Foundations of Metabolic Health: Glucose Control, Energy, and Daily Protocols',
    episode_number: 152,
    episode_date: '2024-09-23T05:00:00Z',
    episode_duration_minutes: 172,
    guest_name: 'Andrew Huberman, Ph.D.',
    guest_title: 'Neuroscientist & Professor, Stanford School of Medicine',
    guest_bio:
      'Andrew Huberman is a neuroscientist translating lab findings into practical protocols that support physical and mental health.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/andrew-huberman.jpg?auto=compress,format',
    summary: [
      `This solo deep dive lays out a start-to-finish blueprint for improving metabolic health. Huberman connects circadian biology to glucose control, shares morning and evening routines, and explains how exercise, nutrition, and cold exposure interact.`,
      `He balances mechanistic explanations with tactical recommendations, giving listeners lab markers to monitor and week-by-week habit ladders to follow.`,
    ],
    key_takeaways: [
      `Morning sunlight within 60 minutes of waking synchronizes liver clocks that regulate glucose.`,
      `Resistance training before large meals enhances insulin sensitivity for up to 24 hours.`,
      `Zone 2 cardio three times weekly expands mitochondrial density and metabolic flexibility.`,
      `Front-load protein and fiber at meals to blunt blood sugar spikes.`,
      `Sleep restriction immediately reduces insulin sensitivity—consistency matters.`,
      `Cold exposure is best performed after training or on rest days to avoid blunting hypertrophy.`,
      `Supplement stack: creatine monohydrate, berberine (with medical oversight), and electrolytes.`,
      `Labs to watch: fasting insulin, HbA1c, triglyceride-to-HDL ratio, and continuous glucose trends.`,
      `Use wearable data as prompts to reflect, not as a source of shame.`,
      `Mindset: treat metabolic work as skill acquisition; celebrate small wins each week.`,
      `Community accountability dramatically increases adherence—find a partner or small group.`,
      `Huberman shares how he breaks plateaus by changing training environment every quarter.`,
    ],
    full_notes: [
      {
        title: 'Circadian Anchors',
        content: `Sunlight timing, meal cadence, and movement cues that align central and peripheral clocks.`,
      },
      {
        title: 'Nutrition Framework',
        content: `Macro ranges, prioritizing whole foods, and handling social meals without derailing progress.`,
      },
      {
        title: 'Training Protocols',
        content: `Weekly template combining strength, conditioning, mobility, and NEAT (non-exercise activity thermogenesis).`,
      },
      {
        title: 'Measurement & Iteration',
        content: `Recommended lab tests, tracking apps, and guidance on working with medical professionals.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Circadian Regulation of Glucose Metabolism',
        author: 'Bass & Takahashi',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3914090/',
      },
      {
        type: 'tool',
        title: 'Levels Continuous Glucose Monitor',
        url: 'https://www.levelshealth.com/',
      },
      {
        type: 'video',
        title: 'Huberman Lab Toolkit: Metabolic Health',
        url: 'https://hubermanlab.com/toolkit-for-metabolic-health/',
      },
    ],
    tags: ['Metabolic Health', 'Glucose', 'Circadian Rhythm', 'Training', 'Nutrition'],
    read_time_minutes: 14,
    view_count: 0,
    published_at: '2024-09-23T05:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Huberman Lab',
    podcast_host: 'Andrew Huberman',
    podcast_category: ['Health', 'Neuroscience', 'Sleep'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/huberman-lab-cover.jpg?auto=compress,format',
    episode_title: 'Matthew Walker: Deep Sleep, Emotional Resilience, and Travel Protocols',
    episode_number: 154,
    episode_date: '2024-10-21T05:00:00Z',
    episode_duration_minutes: 149,
    guest_name: 'Dr. Matthew Walker',
    guest_title: 'Professor of Neuroscience & Psychology, UC Berkeley',
    guest_bio:
      'Matthew Walker is a leading sleep scientist and author of "Why We Sleep," translating decades of research into actionable advice.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/matthew-walker.jpg?auto=compress,format',
    summary: [
      `Walker returns with fresh findings on deep sleep and how it recalibrates emotional processing. He and Huberman examine longitudinal data linking slow-wave sleep to mental health, creativity, and metabolic function.`,
      `Practical takeaways include wind-down routines, light hygiene, temperature tweaks, and realistic travel strategies for founders who cross time zones frequently.`,
    ],
    key_takeaways: [
      `Deep sleep acts like overnight therapy, quieting the amygdala and stabilizing mood.`,
      `Light is the main lever—dim fixtures below 50 lux two hours before bed.`,
      `Temperature: take a warm shower 90 minutes before bed and keep rooms near 65°F.`,
      `Consistent wake times anchor circadian rhythm even if bedtime fluctuates.`,
      `REM sleep fuels creativity and social acuity; alcohol severely fragments it.`,
      `Caffeine cutoff: 10 hours before target bedtime due to variable metabolism.`,
      `Jet lag protocol: shift schedule by 30 minutes per day before travel, seek morning light at destination.`,
      `Supplements like magnesium threonate, glycine, and apigenin can help but require experimentation.`,
      `Walker encourages leaders to design team schedules aligned with human sleep biology.`,
      `Short naps (20 minutes) earlier in the day can restore alertness without harming night sleep.`,
      `Respect chronotypes—forcing night owls into 5 a.m. routines is counterproductive.`,
      `Rebounding after a poor night involves early light, movement, and avoiding catastrophic thinking.`,
    ],
    full_notes: [
      {
        title: 'Why Deep Sleep Matters',
        content: `Mechanisms of slow-wave sleep, synaptic pruning, and links to anxiety resilience.`,
      },
      {
        title: 'Evening Protocols',
        content: `Lighting, temperature, and digital boundaries that support predictable sleep onset.`,
      },
      {
        title: 'Travel & Shift Work',
        content: `Strategies for adjusting schedules, leveraging light, and minimizing jet lag.`,
      },
      {
        title: 'Q&A Highlights',
        content: `Listener questions on naps, sleep trackers, parenting teens, and handling all-nighters.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Why We Sleep',
        author: 'Matthew Walker',
        url: 'https://www.sleepdiplomat.com/why-we-sleep',
      },
      {
        type: 'article',
        title: 'Sleep and Emotional Brain Function',
        author: 'Goldstein & Walker',
        url: 'https://www.annualreviews.org/doi/10.1146/annurev-clinpsy-050718-095554',
      },
      {
        type: 'tool',
        title: 'Eight Sleep Pod Cover',
        url: 'https://www.eightsleep.com/',
      },
    ],
    tags: ['Sleep', 'Circadian Rhythm', 'Mental Health', 'Recovery', 'Performance'],
    read_time_minutes: 12,
    view_count: 0,
    published_at: '2024-10-21T05:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Huberman Lab',
    podcast_host: 'Andrew Huberman',
    podcast_category: ['Health', 'Neuroscience', 'Performance'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/huberman-lab-cover.jpg?auto=compress,format',
    episode_title: 'Susanna Søberg: Cold Exposure, Sauna, and Building Stress Resilience',
    episode_number: 156,
    episode_date: '2024-11-11T05:00:00Z',
    episode_duration_minutes: 161,
    guest_name: 'Dr. Susanna Søberg',
    guest_title: 'Metabolic Scientist & Author of Winter Swimming',
    guest_bio:
      'Susanna Søberg researches brown fat activation, deliberate cold exposure, and hormetic stress. Her Søberg Principle guides millions of practitioners.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/susanna-soberg.jpg?auto=compress,format',
    summary: [
      `Søberg and Huberman map out how to use cold exposure and sauna strategically. They dispel myths, highlight safety considerations, and explain how dosing stress can build confidence and metabolic flexibility.`,
      `Listeners receive week-by-week templates, journaling prompts, and guidance on integrating cold with strength training, endurance work, and recovery.`,
    ],
    key_takeaways: [
      `Finish cold sessions on cold to maximize brown fat activation—the Søberg Principle.`,
      `Aim for 11 minutes of deliberate cold per week, split across multiple sessions.`,
      `Breath control and extended exhales help tame the initial cold shock response.`,
      `Sauna protocols: 20 minutes at 80–90°C, three rounds, with cooling periods in between.`,
      `Cold before heavy strength work can blunt hypertrophy; schedule it on rest or cardio days.`,
      `Track mood and energy in a journal to notice psychological adaptations.`,
      `Hydration and electrolytes are essential—cold exposure increases diuresis.`,
      `Women should modulate intensity around menstrual cycles to avoid compounding stress.`,
      `Pair sauna and cold carefully; the contrast can amplify growth hormone release.`,
      `Cold showers are gateways, but immersion allows more precise temperature control.`,
      `Community sessions make the practice easier and add social accountability.`,
      `Mindset: treat the discomfort as voluntary short-term stress that raises your baseline capacity.`,
    ],
    full_notes: [
      {
        title: 'Cold Exposure Science',
        content: `Brown fat activation, norepinephrine spikes, and mitochondrial uncoupling explained in plain language.`,
      },
      {
        title: 'Weekly Templates',
        content: `Beginner, intermediate, and advanced schedules for cold plunges and sauna stacking.`,
      },
      {
        title: 'Integration with Training',
        content: `How endurance athletes, lifters, and knowledge workers can integrate thermal stress safely.`,
      },
      {
        title: 'Safety & Contraindications',
        content: `When to consult a physician, warning signs to stop, and post-session recovery tips.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Winter Swimming',
        author: 'Susanna Søberg',
        url: 'https://www.susannasoberg.com/winter-swimming',
      },
      {
        type: 'article',
        title: 'Thermogenesis in Brown Adipose Tissue',
        author: 'Cannon & Nedergaard',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4074730/',
      },
      {
        type: 'tool',
        title: 'Morozko Forge Ice Bath',
        url: 'https://morozkoforge.com/',
      },
    ],
    tags: ['Cold Exposure', 'Sauna', 'Stress Resilience', 'Metabolic Health', 'Recovery'],
    read_time_minutes: 13,
    view_count: 0,
    published_at: '2024-11-11T05:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Acquired',
    podcast_host: 'Ben Gilbert & David Rosenthal',
    podcast_category: ['Business', 'Technology', 'History'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/acquired-cover.jpg?auto=compress,format',
    episode_title: 'NVIDIA (Part II): Jensen’s AI Empire and the Platform Shift',
    episode_number: 210,
    episode_date: '2024-09-30T12:00:00Z',
    episode_duration_minutes: 185,
    guest_name: 'Ben Gilbert & David Rosenthal',
    guest_title: 'Co-hosts, Acquired',
    guest_bio:
      'Ben Gilbert and David Rosenthal explore the stories of great companies. This episode continues their definitive breakdown of NVIDIA and the AI platform wave.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/acquired-hosts.jpg?auto=compress,format',
    summary: [
      `Ben and David pick up the NVIDIA story post-2015, chronicling how Jensen Huang steered the company from gaming GPUs to the heart of the AI revolution. They analyze architectural bets, supply chain maneuvers, and the cultural fabric that allowed NVIDIA to out-execute rivals.`,
      `The duo also dissects financial performance, investor psychology, and the feedback loop between CUDA adoption and data center dominance. The episode is an MBA masterclass wrapped in storytelling.`,
    ],
    key_takeaways: [
      `Jensen’s long-term vision for accelerated computing gave NVIDIA a 10-year head start.`,
      `CUDA created an ecosystem lock-in that competitors still struggle to match.`,
      `Owning software, hardware, and developer relations allowed NVIDIA to move faster than traditional chip companies.`,
      `Supply chain investments in CoWoS packaging and HBM memory proved decisive in 2023–2024.`,
      `The company runs like a startup with tight feedback loops from customers back to engineering.`,
      `Ben & David highlight how NVIDIA structured go-to-market teams around industries, not products.`,
      `Financially, data center revenue eclipsed gaming, changing NVIDIA’s valuation profile.`,
      `Competitors face the Innovator’s Dilemma; incumbents hesitate to cannibalize existing product lines.`,
      `NVIDIA’s “full-stack” strategy extends to networking after the Mellanox acquisition.`,
      `Jensen’s culture of “no vacation before launch” is intense but fosters accountability.`,
      `The hosts explore sovereign compute initiatives and how national labs partner with NVIDIA.`,
      `Despite dominance, risks include export controls, customer concentration, and potential platform shifts.`,
    ],
    full_notes: [
      {
        title: 'From Gaming to AI Dominance',
        content: `Timeline of key product launches, including Volta, Turing, Ampere, and Hopper architectures.`,
      },
      {
        title: 'CUDA and Developer Ecosystem',
        content: `How software lock-in, SDKs, and conferences like GTC nurtured a passionate developer base.`,
      },
      {
        title: 'Financial Flywheel',
        content: `Revenue breakdowns, margin expansion, and how data center demand reshaped the business model.`,
      },
      {
        title: 'Risks & Future Bets',
        content: `Competition, geopolitics, and NVIDIA’s push into automotive, robotics, and Omniverse.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'NVIDIA’s CUDA Dominance Explained',
        author: 'SemiAnalysis',
        url: 'https://www.semianalysis.com/',
      },
      {
        type: 'video',
        title: 'Jensen Huang GTC Keynote 2024',
        url: 'https://www.nvidia.com/gtc/',
      },
      {
        type: 'book',
        title: 'The Innovator’s Dilemma',
        author: 'Clayton Christensen',
        url: 'https://www.harpercollins.com/products/the-innovators-dilemma-clayton-m-christensen',
      },
    ],
    tags: ['NVIDIA', 'CUDA', 'AI Infrastructure', 'Semiconductors', 'Business Strategy'],
    read_time_minutes: 15,
    view_count: 0,
    published_at: '2024-09-30T12:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Acquired',
    podcast_host: 'Ben Gilbert & David Rosenthal',
    podcast_category: ['Business', 'Retail', 'Strategy'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/acquired-cover.jpg?auto=compress,format',
    episode_title: 'Costco: The Trillion-Dollar Warehouse Club',
    episode_number: 211,
    episode_date: '2024-10-28T12:00:00Z',
    episode_duration_minutes: 168,
    guest_name: 'Ben Gilbert & David Rosenthal',
    guest_title: 'Co-hosts, Acquired',
    guest_bio:
      'Ben and David peel back the layers of Costco, one of the most disciplined retailers on earth, and explain how its culture, unit economics, and membership flywheel create unstoppable momentum.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/acquired-hosts.jpg?auto=compress,format',
    summary: [
      `The hosts trace Costco’s roots from Price Club to a global warehouse phenomenon. They break down how the company maintains fanatical focus on value, treats employees as a strategic asset, and wields private label powerhouse Kirkland Signature.`,
      `Listeners learn why Costco’s business model produces enviable cash flow, how it expanded internationally, and what lessons modern subscription companies can borrow.`,
    ],
    key_takeaways: [
      `Costco makes most of its profit from membership fees, allowing razor-thin product margins.`,
      `A ruthless 14% markup cap cements trust with members.`,
      `Employee retention is a superpower—Costco pays top-tier wages and promotes from within.`,
      `Kirkland Signature now rivals national brands in quality while boosting margins.`,
      `The treasure-hunt merchandising strategy creates excitement and loyalty.`,
      `Gas stations, optical centers, and travel services deepen wallet share.`,
      `International expansion works when Costco adapts to local tastes while preserving core principles.`,
      `Inventory turns and limited SKUs keep operations lean.`,
      `Costco’s culture punishes greed and celebrates humility, starting with Jim Sinegal’s example.`,
      `Real estate discipline—owning land when possible—provides resilience during downturns.`,
      `The company uses data to forecast demand but still empowers merchants with autonomy.`,
      `Threats include e-commerce convenience and competition for wallet share, but membership renewal rates remain above 90%.`,
    ],
    full_notes: [
      {
        title: 'Founding Story',
        content: `From Sol Price to Jim Sinegal, the origins of the warehouse-club concept.`,
      },
      {
        title: 'Membership Flywheel',
        content: `Economics of renewal revenue, ancillary services, and lifetime value.`,
      },
      {
        title: 'Operations & Culture',
        content: `Employee practices, vendor relationships, and Kirkland Signature’s rise.`,
      },
      {
        title: 'Risks & Future Outlook',
        content: `E-commerce, demographics, and potential adjacencies Costco could pursue.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Costco’s Secret Sauce',
        author: 'Harvard Business Review',
        url: 'https://hbr.org/',
      },
      {
        type: 'book',
        title: 'The New Gold Standard',
        author: 'Joseph Michelli',
        url: 'https://www.penguinrandomhouse.com/books/304945/the-new-gold-standard-by-joseph-a-michelli/',
      },
      {
        type: 'video',
        title: 'Inside Costco’s Treasure Hunt',
        url: 'https://www.youtube.com/watch?v=GXF29V3lGKo',
      },
    ],
    tags: ['Costco', 'Retail Strategy', 'Membership Models', 'Operations', 'Kirkland Signature'],
    read_time_minutes: 13,
    view_count: 0,
    published_at: '2024-10-28T12:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Acquired',
    podcast_host: 'Ben Gilbert & David Rosenthal',
    podcast_category: ['Business', 'Fintech', 'Startups'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/acquired-cover.jpg?auto=compress,format',
    episode_title: 'Stripe: The Internet’s Financial Backbone',
    episode_number: 212,
    episode_date: '2024-11-18T12:00:00Z',
    episode_duration_minutes: 176,
    guest_name: 'Ben Gilbert & David Rosenthal',
    guest_title: 'Co-hosts, Acquired',
    guest_bio:
      'Ben and David tell the origin story of Stripe, dissecting how the Collison brothers built developer love, expanded into enterprise, and now power a multi-product financial platform.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/acquired-hosts.jpg?auto=compress,format',
    summary: [
      `This episode charts Stripe’s path from a seven-line API to a global financial infrastructure company. The hosts explore product strategy, platform expansion, and the company’s unique partnership with developers.`,
      `They examine how Stripe Atlas, Issuing, and Climate extend the brand while remaining anchored in developer experience.`,
    ],
    key_takeaways: [
      `Stripe won early by obsessing over developer experience—clear docs, copy-paste snippets, and instant activation.`,
      `The Collison brothers grew slowly and deliberately, turning down acquisition offers to pursue the mission.`,
      `Moving upmarket required building sales and compliance muscle without sacrificing product velocity.`,
      `Stripe’s product flywheel spans payments, billing, treasury, issuing, and identity.`,
      `Atlas and Climate programs cement relationships with startups and climate-conscious enterprises.`,
      `Global expansion demanded navigating local banking regulations and fraud patterns country by country.`,
      `Stripe Capital and Instant Payouts illustrate how data network effects unlock adjacent services.`,
      `Culture emphasizes intellectual curiosity, rigorous thinking, and respect for craft.`,
      `Competition includes Adyen, Checkout.com, and incumbent banks, but Stripe still wins on developer love.`,
      `IPO timing remains a strategic question; the company prefers patience over unfriendly market windows.`,
      `The hosts analyze Stripe’s valuation resets and lessons for private-market investors.`,
      `Risks include regulatory scrutiny, margin pressure, and dependency on growing ecommerce volumes.`,
    ],
    full_notes: [
      {
        title: 'Founding Years',
        content: `Patrick and John Collison’s journey, Y Combinator roots, and early product decisions.`,
      },
      {
        title: 'Product Expansion',
        content: `From Payments to Billing, Connect, Issuing, Treasury, and beyond.`,
      },
      {
        title: 'Go-To-Market Evolution',
        content: `Self-serve onboarding, enterprise sales, and partnerships with platforms.`,
      },
      {
        title: 'Current Challenges & Future',
        content: `Regulation, margin compression, and opportunities in global trade and climate.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Stripe Atlas Guide',
        author: 'Stripe',
        url: 'https://stripe.com/atlas',
      },
      {
        type: 'book',
        title: 'Innovation Stack',
        author: 'Jim McKelvey',
        url: 'https://www.penguinrandomhouse.com/books/622526/the-innovation-stack-by-jim-mckelvey/',
      },
      {
        type: 'podcast',
        title: 'Patrick Collison on EconTalk',
        author: 'EconTalk',
        url: 'https://www.econtalk.org/',
      },
    ],
    tags: ['Stripe', 'Fintech', 'Developer Experience', 'Platform Strategy', 'Startups'],
    read_time_minutes: 14,
    view_count: 0,
    published_at: '2024-11-18T12:00:00Z',
  }),
  createEpisode({
    podcast_name: 'All-In Podcast',
    podcast_host: 'Chamath Palihapitiya, Jason Calacanis, David Sacks & David Friedberg',
    podcast_category: ['Business', 'Politics', 'Technology'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/all-in-cover.jpg?auto=compress,format',
    episode_title: 'Election 2024 Wrap-Up: AI Policy, Markets, and the New Congress',
    episode_number: 151,
    episode_date: '2024-11-09T03:00:00Z',
    episode_duration_minutes: 124,
    guest_name: 'The Besties',
    guest_title: 'Co-hosts of the All-In Podcast',
    guest_bio:
      'Chamath, Jason, Sacks, and Friedberg debate the latest in tech, markets, and politics. Post-election episodes are famous for candid analysis and spirited disagreements.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/all-in-hosts.jpg?auto=compress,format',
    summary: [
      `The Besties break down the U.S. election results with a focus on how AI policy, antitrust enforcement, and energy strategy will shift under the new Congress. Each host brings a different lens—from venture capital to national security.`,
      `They preview cabinet appointments, debate the odds of comprehensive AI legislation, and speculate on market reactions in the weeks ahead.`,
    ],
    key_takeaways: [
      `AI policy is now a mainstream political issue; expect hearings on model licensing and compute access.`,
      `Chamath argues energy abundance should be the new moonshot, with nuclear and geothermal in focus.`,
      `Sacks warns of antitrust overreach that could chill innovation if regulators overcorrect.`,
      `Jason pushes for a startup-friendly immigration overhaul to retain global AI talent.`,
      `Friedberg highlights how climate tech is positioned for bipartisan wins via permitting reform.`,
      `Markets are likely to favor infrastructure and security plays in the new administration.`,
      `The hosts debate whether AI guardrails should be handled by a new agency or existing regulators.`,
      `They expect renewed scrutiny of social media moderation policies and Section 230.`,
      `Defense spending on autonomous systems will accelerate as geopolitical tensions stay high.`,
      `Chamath and Sacks spar over crypto regulation and whether the new Congress will embrace stablecoins.`,
      `Jason predicts a wave of new founders building civic tech tools to enhance transparency.`,
      `Friedberg calls for pragmatic public-private partnerships to deploy climate solutions faster.`,
    ],
    full_notes: [
      {
        title: 'Election Results Recap',
        content: `Swing states, voter demographics, and how tech money influenced key races.`,
      },
      {
        title: 'AI Policy Outlook',
        content: `Model licensing, export controls, and expectations for global coordination.`,
      },
      {
        title: 'Markets & Sectors',
        content: `Energy, defense, infrastructure, and venture sentiment heading into 2025.`,
      },
      {
        title: 'Action Items for Builders',
        content: `Immigration advocacy, regulatory engagement, and areas ripe for new startups.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'White House Blueprint for an AI Bill of Rights',
        author: 'OSTP',
        url: 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/',
      },
      {
        type: 'paper',
        title: 'DOE Pathways to Commercial Liftoff: Advanced Nuclear',
        author: 'U.S. Department of Energy',
        url: 'https://liftoff.energy.gov/advanced-nuclear/',
      },
      {
        type: 'tool',
        title: 'AI Policy Tracker',
        url: 'https://www.aipolicytracker.org/',
      },
    ],
    tags: ['AI Policy', 'Elections', 'Markets', 'Energy', 'Geopolitics'],
    read_time_minutes: 10,
    view_count: 0,
    published_at: '2024-11-09T03:00:00Z',
  }),
  createEpisode({
    podcast_name: 'All-In Podcast',
    podcast_host: 'Chamath Palihapitiya, Jason Calacanis, David Sacks & David Friedberg',
    podcast_category: ['Business', 'Startups', 'Economics'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/all-in-cover.jpg?auto=compress,format',
    episode_title: 'Startup Therapy: Surviving the 2025 Fundraising Reset',
    episode_number: 152,
    episode_date: '2024-11-23T03:00:00Z',
    episode_duration_minutes: 118,
    guest_name: 'The Besties',
    guest_title: 'Co-hosts of the All-In Podcast',
    guest_bio:
      'The All-In co-hosts bring operator and investor experience to dissect the startup landscape each week.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/all-in-hosts.jpg?auto=compress,format',
    summary: [
      `This therapy session episode focuses on founders navigating a tougher fundraising environment. The Besties share brutal truths about burn reduction, narrative tightening, and the rise of structured rounds.`,
      `Real founder questions spark debates on bridge financing, secondary sales, and whether to pursue profitability or growth.`,
    ],
    key_takeaways: [
      `Every founder should know runway at three burn levels: base, moderate cuts, and survival mode.`,
      `Structured rounds and investor-friendly terms are back—understand the cost before signing.`,
      `Narrative clarity beats buzzwords; explain the customer pain and why you win.`,
      `Consider staged layoffs with empathy—communicate early and offer references.`,
      `Bridge rounds must come with a plan for hitting milestones that unlock the next raise.`,
      `Gross margin and payback periods now matter as much as top-line growth.`,
      `Chamath advocates for disciplined capital allocation and brutal honesty with boards.`,
      `Jason emphasizes human storytelling when pitching—who are you helping and why now?`,
      `Sacks warns about predatory debt and urges founders to shop terms aggressively.`,
      `Friedberg recommends thinking in systems: revenue diversity, supply chain resilience, and pricing power.`,
      `Secondaries should be used sparingly; signal alignment by keeping skin in the game.`,
      `The hosts predict a wave of founder-led buybacks from exhausted investors.`,
    ],
    full_notes: [
      {
        title: 'Fundraising Landscape',
        content: `Deal volume, valuation resets, and the rise of alternative financing.`,
      },
      {
        title: 'Operational Discipline',
        content: `Burn modeling, expense audits, and aligning teams around new goals.`,
      },
      {
        title: 'Board Dynamics',
        content: `Managing expectations, communicating bad news, and leveraging advisors.`,
      },
      {
        title: 'Mental Health Tools',
        content: `Peer groups, executive coaching, and routines to stay resilient.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Sequoia’s Adaptive Strategies for Founders',
        author: 'Sequoia Capital',
        url: 'https://www.sequoiacap.com/article/adapt-to-endure/',
      },
      {
        type: 'tool',
        title: 'Runway Calculator Template',
        url: 'https://docs.google.com/spreadsheets/d/1runway-template',
      },
      {
        type: 'book',
        title: 'The Great CEO Within',
        author: 'Matt Mochary',
        url: 'https://www.thegreatceowithin.com/',
      },
    ],
    tags: ['Startups', 'Fundraising', 'Operations', 'Leadership', 'Mental Health'],
    read_time_minutes: 9,
    view_count: 0,
    published_at: '2024-11-23T03:00:00Z',
  }),
  createEpisode({
    podcast_name: 'All-In Podcast',
    podcast_host: 'Chamath Palihapitiya, Jason Calacanis, David Sacks & David Friedberg',
    podcast_category: ['Business', 'Technology', 'Global Affairs'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/all-in-cover.jpg?auto=compress,format',
    episode_title: 'AI Geopolitics: Chips, Cloud Sovereignty, and the Pacific Strategy',
    episode_number: 153,
    episode_date: '2024-12-01T03:00:00Z',
    episode_duration_minutes: 122,
    guest_name: 'The Besties',
    guest_title: 'Co-hosts of the All-In Podcast',
    guest_bio:
      'In this episode, the Besties unpack the intersection of AI, national security, and global supply chains as the Pacific region becomes the center of gravity for geopolitics.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/all-in-hosts.jpg?auto=compress,format',
    summary: [
      `The panel analyzes new export controls, the race to build sovereign clouds, and Japan’s and India’s push to attract chip fabs. They discuss what it means for startups, investors, and democracies managing strategic dependence on Taiwan.`,
      `Chamath and Sacks spar over how aggressive the U.S. should be with industrial policy versus letting markets allocate capital.`,
    ],
    key_takeaways: [
      `Export controls are tightening, forcing AI labs to rethink GPU sourcing and deployment strategies.`,
      `Sovereign cloud initiatives in Europe and Asia aim to keep sensitive data within borders.`,
      `Japan’s Rapidus and India’s ISMC represent new entrants in the advanced node race.`,
      `Chamath believes the U.S. should double down on nuclear energy to power AI data centers domestically.`,
      `Sacks warns that protectionism could slow innovation if allies retaliate.`,
      `Startups should plan for multi-cloud architectures and supply chain redundancy.`,
      `Friedberg highlights rare earth minerals and recycling as under-discussed choke points.`,
      `Jason pushes founders to consider geopolitical resilience when pitching enterprise customers.`,
      `The hosts expect venture money to flow into chip design, packaging, and cooling startups.`,
      `They advise keeping open lines with government affairs teams to anticipate policy swings.`,
      `Regional alliances like QUAD are becoming economic as much as military.`,
      `The conversation closes with a call for civic engagement and informed debate around AI governance.`,
    ],
    full_notes: [
      {
        title: 'Export Controls & Compliance',
        content: `New U.S. rules, their impact on NVIDIA, and how startups should prepare.`,
      },
      {
        title: 'Sovereign Cloud Strategies',
        content: `EU, Japan, India, and Middle East approaches to data localization.`,
      },
      {
        title: 'Industrial Policy vs. Markets',
        content: `Debate between hosts on subsidies, national champions, and innovation speed.`,
      },
      {
        title: 'Opportunities & Risks for Founders',
        content: `Areas ripe for new companies—cooling, packaging, recycling, and compliance tooling.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'U.S. Tightens Controls on AI Chips to China',
        author: 'Financial Times',
        url: 'https://www.ft.com/',
      },
      {
        type: 'paper',
        title: 'Quad Statement on Critical and Emerging Technologies',
        author: 'Quad Leaders',
        url: 'https://www.whitehouse.gov/briefing-room/statements-releases/',
      },
      {
        type: 'tool',
        title: 'Global Supply Chain Risk Dashboard',
        url: 'https://www.supplychainrisk.io/',
      },
    ],
    tags: ['Geopolitics', 'AI Infrastructure', 'Chips', 'Industrial Policy', 'Sovereign Cloud'],
    read_time_minutes: 11,
    view_count: 0,
    published_at: '2024-12-01T03:00:00Z',
  }),
  createEpisode({
    podcast_name: 'My First Million',
    podcast_host: 'Sam Parr & Shaan Puri',
    podcast_category: ['Entrepreneurship', 'Business', 'Technology'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/mfm-cover.jpg?auto=compress,format',
    episode_title: 'Building a $100M No-Code Empire with Serial Maker Alex Hormozi',
    episode_number: 522,
    episode_date: '2024-09-26T14:00:00Z',
    episode_duration_minutes: 102,
    guest_name: 'Alex Hormozi',
    guest_title: 'Founder, Acquisition.com',
    guest_bio:
      'Alex Hormozi is an entrepreneur and investor who scaled multiple service businesses before focusing on software and education products for creators and agencies.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/alex-hormozi.jpg?auto=compress,format',
    summary: [
      `Alex joins Sam and Shaan to break down how he’s using no-code tools to launch and scale products inside Acquisition.com. He shares his operating cadence, funnel experiments, and frameworks for spotting underserved niches.`,
      `The crew riffs on monetization ladders, agency arbitrage, and what it takes to stay disciplined when opportunity overload hits.`,
    ],
    key_takeaways: [
      `No-code tools compress launch cycles, letting teams test offers within days.`,
      `Alex runs monthly “build weeks” focused on shipping one high-leverage feature.`,
      `Pricing ladders—from free lead magnets to high-ticket programs—maximize LTV.`,
      `He tracks three metrics weekly: lead velocity, conversion rate, and cash collected.`,
      `Community-first funnels outperform cold ads; create value before pitching.`,
      `Delegation is easier when SOPs include loom walkthroughs and expected outcomes.`,
      `Alex keeps a “kill list” of projects to drop when focus gets diluted.`,
      `Partnerships with niche influencers provide better CAC than broad ad spend.`,
      `Hybrid teams (operators + creators) build products grounded in real customer pain.`,
      `He advises documenting every successful playbook immediately to avoid regression.`,
      `Sam and Shaan share their favorite no-code stacks for media and info product businesses.`,
      `The episode ends with a challenge to launch a $1K product in 30 days.`,
    ],
    full_notes: [
      {
        title: 'Acquisition.com Factory Model',
        content: `How Alex structures pods, revenue share, and governance for new product launches.`,
      },
      {
        title: 'No-Code Tooling',
        content: `Stacks leveraging Webflow, Airtable, Softr, Zapier, and custom scripts.`,
      },
      {
        title: 'Monetization Ladders',
        content: `Designing offers that graduate customers from free value to premium programs.`,
      },
      {
        title: 'Focus & Execution',
        content: `Calendaring, delegation, and internal dashboards that keep teams aligned.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: '$100M Leads',
        author: 'Alex Hormozi',
        url: 'https://acquisition.com/books',
      },
      {
        type: 'tool',
        title: 'Softr',
        url: 'https://www.softr.io/',
      },
      {
        type: 'podcast',
        title: 'Acquisition.com YouTube Channel',
        author: 'Alex Hormozi',
        url: 'https://www.youtube.com/@AlexHormozi',
      },
    ],
    tags: ['No-Code', 'Funnels', 'Operations', 'Agency', 'Creator Economy'],
    read_time_minutes: 9,
    view_count: 0,
    published_at: '2024-09-26T14:00:00Z',
  }),
  createEpisode({
    podcast_name: 'My First Million',
    podcast_host: 'Sam Parr & Shaan Puri',
    podcast_category: ['Business', 'Industrial', 'SaaS'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/mfm-cover.jpg?auto=compress,format',
    episode_title: 'Industrial SaaS Gold Rush: Selling Picks & Shovels to Legacy Industries',
    episode_number: 527,
    episode_date: '2024-10-31T14:00:00Z',
    episode_duration_minutes: 97,
    guest_name: 'Anna Kramer',
    guest_title: 'Founder, ConveyorOS',
    guest_bio:
      'Anna Kramer is a former oil & gas engineer who now builds software for heavy industry, helping field teams digitize workflows and unlock new revenue streams.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/anna-kramer.jpg?auto=compress,format',
    summary: [
      `Anna shares how she bootstrapped ConveyorOS to seven figures selling workflow automation to industrial distributors. Sam and Shaan dig into pricing psychology, channel partnerships, and the underrated power of boring businesses.`,
      `The conversation becomes a blueprint for anyone trying to modernize paper-and-clipboard industries.`,
    ],
    key_takeaways: [
      `Legacy industries crave simple software that mirrors familiar paper workflows.`,
      `Implementation services can be a profit center if you productize onboarding.`,
      `Annual contracts with usage tiers align incentives for both vendor and customer.`,
      `Channel partners—manufacturers, distributors—can be compensated with revenue share.`,
      `Case studies with hard ROI numbers close deals faster than feature checklists.`,
      `Trade shows remain powerful; bring live demos and same-day proposals.`,
      `Hire account managers with industry cred, not just SaaS resumes.`,
      `Text and email alerts beat mobile apps when field workers have glove hands.`,
      `Price increases stick when paired with new automation or reporting modules.`,
      `Shaan recommends bundling financing or insurance to deepen moats.`,
      `Anna tracks net revenue retention monthly to guide product roadmap decisions.`,
      `The hosts encourage listeners to explore municipal, construction, and maritime niches.`,
    ],
    full_notes: [
      {
        title: 'Finding Alpha in Industrial SaaS',
        content: `Anna’s origin story, customer discovery journey, and early product iterations.`,
      },
      {
        title: 'Go-To-Market Playbook',
        content: `Outbound scripts, trade show strategy, and partner programs.`,
      },
      {
        title: 'Product & Pricing',
        content: `Usage-based tiers, integrations, and monetizing implementation.`,
      },
      {
        title: 'Scaling Lessons',
        content: `Hiring, culture, and maintaining quality while expanding nationally.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Why Boring Businesses Win',
        author: 'Shaan Puri',
        url: 'https://www.shaanpuri.com/boring-businesses',
      },
      {
        type: 'tool',
        title: 'ConveyorOS Demo',
        url: 'https://www.conveyoros.com/demo',
      },
      {
        type: 'book',
        title: 'Amp It Up',
        author: 'Frank Slootman',
        url: 'https://www.harpercollins.com/products/amp-it-up-frank-slootman',
      },
    ],
    tags: ['Industrial SaaS', 'Go-To-Market', 'Pricing', 'Partnerships', 'Bootstrapping'],
    read_time_minutes: 9,
    view_count: 0,
    published_at: '2024-10-31T14:00:00Z',
  }),
  createEpisode({
    podcast_name: 'My First Million',
    podcast_host: 'Sam Parr & Shaan Puri',
    podcast_category: ['Entrepreneurship', 'Media', 'SaaS'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/mfm-cover.jpg?auto=compress,format',
    episode_title: 'From Creator to SaaS CEO: How Vanessa Lau Built a $20M Recurring Business',
    episode_number: 531,
    episode_date: '2024-11-21T14:00:00Z',
    episode_duration_minutes: 95,
    guest_name: 'Vanessa Lau',
    guest_title: 'Founder, LaunchLabs',
    guest_bio:
      'Vanessa Lau is a creator and entrepreneur who transitioned from online courses to building LaunchLabs, a SaaS platform for membership communities.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/vanessa-lau.jpg?auto=compress,format',
    summary: [
      `Vanessa explains how she repackaged her audience insights into a SaaS product that helps creators manage memberships, launches, and churn. She dives into product development, fundraising, and how she rebuilt trust after a public burnout break.`,
      `Sam and Shaan probe the business mechanics of creator-led software and what traditional SaaS teams can learn from content-native founders.`,
    ],
    key_takeaways: [
      `Creators have an unfair advantage in customer research—they live with their audience daily.`,
      `Vanessa launched with a concierge MVP, manually running cohorts to refine features.`,
      `Transparent storytelling about burnout rebuilt trust and differentiated her brand.`,
      `She priced on successful launches, aligning revenue with customer outcomes.`,
      `Community events and live analytics dashboards reduce churn in membership businesses.`,
      `Raising capital required translating creator metrics into SaaS KPIs for investors.`,
      `LaunchLabs integrates with Stripe, Circle, and ConvertKit to slot into existing stacks.`,
      `Vanessa runs weekly founder therapy sessions to manage stress and stay creative.`,
      `Content flywheel: YouTube case studies feed product adoption while product data informs content.`,
      `She warns against letting algorithms dictate roadmap decisions—solve root problems first.`,
      `Shaan highlights opportunities in compliance tooling for the creator economy.`,
      `Sam emphasizes building operational leadership around a creator to avoid single-point failure.`,
    ],
    full_notes: [
      {
        title: 'Creator Insight to Product',
        content: `How Vanessa mapped community pain points into product specs and pricing.`,
      },
      {
        title: 'Go-To-Market',
        content: `Launch playbooks, referral programs, and balancing free content with paid value.`,
      },
      {
        title: 'Scaling the Team',
        content: `Hiring executives, setting OKRs, and keeping culture creator-friendly.`,
      },
      {
        title: 'Personal Sustainability',
        content: `Boundaries, mental health routines, and sharing transparently with the audience.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'video',
        title: 'Vanessa Lau YouTube Channel',
        url: 'https://www.youtube.com/@vanessalau',
      },
      {
        type: 'tool',
        title: 'LaunchLabs Platform',
        url: 'https://launchlabs.app/',
      },
      {
        type: 'article',
        title: 'Creator Burnout Isn’t a Badge of Honor',
        author: 'Vanessa Lau',
        url: 'https://medium.com/@vanessalau',
      },
    ],
    tags: ['Creator Economy', 'SaaS', 'Product Development', 'Community', 'Mental Health'],
    read_time_minutes: 10,
    view_count: 0,
    published_at: '2024-11-21T14:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Knowledge Project',
    podcast_host: 'Shane Parrish',
    podcast_category: ['Learning', 'Decision Making', 'Personal Growth'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/knowledge-project-cover.jpg?auto=compress,format',
    episode_title: 'David Epstein: Range, Curiosity, and the Power of Slow Specialization',
    episode_number: 191,
    episode_date: '2024-09-24T09:00:00Z',
    episode_duration_minutes: 112,
    guest_name: 'David Epstein',
    guest_title: 'Author of Range & The Sports Gene',
    guest_bio:
      'David Epstein is a science writer and investigative journalist exploring how broad interests and diverse experiences fuel success.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/david-epstein.jpg?auto=compress,format',
    summary: [
      `Shane and David discuss why range—not hyperspecialization—is a competitive advantage in volatile fields. David shares stories from sports, science, and business to illustrate how curiosity-driven exploration produces uncommon insight.`,
      `They examine the psychology of switching careers, how to build mental models faster, and why slow specialization often beats sticking to a rigid plan.`,
    ],
    key_takeaways: [
      `Broad sampling periods cultivate pattern recognition and transferable skills.`,
      `Many elite performers started late or dabbled widely before finding their lane.`,
      `Curiosity is a muscle—set aside time to follow questions without immediate payoff.`,
      `The best mentors encourage experimentation rather than enforcing narrow paths.`,
      `Writing is a forcing function for clarity; David drafts to learn, not just to publish.`,
      `Career shifts rarely happen in a single leap—collect small bets and adjacent experiences.`,
      `Deliberate practice still matters, but so does cross-training in completely different domains.`,
      `Beware of echo chambers; seek disconfirming evidence to stress-test beliefs.`,
      `David keeps an “interesting people” database to nurture serendipitous collaborations.`,
      `Slow specialization reduces burnout by aligning work with authentic interests.`,
      `Shane emphasizes reflection time to convert experience into wisdom.`,
      `Range complements expertise—teams need polymaths and specialists collaborating.`,
    ],
    full_notes: [
      {
        title: 'The Case for Range',
        content: `Evidence from sports, science, and business showing the value of sampling and exploration.`,
      },
      {
        title: 'Designing Experiments',
        content: `How to run low-risk tests in your career and evaluate what to double down on.`,
      },
      {
        title: 'Building Curiosity Habits',
        content: `Journaling, reading strategies, and cultivating peer groups that encourage exploration.`,
      },
      {
        title: 'Combining Specialists and Generalists',
        content: `Team design principles that harness diverse skill sets without chaos.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Range',
        author: 'David Epstein',
        url: 'https://www.davidepstein.com/range/',
      },
      {
        type: 'article',
        title: 'The Outsider Advantage',
        author: 'David Epstein',
        url: 'https://www.newyorker.com/',
      },
      {
        type: 'tool',
        title: 'Farnam Street Brain Food Newsletter',
        url: 'https://www.fs.blog/newsletter/',
      },
    ],
    tags: ['Range', 'Career', 'Curiosity', 'Learning', 'Mental Models'],
    read_time_minutes: 9,
    view_count: 0,
    published_at: '2024-09-24T09:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Knowledge Project',
    podcast_host: 'Shane Parrish',
    podcast_category: ['Decision Making', 'Psychology', 'Business'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/knowledge-project-cover.jpg?auto=compress,format',
    episode_title: 'Annie Duke: How to Decide When to Quit (and When to Double Down)',
    episode_number: 193,
    episode_date: '2024-10-29T09:00:00Z',
    episode_duration_minutes: 108,
    guest_name: 'Annie Duke',
    guest_title: 'Decision Strategist & Author of Quit',
    guest_bio:
      'Annie Duke is a former professional poker player who now advises executives on decision-making, cognitive biases, and strategic quitting.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/annie-duke.jpg?auto=compress,format',
    summary: [
      `Annie and Shane explore why abandoning the wrong path is often the bravest decision. Annie offers mental models, pre-mortem habits, and communication frameworks leaders can use to exit projects without drama.`,
      `They discuss how to build quitting checkpoints, align teams on decision criteria, and manage the emotions that come with changing course.`,
    ],
    key_takeaways: [
      `Quitting is not failure—it’s a skill that preserves resources for better opportunities.`,
      `Set kill criteria in advance to avoid emotional attachment clouding judgment.`,
      `Thinking in bets reframes decisions as probabilistic rather than binary.`,
      `Use backcasting: imagine success, then identify milestones that must be true.`,
      `Solicit dissent from trusted advisors to counter confirmation bias.`,
      `Annie recommends “quitting parties” to celebrate lessons learned.`,
      `Leaders should model quitting publicly to reduce stigma for their teams.`,
      `Separate identity from projects to stay flexible and avoid sunk-cost traps.`,
      `Short feedback loops let you iterate faster and exit dead ends quickly.`,
      `Shane emphasizes explicit decision journaling to track reasoning over time.`,
      `Quitting frees up talent and capital; redeploy immediately to maintain momentum.`,
      `The duo highlights stories from venture capital, sports, and science.`,
    ],
    full_notes: [
      {
        title: 'Reframing Quitting',
        content: `Why culture celebrates grit but undervalues the courage to walk away.`,
      },
      {
        title: 'Setting Kill Criteria',
        content: `Pre-mortems, tripwires, and decision trees that make quitting objective.`,
      },
      {
        title: 'Communicating Change',
        content: `Scripts for boardrooms, teams, and stakeholders when you pivot or sunset projects.`,
      },
      {
        title: 'Personal Applications',
        content: `How Annie uses quitting skills in parenting, investing, and daily habits.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'Quit',
        author: 'Annie Duke',
        url: 'https://www.penguinrandomhouse.com/books/669454/quit-by-annie-duke/',
      },
      {
        type: 'article',
        title: 'Thinking in Bets',
        author: 'Annie Duke',
        url: 'https://fs.blog/thinking-in-bets/',
      },
      {
        type: 'tool',
        title: 'Decision Journal Template',
        url: 'https://www.fs.blog/decision-journal/',
      },
    ],
    tags: ['Decision Making', 'Quitting', 'Strategy', 'Leadership', 'Cognitive Bias'],
    read_time_minutes: 9,
    view_count: 0,
    published_at: '2024-10-29T09:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Knowledge Project',
    podcast_host: 'Shane Parrish',
    podcast_category: ['Health', 'Systems', 'Leadership'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/knowledge-project-cover.jpg?auto=compress,format',
    episode_title: 'Atul Gawande: Scaling Better Care, Checklists, and the Craft of Observation',
    episode_number: 195,
    episode_date: '2024-11-26T09:00:00Z',
    episode_duration_minutes: 116,
    guest_name: 'Dr. Atul Gawande',
    guest_title: 'Surgeon, Author & Assistant Administrator, USAID',
    guest_bio:
      'Atul Gawande is a surgeon and writer focused on improving healthcare systems through checklists, measurement, and compassionate leadership.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/atul-gawande.jpg?auto=compress,format',
    summary: [
      `Atul talks with Shane about scaling quality healthcare, building feedback loops in complex systems, and maintaining humanity in high-stakes environments. They dissect checklists, observation skills, and lessons from public health deployments.`,
      `The conversation spans the operating room, pandemic response, and how leaders can uphold standards while innovating.`,
    ],
    key_takeaways: [
      `Checklists are communication tools that create shared mental models under pressure.`,
      `Measurement without blame allows teams to improve rather than hide mistakes.`,
      `Scaling care requires training, supervision, and empowerment at the edge.`,
      `Atul emphasizes “listen, observe, then intervene” as a leadership mantra.`,
      `He keeps field notebooks to capture surprises and unmet needs in the moment.`,
      `Simple social rituals—introductions, briefings, debriefings—boost performance.`,
      `Public health success hinges on trust and community partnership.`,
      `Innovation is more likely when leaders create psychological safety for frontline workers.`,
      `Atul’s writing habit helps translate complex medical topics into relatable stories.`,
      `He cautions against hero culture; systems beat individual brilliance.`,
      `Shane notes the value of “pause points” to catch errors before they cascade.`,
      `The pair highlight how to balance rigor with compassion at scale.`,
    ],
    full_notes: [
      {
        title: 'Checklists & Systems Thinking',
        content: `Origin of the surgical safety checklist and principles for designing effective process guides.`,
      },
      {
        title: 'Observation as a Superpower',
        content: `Field stories showing how careful observation uncovers leverage points.`,
      },
      {
        title: 'Scaling Humane Care',
        content: `Training, feedback, and culture practices that travel across continents.`,
      },
      {
        title: 'Leadership Lessons',
        content: `Balancing accountability with empathy and staying grounded amid bureaucracy.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'The Checklist Manifesto',
        author: 'Atul Gawande',
        url: 'https://www.penguinrandomhouse.com/books/301781/the-checklist-manifesto-by-atul-gawande/',
      },
      {
        type: 'article',
        title: 'Slow Ideas',
        author: 'Atul Gawande',
        url: 'https://www.newyorker.com/magazine/2013/07/29/slow-ideas',
      },
      {
        type: 'tool',
        title: 'WHO Surgical Safety Checklist',
        url: 'https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery',
      },
    ],
    tags: ['Healthcare', 'Systems Thinking', 'Leadership', 'Checklists', 'Public Health'],
    read_time_minutes: 10,
    view_count: 0,
    published_at: '2024-11-26T09:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Invest Like the Best',
    podcast_host: 'Patrick O’Shaughnessy',
    podcast_category: ['Investing', 'Technology', 'Leadership'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/invest-like-the-best-cover.jpg?auto=compress,format',
    episode_title: 'Jensen Huang: Building the Indispensable Company',
    episode_number: 392,
    episode_date: '2024-10-01T11:00:00Z',
    episode_duration_minutes: 88,
    guest_name: 'Jensen Huang',
    guest_title: 'Founder & CEO, NVIDIA',
    guest_bio:
      'Jensen Huang is the co-founder of NVIDIA, leading the company from graphics chips to powering the world’s AI and accelerated computing infrastructure.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/jensen-huang.jpg?auto=compress,format',
    summary: [
      `Patrick sits down with Jensen to discuss building a company that became essential to multiple industries. Jensen shares product lessons, culture design, and why he views NVIDIA as an “AI foundry” serving scientists and builders.`,
      `They dig into leadership habits, capital allocation, and how to stay paranoid while operating from a position of strength.`,
    ],
    key_takeaways: [
      `NVIDIA’s mission centers on accelerating workloads for every industry, not just consumer graphics.`,
      `Jensen believes in full-stack integration—hardware, software, and services working in harmony.`,
      `Product roadmaps are anchored in solving “impossible” problems 10 years out.`,
      `Company culture celebrates humility, intellectual honesty, and continuous learning.`,
      `NVIDIA invests heavily in customer co-design to ensure relevance.`,
      `Jensen reviews product demos weekly to stay connected to details.`,
      `Capital allocation prioritizes R&D and strategic acquisitions like Mellanox.`,
      `He encourages employees to think like owners and challenge assumptions openly.`,
      `Partnerships with cloud providers and nations expand NVIDIA’s platform reach.`,
      `Jensen views failure as tuition; fast recovery beats risk avoidance.`,
      `The company is preparing for AI workloads that include robotics, biology, and climate modeling.`,
      `Leaders must balance urgent execution with long-range storytelling.`,
    ],
    full_notes: [
      {
        title: 'Origins & Mission',
        content: `Why Jensen founded NVIDIA and how the mission evolved toward accelerated computing.`,
      },
      {
        title: 'Product & Culture',
        content: `Designing chips, software, and platforms while nurturing a high-performance culture.`,
      },
      {
        title: 'Customer Partnerships',
        content: `Working closely with hyperscalers, research labs, and startups to anticipate needs.`,
      },
      {
        title: 'Leadership Lessons',
        content: `Communication cadence, decision frameworks, and staying grounded.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'video',
        title: 'NVIDIA GTC Keynote 2024',
        url: 'https://www.nvidia.com/gtc/',
      },
      {
        type: 'article',
        title: 'How NVIDIA Won the AI Race',
        author: 'Patrick O’Shaughnessy',
        url: 'https://investorfieldguide.com/blog/',
      },
      {
        type: 'book',
        title: 'Measure What Matters',
        author: 'John Doerr',
        url: 'https://www.penguinrandomhouse.com/books/548323/measure-what-matters-by-john-doerr/',
      },
    ],
    tags: ['NVIDIA', 'Leadership', 'AI Infrastructure', 'Culture', 'Investing'],
    read_time_minutes: 8,
    view_count: 0,
    published_at: '2024-10-01T11:00:00Z',
  }),
  createEpisode({
    podcast_name: 'Invest Like the Best',
    podcast_host: 'Patrick O’Shaughnessy',
    podcast_category: ['Investing', 'Entrepreneurship', 'Consumer'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/invest-like-the-best-cover.jpg?auto=compress,format',
    episode_title: 'Whitney Wolfe Herd: Re-architecting Connection',
    episode_number: 395,
    episode_date: '2024-11-12T11:00:00Z',
    episode_duration_minutes: 82,
    guest_name: 'Whitney Wolfe Herd',
    guest_title: 'Founder & Executive Chair, Bumble',
    guest_bio:
      'Whitney Wolfe Herd founded Bumble to create kinder digital spaces. She now focuses on product vision, safety innovation, and expanding the Bumble ecosystem.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/whitney-wolfe-herd.jpg?auto=compress,format',
    summary: [
      `Whitney discusses building trust-centric consumer products, the evolution of online dating, and how Bumble is expanding into friendship, networking, and AI-assisted safety.`,
      `Patrick and Whitney explore governance, balancing public market expectations with mission, and building resilient teams after stepping back from the CEO role.`,
    ],
    key_takeaways: [
      `Bumble differentiates through safety features and women-first product design.`,
      `Whitney views product as a cultural response—design choices shape norms and behavior.`,
      `Expanding into friendship and networking requires novel algorithms for compatibility.`,
      `AI is being deployed to detect harassment, scams, and fraudulent profiles.`,
      `Governance matters; diverse boards and clear metrics keep mission and business aligned.`,
      `Whitney sets “heartbeat goals” that measure belonging, not just revenue.`,
      `Stepping back from day-to-day operations allowed her to focus on strategy and culture.`,
      `She invests in founder wellness programs to sustain creative energy.`,
      `Brand partnerships with colleges and cities drive grassroots adoption.`,
      `Bumble’s subscription tiers are tailored to different relationship intents.`,
      `Whitney emphasizes building products with empathy, humility, and constant iteration.`,
      `She encourages founders to articulate their “why” daily to guide decisions.`,
    ],
    full_notes: [
      {
        title: 'Creating Safer Platforms',
        content: `Feature design, moderation policies, and metrics for healthy communities.`,
      },
      {
        title: 'Scaling Beyond Dating',
        content: `Bumble BFF, Bizz, and experiments in hybrid online-offline experiences.`,
      },
      {
        title: 'Leadership Evolution',
        content: `Transitioning leadership roles, succession planning, and personal growth.`,
      },
      {
        title: 'Investor Perspective',
        content: `Balancing mission with capital markets, communicating long-term vision.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'The Future of Online Trust',
        author: 'Bumble Insights',
        url: 'https://bumble.com/en/the-buzz',
      },
      {
        type: 'video',
        title: 'Whitney Wolfe Herd TED Talk',
        url: 'https://www.ted.com/speakers/whitney_wolfe_herd',
      },
      {
        type: 'tool',
        title: 'Bumble Brand Safety Center',
        url: 'https://bumble.com/en/safety',
      },
    ],
    tags: ['Consumer Apps', 'Trust & Safety', 'Leadership', 'Brand', 'Investing'],
    read_time_minutes: 8,
    view_count: 0,
    published_at: '2024-11-12T11:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Joe Rogan Experience',
    podcast_host: 'Joe Rogan',
    podcast_category: ['Society', 'Technology', 'Culture'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/jre-cover.jpg?auto=compress,format',
    episode_title: '#2048 – Naval Ravikant on AI, Freedom, and Building for Leverage',
    episode_number: 2048,
    episode_date: '2024-09-27T19:00:00Z',
    episode_duration_minutes: 176,
    guest_name: 'Naval Ravikant',
    guest_title: 'Entrepreneur & Investor',
    guest_bio:
      'Naval Ravikant co-founded AngelList and writes about wealth, happiness, and technology. He invests in frontier startups and explores philosophy, crypto, and leverage.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/naval-ravikant.jpg?auto=compress,format',
    summary: [
      `Joe and Naval dive into how AI changes opportunity, why freedom of thought matters, and how individuals can cultivate leverage without burning out. The conversation blends philosophy, practical tactics, and Naval’s latest explorations in meditation and crypto.`,
      `They discuss policy, the future of work, and maintaining sanity in an always-online world.`,
    ],
    key_takeaways: [
      `Leverage today comes from code, media, and capital—AI accelerates all three.`,
      `Naval emphasizes owning assets that earn while you sleep rather than selling time.`,
      `Meditation and solitude help counter algorithmic distraction and keep thinking original.`,
      `Individuals should learn to code, write, or sell to stay relevant in an AI world.`,
      `Crypto enables global permissionless innovation despite regulatory headwinds.`,
      `Naval urges skepticism of centralized control over speech and computation.`,
      `Health fundamentals—sleep, nutrition, strength—are leverage multipliers.`,
      `Define personal games you actually want to play, not society’s default scripts.`,
      `AI tools can free people to pursue art and curiosity if paired with economic reforms.`,
      `Naval shares his daily routine balancing reading, writing, movement, and investing.`,
      `Joe and Naval debate the merits of urban exodus versus staying engaged in cities.`,
      `The episode closes with Naval’s advice on building long-term relationships built on trust.`,
    ],
    full_notes: [
      {
        title: 'AI and Leverage',
        content: `How large models shift value creation and why Naval invests in AI tooling.`,
      },
      {
        title: 'Freedom & Policy',
        content: `Debate over regulation, censorship, and maintaining open systems.`,
      },
      {
        title: 'Personal Operating System',
        content: `Meditation, exercise, nutrition, and daily practices Naval swears by.`,
      },
      {
        title: 'Crypto & The Future of Work',
        content: `On-chain organizations, remote collaboration, and new economic models.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'book',
        title: 'The Almanack of Naval Ravikant',
        author: 'Eric Jorgenson',
        url: 'https://www.navalmanack.com/',
      },
      {
        type: 'article',
        title: 'Permissionless Innovation',
        author: 'Naval Ravikant',
        url: 'https://nav.al/',
      },
      {
        type: 'tool',
        title: 'Meditation App – Waking Up',
        url: 'https://www.wakingup.com/',
      },
    ],
    tags: ['AI', 'Philosophy', 'Crypto', 'Personal Growth', 'Freedom'],
    read_time_minutes: 12,
    view_count: 0,
    published_at: '2024-09-27T19:00:00Z',
  }),
  createEpisode({
    podcast_name: 'The Joe Rogan Experience',
    podcast_host: 'Joe Rogan',
    podcast_category: ['Science', 'Health', 'Lifestyle'],
    podcast_artwork_url:
      'https://images.prismic.io/podcast-decoded/jre-cover.jpg?auto=compress,format',
    episode_title: '#2054 – Dr. Rhonda Patrick on Longevity, Sauna, and Brain Health',
    episode_number: 2054,
    episode_date: '2024-11-15T19:00:00Z',
    episode_duration_minutes: 162,
    guest_name: 'Dr. Rhonda Patrick',
    guest_title: 'Biomedical Scientist & Founder, FoundMyFitness',
    guest_bio:
      'Rhonda Patrick studies nutrition, aging, and brain health. She translates complex science into actionable protocols for the public.',
    guest_avatar_url:
      'https://images.prismic.io/podcast-decoded/rhonda-patrick.jpg?auto=compress,format',
    summary: [
      `Rhonda shares new research on heat stress, cold exposure, and micronutrients that influence longevity and cognitive performance. Joe and Rhonda swap routines, sauna stories, and supplement experiments.`,
      `She offers evidence-backed advice on hormesis, lab testing, and designing a lifestyle that supports healthy aging.`,
    ],
    key_takeaways: [
      `Sauna use 4–7 times per week correlates with reduced cardiovascular and Alzheimer’s risk.`,
      `Heat stress proteins enhance resilience; cold exposure complements but doesn’t replace sauna.`,
      `Prioritize whole-food sources of micronutrients before supplements.`,
      `Vitamin D, omega-3s, and magnesium remain foundational for brain health.`,
      `Rhonda shares histamine-aware nutrition strategies for people with sensitivities.`,
      `Strength training and zone 2 cardio are non-negotiable for longevity.`,
      `Time-restricted eating may improve metabolic markers when done consistently.`,
      `Blood testing twice per year helps personalize supplementation.`,
      `Minimize plastics and endocrine disruptors in the kitchen environment.`,
      `Novel research links sauna use to increased BDNF and mood improvements.`,
      `Rhonda’s recovery stack includes sleep hygiene, mindfulness, and social connection.`,
      `Joe commits to upgrading his home sauna setup with better ventilation.`,
    ],
    full_notes: [
      {
        title: 'Heat & Cold Protocols',
        content: `Optimal sauna durations, temperature ranges, and pairing with deliberate cold exposure.`,
      },
      {
        title: 'Nutrition & Supplementation',
        content: `Micronutrients, lab markers to monitor, and avoiding deficiency pitfalls.`,
      },
      {
        title: 'Longevity Lifestyle',
        content: `Movement patterns, stress management, and community as protective factors.`,
      },
      {
        title: 'Brain Health & Cognition',
        content: `BDNF, neuroplasticity, and protecting the brain as we age.`,
      },
    ],
    resources_mentioned: [
      {
        type: 'article',
        title: 'Sauna Use and Cardiovascular Mortality',
        author: 'Laukkanen et al.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5941775/',
      },
      {
        type: 'tool',
        title: 'FoundMyFitness Reports',
        url: 'https://www.foundmyfitness.com/reports',
      },
      {
        type: 'book',
        title: 'Lifespan',
        author: 'David Sinclair',
        url: 'https://www.lifespanbook.com/',
      },
    ],
    tags: ['Longevity', 'Sauna', 'Nutrition', 'Brain Health', 'Hormesis'],
    read_time_minutes: 11,
    view_count: 0,
    published_at: '2024-11-15T19:00:00Z',
  }),
];

async function seed() {
  console.log('🚀 Starting seed...');

  if (RESET_EPISODES) {
    console.log('🧹 Clearing existing episodes table first (RESET_EPISODES=true).');
    const { error: deleteError, count } = await supabase
      .from('episodes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('*', { count: 'exact' });
    if (deleteError) {
      console.error('❌ Failed to clear episodes table:', deleteError.message);
      process.exit(1);
    }
    console.log(`🗑️ Removed ${count ?? 0} existing rows.`);
  } else {
    console.log('ℹ️ Skipping table reset. Set RESET_EPISODES=true to wipe before seeding.');
  }

  let inserted = 0;
  let failed = 0;

  for (const [index, batch] of chunkArray(episodes, 5).entries()) {
    const { error } = await supabase.from('episodes').insert(batch);
    if (error) {
      failed += batch.length;
      console.error(`❌ Batch ${index + 1} failed:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`✅ Batch ${index + 1} inserted ${batch.length} episodes.`);
    }
  }

  console.log('—'.repeat(40));
  console.log(`🎉 Seed complete. Inserted: ${inserted}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

seed().catch((err) => {
  console.error('Unexpected error during seeding:', err);
  process.exit(1);
});
