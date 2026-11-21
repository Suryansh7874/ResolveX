import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UsersRound,
  FileText,
  FolderKanban,
  Bell,
  UserCircle,
  Search,
  Settings,
  Menu,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  BriefcaseBusiness,
  Sparkles,
  ArrowUpRight,
  Target,
  Activity,
  Building2,
  CircleDot,
  Plus,
} from "lucide-react";

import api from "../services/api";
import monsoon from "../assets/monsoon.jpg";

const navItems = [
  {
    label: "Dashboard",
    path: "/hei",
    icon: LayoutDashboard,
  },
  {
    label: "Assigned Challenges",
    path: "/hei/challenges",
    icon: ClipboardList,
  },
  {
    label: "Members",
    path: "/hei/members",
    icon: Users,
  },
  {
    label: "Teams",
    path: "/hei/teams",
    icon: UsersRound,
  },
  {
    label: "Proposals",
    path: "/hei/proposals",
    icon: FileText,
  },
  {
    label: "Projects",
    path: "/hei/projects",
    icon: FolderKanban,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

/* =========================================================
   CHALLENGE HELPERS
========================================================= */

const getRawChallengeStatus = (challenge) => {
  return String(
    challenge?.status ||
      challenge?.challengeStatus ||
      challenge?.state ||
      ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

/*
  Backend stores HEI response separately:

  challenge.heiAcceptance.status

  Possible values:
  PENDING
  ACCEPTED
  REJECTED

  The challenge itself can have statuses such as:
  MATCHED
  IN_PROJECT
  IN_PROGRESS
  PILOT
  COMPLETED
*/
const getAcceptanceStatus = (challenge) => {
  return String(
    challenge?.heiAcceptance?.status || ""
  )
    .trim()
    .toUpperCase();
};

/*
  This is the status that should be shown on the HEI dashboard.

  Backend behavior:
  ACCEPTED -> challenge.status becomes IN_PROJECT
  REJECTED -> challenge.status remains MATCHED
*/
const getChallengeStatus = (challenge) => {
  const acceptanceStatus = getAcceptanceStatus(challenge);
  const rawStatus = getRawChallengeStatus(challenge);

  // HEI explicitly rejected the assignment
  if (acceptanceStatus === "REJECTED") {
    return "rejected";
  }

  // HEI accepted the challenge
  if (acceptanceStatus === "ACCEPTED") {
    if (
      [
        "active",
        "in_project",
        "in_progress",
        "pilot",
        "completed",
      ].includes(rawStatus)
    ) {
      return rawStatus;
    }

    return "accepted";
  }

  // HEI has not responded yet
  if (acceptanceStatus === "PENDING") {
    if (rawStatus === "matched") {
      return "matched";
    }

    return rawStatus || "pending";
  }

  // Fallback for older / differently shaped records
  return rawStatus || "assigned";
};

const getChallengeTitle = (challenge) => {
  return (
    challenge?.title ||
    challenge?.problemStatement ||
    challenge?.problem_statement ||
    challenge?.name ||
    "Untitled Challenge"
  );
};

const getChallengeDescription = (challenge) => {
  return (
    challenge?.description ||
    challenge?.problemStatement ||
    challenge?.problem_statement ||
    "No description available."
  );
};

const getDomain = (challenge) => {
  return (
    challenge?.domain ||
    challenge?.category ||
    challenge?.aiAnalysis?.domain ||
    challenge?.ai_analysis?.domain ||
    "General"
  );
};

const getPriority = (challenge) => {
  return String(
    challenge?.priority ||
      challenge?.aiPriority ||
      challenge?.ai_priority ||
      challenge?.aiAnalysis?.priority ||
      challenge?.ai_analysis?.priority ||
      "Normal"
  );
};

const getLocation = (challenge) => {
  const location =
    challenge?.location ||
    challenge?.locationName ||
    challenge?.city;

  if (!location) {
    return "Location not specified";
  }

  if (
    typeof location === "object" &&
    location.type === "Point" &&
    Array.isArray(location.coordinates)
  ) {
    return `Coordinates: ${location.coordinates.join(", ")}`;
  }

  if (typeof location === "object") {
    return (
      location.name ||
      location.address ||
      location.city ||
      "Location available"
    );
  }

  return String(location);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Date not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "accepted",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "accepted",
  },

  active: {
    label: "Active",
    icon: Activity,
    className: "active",
  },

  in_project: {
    label: "In Project",
    icon: BriefcaseBusiness,
    className: "active",
  },

  in_progress: {
    label: "In Progress",
    icon: Activity,
    className: "active",
  },

  pilot: {
    label: "Pilot",
    icon: Activity,
    className: "active",
  },

  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "completed",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "rejected",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className: "pending",
  },

  pending_review: {
    label: "Pending Review",
    icon: Clock3,
    className: "pending",
  },

  under_review: {
    label: "Under Review",
    icon: Clock3,
    className: "pending",
  },

  assigned: {
    label: "Assigned",
    icon: CircleDot,
    className: "assigned",
  },

  matched: {
    label: "Matched",
    icon: CircleDot,
    className: "assigned",
  },
};

const getStatusInfo = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return (
    statusConfig[normalized] || {
      label: status
        ? String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        : "Assigned",
      icon: CircleDot,
      className: "assigned",
    }
  );
};

/* =========================================================
   HEI DASHBOARD
========================================================= */

export default function HEIDashboard() {
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* =========================================================
     FETCH CHALLENGES
  ========================================================= */

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          console.error("User not found in localStorage");
          setChallenges([]);
          return;
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch (parseError) {
          console.error(
            "Invalid user data in localStorage:",
            parseError
          );

          setChallenges([]);
          return;
        }

        /*
          Your backend's /api/hei/assigned endpoint depends on
          req.user.heiId.

          Since the current authentication setup does not
          reliably put heiId inside the JWT, we are deliberately
          using the already-existing /api/challenges endpoint
          and filtering on the frontend.

          NO BACKEND CHANGE REQUIRED.
        */
        const heiId =
          user?.heiId ||
          user?.hei?._id ||
          user?.hei?.id ||
          user?.institutionId;

        if (!heiId) {
          console.error(
            "HEI ID not found in logged-in user"
          );

          setChallenges([]);
          return;
        }

        const response = await api.get("/challenges");

        if (!response.data?.success) {
          console.error(
            "Failed to fetch challenges:",
            response.data?.message
          );

          setChallenges([]);
          return;
        }

        const allChallenges =
          response.data?.challenges || [];

        /*
          assignedHEI can be:
            - Object populated by MongoDB
            - Object with _id
            - Object with id
            - Direct ObjectId/string
        */
        const assignedChallenges =
          allChallenges.filter((challenge) => {
            const assignedHeiId =
              challenge?.assignedHEI?._id ||
              challenge?.assignedHEI?.id ||
              challenge?.assignedHEI;

            if (!assignedHeiId) {
              return false;
            }

            return (
              assignedHeiId.toString() ===
              heiId.toString()
            );
          });

        setChallenges(assignedChallenges);
      } catch (error) {
        console.error(
          "Failed to fetch HEI challenges:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [navigate]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredChallenges = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return challenges;
    }

    return challenges.filter((challenge) => {
      const title = getChallengeTitle(challenge)
        .toLowerCase();

      const domain = getDomain(challenge)
        .toLowerCase();

      const location = getLocation(challenge)
        .toLowerCase();

      const description = getChallengeDescription(
        challenge
      ).toLowerCase();

      const priority = getPriority(challenge)
        .toLowerCase();

      return (
        title.includes(query) ||
        domain.includes(query) ||
        location.includes(query) ||
        description.includes(query) ||
        priority.includes(query)
      );
    });
  }, [challenges, search]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    let accepted = 0;
    let rejected = 0;
    let pending = 0;
    let active = 0;

    challenges.forEach((challenge) => {
      const acceptanceStatus =
        getAcceptanceStatus(challenge);

      const rawStatus =
        getRawChallengeStatus(challenge);

      /*
        ACCEPTED is determined from heiAcceptance,
        NOT challenge.status.
      */
      if (acceptanceStatus === "ACCEPTED") {
        accepted++;
      }

      /*
        REJECTED is determined from heiAcceptance.
        Backend intentionally keeps challenge.status
        as MATCHED after rejection.
      */
      if (acceptanceStatus === "REJECTED") {
        rejected++;
      }

      /*
        Pending means HEI has not responded yet.
      */
      if (
        acceptanceStatus === "PENDING" ||
        (
          !acceptanceStatus &&
          [
            "pending",
            "pending_review",
            "assigned",
            "matched",
            "under_review",
          ].includes(rawStatus)
        )
      ) {
        pending++;
      }

      /*
        Active Projects:
        Do NOT count COMPLETED here because it is no longer
        an active project.
      */
      if (
        [
          "active",
          "in_project",
          "in_progress",
          "pilot",
        ].includes(rawStatus)
      ) {
        active++;
      }
    });

    return {
      assigned: challenges.length,
      pending,
      accepted,
      rejected,
      active,
    };
  }, [challenges]);

  /* =========================================================
     DOMAIN DATA
  ========================================================= */

  const domainData = useMemo(() => {
    const counts = {};

    challenges.forEach((challenge) => {
      const domain = getDomain(challenge);

      counts[domain] =
        (counts[domain] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [challenges]);

  /* =========================================================
     RECENT CHALLENGES
  ========================================================= */

  const recentChallenges = useMemo(() => {
    return [...filteredChallenges]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt ||
            a?.created_at ||
            a?.assignedAt ||
            a?.assigned_at ||
            0
        ).getTime();

        const dateB = new Date(
          b?.createdAt ||
            b?.created_at ||
            b?.assignedAt ||
            b?.assigned_at ||
            0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [filteredChallenges]);

  /* =========================================================
     PROFILE
  ========================================================= */

  const profileUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const userName =
    profileUser?.name ||
    profileUser?.fullName ||
    profileUser?.username ||
    "HEI Admin";

  const institutionName =
    profileUser?.hei?.name ||
    profileUser?.institutionName ||
    profileUser?.institution?.name ||
    "Higher Education Institution";

  /* =========================================================
     STAT CARD
  ========================================================= */

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    type,
  }) => (
    <div className="hei-stat-card">
      <div className={`hei-stat-icon ${type}`}>
        <Icon size={21} strokeWidth={2.2} />
      </div>

      <div className="hei-stat-content">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>
      </div>

      <ArrowUpRight
        size={17}
        className="hei-stat-arrow"
      />
    </div>
  );

  return (
    <div
      className="hei-page"
      style={{
        backgroundImage: `linear-gradient(
          135deg,
          rgba(5, 15, 27, 0.76),
          rgba(9, 24, 40, 0.82)
        ), url(${monsoon})`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .hei-page {
          min-height: 100vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          color: #f8fafc;
          font-family: "Manrope", Arial, sans-serif;
          overflow-x: hidden;
        }

        /* ================= SIDEBAR ================= */

        .hei-sidebar {
          width: 286px;
          min-height: 100vh;
          height: auto;
          align-self: stretch;
          flex-shrink: 0;
          padding: 18px 14px 16px;
          background: rgba(5, 23, 45, 0.88);
          border-right: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
        }

        .hei-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: white;
          padding: 4px 10px 27px;
        }

        .hei-brand-mark {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: linear-gradient(135deg, #55a8ff, #7c6df2);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 22px rgba(65, 137, 255, 0.28);
          flex-shrink: 0;
        }

        .hei-brand-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -.7px;
        }

        .hei-brand-text span {
          color: #72b7ff;
        }

        .hei-sidebar-label {
          color: rgba(255,255,255,0.43);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 0 13px 11px;
          text-transform: uppercase;
        }

        .hei-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .hei-nav-link {
          display: flex;
          align-items: center;
          gap: 13px;
          min-height: 43px;
          padding: 11px 13px;
          color: rgba(255,255,255,0.67);
          text-decoration: none;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 700;
          transition: 0.2s ease;
          border: 1px solid transparent;
        }

        .hei-nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.07);
        }

        .hei-nav-link.active {
          color: white;
          background: linear-gradient(
            90deg,
            rgba(72, 139, 237, 0.30),
            rgba(72, 139, 237, 0.12)
          );
          border-color: rgba(109, 172, 255, 0.20);
          box-shadow: inset 3px 0 0 #63adff;
        }

        .hei-nav-link.active svg {
          color: #74baff;
        }

        .hei-nav-link svg {
          flex-shrink: 0;
        }

        .hei-nav-badge {
          margin-left: auto;
          min-width: 18px;
          height: 18px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ff5f73;
          color: white;
          font-size: 9px;
          font-weight: 800;
        }

        .hei-sidebar-bottom {
          margin-top: auto;
          padding-top: 18px;
        }

        .hei-mini-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(255,255,255,.065);
          border: 1px solid rgba(255,255,255,.09);
        }

        .hei-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #91d1ff, #7169ef);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          flex-shrink: 0;
        }

        .hei-mini-profile-text {
          min-width: 0;
        }

        .hei-mini-profile-text strong {
          color: white;
          font-size: 12px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hei-mini-profile-text span {
          color: rgba(255,255,255,0.48);
          font-size: 9.5px;
        }

        /* ================= MAIN ================= */

        .hei-main {
          flex: 1;
          min-width: 0;
          padding: 27px 40px 60px;
          background: transparent;
        }

        /* ================= HEADER ================= */

        .hei-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 25px;
        }

        .hei-header-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .hei-mobile-menu {
          display: none;
        }

        .hei-page-title h1 {
          margin: 0;
          font-size: 39px;
          line-height: 1.08;
          color: #f8fafc;
          letter-spacing: -1.45px;
          font-weight: 800;
        }

        .hei-page-title p {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.55;
          color: rgba(255,255,255,.68);
        }

        .hei-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hei-search {
          width: 330px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 15px;
          border-radius: 14px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.13);
          backdrop-filter: blur(14px);
        }

        .hei-search svg {
          color: rgba(255,255,255,.5);
          flex-shrink: 0;
        }

        .hei-search input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 12px;
          color: #f8fafc;
          background: transparent;
        }

        .hei-search input::placeholder {
          color: rgba(255,255,255,.45);
        }

        .hei-header-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.13);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,.65);
          position: relative;
          cursor: pointer;
        }

        .hei-notification-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef586d;
          position: absolute;
          top: 8px;
          right: 8px;
          border: 1.5px solid white;
        }

        .hei-header-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, #84c9ff, #8177ec);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          border: 2px solid white;
          box-shadow: 0 3px 10px rgba(48, 86, 132, 0.15);
        }

        /* ================= WELCOME ================= */

        .hei-welcome {
          min-height: 126px;
          margin-bottom: 20px;
          padding: 27px 30px;
          border-radius: 20px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.12),
              rgba(255,255,255,.055)
            );
          border: 1px solid rgba(255,255,255,.13);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .hei-welcome::after {
          content: "";
          width: 270px;
          height: 270px;
          border-radius: 50%;
          position: absolute;
          right: -85px;
          top: -145px;
          border: 38px solid rgba(255,255,255,.055);
        }

        .hei-welcome h2 {
          margin: 0 0 7px;
          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -.7px;
        }

        .hei-welcome p {
          margin: 0;
          color: rgba(255,255,255,.68);
          font-size: 13px;
        }

        .hei-welcome-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.14);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 12px;
          position: relative;
          z-index: 1;
        }

        /* ================= STATS ================= */

        .hei-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 18px;
        }

        .hei-stat-card {
          min-height: 112px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.115),
              rgba(255,255,255,.052)
            );
          border: 1px solid rgba(255,255,255,.13);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-radius: 18px;
          padding: 18px 19px;
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          position: relative;
          box-shadow: 0 22px 58px rgba(0,0,0,.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hei-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 65px rgba(0,0,0,.22);
        }

        .hei-stat-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hei-stat-icon.blue {
          color: #397dd0;
          background: #e8f3ff;
        }

        .hei-stat-icon.yellow {
          color: #ca8b24;
          background: #fff4db;
        }

        .hei-stat-icon.green {
          color: #29996b;
          background: #e4f8ee;
        }

        .hei-stat-icon.red {
          color: #dc6171;
          background: #ffeaee;
        }

        .hei-stat-icon.purple {
          color: #7965c9;
          background: #f0ebff;
        }

        .hei-stat-content {
          min-width: 0;
        }

        .hei-stat-content span {
          display: block;
          font-size: 11.5px;
          color: rgba(255,255,255,.66);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .hei-stat-content strong {
          display: block;
          color: #f8fafc;
          font-size: 28px;
          line-height: 1.05;
        }

        .hei-stat-content small {
          display: block;
          color: rgba(255,255,255,.52);
          font-size: 9.5px;
          margin-top: 5px;
        }

        .hei-stat-arrow {
          position: absolute;
          top: 17px;
          right: 16px;
          color: rgba(255,255,255,.68);
        }

        /* ================= COMMON CARD ================= */

        .hei-grid-card {
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.115),
              rgba(255,255,255,.052)
            );
          border: 1px solid rgba(255,255,255,.13);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-radius: 19px;
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
          overflow: hidden;
        }

        .hei-card-header {
          min-height: 78px;
          padding: 17px 21px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }

        .hei-card-title {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .hei-card-title-icon {
          width: 37px;
          height: 37px;
          border-radius: 10px;
          background: rgba(239,247,255,.96);
          color: #3c82cf;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hei-card-title h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 17px;
          line-height: 1.15;
          letter-spacing: -.25px;
        }

        .hei-card-title p {
          margin: 4px 0 0;
          font-size: 10.5px;
          color: rgba(255,255,255,.57);
        }

        .hei-view-all {
          display: flex;
          align-items: center;
          gap: 3px;
          text-decoration: none;
          color: #58a9e8;
          font-size: 10.5px;
          font-weight: 800;
        }

        /* ================= SECOND ROW ================= */

        .hei-second-grid {
          display: grid;
          grid-template-columns: 1.45fr 0.9fr 0.9fr;
          gap: 17px;
          margin-bottom: 18px;
        }

        .hei-challenge-list {
          min-height: 265px;
          padding: 5px 21px 13px;
        }

        .hei-challenge-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 16px 3px;
          border-bottom: 1px solid rgba(255,255,255,.09);
        }

        .hei-challenge-item:last-child {
          border-bottom: none;
        }

        .hei-challenge-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #edf6ff;
          color: #4389d0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hei-challenge-info {
          flex: 1;
          min-width: 0;
        }

        .hei-challenge-info strong {
          display: block;
          color: #f1f5f9;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hei-challenge-info span {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,.52);
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hei-status {
          padding: 7px 10px;
          border-radius: 9px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hei-status.accepted,
        .hei-status.completed {
          background: #e5f8ee;
          color: #269365;
        }

        .hei-status.active {
          background: #e7f1ff;
          color: #3c7bc2;
        }

        .hei-status.rejected {
          background: #ffebee;
          color: #d75d6d;
        }

        .hei-status.pending {
          background: #fff4dc;
          color: #bf8327;
        }

        .hei-status.assigned {
          background: #eeeaff;
          color: #7460c1;
        }

        /* Proposal Status */

        .hei-proposal-body {
          min-height: 265px;
          padding: 22px;
        }

        .hei-donut-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 17px;
          min-height: 175px;
        }

        .hei-donut {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          background: conic-gradient(
            #55c993 0 28%,
            #68a8e8 28% 63%,
            #f2b958 63% 82%,
            #df7081 82% 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hei-donut-inner {
          width: 89px;
          height: 89px;
          border-radius: 50%;
          background: rgba(255,255,255,.075);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hei-donut-inner strong {
          font-size: 24px;
          color: #f8fafc;
        }

        .hei-donut-inner span {
          font-size: 10px;
          color: rgba(255,255,255,.5);
        }

        .hei-legend {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .hei-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          color: rgba(255,255,255,.62);
        }

        .hei-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Upcoming */

        .hei-deadlines {
          min-height: 265px;
          padding: 10px 20px 15px;
        }

        .hei-deadline {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 2px;
          border-bottom: 1px solid rgba(255,255,255,.09);
        }

        .hei-deadline:last-child {
          border-bottom: none;
        }

        .hei-date-box {
          width: 43px;
          height: 46px;
          border-radius: 10px;
          background: #edf6ff;
          color: #397ec7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hei-date-box strong {
          font-size: 13px;
          line-height: 1;
        }

        .hei-date-box span {
          font-size: 8px;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .hei-deadline-text {
          min-width: 0;
        }

        .hei-deadline-text strong {
          display: block;
          font-size: 11.5px;
          color: #f5f7fa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hei-deadline-text span {
          display: block;
          color: rgba(255,255,255,.56);
          font-size: 9px;
          margin-top: 4px;
        }

        /* ================= THIRD ROW ================= */

        .hei-third-grid {
          display: grid;
          grid-template-columns: 1.05fr 1.05fr 0.9fr;
          gap: 17px;
          margin-bottom: 18px;
        }

        /* Pipeline */

        .hei-pipeline {
          min-height: 225px;
          padding: 23px 22px 20px;
        }

        .hei-pipeline-track {
          display: flex;
          align-items: center;
          margin: 20px 0 20px;
        }

        .hei-pipeline-node {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf4ff;
          color: #4387cc;
          border: 2px solid #d4e8fb;
          flex-shrink: 0;
        }

        .hei-pipeline-node.done {
          background: #e5f8ee;
          border-color: #c7ecd9;
          color: #269364;
        }

        .hei-pipeline-line {
          height: 2px;
          flex: 1;
          background: rgba(255,255,255,.18);
        }

        .hei-pipeline-labels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .hei-pipeline-label {
          text-align: center;
          font-size: 10.5px;
          color: rgba(255,255,255,.58);
          font-weight: 700;
        }

        .hei-pipeline-number {
          display: block;
          color: #f8fafc;
          font-size: 21px;
          margin-bottom: 5px;
        }

        /* Domain */

        .hei-domain-body {
          min-height: 225px;
          padding: 22px 22px 23px;
        }

        .hei-domain-row {
          margin-bottom: 17px;
        }

        .hei-domain-row:last-child {
          margin-bottom: 0;
        }

        .hei-domain-top {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: rgba(255,255,255,.72);
          margin-bottom: 7px;
        }

        .hei-domain-top strong {
          color: #f1f5f9;
        }

        .hei-progress {
          height: 7px;
          background: rgba(255,255,255,.10);
          border-radius: 20px;
          overflow: hidden;
        }

        .hei-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #5ca9e9, #6e7ee5);
        }

        /* Quick Actions */

        .hei-actions {
          min-height: 225px;
          padding: 18px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .hei-action {
          min-height: 96px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.11);
          background: rgba(255,255,255,.075);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 14px;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .hei-action:hover {
          background: rgba(255,255,255,.13);
          border-color: rgba(255,255,255,.2);
          transform: translateY(-1px);
        }

        .hei-action-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #e9f4ff;
          color: #4386cc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 9px;
        }

        .hei-action strong {
          font-size: 11.5px;
          color: #f1f5f9;
        }

        .hei-action span {
          font-size: 9px;
          color: rgba(255,255,255,.52);
          margin-top: 4px;
        }

        /* ================= BOTTOM ================= */

        .hei-bottom-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.9fr;
          gap: 17px;
        }

        .hei-insight,
        .hei-participation {
          min-height: 170px;
        }

        .hei-insight {
          padding: 22px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .hei-insight-icon {
          width: 46px;
          height: 46px;
          border-radius: 11px;
          background: linear-gradient(135deg, #eeeaff, #e6f4ff);
          color: #7266c8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hei-insight h4 {
          margin: 0 0 8px;
          font-size: 15px;
          color: #f1f5f9;
        }

        .hei-insight p {
          margin: 0;
          color: rgba(255,255,255,.65);
          font-size: 11.5px;
          line-height: 1.65;
        }

        .hei-participation {
          padding: 18px 22px;
        }

        .hei-participation-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.09);
        }

        .hei-participation-stat:last-child {
          border-bottom: none;
        }

        .hei-participation-stat span {
          color: rgba(255,255,255,.62);
          font-size: 11px;
        }

        .hei-participation-stat strong {
          color: #f8fafc;
          font-size: 15px;
        }

        .hei-empty {
          padding: 34px 12px;
          text-align: center;
          color: rgba(255,255,255,.5);
          font-size: 11px;
        }

        /* ================= RESPONSIVE ================= */

        @media (min-width: 1500px) {
          .hei-main {
            padding-left: 40px;
            padding-right: 40px;
          }
        }

        @media (max-width: 1250px) {
          .hei-sidebar {
            width: 250px;
          }

          .hei-main {
            padding: 25px 27px 50px;
          }

          .hei-page-title h1 {
            font-size: 34px;
          }

          .hei-search {
            width: 270px;
          }
        }

        @media (max-width: 1200px) {
          .hei-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .hei-second-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }

          .hei-second-grid > :last-child {
            grid-column: 1 / -1;
          }

          .hei-third-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hei-third-grid > :last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 1000px) {
          .hei-sidebar {
            width: 78px;
            padding-left: 9px;
            padding-right: 9px;
          }

          .hei-brand-text,
          .hei-sidebar-label,
          .hei-nav-link span,
          .hei-mini-profile-text {
            display: none;
          }

          .hei-brand {
            justify-content: center;
            padding-left: 0;
            padding-right: 0;
          }

          .hei-nav-link {
            justify-content: center;
            padding: 12px;
          }

          .hei-nav-badge {
            position: absolute;
            margin: -20px -18px 0 0;
          }

          .hei-mini-profile {
            justify-content: center;
          }

          .hei-main {
            padding: 23px 20px 40px;
          }

          .hei-page-title h1 {
            font-size: 30px;
          }

          .hei-search {
            width: 210px;
          }
        }

        @media (max-width: 900px) {
          .hei-second-grid {
            grid-template-columns: 1fr;
          }

          .hei-second-grid > :last-child {
            grid-column: auto;
          }

          .hei-third-grid {
            grid-template-columns: 1fr;
          }

          .hei-third-grid > :last-child {
            grid-column: auto;
          }

          .hei-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .hei-page {
            display: block;
            background-attachment: scroll;
          }

          .hei-sidebar {
            display: none;
          }

          .hei-main {
            padding: 18px 15px 35px;
          }

          .hei-header {
            align-items: flex-start;
          }

          .hei-page-title h1 {
            font-size: 27px;
          }

          .hei-page-title p {
            font-size: 11px;
          }

          .hei-mobile-menu {
            display: flex;
            width: 38px;
            height: 38px;
            border: 1px solid rgba(255,255,255,.12);
            background: rgba(255,255,255,.075);
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            color: #dbeafe;
            cursor: pointer;
          }

          .hei-header-right .hei-search {
            display: none;
          }

          .hei-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hei-welcome {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .hei-welcome h2 {
            font-size: 22px;
          }
        }

        @media (max-width: 450px) {
          .hei-page-title h1 {
            font-size: 23px;
          }

          .hei-stats-grid {
            grid-template-columns: 1fr;
          }

          .hei-welcome h2 {
            font-size: 22px;
          }

          .hei-card-title h3 {
            font-size: 15px;
          }
        }
      `}</style>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hei-sidebar">
        <div className="hei-brand">
          <div className="hei-brand-mark">
            <Building2 size={21} />
          </div>

          <div className="hei-brand-text">
            Resolve<span>X</span>
          </div>
        </div>

        <div className="hei-sidebar-label">
          HEI Workspace
        </div>

        <nav className="hei-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/hei"}
                className={({ isActive }) =>
                  `hei-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} />

                <span>{item.label}</span>

                {item.label === "Notifications" && (
                  <span className="hei-nav-badge">
                    3
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="hei-sidebar-bottom">
          <div className="hei-mini-profile">
            <div className="hei-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="hei-mini-profile-text">
              <strong>{userName}</strong>

              <span>
                HEI Administrator
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="hei-main">

        {/* HEADER */}

        <header className="hei-header">
          <div className="hei-header-left">
            <button
              className="hei-mobile-menu"
              type="button"
            >
              <Menu size={19} />
            </button>

            <div className="hei-page-title">
              <h1>
                HEI Admin Dashboard
              </h1>

              <p>
                Manage challenges, members, teams and
                institutional participation.
              </p>
            </div>
          </div>

          <div className="hei-header-right">
            <div className="hei-search">
              <Search size={15} />

              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="hei-header-icon"
              type="button"
            >
              <Settings size={16} />
            </button>

            <button
              className="hei-header-icon"
              type="button"
              onClick={() =>
                navigate("/notifications")
              }
            >
              <Bell size={17} />

              <span className="hei-notification-dot" />
            </button>

            <div className="hei-header-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* =====================================================
            WELCOME
        ===================================================== */}

        <section className="hei-welcome">
          <div>
            <h2>
              Welcome,{" "}
              {userName.split(" ")[0]} 👋
            </h2>

            <p>
              Here's what's happening with your
              institution's ResolveX participation.
            </p>
          </div>

          <div className="hei-welcome-chip">
            <Building2 size={14} />

            {institutionName}
          </div>
        </section>

        {/* =====================================================
            FIRST ROW - STATISTICS
        ===================================================== */}

        <section className="hei-stats-grid">

          <StatCard
            icon={ClipboardList}
            title="Assigned Challenges"
            value={stats.assigned}
            subtitle="Challenges assigned"
            type="blue"
          />

          <StatCard
            icon={Clock3}
            title="Pending Acceptance"
            value={stats.pending}
            subtitle="Awaiting action"
            type="yellow"
          />

          <StatCard
            icon={CheckCircle2}
            title="Accepted"
            value={stats.accepted}
            subtitle="Challenges accepted"
            type="green"
          />

          <StatCard
            icon={XCircle}
            title="Rejected"
            value={stats.rejected}
            subtitle="Challenges rejected"
            type="red"
          />

          <StatCard
            icon={BriefcaseBusiness}
            title="Active Projects"
            value={stats.active}
            subtitle="Projects in progress"
            type="purple"
          />

        </section>

        {/* =====================================================
            SECOND ROW
        ===================================================== */}

        <section className="hei-second-grid">

          {/* RECENT CHALLENGES */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <ClipboardList size={15} />
                </div>

                <div>
                  <h3>
                    Recent Challenges
                  </h3>

                  <p>
                    Latest opportunities assigned
                    to your HEI
                  </p>
                </div>
              </div>

              <NavLink
                to="/hei/challenges"
                className="hei-view-all"
              >
                View all

                <ChevronRight size={12} />
              </NavLink>
            </div>

            <div className="hei-challenge-list">

              {loading ? (
                <div className="hei-empty">
                  Loading challenges...
                </div>
              ) : recentChallenges.length === 0 ? (
                <div className="hei-empty">
                  No challenges available.
                </div>
              ) : (
                recentChallenges.map(
                  (challenge, index) => {
                    const status =
                      getStatusInfo(
                        getChallengeStatus(
                          challenge
                        )
                      );

                    const StatusIcon =
                      status.icon;

                    return (
                      <div
                        className="hei-challenge-item"
                        key={
                          challenge?._id ||
                          challenge?.id ||
                          index
                        }
                      >
                        <div className="hei-challenge-icon">
                          <Target size={15} />
                        </div>

                        <div className="hei-challenge-info">
                          <strong>
                            {getChallengeTitle(
                              challenge
                            )}
                          </strong>

                          <span>
                            {getDomain(
                              challenge
                            )}{" "}
                            •{" "}
                            {getLocation(
                              challenge
                            )}
                          </span>
                        </div>

                        <div
                          className={`hei-status ${status.className}`}
                        >
                          <StatusIcon
                            size={8}
                            style={{
                              marginRight: 3,
                              verticalAlign:
                                "middle",
                            }}
                          />

                          {status.label}
                        </div>
                      </div>
                    );
                  }
                )
              )}

            </div>
          </div>

          {/* =================================================
              PROPOSAL STATUS
          ================================================= */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <FileText size={15} />
                </div>

                <div>
                  <h3>
                    Proposal Status
                  </h3>

                  <p>
                    Institution proposal overview
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-proposal-body">
              <div className="hei-donut-wrapper">

                <div className="hei-donut">
                  <div className="hei-donut-inner">
                    <strong>—</strong>

                    <span>
                      Proposals
                    </span>
                  </div>
                </div>

                <div className="hei-legend">

                  <div className="hei-legend-item">
                    <span
                      className="hei-legend-dot"
                      style={{
                        background:
                          "#55c993",
                      }}
                    />

                    Approved
                  </div>

                  <div className="hei-legend-item">
                    <span
                      className="hei-legend-dot"
                      style={{
                        background:
                          "#68a8e8",
                      }}
                    />

                    Submitted
                  </div>

                  <div className="hei-legend-item">
                    <span
                      className="hei-legend-dot"
                      style={{
                        background:
                          "#f2b958",
                      }}
                    />

                    Revision
                  </div>

                  <div className="hei-legend-item">
                    <span
                      className="hei-legend-dot"
                      style={{
                        background:
                          "#df7081",
                      }}
                    />

                    Rejected
                  </div>

                </div>
              </div>

              <div className="hei-empty">
                Proposal data will appear when
                proposal APIs are available.
              </div>
            </div>
          </div>

          {/* =================================================
              UPCOMING DEADLINES
          ================================================= */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <Clock3 size={15} />
                </div>

                <div>
                  <h3>
                    Upcoming Deadlines
                  </h3>

                  <p>
                    Important project milestones
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-deadlines">

              <div className="hei-deadline">
                <div className="hei-date-box">
                  <strong>--</strong>
                  <span>date</span>
                </div>

                <div className="hei-deadline-text">
                  <strong>
                    Challenge milestones
                  </strong>

                  <span>
                    Deadline information unavailable
                  </span>
                </div>
              </div>

              <div className="hei-deadline">
                <div className="hei-date-box">
                  <strong>--</strong>
                  <span>date</span>
                </div>

                <div className="hei-deadline-text">
                  <strong>
                    Proposal submission
                  </strong>

                  <span>
                    Deadline information unavailable
                  </span>
                </div>
              </div>

              <div className="hei-deadline">
                <div className="hei-date-box">
                  <strong>--</strong>
                  <span>date</span>
                </div>

                <div className="hei-deadline-text">
                  <strong>
                    Project review
                  </strong>

                  <span>
                    Deadline information unavailable
                  </span>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* =====================================================
            THIRD ROW
        ===================================================== */}

        <section className="hei-third-grid">

          {/* CHALLENGE PIPELINE */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <Activity size={15} />
                </div>

                <div>
                  <h3>
                    Challenge Pipeline
                  </h3>

                  <p>
                    Institutional participation
                    journey
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-pipeline">

              <div className="hei-pipeline-track">

                <div className="hei-pipeline-node done">
                  <ClipboardList size={14} />
                </div>

                <div className="hei-pipeline-line" />

                <div
                  className={`hei-pipeline-node ${
                    stats.accepted > 0
                      ? "done"
                      : ""
                  }`}
                >
                  <CheckCircle2 size={14} />
                </div>

                <div className="hei-pipeline-line" />

                <div className="hei-pipeline-node">
                  <UsersRound size={14} />
                </div>

                <div className="hei-pipeline-line" />

                <div className="hei-pipeline-node">
                  <FileText size={14} />
                </div>

              </div>

              <div className="hei-pipeline-labels">

                <div className="hei-pipeline-label">
                  <span className="hei-pipeline-number">
                    {stats.assigned}
                  </span>

                  Assigned
                </div>

                <div className="hei-pipeline-label">
                  <span className="hei-pipeline-number">
                    {stats.accepted}
                  </span>

                  Accepted
                </div>

                <div className="hei-pipeline-label">
                  <span className="hei-pipeline-number">
                    —
                  </span>

                  Teams
                </div>

                <div className="hei-pipeline-label">
                  <span className="hei-pipeline-number">
                    —
                  </span>

                  Proposals
                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              DOMAINS
          ================================================= */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <Target size={15} />
                </div>

                <div>
                  <h3>
                    Challenge Domains
                  </h3>

                  <p>
                    Distribution of assigned
                    challenges
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-domain-body">

              {domainData.length === 0 ? (
                <div className="hei-empty">
                  No domain data available.
                </div>
              ) : (
                domainData.map(
                  ([domain, count]) => {
                    const percentage =
                      challenges.length > 0
                        ? Math.max(
                            8,
                            Math.round(
                              (count /
                                challenges.length) *
                                100
                            )
                          )
                        : 0;

                    return (
                      <div
                        className="hei-domain-row"
                        key={domain}
                      >
                        <div className="hei-domain-top">
                          <span>
                            {domain}
                          </span>

                          <strong>
                            {count}
                          </strong>
                        </div>

                        <div className="hei-progress">
                          <div
                            className="hei-progress-fill"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}

            </div>
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <Sparkles size={15} />
                </div>

                <div>
                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Frequently used workspace
                    tools
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-actions">

              <NavLink
                to="/hei/challenges"
                className="hei-action"
              >
                <div className="hei-action-icon">
                  <ClipboardList size={14} />
                </div>

                <strong>
                  Review Challenges
                </strong>

                <span>
                  View assignments
                </span>
              </NavLink>

              <NavLink
                to="/hei/members"
                className="hei-action"
              >
                <div className="hei-action-icon">
                  <Users size={14} />
                </div>

                <strong>
                  Manage Members
                </strong>

                <span>
                  Faculty & students
                </span>
              </NavLink>

              <NavLink
                to="/hei/teams"
                className="hei-action"
              >
                <div className="hei-action-icon">
                  <UsersRound size={14} />
                </div>

                <strong>
                  Create Team
                </strong>

                <span>
                  Build project team
                </span>
              </NavLink>

              <NavLink
                to="/hei/proposals"
                className="hei-action"
              >
                <div className="hei-action-icon">
                  <Plus size={14} />
                </div>

                <strong>
                  New Proposal
                </strong>

                <span>
                  Start a proposal
                </span>
              </NavLink>

            </div>
          </div>

        </section>

        {/* =====================================================
            BOTTOM ROW
        ===================================================== */}

        <section className="hei-bottom-grid">

          {/* HEI INSIGHT */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <Sparkles size={15} />
                </div>

                <div>
                  <h3>
                    HEI Participation Insight
                  </h3>

                  <p>
                    Dashboard activity summary
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-insight">

              <div className="hei-insight-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <h4>
                  Keep your institutional
                  pipeline moving
                </h4>

                <p>
                  Your dashboard currently
                  tracks{" "}
                  <strong>
                    {stats.assigned}
                  </strong>{" "}
                  assigned challenge
                  {stats.assigned !== 1
                    ? "s"
                    : ""}.
                  Review pending assignments
                  and move accepted challenges
                  toward team formation.
                </p>
              </div>

            </div>
          </div>

          {/* PARTICIPATION */}

          <div className="hei-grid-card">
            <div className="hei-card-header">
              <div className="hei-card-title">
                <div className="hei-card-title-icon">
                  <UsersRound size={15} />
                </div>

                <div>
                  <h3>
                    Participation Snapshot
                  </h3>

                  <p>
                    Current HEI activity
                  </p>
                </div>
              </div>
            </div>

            <div className="hei-participation">

              <div className="hei-participation-stat">
                <span>
                  Assigned
                </span>

                <strong>
                  {stats.assigned}
                </strong>
              </div>

              <div className="hei-participation-stat">
                <span>
                  Accepted
                </span>

                <strong>
                  {stats.accepted}
                </strong>
              </div>

              <div className="hei-participation-stat">
                <span>
                  Pending
                </span>

                <strong>
                  {stats.pending}
                </strong>
              </div>

              <div className="hei-participation-stat">
                <span>
                  Active
                </span>

                <strong>
                  {stats.active}
                </strong>
              </div>

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}