const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProjectDocument,
  getProjectDocuments,
  getProjectDocumentById,
  updateProjectDocument,
  deleteProjectDocument,
} = require("../controllers/projectdocController");

const upload = require("../middleware/upload");

const router = express.Router();


// ==========================================
// GET DOCUMENTS
// ==========================================

router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectDocuments
);

router.get(
  "/:documentId",
  authMiddleware,
  getProjectDocumentById
);


// ==========================================
// UPLOAD DOCUMENT
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("FACULTY"),
  upload.single("document"),
  createProjectDocument
);


// ==========================================
// UPDATE DOCUMENT
// ==========================================

router.patch(
  "/:documentId",
  authMiddleware,
  roleMiddleware("FACULTY"),
  updateProjectDocument
);


// ==========================================
// DELETE DOCUMENT
// ==========================================

router.delete(
  "/:documentId",
  authMiddleware,
  roleMiddleware("FACULTY"),
  deleteProjectDocument
);


module.exports = router;