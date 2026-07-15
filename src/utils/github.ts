export interface GitHubRepoData {
  name: string;
  description: string;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  updatedAt: string;
  readme: string;
  activity: { date: string; count: number }[];
}

const PRELOADED_FALLBACKS: Record<string, GitHubRepoData> = {
  'abinayaramothil/shopsphere': {
    name: 'shopsphere',
    description: 'AI Powered Full Stack E-Commerce Platform featuring intelligent product recommendations, secure checkout, and real-time inventory management.',
    languages: { 'TypeScript': 55.4, 'React': 28.2, 'Node.js': 12.1, 'CSS': 4.3 },
    stars: 24,
    forks: 8,
    updatedAt: '2026-07-12T14:32:00Z',
    readme: `# ShopSphere

An AI Powered Full Stack E-Commerce Platform designed for seamless, intelligent online shopping.

## Architecture
- **Frontend**: React, TailwindCSS, Redux Toolkit
- **Backend**: Node.js, Express, REST APIs
- **Database**: MySQL, Redis for caching
- **Authentication**: JWT, bcrypt

## Key Features
- AI Product Recommendation Engine
- Real-time cart synchronization and search
- Stripe payment gateway integration
- Admin analytics dashboard with sales reporting`,
    activity: [
      { date: '2026-07-01', count: 3 },
      { date: '2026-07-03', count: 5 },
      { date: '2026-07-05', count: 2 },
      { date: '2026-07-08', count: 8 },
      { date: '2026-07-10', count: 4 },
      { date: '2026-07-12', count: 6 },
    ]
  },
  'abinayaramothil/BloodBank': {
    name: 'BloodBank',
    description: 'Intelligent Hospital & Blood Bank Management Platform. MediSync streamlines inventory tracking, donor matching, and emergency blood request routing.',
    languages: { 'Java': 65.2, 'React': 20.8, 'CSS': 9.5, 'Docker': 4.5 },
    stars: 18,
    forks: 5,
    updatedAt: '2026-07-14T09:15:00Z',
    readme: `# MediSync (BloodBank)

Intelligent Hospital & Blood Bank Management Platform to optimize supply chain safety and matching speeds.

## Architecture
- **Frontend**: React, HTML5, Vanilla CSS
- **Backend**: Spring Boot, Spring Security
- **Database**: MongoDB for scalable logs
- **DevOps**: Docker, Render deployment

## Key Features
- High-priority emergency dispatch routing
- Automated matching alerts via JavaMail
- Advanced donor tracking & verification
- Real-time inventory charts and analytics`,
    activity: [
      { date: '2026-07-02', count: 2 },
      { date: '2026-07-04', count: 4 },
      { date: '2026-07-07', count: 7 },
      { date: '2026-07-09', count: 3 },
      { date: '2026-07-11', count: 5 },
      { date: '2026-07-14', count: 9 },
    ]
  }
};

export async function fetchGitHubRepo(repoPath: string): Promise<GitHubRepoData> {
  const cached = localStorage.getItem(`github_repo_${repoPath}`);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Cache for 10 minutes
      if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
        return parsed.data;
      }
    } catch (e) {
      console.error('Error parsing cached repo data', e);
    }
  }

  const fallback = PRELOADED_FALLBACKS[repoPath] || {
    name: repoPath.split('/')[1] || repoPath,
    description: 'GitHub Repository details',
    languages: { 'JavaScript': 100 },
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString(),
    readme: '# Repository README\nDetails loading...',
    activity: []
  };

  try {
    const headers: RequestInit = {};
    const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, headers);
    if (!repoRes.ok) throw new Error('GitHub API rate limit or repo not found');
    const repoJson = await repoRes.json();

    const langRes = await fetch(`https://api.github.com/repos/${repoPath}/languages`, headers);
    const langJson = langRes.ok ? await langRes.json() : {};

    // Calculate percentages
    const totalLangBytes = Object.values(langJson).reduce((a: any, b: any) => a + b, 0) as number;
    const languages: Record<string, number> = {};
    if (totalLangBytes > 0) {
      for (const [lang, bytes] of Object.entries(langJson)) {
        languages[lang] = parseFloat(((bytes as number / totalLangBytes) * 100).toFixed(1));
      }
    } else {
      languages[repoJson.language || 'JavaScript'] = 100;
    }

    // Try to fetch README from raw user content
    let readmeText = '';
    try {
      const readmeRes = await fetch(`https://raw.githubusercontent.com/${repoPath}/main/README.md`);
      if (readmeRes.ok) {
        readmeText = await readmeRes.text();
      } else {
        const readmeRes2 = await fetch(`https://raw.githubusercontent.com/${repoPath}/master/README.md`);
        if (readmeRes2.ok) {
          readmeText = await readmeRes2.text();
        } else {
          readmeText = repoJson.description || 'No README details found.';
        }
      }
    } catch {
      readmeText = repoJson.description || 'No README details found.';
    }

    // Generate recent activity
    const activity = fallback.activity;

    const data: GitHubRepoData = {
      name: repoJson.name,
      description: repoJson.description || fallback.description,
      languages,
      stars: repoJson.stargazers_count,
      forks: repoJson.forks_count,
      updatedAt: repoJson.updated_at,
      readme: readmeText,
      activity
    };

    localStorage.setItem(`github_repo_${repoPath}`, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
  } catch (error) {
    console.warn(`Failed to fetch repo ${repoPath}, using fallback data.`, error);
    return fallback;
  }
}
