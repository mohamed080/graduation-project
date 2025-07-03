import project1 from '../assets/project1.png'
import project2 from '../assets/project2.png'
import project3 from '../assets/project3.png'
import project4 from '../assets/project4.jpeg'
import project5 from '../assets/project5.jpeg'
import team1 from '../assets/team-1.jpeg'
import team2 from '../assets/team-2.jpeg'
import team3 from '../assets/team-3.jpeg'
import team4 from '../assets/team-4.jpeg'

export const projects = [
    {
        id: 1,
        title: "Series spaceX-2",
        slug: "series-spacex-2",
        img: project1,
        raised: '$6.10M',
        minInvestment: '$75,2K',
        link: '#',
        category: 'technology',
        status: 'active',
        desc: 'Follow‑on round backing SpaceX’s next‑gen launch system. Capital will scale Starlink production, expand reusable booster research, and accelerate Mars‑bound Starship testing.',
        period: 14,
        team: [
            {
                id: 1,
                name: 'Arthur Erickson',
                role: 'CEO',
                bio: 'Arthurs interest in UAS began at UT Austin while studying aerospace engineering. As a researcher there, he optimized UAS controls. Seeing the potential of UAS, Arthur and his co-founders founded Hylio in 2015. Arthur has led many successful product launches and the company’s rapid growth. As Hylio co-founder and CEO, Arthur focuses on business and product development, strategy, and scaling.',
                img: team1,
            },
            {
                id: 2,
                name: 'Nikhil Dixit',
                role: 'CTO',
                bio: 'Nikhil Dixit received degrees in electrical engineering and computer science from UT Austin and went on to receive a masters in computer architecture. As a gifted software engineer, Nikhil joined NVIDIA while in school and was chosen to lead an AI project there. Now as Hylio co-founder and CTO, he leads dozens of engineers and programmers as they develop Hylio’s groundbreaking products and technologies.',
                img: team2,
            },
            {
                id: 3,
                name: 'Nick Nawratil',
                role: 'COO',
                bio: 'Nick Nawratil first began working with UAS while studying aerospace engineering at UT Austin. With experience as the founder of an Austin-based utilities company, he adds supply chain, logistics, and personnel management expertise to the Hylio team. As co-founder and COO of Hylio, he now leads the scaling of Hylio’s manufacturing, fleet operations, support infrastructure, and regulatory compliance.',
                img: team3,
            },
            {
                id: 4,
                name: 'Mike Oda',
                role: 'CFO',
                bio: 'A lifelong entrepreneur, Mike Oda began managing many of his familys businesses at a young age including: distribution of engineering products, housing development, a restaurant, and a Wagyu cattle ranch. While juggling those responsibilities, he received a degree in Finance UT Austin. As Hylio co-founder and CFO, he leads its finance and accounting teams to help guide the company’s aggressive expansion.',
                img: team4,
            }
        ],
        equityOffered: 10,
        amountRequested: 100000,
        ownerID: 3,
    },
    {
        id: 2,
        title: "Series OpenAI",
        slug: "series-openai",
        img: project2,
        raised: '$4.75M',
        minInvestment: '$17,2K',
        link: '#',
        category: 'technology',
        status: 'closed',
        desc: 'After xAI acquired X in an all-stock deal, Elon Musk’s AI venture now carries an $80B valuation, with a combined post-merger value of $113B (including $12B of debt from X).³ The move follows a $6B Series C⁴ that helped xAI expand its Colossus supercomputer, “one of the most powerful AI clusters to date.”⁵ Now you can gain exposure to the company innovating at the intersection of GenAI and social media. Limited to 100 spots for accredited investors.',
        period: 30,
        equityOffered: 30, // Percentage
    amountRequested: 150000, // USD
    },
    {
        id: 3,
        title: "Series spaceX-2",
        slug: "series-spacex-2",
        img: project3,
        raised: '$6.10M',
        minInvestment: '$20,2K',
        link: '#',
        category: 'finance',
        status: 'active',
        desc: 'A structured note tied to SpaceX equity with downside protection. Investors gain synthetic exposure to the company’s valuation upside while capping risk via a collateral pool.',
        period: 14,
        equityOffered: 5,
        amountRequested: 30000,
    },
    {
        id: 4,
        title: "Series Ripple",
        slug: "series-ripple",
        img: project4,
        raised: '$1M',
        minInvestment: '$15K',
        link: '#',
        category: 'finance',
        status: 'pending',
        desc: 'Seed extension for Ripple’s on‑chain liquidity rails. Funds will accelerate partnerships with central banks and expand cross‑border payment corridors in LATAM and APAC.',
        period: 7,
        equityOffered: 5,
        amountRequested: 15000,
    },
    {
        id: 5,
        title: "A.I Disruptors Fund",
        slug: "ai-disruptors-fund",
        img: project5,
        raised: '$2.31M',
        minInvestment: '$25,2K',
        link: '#',
        category: 'healthcare',
        status: 'active',
        desc: 'A thematic fund targeting early‑stage AI companies revolutionizing diagnostics, drug discovery, and robotic surgery—diversified across ten high‑conviction healthcare startups.',
        period: 0,
        equityOffered: 60,
        amountRequested: 60000,
    },
];