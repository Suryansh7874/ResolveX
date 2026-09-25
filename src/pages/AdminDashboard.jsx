import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  UserCog,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Building2,
  XCircle,
  GitMerge,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  BriefcaseBusiness,
  Activity,
  Target,
  MapPin,
  ChevronRight,
  TrendingUp,
  Globe2,
  Layers3,
  Sparkles,
} from "lucide-react";

import api from "../services/api";
import monsoonBg from "../assets/monsoon.jpg";
import axios from "axios";

function AdminDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH CHALLENGES
  ========================================================= */

  const fetchChallenges = async () => {
    try {
      setError("");

      const response = await axios.get("http://localhost:5000/api/challenges");

      console.log("CHALLENGES FROM BACKEND:", response.data);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Failed to fetch challenges"
        );
      }

      const fetchedChallenges = response.data?.challenges || [];

      setChallenges(
        Array.isArray(fetchedChallenges)
          ? fetchedChallenges
          : []
      );
    } catch (err) {
      console.error("Failed to fetch challenges:", err);

      setChallenges([]);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch challenges. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChallenges();
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const normalizeStatus = (status) =>
    String(status || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

  const isValidated = (challenge) =>
    normalizeStatus(challenge?.status) === "validated";

  const isRejected = (challenge) =>
    normalizeStatus(challenge?.status) === "rejected";

  const isMatched = (challenge) =>
    normalizeStatus(challenge?.status) === "matched";

  const isActiveProject = (challenge) =>
    normalizeStatus(challenge?.status) === "in_project";

  const isCompletedProject = (challenge) =>
    normalizeStatus(challenge?.status) === "resolved";

  const isPendingReview = (challenge) => {
    const status = normalizeStatus(challenge?.status);

    return ![
      "validated",
      "rejected",
      "matched",
      "in_project",
      "resolved",
    ].includes(status);
  };

  const totalChallenges = challenges.length;

  const validatedChallenges =
    challenges.filter(isValidated).length;

  const rejectedChallenges =
    challenges.filter(isRejected).length;

  const matchedChallenges =
    challenges.filter(isMatched).length;

  const activeProjects =
    challenges.filter(isActiveProject).length;

  const completedProjects =
    challenges.filter(isCompletedProject).length;

  const pendingReview =
    challenges.filter(isPendingReview).length;

  const percentage = (value) => {
    if (!totalChallenges) return 0;

    return Math.min(
      100,
      Math.round((value / totalChallenges) * 100)
    );
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusLabel = (status) => {
    switch (normalizeStatus(status)) {
      case "validated":
        return "Validated";

      case "rejected":
        return "Rejected";

      case "matched":
        return "Assigned";

      case "in_project":
        return "Active Project";

      case "resolved":
        return "Completed";

      default:
        return "Pending Review";
    }
  };

  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "validated":
        return "status-validated";

      case "rejected":
        return "status-rejected";

      case "matched":
        return "status-matched";

      case "in_project":
        return "status-active";

      case "resolved":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  /* =========================================================
     DOMAIN / PRIORITY
  ========================================================= */

  const getDomain = (challenge) =>
    challenge?.domain ||
    challenge?.aiAnalysis?.domain ||
    "Other";

  const getPriority = (challenge) =>
    challenge?.priority ||
    challenge?.aiAnalysis?.priority ||
    "Normal";

  const formatValue = (value, fallback = "Other") =>
    String(value || fallback)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const domainDistribution = useMemo(() => {
    const counts = {};

    challenges.forEach((challenge) => {
      const domain = formatValue(getDomain(challenge));

      counts[domain] = (counts[domain] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [challenges]);

  const priorityDistribution = useMemo(() => {
    const counts = {};

    challenges.forEach((challenge) => {
      const priority = formatValue(
        getPriority(challenge),
        "Normal"
      );

      counts[priority] =
        (counts[priority] || 0) + 1;
    });

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [challenges]);

  /* =========================================================
     PROJECT PROGRESS
  ========================================================= */

  const projectProgress = [
    {
      label: "Pending Review",
      value: pendingReview,
      className: "progress-pending",
    },
    {
      label: "Validated",
      value: validatedChallenges,
      className: "progress-validated",
    },
    {
      label: "Matched / Assigned",
      value: matchedChallenges,
      className: "progress-matched",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      className: "progress-active",
    },
    {
      label: "Completed",
      value: completedProjects,
      className: "progress-completed",
    },
  ];

  /* =========================================================
     CIRCULAR CHART
  ========================================================= */

  const progressChartData = useMemo(() => {
    const classified =
      pendingReview +
      validatedChallenges +
      rejectedChallenges +
      matchedChallenges +
      activeProjects +
      completedProjects;

    const other = Math.max(
      totalChallenges - classified,
      0
    );

    return [
      {
        label: "Pending Review",
        value: pendingReview,
        color: "#fbbf24",
      },
      {
        label: "Validated",
        value: validatedChallenges,
        color: "#4ade80",
      },
      {
        label: "Rejected",
        value: rejectedChallenges,
        color: "#f87171",
      },
      {
        label: "Matched",
        value: matchedChallenges,
        color: "#a78bfa",
      },
      {
        label: "Active Projects",
        value: activeProjects,
        color: "#38bdf8",
      },
      {
        label: "Completed",
        value: completedProjects,
        color: "#34d399",
      },
      {
        label: "Other",
        value: other,
        color: "#94a3b8",
      },
    ];
  }, [
    pendingReview,
    validatedChallenges,
    rejectedChallenges,
    matchedChallenges,
    activeProjects,
    completedProjects,
    totalChallenges,
  ]);

  const progressChartStyle = useMemo(() => {
    if (!totalChallenges) {
      return {
        background:
          "conic-gradient(rgba(255,255,255,.10) 0deg 360deg)",
      };
    }

    let currentAngle = 0;

    const segments = progressChartData.map((item) => {
      const angle =
        (item.value / totalChallenges) * 360;

      const start = currentAngle;
      const end = currentAngle + angle;

      currentAngle = end;

      return `${item.color} ${start}deg ${end}deg`;
    });

    return {
      background: `conic-gradient(${segments.join(", ")})`,
    };
  }, [progressChartData, totalChallenges]);

  /* =========================================================
     IMPACT METRICS
  ========================================================= */

  const getNumericValue = (challenge, fields) => {
    for (const field of fields) {
      const value = challenge?.[field];

      if (
        typeof value === "number" &&
        !Number.isNaN(value)
      ) {
        return value;
      }

      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        !Number.isNaN(Number(value))
      ) {
        return Number(value);
      }
    }

    return null;
  };

  const calculateMetric = (fields) => {
    let total = 0;

    challenges.forEach((challenge) => {
      const value = getNumericValue(
        challenge,
        fields
      );

      if (value !== null) {
        total += value;
      }
    });

    return total;
  };

  const beneficiaries = calculateMetric([
    "beneficiaries",
    "beneficiaryCount",
    "impactBeneficiaries",
  ]);

  const solutionsDeployed = calculateMetric([
    "solutionsDeployed",
    "deployedSolutions",
    "solutionCount",
  ]);

  const villagesCovered = calculateMetric([
    "villagesCovered",
    "villageCount",
    "coveredVillages",
  ]);

  /* =========================================================
     ECOSYSTEM
  ========================================================= */

  const getUniqueCount = (fields) => {
    const values = new Set();

    challenges.forEach((challenge) => {
      for (const field of fields) {
        const value = challenge?.[field];

        if (value) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item) values.add(String(item));
            });
          } else if (
            typeof value === "object" &&
            value?._id
          ) {
            values.add(String(value._id));
          } else {
            values.add(String(value));
          }

          break;
        }
      }
    });

    return values.size;
  };

  const heiParticipation = getUniqueCount([
    "assignedHEI",
    "heiId",
    "institutionId",
    "hei",
    "institution",
    "college",
    "university",
  ]);

  const industryEngagement = getUniqueCount([
    "industryId",
    "organizationId",
    "industry",
    "organization",
    "company",
  ]);

  /* =========================================================
     RECENT CHALLENGES
  ========================================================= */

  const recentChallenges = [...challenges]
    .sort((a, b) => {
      const dateA = new Date(
        a?.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b?.createdAt || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getChallengeTitle = (challenge) =>
    challenge?.title ||
    challenge?.name ||
    challenge?.description ||
    "Untitled Challenge";

  const getLocation = (challenge) => {
    const location = challenge?.location;

    if (!location) {
      return "Location not available";
    }

    if (typeof location === "string") {
      return location;
    }

    if (location?.address) {
      return location.address;
    }

    if (location?.name) {
      return location.name;
    }

    if (
      Array.isArray(location?.coordinates) &&
      location.coordinates.length >= 2
    ) {
      const [longitude, latitude] =
        location.coordinates;

      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    return "Location not available";
  };

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const statCards = [
    {
      label: "Total Challenges",
      value: totalChallenges,
      percent: 100,
      icon: ClipboardList,
      className: "blue",
    },
    {
      label: "Validated",
      value: validatedChallenges,
      percent: percentage(validatedChallenges),
      icon: CheckCircle2,
      className: "green",
    },
    {
      label: "Rejected",
      value: rejectedChallenges,
      percent: percentage(rejectedChallenges),
      icon: XCircle,
      className: "red",
    },
    {
      label: "Matched",
      value: matchedChallenges,
      percent: percentage(matchedChallenges),
      icon: GitMerge,
      className: "purple",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      percent: percentage(activeProjects),
      icon: Activity,
      className: "cyan",
    },
    {
      label: "Completed Projects",
      value: completedProjects,
      percent: percentage(completedProjects),
      icon: Target,
      className: "emerald",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .admin-page {
          min-height: 100vh;
          padding: 42px 5% 80px;
          color: #f8fafc;
          font-family: "Manrope", Arial, sans-serif;

          background:
            linear-gradient(
              135deg,
              rgba(5, 15, 27, 0.76),
              rgba(9, 24, 40, 0.82)
            ),
            url(${monsoonBg});

          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .admin-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 30px;
        }

        .header-left {
          max-width: 820px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 12px;
          margin-bottom: 14px;
          border: 1px solid rgba(148,163,184,.22);
          border-radius: 999px;
          background: rgba(15,23,42,.42);
          backdrop-filter: blur(18px);
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 14px rgba(96,165,250,.9);
        }

        .dashboard-title {
          margin: 0;
          font-size: clamp(34px, 4vw, 52px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: -2.2px;
          color: #fff;
        }

        .dashboard-subtitle {
          margin: 14px 0 0;
          max-width: 760px;
          color: rgba(226,232,240,.78);
          font-size: 15px;
          line-height: 1.75;
        }

        .refresh-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 17px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 13px;
          background: rgba(15,23,42,.48);
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 30px rgba(0,0,0,.18);
          transition: .22s ease;
        }

        .refresh-button:hover {
          transform: translateY(-2px);
          background: rgba(30,41,59,.7);
          border-color: rgba(147,197,253,.35);
        }

        .refresh-button:disabled {
          opacity: .65;
          cursor: not-allowed;
          transform: none;
        }

        .spin {
          animation: spin .9s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-box {
          margin-bottom: 22px;
          padding: 15px 18px;
          border: 1px solid rgba(248,113,113,.3);
          border-radius: 14px;
          background: rgba(127,29,29,.35);
          color: #fecaca;
          font-size: 13px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 24px;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          min-height: 130px;
          padding: 17px 18px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 17px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.13),
              rgba(255,255,255,.055)
            );
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 45px rgba(0,0,0,.16);
          transition:
            transform .22s ease,
            border-color .22s ease,
            box-shadow .22s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(147,197,253,.28);
          box-shadow: 0 25px 55px rgba(0,0,0,.22);
        }

        .stat-card::before {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          right: -55px;
          top: -60px;
          border-radius: 50%;
          background: rgba(255,255,255,.06);
        }

        .stat-card::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 42%;
          height: 2px;
          opacity: .7;
          background: currentColor;
        }

        .stat-card.blue { color: #60a5fa; }
        .stat-card.green { color: #4ade80; }
        .stat-card.red { color: #f87171; }
        .stat-card.purple { color: #a78bfa; }
        .stat-card.cyan { color: #38bdf8; }
        .stat-card.emerald { color: #34d399; }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .stat-icon {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(255,255,255,.075);
          color: currentColor;
        }

        .stat-percent {
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          background: rgba(255,255,255,.055);
          color: rgba(226,232,240,.72);
          font-size: 10px;
          font-weight: 800;
        }

        .stat-value {
          margin-bottom: 5px;
          color: #fff;
          font-size: 28px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -1.1px;
        }

        .stat-label {
          color: rgba(226,232,240,.76);
          font-size: 12px;
          font-weight: 700;
        }

        .panel,
        .analytics-card,
        .impact-card {
          border: 1px solid rgba(255,255,255,.115);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.115),
              rgba(255,255,255,.045)
            );
          backdrop-filter: blur(20px);
          box-shadow: 0 22px 60px rgba(0,0,0,.16);
        }

        .panel {
          overflow: hidden;
          border-radius: 20px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,.075);
        }

        .panel-title-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .panel-icon {
          width: 37px;
          height: 37px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(96,165,250,.10);
          color: #93c5fd;
        }

        .panel .panel-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #ffffff !important;
        }

        .panel .panel-description {
          margin: 3px 0 0;
          color: rgba(255,255,255,.78) !important;
          font-size: 11px;
          line-height: 1.5;
        }

        .view-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #38bdf8;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          transition: .2s ease;
        }

        .view-link:hover {
          color: #fff;
          transform: translateX(2px);
        }

        .main-grid {
          display: grid;
          grid-template-columns: .88fr 1.35fr;
          gap: 18px;
          margin-bottom: 27px;
        }

        .review-body {
          padding: 19px;
        }

        .review-highlight {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px;
          border: 1px solid rgba(251,191,36,.18);
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            rgba(251,191,36,.105),
            rgba(251,191,36,.035)
          );
          margin-bottom: 15px;
        }

        .review-highlight-icon {
          width: 43px;
          height: 43px;
          min-width: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: rgba(251,191,36,.12);
          color: #fcd34d;
        }

        .review-number {
          font-size: 27px;
          line-height: 1;
          font-weight: 800;
          color: #fff;
        }

        .review-text {
          margin-top: 5px;
          color: rgba(226,232,240,.65);
          font-size: 11px;
          line-height: 1.45;
        }

        .review-actions {
          display: grid;
          gap: 8px;
        }

        .action-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          color: #e2e8f0;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: .2s ease;
        }

        .action-link:hover {
          transform: translateX(4px);
          background: rgba(255,255,255,.075);
          border-color: rgba(147,197,253,.18);
        }

        .action-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .action-left svg {
          color: #93c5fd;
        }

        .challenge-list {
          padding: 5px 10px 8px;
        }

        /*
          IMPORTANT:
          Challenge items are now Links.
        */

        .challenge-item {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 16px;
          padding: 14px 11px;
          border-bottom: 1px solid rgba(255,255,255,.065);
          text-decoration: none;
          color: inherit;
          border-radius: 10px;
          transition: .2s ease;
        }

        .challenge-item:last-child {
          border-bottom: none;
        }

        .challenge-item:hover {
          background: rgba(255,255,255,.055);
          transform: translateX(3px);
        }

        .challenge-title {
          margin-bottom: 7px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .challenge-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          color: rgba(226,232,240,.68);
          font-size: 11px;
        }

        .challenge-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .challenge-meta svg {
          flex-shrink: 0;
          color: #93c5fd;
        }

        .status-badge {
          align-self: start;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-pending {
          background: rgba(251,191,36,.12);
          color: #fcd34d;
        }

        .status-validated {
          background: rgba(74,222,128,.12);
          color: #86efac;
        }

        .status-rejected {
          background: rgba(248,113,113,.12);
          color: #fca5a5;
        }

        .status-matched {
          background: rgba(167,139,250,.13);
          color: #c4b5fd;
        }

        .status-active {
          background: rgba(56,189,248,.12);
          color: #7dd3fc;
        }

        .status-completed {
          background: rgba(52,211,153,.12);
          color: #6ee7b7;
        }

        .section {
          margin-bottom: 28px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 14px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.3px;
        }

        .section-heading svg {
          color: #93c5fd;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 17px;
        }

        .analytics-card {
          padding: 19px;
          border-radius: 18px;
        }

        .analytics-card.full-width {
          grid-column: span 2;
        }

        .progress-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 17px;
          grid-column: span 2;
        }

        .progress-cards-row .analytics-card {
          min-width: 0;
        }

        .analytics-card-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .analytics-card .analytics-card-title h3 {
          margin: 0;
          color: #ffffff !important;
          font-size: 16px;
          font-weight: 800;
        }

        .analytics-card-title span {
          color: rgba(226,232,240,.65);
          font-size: 11px;
        }

        .distribution-list {
          display: grid;
          gap: 13px;
        }

        .distribution-row {
          display: grid;
          grid-template-columns: 115px 1fr 30px;
          align-items: center;
          gap: 10px;
        }

        .distribution-label {
          color: rgba(226,232,240,.82);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bar-track {
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.075);
        }

        .bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #60a5fa,
            #38bdf8
          );
          transition: width .5s ease;
        }

        .bar-fill.priority {
          background: linear-gradient(
            90deg,
            #f59e0b,
            #fbbf24
          );
        }

        .distribution-value {
          text-align: right;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
        }

        .empty-analytics {
          padding: 25px 0;
          color: rgba(226,232,240,.65);
          text-align: center;
          font-size: 12px;
        }

        .project-progress {
          display: grid;
          gap: 14px;
        }

        .project-progress-row {
          display: grid;
          grid-template-columns: 140px 1fr 30px;
          align-items: center;
          gap: 11px;
        }

        .project-progress-label {
          color: rgba(226,232,240,.82);
          font-size: 12px;
          font-weight: 700;
        }

        .project-progress-value {
          color: #fff;
          text-align: right;
          font-size: 12px;
          font-weight: 800;
        }

        .progress-bar {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.075);
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: inherit;
        }

        .progress-pending { background: #fbbf24; }
        .progress-validated { background: #4ade80; }
        .progress-matched { background: #a78bfa; }
        .progress-active { background: #38bdf8; }
        .progress-completed { background: #34d399; }

        .progress-chart-layout {
          display: grid;
          grid-template-columns: 230px 1fr;
          align-items: center;
          gap: 20px;
        }

        .progress-chart-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .progress-chart {
          position: relative;
          width: 190px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow:
            0 0 0 5px rgba(255,255,255,.08),
            0 0 28px rgba(255,255,255,.25),
            0 18px 45px rgba(0,0,0,.28);
        }

        .progress-chart::before {
          content: "";
          position: absolute;
          width: 138px;
          height: 138px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(255,255,255,.13),
              rgba(7,18,31,.96)
            );
        }

        .progress-chart-center {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .progress-chart-total {
          color: #fff;
          font-size: 32px;
          line-height: 1;
          font-weight: 800;
        }

        .progress-chart-label {
          margin-top: 7px;
          color: rgba(226,232,240,.75);
          font-size: 10px;
          font-weight: 700;
        }

        .progress-legend {
          display: grid;
          gap: 9px;
        }

        .progress-legend-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 9px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
        }

        .progress-legend-dot {
          width: 9px;
          height: 9px;
          min-width: 9px;
          border-radius: 50%;
        }

        .progress-legend-content {
          flex: 1;
        }

        .progress-legend-label {
          color: rgba(226,232,240,.82);
          font-size: 11px;
          font-weight: 700;
        }

        .progress-legend-value {
          color: #fff;
          font-size: 14px;
          font-weight: 800;
        }

        .ecosystem-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 13px;
        }

        .ecosystem-item {
          padding: 16px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          background: rgba(255,255,255,.035);
        }

        .ecosystem-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ecosystem-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(96,165,250,.09);
          color: #bfdbfe;
        }

        .ecosystem-value {
          font-size: 21px;
          font-weight: 800;
          color: #fff;
        }

        .ecosystem-title {
          margin-bottom: 5px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .ecosystem-description {
          color: rgba(226,232,240,.68);
          font-size: 11px;
          line-height: 1.65;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .impact-card {
          min-height: 125px;
          padding: 14px 16px;
          border-radius: 14px;
        }

        .impact-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 9px;
          border-radius: 9px;
          background: rgba(96,165,250,.09);
          color: #93c5fd;
        }

        .impact-value {
          margin-bottom: 3px;
          color: #fff;
          font-size: 23px;
          font-weight: 800;
        }

        .impact-label {
          color: rgba(226,232,240,.80);
          font-size: 11px;
          font-weight: 700;
        }

        .impact-note {
          margin-top: 5px;
          color: rgba(226,232,240,.55);
          font-size: 9px;
          line-height: 1.45;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 13px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.065),
              rgba(255,255,255,.025)
            );
          color: #fff;
          text-decoration: none;
          transition: .22s ease;
        }

        .quick-action:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,.085);
          border-color: rgba(147,197,253,.22);
        }

        .quick-action-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: rgba(96,165,250,.10);
          color: #93c5fd;
        }

        .quick-action-content {
          min-width: 0;
        }

        .quick-action-title {
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 800;
        }

        .quick-action-description {
          color: rgba(226,232,240,.68);
          font-size: 11px;
          line-height: 1.5;
        }

        .quick-action-arrow {
          margin-left: auto;
          flex-shrink: 0;
          color: rgba(226,232,240,.4);
        }

        .loading-state {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(226,232,240,.65);
        }

        .loading-state p {
          margin: 0;
          font-size: 13px;
        }

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2,1fr);
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: repeat(2,1fr);
          }

          .progress-chart-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .progress-cards-row {
            grid-template-columns: 1fr;
            grid-column: span 1;
          }
        }

        @media (max-width: 820px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .analytics-card.full-width {
            grid-column: span 1;
          }

          .progress-cards-row {
            grid-column: span 1;
          }

          .impact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .admin-page {
            padding: 28px 15px 55px;
            background-attachment: scroll;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .refresh-button {
            width: 100%;
          }

          .stats-grid,
          .quick-actions,
          .ecosystem-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-title {
            font-size: 34px;
          }

          .challenge-item {
            grid-template-columns: 1fr;
          }

          .status-badge {
            justify-self: start;
          }
        }

        @media (max-width: 450px) {
          .distribution-row,
          .project-progress-row {
            grid-template-columns: 85px 1fr 25px;
            gap: 7px;
          }

          .panel-header,
          .review-body,
          .analytics-card,
          .impact-card {
            padding: 17px;
          }
        }
      `}</style>

      <main className="admin-page">
        <div className="admin-container">

          {/* HEADER */}

          <header className="dashboard-header">
            <div className="header-left">

              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Government Administration
              </div>

              <h1 className="dashboard-title">
                Government Dashboard
              </h1>

              <p className="dashboard-subtitle">
                Monitor societal challenges, validate submissions,
                coordinate institutions, track projects and measure
                the real-world impact of innovation initiatives.
              </p>

            </div>

            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                size={15}
                className={refreshing ? "spin" : ""}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>
          </header>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {loading ? (
            <div className="panel loading-state">
              <Loader2 size={30} className="spin" />
              <p>Loading government dashboard...</p>
            </div>
          ) : (
            <>

              {/* SUMMARY */}

              <section className="stats-grid">

                {statCards.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      className={`stat-card ${stat.className}`}
                      key={stat.label}
                    >
                      <div className="stat-top">

                        <div className="stat-icon">
                          <Icon size={19} />
                        </div>

                        <span className="stat-percent">
                          {stat.percent}%
                        </span>

                      </div>

                      <div className="stat-value">
                        {stat.value}
                      </div>

                      <div className="stat-label">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}

              </section>

              {/* REVIEW + RECENT CHALLENGES */}

              <section className="main-grid">

                <div className="panel">

                  <div className="panel-header">

                    <div className="panel-title-wrap">

                      <div className="panel-icon">
                        <ShieldCheck size={18} />
                      </div>

                      <div>
                        <h2 className="panel-title">
                          Government Review
                        </h2>

                        <p className="panel-description">
                          Validate and manage submitted challenges
                        </p>
                      </div>

                    </div>

                    <Link
                      to="/admin/review"
                      className="view-link"
                    >
                      Open
                      <ArrowUpRight size={13} />
                    </Link>

                  </div>

                  <div className="review-body">

                    <div className="review-highlight">

                      <div className="review-highlight-icon">
                        <Clock3 size={20} />
                      </div>

                      <div>
                        <div className="review-number">
                          {pendingReview}
                        </div>

                        <div className="review-text">
                          Challenges awaiting government review
                        </div>
                      </div>

                    </div>

                    <div className="review-actions">

                      <Link
                        to="/admin/review"
                        className="action-link"
                      >
                        <span className="action-left">
                          <ShieldCheck size={15} />
                          Review Challenges
                        </span>

                        <ChevronRight size={14} />
                      </Link>

                      <Link
                        to="/admin/hei"
                        className="action-link"
                      >
                        <span className="action-left">
                          <GitMerge size={15} />
                          HEI Matching
                        </span>

                        <ChevronRight size={14} />
                      </Link>

                      <Link
                        to="/admin/projects"
                        className="action-link"
                      >
                        <span className="action-left">
                          <FolderKanban size={15} />
                          Monitor Projects
                        </span>

                        <ChevronRight size={14} />
                      </Link>

                    </div>

                  </div>
                </div>

                <div className="panel">

                  <div className="panel-header">

                    <div className="panel-title-wrap">

                      <div className="panel-icon">
                        <ClipboardList size={18} />
                      </div>

                      <div>
                        <h2 className="panel-title">
                          Recent Challenges
                        </h2>

                        <p className="panel-description">
                          Latest submissions received
                        </p>
                      </div>

                    </div>

                    <Link
                      to="/admin/challenges"
                      className="view-link"
                    >
                      View All
                      <ArrowUpRight size={13} />
                    </Link>

                  </div>

                  <div className="challenge-list">

                    {recentChallenges.length === 0 ? (
                      <div className="empty-analytics">
                        No challenges available.
                      </div>
                    ) : (
                      recentChallenges.map(
                        (challenge, index) => {

                          const challengeId =
                            challenge?._id ||
                            challenge?.id;

                          return (
                            <Link
                              to={
                                challengeId
                                  ? `/challenges/${challengeId}`
                                  : "#"
                              }
                              className="challenge-item"
                              key={
                                challengeId || index
                              }
                              onClick={(event) => {
                                if (!challengeId) {
                                  event.preventDefault();
                                }
                              }}
                            >

                              <div>

                                <div className="challenge-title">
                                  {getChallengeTitle(
                                    challenge
                                  )}
                                </div>

                                <div className="challenge-meta">

                                  <span>
                                    <Layers3 size={10} />
                                    {formatValue(
                                      getDomain(challenge)
                                    )}
                                  </span>

                                  <span>
                                    <MapPin size={10} />
                                    {getLocation(
                                      challenge
                                    )}
                                  </span>

                                  <span>
                                    {formatDate(
                                      challenge?.createdAt
                                    )}
                                  </span>

                                </div>

                              </div>

                              <span
                                className={`status-badge ${getStatusClass(
                                  challenge?.status
                                )}`}
                              >
                                {getStatusLabel(
                                  challenge?.status
                                )}
                              </span>

                            </Link>
                          );
                        }
                      )
                    )}

                  </div>
                </div>

              </section>

              {/* ANALYTICS */}

              <section className="section">

                <h2 className="section-heading">
                  <BarChart3 size={20} />
                  Analytics & Monitoring
                </h2>

                <div className="analytics-grid">

                  <div className="analytics-card">

                    <div className="analytics-card-title">
                      <h3>Domain Distribution</h3>
                      <span>Challenges</span>
                    </div>

                    {domainDistribution.length === 0 ? (
                      <div className="empty-analytics">
                        No domain data available.
                      </div>
                    ) : (
                      <div className="distribution-list">

                        {domainDistribution.map(
                          ([domain, value]) => {

                            const maxValue =
                              domainDistribution[0]?.[1] || 1;

                            const width =
                              (value / maxValue) * 100;

                            return (
                              <div
                                className="distribution-row"
                                key={domain}
                              >

                                <span className="distribution-label">
                                  {domain}
                                </span>

                                <div className="bar-track">
                                  <div
                                    className="bar-fill"
                                    style={{
                                      width: `${width}%`,
                                    }}
                                  />
                                </div>

                                <span className="distribution-value">
                                  {value}
                                </span>

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>

                  <div className="analytics-card">

                    <div className="analytics-card-title">
                      <h3>Priority Distribution</h3>
                      <span>Challenges</span>
                    </div>

                    {priorityDistribution.length === 0 ? (
                      <div className="empty-analytics">
                        No priority data available.
                      </div>
                    ) : (
                      <div className="distribution-list">

                        {priorityDistribution.map(
                          ([priority, value]) => {

                            const maxValue =
                              Math.max(
                                ...priorityDistribution.map(
                                  ([, count]) => count
                                ),
                                1
                              );

                            const width =
                              (value / maxValue) * 100;

                            return (
                              <div
                                className="distribution-row"
                                key={priority}
                              >

                                <span className="distribution-label">
                                  {priority}
                                </span>

                                <div className="bar-track">
                                  <div
                                    className="bar-fill priority"
                                    style={{
                                      width: `${width}%`,
                                    }}
                                  />
                                </div>

                                <span className="distribution-value">
                                  {value}
                                </span>

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>

                  <div className="progress-cards-row">

                    <div className="analytics-card">

                      <div className="analytics-card-title">
                        <h3>Challenge Progress</h3>
                        <span>Overall lifecycle</span>
                      </div>

                      <div className="progress-chart-layout">

                        <div className="progress-chart-wrapper">

                          <div
                            className="progress-chart"
                            style={progressChartStyle}
                          >
                            <div className="progress-chart-center">

                              <div className="progress-chart-total">
                                {totalChallenges}
                              </div>

                              <div className="progress-chart-label">
                                Total Challenges
                              </div>

                            </div>
                          </div>

                        </div>

                        <div className="progress-legend">

                          {progressChartData.map(
                            (item) => (
                              <div
                                className="progress-legend-item"
                                key={item.label}
                              >

                                <span
                                  className="progress-legend-dot"
                                  style={{
                                    background:
                                      item.color,
                                  }}
                                />

                                <div className="progress-legend-content">
                                  <div className="progress-legend-label">
                                    {item.label}
                                  </div>
                                </div>

                                <div className="progress-legend-value">
                                  {item.value}
                                </div>

                              </div>
                            )
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="analytics-card">

                      <div className="analytics-card-title">
                        <h3>Project Progress</h3>
                        <span>Challenge lifecycle</span>
                      </div>

                      <div className="project-progress">

                        {projectProgress.map(
                          (item) => (
                            <div
                              className="project-progress-row"
                              key={item.label}
                            >

                              <span className="project-progress-label">
                                {item.label}
                              </span>

                              <div className="progress-bar">
                                <div
                                  className={`progress-bar-fill ${item.className}`}
                                  style={{
                                    width: `${percentage(
                                      item.value
                                    )}%`,
                                  }}
                                />
                              </div>

                              <span className="project-progress-value">
                                {item.value}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    </div>

                  </div>

                  <div className="analytics-card full-width">

                    <div className="analytics-card-title">
                      <h3>
                        Ecosystem Participation
                      </h3>

                      <span>
                        HEI & Industry
                      </span>
                    </div>

                    <div className="ecosystem-grid">

                      <div className="ecosystem-item">

                        <div className="ecosystem-top">

                          <div className="ecosystem-icon">
                            <Building2 size={17} />
                          </div>

                          <div className="ecosystem-value">
                            {heiParticipation}
                          </div>

                        </div>

                        <div className="ecosystem-title">
                          HEI Participation
                        </div>

                        <div className="ecosystem-description">
                          Higher Education Institutions
                          participating in challenge matching,
                          team formation and project execution.
                        </div>

                      </div>

                      <div className="ecosystem-item">

                        <div className="ecosystem-top">

                          <div className="ecosystem-icon">
                            <BriefcaseBusiness size={17} />
                          </div>

                          <div className="ecosystem-value">
                            {industryEngagement}
                          </div>

                        </div>

                        <div className="ecosystem-title">
                          Industry Engagement
                        </div>

                        <div className="ecosystem-description">
                          Industry organizations contributing
                          expertise, resources and collaboration
                          toward solution development.
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              </section>

              {/* IMPACT */}

              <section className="section">

                <h2 className="section-heading">
                  <TrendingUp size={20} />
                  Impact Metrics
                </h2>

                <div className="impact-grid">

                  <div className="impact-card">

                    <div className="impact-icon">
                      <Users size={18} />
                    </div>

                    <div className="impact-value">
                      {beneficiaries.toLocaleString("en-IN")}
                    </div>

                    <div className="impact-label">
                      Beneficiaries
                    </div>

                    <div className="impact-note">
                      People impacted by deployed solutions
                    </div>

                  </div>

                  <div className="impact-card">

                    <div className="impact-icon">
                      <CheckCircle2 size={18} />
                    </div>

                    <div className="impact-value">
                      {solutionsDeployed.toLocaleString("en-IN")}
                    </div>

                    <div className="impact-label">
                      Solutions Deployed
                    </div>

                    <div className="impact-note">
                      Successfully implemented solutions
                    </div>

                  </div>

                  <div className="impact-card">

                    <div className="impact-icon">
                      <Globe2 size={18} />
                    </div>

                    <div className="impact-value">
                      {villagesCovered.toLocaleString("en-IN")}
                    </div>

                    <div className="impact-label">
                      Villages Covered
                    </div>

                    <div className="impact-note">
                      Communities reached by projects
                    </div>

                  </div>

                </div>

              </section>

              {/* GOVERNMENT ACTIONS */}

              <section className="section">

                <h2 className="section-heading">
                  <Sparkles size={20} />
                  Government Actions
                </h2>

                <div className="quick-actions">

                  <Link
                    to="/admin/challenges"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <ClipboardList size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        Challenge Management
                      </div>

                      <div className="quick-action-description">
                        Manage submitted societal challenges
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                  <Link
                    to="/admin/review"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <ShieldCheck size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        Government Review
                      </div>

                      <div className="quick-action-description">
                        Validate or reject challenges
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                  <Link
                    to="/admin/hei"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <GitMerge size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        HEI Matching
                      </div>

                      <div className="quick-action-description">
                        Match challenges with institutions
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                  <Link
                    to="/admin/projects"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <FolderKanban size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        Project Monitoring
                      </div>

                      <div className="quick-action-description">
                        Track active and completed projects
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                  <Link
                    to="/admin/officers"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <UserCog size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        Government Officers
                      </div>

                      <div className="quick-action-description">
                        Manage government-side users
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                  <Link
                    to="/admin/impact"
                    className="quick-action"
                  >
                    <div className="quick-action-icon">
                      <BarChart3 size={18} />
                    </div>

                    <div className="quick-action-content">
                      <div className="quick-action-title">
                        Impact & Outcomes
                      </div>

                      <div className="quick-action-description">
                        Monitor measurable social impact
                      </div>
                    </div>

                    <ChevronRight
                      size={15}
                      className="quick-action-arrow"
                    />
                  </Link>

                </div>

              </section>

            </>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;