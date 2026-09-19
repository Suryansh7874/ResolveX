const ProjectDocument = require("../models/ProjectDoc");
const Project = require("../models/Project");
const createNotification = require("../utils/createNotification");


// ==========================================
// UPLOAD / CREATE PROJECT DOCUMENT
// ==========================================

const createProjectDocument = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description = "",
      documentType = "OTHER",
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        success: false,
        message: "projectId and title are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const document = await ProjectDocument.create({
      projectId,
      uploadedBy: req.user.id,
      title,
      description,
      documentType,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
    });

    // Notify faculty mentor
    if (project.facultyMentor) {
      await createNotification({
        userId: project.facultyMentor,
        type: "project_document_uploaded",
        message: `A new document "${title}" was uploaded for project "${project.title}".`,
        projectId: project._id,
      });
    }

    const populatedDocument = await ProjectDocument.findById(
      document._id
    )
      .populate({
        path: "projectId",
        select: "title status",
      })
      .populate({
        path: "uploadedBy",
        select: "name email role",
      });

    return res.status(201).json({
      success: true,
      message: "Project document uploaded successfully",
      document: populatedDocument,
    });
  } catch (error) {
    console.error("Create project document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload project document",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL DOCUMENTS OF A PROJECT
// ==========================================

const getProjectDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const documents = await ProjectDocument.find({
      projectId,
    })
      .populate({
        path: "uploadedBy",
        select: "name email role",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get project documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project documents",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE DOCUMENT
// ==========================================

const getProjectDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await ProjectDocument.findById(documentId)
      .populate({
        path: "projectId",
        select: "title status",
      })
      .populate({
        path: "uploadedBy",
        select: "name email role",
      });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get project document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE DOCUMENT METADATA
// ==========================================

const updateProjectDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const {
      title,
      description,
      documentType,
    } = req.body;

    const document = await ProjectDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (title !== undefined) {
      document.title = title;
    }

    if (description !== undefined) {
      document.description = description;
    }

    if (documentType !== undefined) {
      document.documentType = documentType;
    }

    await document.save();

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error("Update project document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update document",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE DOCUMENT
// ==========================================

const deleteProjectDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await ProjectDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    await ProjectDocument.findByIdAndDelete(documentId);

    return res.status(200).json({
      success: true,
      message: "Project document deleted successfully",
    });
  } catch (error) {
    console.error("Delete project document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
};


module.exports = {
  createProjectDocument,
  getProjectDocuments,
  getProjectDocumentById,
  updateProjectDocument,
  deleteProjectDocument,
};