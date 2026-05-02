import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { roadmapApi } from "../api/roadmap";
import { assessmentApi } from "../api/assessment";
import { STORAGE_KEYS } from "../config/env";

interface RoadmapCardProps {
  title: string;
  subtitle?: string;
  description: string;
  color: string;
  position: "left" | "right";
  weeks?: number;
  resources?: Array<{ type: string; title: string; url: string }>;
}

interface Milestone {
  title: string;
  subtitle?: string;
  description: string;
  weeks?: number;
  resources?: Array<{ type: string; title: string; url: string }>;
  durationWeeks?: number;
}

// ✅ Colors for milestone cards (cycling through)
const CARD_COLORS = [
  "#462872", // Purple
  "#3b82f6", // Blue
  "#22c55e", // Green
  "#f59e0b", // Orange
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  title,
  subtitle,
  description,
  color,
  position,
  weeks,
  resources,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-[45%] relative mb-20 bg-white rounded-xl shadow-lg p-8 min-h-[250px] flex flex-col
                  ${position === "left" ? "ml-0" : "ml-auto"}`}
    >
      {/* Timeline connector line */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-[12.5%] h-0.5"
        style={{
          backgroundColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
        }}
      />
      {/* Outer circle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 z-10"
        style={{
          borderColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
          transform: `translate(${position === "left" ? "20%" : "-15%"}, -50%)`,
        }}
      />
      {/* Inner circle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-20"
        style={{
          backgroundColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
          transform: `translate(${position === "left" ? "-10%" : "15%"}, -50%)`,
        }}
      />

      {/* Title */}
      <h3
        className="text-[1.75rem] font-semibold mb-3 font-inter"
        style={{ color }}
      >
        {title}
      </h3>

      {/* Subtitle (optional) */}
      {subtitle && (
        <h4 className="text-[1.1rem] text-gray-600 font-medium mb-2 font-inter">
          {subtitle}
        </h4>
      )}

      {/* Color bar */}
      <div className="w-12 h-[3px] mb-4" style={{ backgroundColor: color }} />

      {/* Description */}
      <p className="text-gray-600 leading-[1.7] text-base font-inter mb-4 flex-grow">
        {description}
      </p>

      {/* Duration (if available) */}
      {(weeks || weeks === 0) && (
        <p className="text-sm text-gray-500 mb-3">
          ⏱️ <strong>{weeks || "TBD"}</strong> weeks
        </p>
      )}

      {/* Resources (if available) */}
      {resources && resources.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Resources:</p>
          <ul className="text-sm space-y-1">
            {resources.slice(0, 3).map((resource, idx) => (
              <li key={idx} className="text-gray-600">
                <span
                  className="inline-block px-2 py-0.5 mr-2 text-xs font-medium rounded"
                  style={{ backgroundColor: color + "20", color: color }}
                >
                  {resource.type}
                </span>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource.title}
                  </a>
                ) : (
                  <span>{resource.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => navigate("/week-plan")}
        className="mt-auto self-start px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: color }}
      >
        View Details
      </button>
    </div>
  );
};

interface RoadmapPageProps {
  showPersonalized?: boolean; // Show personalized roadmap from quiz result
}

const Roadmap: React.FC<RoadmapPageProps> = ({ showPersonalized = true }) => {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem(STORAGE_KEYS.authToken);

  // ✅ Fetch personalized roadmap from latest quiz result
  useEffect(() => {
    if (!showPersonalized) {
      setIsLoading(false);
      return;
    }

    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        const roadmaps: any = await roadmapApi.getMyRoadmaps();
        const list = Array.isArray(roadmaps)
          ? roadmaps
          : Array.isArray(roadmaps?.data)
          ? roadmaps.data
          : Array.isArray(roadmaps?.data?.data)
          ? roadmaps.data.data
          : [];
        const latest = Array.isArray(list) && list.length > 0 ? list[0] : null;

        if (!latest) {
          // No roadmap found, check if user has assessment results and auto-generate
          try {
            const assessmentResult = await assessmentApi.latestResult();
            if (assessmentResult) {
              console.log("🎯 Found assessment results, auto-generating roadmap...");
              await roadmapApi.generate();
              // Retry loading roadmaps after generation
              const newRoadmaps: any = await roadmapApi.getMyRoadmaps();
              const newList = Array.isArray(newRoadmaps)
                ? newRoadmaps
                : Array.isArray(newRoadmaps?.data)
                ? newRoadmaps.data
                : Array.isArray(newRoadmaps?.data?.data)
                ? newRoadmaps.data.data
                : [];
              const newLatest = Array.isArray(newList) && newList.length > 0 ? newList[0] : null;
              
              if (newLatest) {
                const milestonesRaw = newLatest?.milestonesArray || newLatest?.roadmapData;
                if (!milestonesRaw) {
                  setError("Roadmap format is invalid - no milestones found");
                  setRoadmapData([]);
                  return;
                }
                // Process the new roadmap data (same logic as below)
                let milestonesArray;
                if (Array.isArray(milestonesRaw)) {
                  milestonesArray = milestonesRaw;
                } else if (typeof milestonesRaw === "string") {
                  try {
                    const jsonStartIndex = milestonesRaw.indexOf("[");
                    const jsonEndIndex = milestonesRaw.lastIndexOf("]") + 1;
                    if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
                      const jsonString = milestonesRaw.substring(jsonStartIndex, jsonEndIndex);
                      milestonesArray = JSON.parse(jsonString);
                    } else {
                      milestonesArray = JSON.parse(milestonesRaw);
                    }
                  } catch (error) {
                    console.error("Error parsing roadmap data:", error);
                    setError("Roadmap format is invalid - unable to parse data");
                    setRoadmapData([]);
                    return;
                  }
                } else {
                  setError("Roadmap format is invalid - unexpected data type");
                  setRoadmapData([]);
                  return;
                }

                if (!Array.isArray(milestonesArray)) {
                  setError("Roadmap format is invalid - parsed data is not an array");
                  setRoadmapData([]);
                  return;
                }

                const mapped: Milestone[] = milestonesArray.map((m: any) => ({
                  title: m?.title || "",
                  subtitle: m?.subTitle || m?.subtitle || "",
                  description: m?.description || "",
                  durationWeeks: m?.durationWeeks,
                  weeks: m?.weeks,
                  resources: Array.isArray(m?.resources)
                    ? m.resources.map((r: any) => ({
                        type: r?.type || "",
                        title: r?.title || "",
                        url: r?.url || "",
                      }))
                    : [],
                }));

                setRoadmapData(mapped);
                setError(null);
                return;
              }
            }
            setError("No roadmap found. Please complete the assessment to generate one!");
            setRoadmapData([]);
            return;
          } catch (assessmentError) {
            console.log("ℹ️ No assessment results found or error checking:", assessmentError);
            setError("No roadmap found. Please complete the assessment to generate one!");
            setRoadmapData([]);
            return;
          }
        }

        const milestonesRaw = latest?.milestonesArray || latest?.roadmapData;
        if (!milestonesRaw) {
          setError("Roadmap format is invalid - no milestones found");
          setRoadmapData([]);
          return;
        }

        let milestonesArray;
        if (Array.isArray(milestonesRaw)) {
          milestonesArray = milestonesRaw;
        } else if (typeof milestonesRaw === "string") {
          try {
            // Try to parse the JSON string from the roadmap_data field
            const jsonStartIndex = milestonesRaw.indexOf("[");
            const jsonEndIndex = milestonesRaw.lastIndexOf("]") + 1;
            if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
              const jsonString = milestonesRaw.substring(
                jsonStartIndex,
                jsonEndIndex
              );
              milestonesArray = JSON.parse(jsonString);
            } else {
              milestonesArray = JSON.parse(milestonesRaw);
            }
          } catch (error) {
            console.error("Error parsing roadmap data:", error);
            setError("Roadmap format is invalid - unable to parse data");
            setRoadmapData([]);
            return;
          }
        } else {
          setError("Roadmap format is invalid - unexpected data type");
          setRoadmapData([]);
          return;
        }

        if (!Array.isArray(milestonesArray)) {
          setError("Roadmap format is invalid - parsed data is not an array");
          setRoadmapData([]);
          return;
        }

        const mapped: Milestone[] = milestonesArray.map((m: any) => ({
          title: m?.title || "",
          subtitle: m?.subTitle || m?.subtitle || "",
          description: m?.description || "",
          durationWeeks: m?.durationWeeks,
          weeks: m?.weeks,
          resources: Array.isArray(m?.resources)
            ? m.resources.map((r: any) => ({
                type: r?.type || "",
                title: r?.title || "",
                url: r?.url || "",
              }))
            : [],
        }));

        setRoadmapData(mapped);
        setError(null);
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        const status = (err as any)?.status;
        if (status === 401) {
          setError("Please log in to view your roadmap");
        } else {
          setError("Error loading roadmap. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [showPersonalized, token]);

  const handleLogoClick = () => {
    navigate("/");
  };

  // ✅ If no roadmap loaded and personalized is requested, show message
  if (showPersonalized && isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#462872] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (showPersonalized && error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/assessment")}
            className="px-6 py-2 bg-[#462872] text-white rounded-lg hover:bg-[#3b2260] transition-colors"
          >
            Take Assessment Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-20 relative">
      {/* Background Wave - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Wave */}
        <svg
          className="absolute -top-10 left-0 w-full h-[600px]"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path
            fill="#462872"
            fillOpacity="0.03"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Top Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 h-[72px] flex items-center justify-between px-16 bg-white border-b border-gray-100 z-50">
        <img
          src="/logos/AiCareerGuidanceLogo.png"
          alt="App Logo"
          className="h-8 cursor-pointer"
          onClick={handleLogoClick}
        />
        <button
          onClick={() => navigate("/week-plan")}
          className="bg-[#462872] h-[40px] text-white px-6 py-3 rounded-lg text-[0.95rem] font-medium hover:bg-[#3b2260] transition-colors flex items-center gap-2"
        >
          Start Preparation
          <ArrowForwardIcon />
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[3rem] font-bold text-[#462872] mb-2 font-inter tracking-tight">
            {showPersonalized && roadmapData.length > 0
              ? "🎯 Your Personalized Roadmap"
              : "Developer Roadmap"}
          </h1>
          <h2 className="text-[1.25rem] text-gray-600 font-normal font-inter max-w-[600px] mx-auto">
            {showPersonalized && roadmapData.length > 0
              ? "Follow your AI-generated learning path to achieve your career goals"
              : "Follow the path to become a full stack web developer"}
          </h2>
        </div>

        {/* Timeline */}
        <div className="container mx-auto max-w-6xl relative">
          {/* Vertical Line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full z-0"
            style={{
              background:
                "linear-gradient(to bottom, #8b5cf6, #3b82f6, #22c55e, #f59e0b, #ef4444, #06b6d4, #ec4899)",
            }}
          />

          {/* Cards - Show personalized or static */}
          {roadmapData.length > 0
            ? // ✅ Personalized roadmap
              roadmapData.map((milestone, index) => (
                <RoadmapCard
                  key={index}
                  title={milestone.title}
                  subtitle={milestone.subtitle}
                  description={milestone.description}
                  color={CARD_COLORS[index % CARD_COLORS.length]}
                  position={index % 2 === 0 ? "left" : "right"}
                  weeks={milestone.weeks || milestone.durationWeeks}
                  resources={milestone.resources}
                />
              ))
            : showPersonalized
            ? null
            : // ✅ Static roadmap (fallback if not personalized)
              [
                {
                  title: "Frontend",
                  subtitle: "HTML, CSS, JS",
                  description:
                    "Begin your journey with core web technologies. Learn HTML to structure web pages, CSS for design and layout, and JavaScript to make your pages interactive and dynamic. Build solid fundamentals in responsive design and browser compatibility.",
                  color: "#462872",
                },
                {
                  title: "React.js",
                  subtitle: "Modern UI Library",
                  description:
                    "Dive into building modern, reusable components using React. Understand state, props, hooks, and how to create performant, maintainable frontends. Build real-world projects to solidify your understanding.",
                  color: "#3b82f6",
                },
                {
                  title: "Backend",
                  subtitle: "Node.js, Express",
                  description:
                    "Learn how to build scalable server-side applications. Handle routing, APIs, and middlewares using Express with Node.js. Understand server-side logic, database connectivity, and security best practices.",
                  color: "#22c55e",
                },
                {
                  title: "Database",
                  subtitle: "MongoDB & SQL",
                  description:
                    "Master both SQL and NoSQL databases. Learn data modeling, querying, and optimization. Understand when to use different database types and how to integrate them with your applications.",
                  color: "#f59e0b",
                },
                {
                  title: "DevOps",
                  subtitle: "Deployment & CI/CD",
                  description:
                    "Explore modern deployment practices. Learn Docker, Kubernetes, and cloud platforms. Implement continuous integration and deployment pipelines for efficient development workflows.",
                  color: "#ef4444",
                },
              ].map((item, index) => (
                <RoadmapCard
                  key={index}
                  {...item}
                  position={index % 2 === 0 ? "left" : "right"}
                />
              ))}
        </div>
      </div>

      {/* AI Message - Fixed at bottom right */}
      <div className="fixed bottom-8 right-8 max-w-[400px] p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg z-50">
        <p className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-[#462872] flex-shrink-0 mt-1.5" />
          <span>
            {showPersonalized && roadmapData.length > 0
              ? "✨ This roadmap is uniquely generated by AI based on your skills, goals, and learning preferences. It's personalized to optimize your learning journey and career development path."
              : "This roadmap shows a general path to becoming a full stack web developer. Complete the quiz to get a personalized learning path!"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Roadmap;
