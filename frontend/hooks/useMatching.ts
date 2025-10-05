import { useState, useEffect } from "react";

interface Match {
  id: string;
  name: string;
  matchScore: number;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: string[];
  interests?: string[];
}

export const useMatching = (email?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/match/${email}`);
        const data = await response.json();

        if (data.matches) {
          const formatted = data.matches.map((m: any, idx: number) => ({
            id: `match-${idx}`,
            name: m.partner,
            matchScore: m.match_score,
            avatar: "👩‍💻", // optional emoji
            skills: ["React", "Node.js", "AWS"], // optional — or you can fetch real ones if backend sends them
            interests: ["Web Development", "Cloud Computing"], // optional
          }));
          setMatches(formatted);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [email]);

  const handleLike = (id: string) => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = (id: string) => {
    setCurrentIndex((prev) => prev + 1);
  };

  const reset = () => {
    setCurrentIndex(0);
  };

  return {
    currentMatch: matches[currentIndex],
    loading,
    hasMoreMatches: currentIndex < matches.length,
    handleLike,
    handlePass,
    reset,
  };
};
