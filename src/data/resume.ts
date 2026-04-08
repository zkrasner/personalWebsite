export interface Role {
  title: string;
  key: string;
  dates: string;
  bullets: string[];
  products?: { name: string; description: string }[];
}

export interface Job {
  company: string;
  companyKey: string;
  description: string;
  overallDates: string;
  roles: Role[];
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Interest {
  title: string;
  description: string;
}

export const summary = {
  name: { first: "Zachary", last: "Krasner" },
  tagline: "Engineering leader. Builder of platforms. Reader of sci-fi.",
  bio: "Software engineer and technical leader with 10 years of experience architecting data platforms and backend systems. Built and scaled engineering teams, modernized legacy infrastructure, and shipped products 0 to 1 that drive measurable business outcomes. Deep expertise in Python, SQL, GCP, and data pipeline design. Driven by curiosity and a bias for ownership, most at home in environments where engineering and product strategy intersect.",
  location: "Boston, MA",
  links: {
    linkedin: "https://linkedin.com/in/zkrasner",
    github: "https://github.com/zkrasner",
  },
};

export const jobs: Job[] = [
  {
    company: "Grassroots Analytics",
    companyKey: "grassroots",
    description:
      "Data analytics platform for political campaigns and nonprofits",
    overallDates: "Jan 2021 — Present",
    roles: [
      {
        title: "Chief Technology Officer",
        key: "cto",
        dates: "Aug 2022 — Present",
        bullets: [
          "Grew engineering team from 0 to 12 and drove company revenue from $5M to $30M+ ARR by removing the technical bottlenecks constraining sales and delivery capacity.",
          "Architected and led development of a full-stack donor data platform spanning multiple systems and 40M+ donor profiles:",
          "Established a culture of engineering excellence by implementing CI/CD pipelines, rolling out AI-assisted development tooling across engineers and analysts, and achieving SOC 2 Type 1 certification.",
        ],
        products: [
          {
            name: "Moosehead",
            description:
              "Internal analyst querying platform reducing data retrieval from 15+ minutes to under 30 seconds, with improved security, repeatability, and result quality.",
          },
          {
            name: "Algo",
            description:
              "Processes hundreds of millions of donation records applying regression analysis to generate hundreds of unique datapoints and categorizations per donor profile.",
          },
          {
            name: "Click Collective",
            description:
              "Ingests and preprocesses billions of email exhaust events across hundreds of clients to predict future donor interactions.",
          },
          {
            name: "Apical",
            description:
              "SaaS platform unifying fragmented campaign and nonprofit data toolsets and overlaying proprietary analytics.",
          },
        ],
      },
      {
        title: "Board Member",
        key: "board",
        dates: "Jan 2021 — Jan 2023",
        bullets: [
          "Advised the executive team on technical strategy and infrastructure roadmap, and upskilled the data science team, before transitioning to the CTO role full-time.",
        ],
      },
    ],
  },
  {
    company: "Bridgewater Associates",
    companyKey: "bridgewater",
    description: "World's largest hedge fund · $150B+ AUM during my tenure",
    overallDates: "Sep 2016 — Aug 2022",
    roles: [
      {
        title: "Senior Software Developer",
        key: "senior",
        dates: "Sep 2020 — Aug 2022",
        bullets: [
          "Partnered with quantitative analysts to implement 10-year tactical and long-term assumption sets into the portfolio construction platform, translating complex Excel-based financial models into production Scala code.",
          "Led extraction of a monolithic permission system into a unified Kafka/Flink microservice, consolidating access control across multiple related client-facing platforms.",
          "Built and maintained a real-time portfolio construction platform used by client managers globally, instrumental in securing billions in AUM from institutional investors including endowments, pensions, and sovereign wealth funds.",
        ],
      },
      {
        title: "Software Developer",
        key: "mid",
        dates: "Sep 2018 — Sep 2020",
        bullets: [
          "Built CI/CD infrastructure for a team of ~15 engineers using Jenkins, implementing automated unit, end-to-end, load and performance test pipelines with results reported back to Bitbucket.",
          "Worked with the infrastructure team to enable ephemeral cloud workspaces for QA, dramatically reducing environment setup friction and accelerating release cycles.",
        ],
      },
      {
        title: "Technology Associate",
        key: "associate",
        dates: "Sep 2016 — Sep 2018",
        bullets: [
          "Joined at the inception of the Portfolio Construction platform within the Client Service department, contributing to the foundational build designed to replace hundreds of hours of bespoke analyst modeling with real-time portfolio construction in live client meetings.",
        ],
      },
    ],
  },
  {
    company: "Epic Systems",
    companyKey: "epic",
    description: "Largest electronic health records platform nationwide",
    overallDates: "May 2015 — Aug 2015",
    roles: [
      {
        title: "Software Development Intern",
        key: "intern",
        dates: "May 2015 — Aug 2015",
        bullets: [
          "Built a thin-client visualization tool for tracking annual flu rates and variants across a user's hospital and surrounding facilities, implementing custom SVG charts from scratch.",
        ],
      },
    ],
  },
];

export const education = {
  school: "University of Pennsylvania",
  degree: "B.S. in Engineering · Computer and Information Sciences",
  years: "2012–2016",
  activities: [
    "Theta Tau Engineering Fraternity",
    "Kappa Sigma Fraternity · Philanthropy Chair",
    "American Institute of Chemical Engineers",
    "Engineers Without Borders",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Frameworks",
    skills: [
      "Python",
      "Django",
      "FastAPI",
      "SQL",
      "Scala",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "React",
      "Vue",
    ],
  },
  {
    label: "Infrastructure & Cloud",
    skills: ["GCP", "AWS", "Airflow", "Terraform", "Jenkins", "Docker"],
  },
  {
    label: "Data & Databases",
    skills: ["PostgreSQL", "BigQuery", "ETL", "Data Pipelines"],
  },
  {
    label: "Leadership",
    skills: ["Team Building", "Technical Strategy", "0-to-1 Engineering"],
  },
];

export const interests: Interest[] = [
  {
    title: "Fatherhood",
    description:
      "Navigating the chaos and joy of first-time parenthood with my son Graham, born in 2025.",
  },
  {
    title: "Travel",
    description:
      "Road tripped around the US for a year, seeing 36 states and 16 national parks.",
  },
  {
    title: "Hiking",
    description:
      "Grew up in the mountains of Vermont and always looking for new mountains to climb.",
  },
  {
    title: "Reading",
    description:
      "Lifelong sci-fi and fantasy reader. Dune, Foundation, Hyperion, Red Rising, The Cosmere, Dungeon Crawler Carl.",
  },
];
