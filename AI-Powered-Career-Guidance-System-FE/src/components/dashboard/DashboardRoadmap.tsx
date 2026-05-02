import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { roadmapApi } from "../../api/roadmap";
import { assessmentApi } from "../../api/assessment";

interface RoadmapCardProps {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  position: "left" | "right";
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  title,
  subtitle,
  description,
  color,
  position,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-[45%] relative mb-20 bg-white rounded-xl shadow-lg p-8 min-h-[200px] flex flex-col
                  ${position === "left" ? "ml-0" : "ml-auto"}`}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 w-[12.5%] h-0.5"
        style={{
          backgroundColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 z-10"
        style={{
          borderColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
          transform: `translate(${position === "left" ? "20%" : "-15%"}, -50%)`,
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-20"
        style={{
          backgroundColor: color,
          [position === "left" ? "right" : "left"]: "-12.5%",
          transform: `translate(${position === "left" ? "-10%" : "15%"}, -50%)`,
        }}
      />

      <h3
        className="text-[1.75rem] font-semibold mb-3 font-inter"
        style={{ color }}
      >
        {title}
      </h3>

      <h4 className="text-[1.1rem] text-gray-600 font-medium mb-4 font-inter">
        {subtitle}
      </h4>

      <div className="w-12 h-[3px] mb-6" style={{ backgroundColor: color }} />

      <p className="text-gray-600 leading-[1.7] text-base font-inter mb-5">
        {description}
      </p>

      <button
        onClick={() => navigate("/dashboard/assessment")}
        className="mt-auto self-start px-3 py-1.5 rounded text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: color }}
      >
        Take Assessment
      </button>
    </div>
  );
};

type StepLike = {
  id?: string;
  title: string;
  description?: string;
};

const DashboardRoadmap = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<StepLike[]>([]);
  const [careerTitle, setCareerTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  // ✅ CLEAN NORMALIZER (NO HACKS)
  const normalizeToSteps = (rm: any): StepLike[] => {
    if (!rm) return [];

    console.log("📦 RAW milestonesArray:", rm.milestonesArray);
    console.log("📦 RAW roadmapData:", rm.roadmapData);

    // ✅ Case 1: Use milestonesArray (primary field from backend)
    if (Array.isArray(rm.milestonesArray)) {
      return rm.milestonesArray;
    }

    // ✅ Case 2: Parse milestones string
    if (typeof rm.milestones === "string") {
      try {
        const parsed = JSON.parse(rm.milestones);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("❌ Parse milestones failed:", e);
      }
    }

    // ✅ Case 3: Fallback to roadmapData
    if (Array.isArray(rm.roadmapData)) {
      return rm.roadmapData;
    }

    if (typeof rm.roadmapData === "string") {
      try {
        const parsed = JSON.parse(rm.roadmapData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        if (Array.isArray(parsed?.data)) {
          return parsed.data;
        }
      } catch (e) {
        console.error("❌ Parse roadmapData failed:", e);
      }
    }

    return [];
  };

  useEffect(() => {
    let cancelled = false;

    const loadUserRoadmap = async () => {
      try {
        setLoading(true);

        const roadmaps: any = await roadmapApi.getMyRoadmaps();
        console.log("🔍 API Response:", roadmaps);
        console.log("🔍 Response Type:", typeof roadmaps);
        console.log("🔍 Is Array:", Array.isArray(roadmaps));
        const list = Array.isArray(roadmaps)
          ? roadmaps
          : Array.isArray(roadmaps?.data)
          ? roadmaps.data
          : Array.isArray(roadmaps?.data?.data)
          ? roadmaps.data.data
          : [];
        const latest = Array.isArray(list) && list.length > 0 ? list[0] : null;

        if (!cancelled) {
          if (latest) {
            const normalized = normalizeToSteps(latest);

            console.log("🚀 FINAL STEPS LENGTH:", normalized.length);

            setCareerTitle(
              latest?.career || latest?.title || "Personalized Roadmap"
            );
            setSteps(normalized);
          } else {
            // No roadmap found, check if user has assessment results and auto-generate
            try {
              const assessmentResult = await assessmentApi.latestResult();
              if (assessmentResult) {
                try {
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
                    const normalized = normalizeToSteps(newLatest);
                    setCareerTitle(
                      newLatest?.career || newLatest?.title || "Personalized Roadmap"
                    );
                    setSteps(normalized);
                  } else {
                    setSteps([]);
                    setCareerTitle("");
                  }
                } catch (generateError: any) {
                  console.error('Roadmap generation failed:', generateError);
                  let errorMessage = 'Failed to generate your personalized roadmap.';
                  
                  if (generateError?.status === 429 || generateError?.message?.includes('quota')) {
                    errorMessage = 'AI service is currently busy. Your roadmap will be generated automatically. Please try again later.';
                  } else if (generateError?.status === 500) {
                    errorMessage = 'Roadmap generation service is temporarily unavailable. Please try again later.';
                  }
                  
                  setError(errorMessage);
                  setSteps([]);
                  setCareerTitle("");
                }
              } else {
                setSteps([]);
                setCareerTitle("");
              }
            } catch (assessmentError) {
              console.log("ℹ️ No assessment results found or error checking:", assessmentError);
              setSteps([]);
              setCareerTitle("");
            }
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading roadmap:", error);
        if (!cancelled) {
          setSteps([]);
          setCareerTitle("");
          setLoading(false);
        }
      }
    };

    loadUserRoadmap();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasData = steps.length > 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[2.5rem] font-bold text-[#462872] mb-2 font-inter tracking-tight">
            Developer Roadmap
          </h1>
          <h2 className="text-[1.25rem] text-gray-600 font-normal font-inter max-w-[600px] mx-auto">
            Follow the path to become a full stack web developer
          </h2>
        </div>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress size={48} sx={{ color: "#462872" }} />
          </Box>
        )}

        {error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              textAlign: "center",
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: "#d32f2f", mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Please try again later or contact support if the issue persists.
            </Typography>
          </Box>
        )}

        {!loading && hasData && (
          <div
            className="w-full max-w-[1200px] mx-auto relative px-4"
            style={{ minHeight: "80vh", maxHeight: "120vh", overflowY: "auto" }}
          >
            {/* Vertical Line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0.5 z-0"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, #8b5cf6, #3b82f6, #22c55e, #f59e0b, #ef4444)",
              }}
            />

            {steps.map((step: any, index: number) => (
              <RoadmapCard
                key={step.id || `${index}-${step.title}`}
                title={step.title}
                subtitle={careerTitle}
                description={step.description || ""}
                color={
                  ["#462872", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444"][
                    index % 5
                  ]
                }
                position={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        )}

        {!loading && !hasData && (
          <Box
            sx={{
              minHeight: "30vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#666", mb: 2 }}>
                No roadmap found. Take the assessment to generate one!
              </Typography>
              <button
                onClick={() => navigate("/assessment")}
                className="px-6 py-2 bg-[#462872] text-white rounded-lg hover:bg-[#3b2260]"
              >
                Take Assessment
              </button>
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default DashboardRoadmap;
