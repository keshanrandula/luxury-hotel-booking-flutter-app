const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to save buffer to local uploads folder
const saveBufferLocally = (buffer, originalname, mimetype) => {
  let ext = path.extname(originalname || '');
  if (!ext) {
    if (mimetype === 'image/png') ext = '.png';
    else if (mimetype === 'image/webp') ext = '.webp';
    else if (mimetype === 'image/gif') ext = '.gif';
    else ext = '.jpg';
  }
  const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return { filename, filePath };
};

// Helper to get local URL
const getLocalUrl = (req, filename) => {
  const host = req.get('host') || '127.0.0.1:5000';
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}/uploads/${filename}`;
};

// @desc    Upload single or multiple image(s) (Cloudinary + Local Storage fallback)
// @route   POST /api/upload
// @access  Public / Admin
exports.uploadImage = async (req, res, next) => {
  try {
    // 1. If uploaded via multer single (req.file)
    if (req.file) {
      const { filename } = saveBufferLocally(req.file.buffer, req.file.originalname, req.file.mimetype);
      const localUrl = getLocalUrl(req, filename);

      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'luxury_stays_hotels',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        });

        return res.status(200).json({
          success: true,
          url: result.secure_url || localUrl,
          localUrl,
          public_id: result.public_id,
          format: result.format,
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload skipped/failed, using local storage:', cloudErr.message);
        return res.status(200).json({
          success: true,
          url: localUrl,
          localUrl,
          filename,
        });
      }
    }

    // 2. If uploaded via multer multiple (req.files)
    if (req.files && req.files.length > 0) {
      const localUrls = [];
      const filesInfo = [];

      for (const file of req.files) {
        const { filename } = saveBufferLocally(file.buffer, file.originalname, file.mimetype);
        const url = getLocalUrl(req, filename);
        localUrls.push(url);
        filesInfo.push({ file, filename, url });
      }

      try {
        const uploadPromises = req.files.map((file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          return cloudinary.uploader.upload(dataURI, {
            folder: 'luxury_stays_hotels',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          });
        });

        const results = await Promise.all(uploadPromises);
        const urls = results.map((r) => r.secure_url);

        return res.status(200).json({
          success: true,
          urls: urls.length > 0 ? urls : localUrls,
          count: urls.length,
        });
      } catch (cloudErr) {
        console.warn('Cloudinary multiple upload skipped/failed, using local storage:', cloudErr.message);
        return res.status(200).json({
          success: true,
          urls: localUrls,
          count: localUrls.length,
        });
      }
    }

    // 3. If uploaded via JSON payload (base64 string or remote image URL)
    if (req.body && (req.body.image || req.body.url || req.body.dataUri)) {
      const imgPayload = req.body.image || req.body.url || req.body.dataUri;

      // If it's a base64 string, also save locally
      if (imgPayload.startsWith('data:image/')) {
        const matches = imgPayload.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const { filename } = saveBufferLocally(buffer, '', mime);
          const localUrl = getLocalUrl(req, filename);

          try {
            const result = await cloudinary.uploader.upload(imgPayload, {
              folder: 'luxury_stays_hotels',
              resource_type: 'image',
              transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            });
            return res.status(200).json({
              success: true,
              url: result.secure_url || localUrl,
              localUrl,
            });
          } catch (cloudErr) {
            return res.status(200).json({
              success: true,
              url: localUrl,
              localUrl,
            });
          }
        }
      }

      // If it's already a regular HTTP URL, just return it
      if (imgPayload.startsWith('http://') || imgPayload.startsWith('https://')) {
        return res.status(200).json({
          success: true,
          url: imgPayload,
        });
      }

      return res.status(200).json({
        success: true,
        url: imgPayload,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'No file or image data provided for upload.',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed.',
    });
  }
};
