import { Router } from "express";
const faceRouter = Router();
import { uploadImagesOnAWS, verifyFaces } from "../controllers/faceRecognition.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createExcelReport } from "../utils/excelReport.js";
faceRouter.route('/verifyFaces').post(
    upload.fields([
        {
            name: "image1",
            maxCount: 1
        }
    ]),
    verifyFaces
)
faceRouter.route('/uploadImagesOnAWS').post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    uploadImagesOnAWS
)
// faceRouter.route('/createExcelReport').get(
//     createExcelReport
// );

export { faceRouter };