import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: 'visava_uploads',
      format: 'webp', // auto convert to webp for performance
      public_id: `${Date.now()}-${file.originalname.split('.')[0].trim().replace(/\s+/g, '_')}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post("/", (req: Request, res: Response, next) => {
  upload.single("media")(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err.message);
      return res.status(400).json({ error: err.message || "File upload failed" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided. Please upload an image with field name 'media'." });
      }

      // Cloudinary stores the URL in req.file.path
      const fileUrl = req.file.path;
      res.status(201).json({
        status: "ok",
        url: fileUrl,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload Route Error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
});

export default router;
