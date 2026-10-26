// ─── FREE PROFILE WEBSITES (backlinks & social proof) ───────────────────────

export type ProfileSite = { name: string; use: string; url: string };

export const topProfileSites: ProfileSite[] = [
  { name: "GitHub",          use: "Code portfolio, repositories and developer credibility.",                          url: "https://github.com/" },
  { name: "LinkedIn",        use: "Professional profile, experience, featured projects and recruiter visibility.",   url: "https://www.linkedin.com/" },
  { name: "DEV Community",   use: "Developer profile and technical articles or tutorials.",                          url: "https://dev.to/" },
  { name: "Hashnode",        use: "Technical blog posts, engineering guides and project write-ups.",                 url: "https://hashnode.com/" },
  { name: "Medium",          use: "Articles, author reputation and links to your original work.",                    url: "https://medium.com/" },
  { name: "Product Hunt",    use: "Maker profile and product launches. Best if you build apps, SaaS or dev tools.",  url: "https://www.producthunt.com/" },
  { name: "Stack Overflow",  use: "Technical reputation through useful answers and community participation.",        url: "https://stackoverflow.com/" },
  { name: "Gravatar",        use: "Public identity profile with bio, avatar and website.",                           url: "https://gravatar.com/" },
  { name: "about.me",        use: "Simple personal profile page linking to your website and accounts.",              url: "https://about.me/" },
  { name: "Wellfound",       use: "Engineering background and connections with startups.",                           url: "https://wellfound.com/" },
];

export const moreProfileSites: ProfileSite[] = [
  { name: "GitLab",        use: "Code portfolio",            url: "https://gitlab.com/" },
  { name: "CodePen",       use: "Frontend demos",            url: "https://codepen.io/" },
  { name: "Replit",        use: "Coding projects",           url: "https://replit.com/" },
  { name: "Quora",         use: "Useful Q&A and expertise",  url: "https://www.quora.com/" },
  { name: "Substack",      use: "Articles and newsletters",  url: "https://substack.com/" },
  { name: "Linktree",      use: "Central link hub",          url: "https://linktr.ee/" },
  { name: "WordPress.com", use: "Personal blog",             url: "https://wordpress.com/" },
];

export const profileTips = [
  { title: "Keep your identity consistent", text: "Use the same name, photo, job title and website across every profile." },
  { title: "Complete each profile",         text: "Add a useful bio, skills, work history and real projects." },
  { title: "Link naturally",                text: "Use the website field where there is one, and link to relevant project pages in context." },
  { title: "Publish original work",         text: "Tutorials, open-source contributions and case studies build far more credibility than empty profiles." },
  { title: "Don’t chase dofollow links alone", text: "Many reputable platforms use nofollow links. Profiles still help people discover and verify you." },
  { title: "Avoid spam",                    text: "Don’t mass-create low-quality profiles, duplicate content or buy bulk backlinks." },
];

export const startingOrder = ["GitHub", "LinkedIn", "DEV Community", "Hashnode", "Stack Overflow"];
