import { Request } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { RequestHandler } from "express";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadFile: RequestHandler = async (req: MulterRequest, res) => {
  try {
    const file = req.file;
    const { name } = req.body;

    if (!file) {
      return sendResponse(res, 400, false, "Please select a file");
    }

    // Save metadata in the database or handle the file as needed
    sendResponse(res, 200, true, "File uploaded successfully", {
      fileName: file.originalname,
      filePath: file.path,
    });
  } catch (error) {
    console.error(`Error in uploading file: ${error}`);
    sendResponse(res, 500, false, "Internal server error");
  }
};
