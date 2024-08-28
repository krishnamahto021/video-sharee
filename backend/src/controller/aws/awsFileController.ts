import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler } from "express";

// Define a file interface
interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  path?: string; // Optional if you're using cloud storage
  location?: string; // For cloud storage, e.g., S3 URL
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      file?: IFile; // Single file handling
    }
  }
}

// File upload handler
export const uploadFile: RequestHandler = async (req, res) => {
  try {
    const file = req.file;
    const { title } = req.body;
    if (!file) {
      return sendResponse(res, 400, false, "Please select a file");
    }

    // Process or save file metadata
    sendResponse(res, 200, true, "File uploaded successfully", {
      fileName: file.originalname,
      filePath: file.location || file.path, // Use location for cloud storage
    });
  } catch (error) {
    console.error(`Error in uploading file: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
