// src/components/blog/blogData.js
import img1 from "../assets/blog-1.webp";
import img2 from "../assets/blog-2.webp";
import img3 from "../assets/blog-3.webp";
import avatar from "../assets/user-1.png";
import avatar2 from "../assets/user-2.png";
import avatar3 from "../assets/user-3.png";
import avatar4 from "../assets/user-4.png";

const blogPosts = [
    {
        id: 1,
        title: "How to Value Your Business for Equity Negotiation",
        excerpt:
            "Learn the key factors that determine your business valuation and how to present it to potential investors.",
        date: "June 12, 2023",
        readTime: 8,
        category: "Valuation",
        image: img1,
        tags: ["valuation", "equity", "business"],
        slug: "how-to-value-your-business",
        author: {
            name: "Alex Johnson",
            image: avatar3,
            title: "Business Valuation Expert",
            bio: "Alex has over 15 years of experience in business valuation and has helped hundreds of companies negotiate fair equity deals with investors.",
        },
        content: {
            title: "Understanding Business Valuation",
            text: "Valuing your business is a critical step in equity negotiation. It determines how much ownership you will need to give up in exchange for investment.",
            subTitle: "Common Valuation Methods",
            listItems: [
                {
                    label: "Asset‑Based Valuation:",
                    desc: " Calculates the value based on the company’s net assets",
                },
                {
                    label: "Earnings Multiplier:",
                    desc: " Uses a multiple of the company’s earnings",
                },
                {
                    label: "Discounted Cash Flow (DCF):",
                    desc: " Projects future cash flows and discounts them to present value",
                },
            ],
            proTip:
                "Most early-stage businesses are valued based on future potential rather than current assets or earnings.",
        },
        relatedPosts: [2, 3, 4],
    },
    {
        id: 2,
        title: "The Ultimate Guide to Equity Negotiation for Business Owners",
        excerpt:
            "Discover the exact preparation steps, term‑sheet levers, and closing tactics that let founders hold their ground at the negotiating table.",
        date: "June 15, 2023",
        readTime: 11,
        category: "Negotiation",
        tags: ["equity", "negotiation", "strategy"],
        slug: "ultimate-guide-equity-negotiation",
        image: img2,
        author: {
            name: "Emily Davis",
            image: avatar,
            title: "Equity Negotiation Consultant",
            bio: "Emily has helped 200+ founders secure investor capital while retaining control of their companies.",
        },
        content: {
            title: "Build Your Negotiation Road‑map",
            text: "Equity talks are won in the weeks of preparation before you ever meet an investor. Here’s the framework I give every client:",
            subTitle: "Prep Checklist",
            listItems: [
                {
                    label: "Clarify Your Objectives:",
                    desc: " Define minimum cash needs, maximum dilution, and non‑negotiables.",
                },
                {
                    label: "Research Investor Motives:",
                    desc: " Align your pitch with their portfolio gaps and time horizon.",
                },
                {
                    label: "Draft Alternative Scenarios:",
                    desc: " Have at least two counter‑offers ready so you’re never cornered.",
                },
            ],
            proTip:
                "Never negotiate valuation and control provisions in the same breath. Decouple them so you can trade a little of one to protect the other.",
        },
        relatedPosts: [1, 3, 5],
    },

    {
        id: 3,
        title: "Understanding Business Valuation for Equity Negotiation",
        excerpt:
            "A step‑by‑step walkthrough of income, market, and DCF methods—plus how to defend your numbers under investor scrutiny.",
        date: "June 18, 2023",
        readTime: 7,
        category: "Valuation",
        tags: ["valuation", "dcf", "multiples"],
        slug: "understanding-valuation-methods",
        image: img3,
        author: {
            name: "Michael Smith",
            image: avatar4,
            title: "Startup Valuation Analyst",
            bio: "Michael specialises in SaaS and deep‑tech valuations and lectures on modern appraisal techniques.",
        },
        content: {
            title: "Why Methods Matter",
            text: "Investors will run their own numbers. Knowing *how* they value companies lets you pre‑empt push‑back.",
            subTitle: "Three Core Approaches",
            listItems: [
                {
                    label: "Market Multiples:",
                    desc: " Compare revenue or EBITDA against similar funded startups.",
                },
                {
                    label: "Scorecard Method:",
                    desc: " Adjust a median valuation using team, traction, and market multipliers.",
                },
                {
                    label: "Venture Capital (VC) Method:",
                    desc: " Work backwards from desired IRR and exit size.",
                },
            ],
            proTip:
                "Have a single‑page valuation memo ready—busy investors don’t read 40‑slide decks.",
        },
        relatedPosts: [1, 2, 6],
    },

    {
        id: 4,
        title: "5 Key Elements of a Successful Pitch to Investors",
        excerpt:
            "Hook investors in the first three minutes with a narrative that proves market demand, traction, and a credible path to scale.",
        date: "June 20, 2023",
        readTime: 6,
        category: "Pitch",
        tags: ["pitch", "storytelling", "investors"],
        slug: "five-elements-successful-pitch",
        image: img1,
        author: {
            name: "Sandra Lee",
            image: avatar2,
            title: "Pitch Coach",
            bio: "Sandra trains founders at five accelerators and has reviewed 3,000+ pitch decks.",
        },
        content: {
            title: "The Anatomy of a Compelling Pitch",
            text: "Your deck should answer *why now, why you, and why this market*—before the first question is asked.",
            subTitle: "Must‑Have Slides",
            listItems: [
                {
                    label: "Problem & Urgency:",
                    desc: " Prove the pain is real and costly.",
                },
                {
                    label: "Solution & USP:",
                    desc: " What makes you 10× better, not 10%.",
                },
                {
                    label: "Traction Metrics:",
                    desc: " Show growth curves—revenue, users, or engagement.",
                },
                {
                    label: "Business Model:",
                    desc: " Explain how you make money in one sentence.",
                },
                {
                    label: "Ask & Use of Funds:",
                    desc: " State exactly how much you need and where it goes.",
                },
            ],
            proTip:
                "Investors decide in slide one if they’ll pay attention to the rest—start with an ‘aha’ hook, not your logo.",
        },
        relatedPosts: [2, 5, 6],
    },

    {
        id: 5,
        title: "The Investor Mindset: What They Really Want",
        excerpt:
            "Break down an investor’s decision process so you can position your startup as the obvious choice.",
        date: "June 25, 2023",
        readTime: 4,
        category: "Negotiation",
        tags: ["investors", "mindset", "fundraising"],
        slug: "inside-investor-mindset",
        image: img2,
        author: {
            name: "Raj Patel",
            image: avatar3,
            title: "Former VC Partner",
            bio: "Raj reviewed pitches for a $200 M fund; now he mentors founders on landing their first term sheet.",
        },
        content: {
            title: "Inside the IC Meeting",
            text: "Every pitch ends with partners asking three questions when you leave the room.",
            subTitle: "The Unspoken Checklist",
            listItems: [
                {
                    label: "Big Market:",
                    desc: " Is the TAM ≥ $1 B? They need 10× returns.",
                },
                {
                    label: "Founders Who Execute:",
                    desc: " Do you know your KPIs cold and show relentless velocity?",
                },
                {
                    label: "Clear Exit Path:",
                    desc: " Can they picture who buys you (or an IPO) within 7–10 years?",
                },
            ],
            proTip:
                "Reference a recent exit in your space—investors crave comparables that justify their upside.",
        },
        relatedPosts: [2, 4, 6],
    },

    {
        id: 6,
        title: "How to Negotiate Equity for Your Startup",
        excerpt:
            "From SAFE notes to priced rounds—learn which instrument fits your stage and how to keep future dilution in check.",
        date: "June 28, 2023",
        readTime: 9,
        category: "Negotiation",
        tags: ["equity", "safes", "cap-table"],
        slug: "negotiate-equity-startup",
        image: img3,
        author: {
            name: "Laura Kim",
            image: avatar4,
            title: "Startup Lawyer",
            bio: "Laura has closed 150+ seed and Series A rounds and lectures on startup law.",
        },
        content: {
            title: "Choosing the Right Deal Structure",
            text: "The instrument you pick today shapes your cap‑table for years. Here’s how to decide:",
            subTitle: "SAFE vs Convertible vs Priced Round",
            listItems: [
                {
                    label: "SAFE Note:",
                    desc: " Fastest and cheapest, but mind the valuation cap.",
                },
                {
                    label: "Convertible Note:",
                    desc: " Adds interest + maturity date—good leverage, higher complexity.",
                },
                {
                    label: "Priced Round:",
                    desc: " Clean ownership math, but legal fees are higher.",
                },
            ],
            proTip:
                "Run dilution models for *this* and *next* round—investors respect founders who think two moves ahead.",
        },
        relatedPosts: [2, 3, 5],
    },
];

// Helper function to get post by slug
export const getPostBySlug = (slug) => {
    return blogPosts.find((post) => post.slug === slug);
};

// Helper function to get posts by category
export const getPostsByCategory = (category) => {
    return blogPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
    );
};

// Helper function to get posts by tag
export const getPostsByTag = (tag) => {
    return blogPosts.filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
};

export default blogPosts;
