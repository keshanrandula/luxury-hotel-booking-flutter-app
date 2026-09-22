const cloudinary = require('../config/cloudinary');

// @desc    Upload single or multiple image(s) to Cloudinary
// @route   POST /api/upload
// @access  Public / Admin
exports.uploadImage = async (req, res, next) => {
  try {
    // 1. If uploaded via multer multipart (req.file)
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'luxury_stays_hotels',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }

    // 2. If uploaded via multer multiple (req.files)
    if (req.files && req.files.length > 0) {
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
        urls,
        count: urls.length,
        data: results.map((r) => ({
          url: r.secure_url,
          public_id: r.public_id,
        })),
      });
    }

    // 3. If uploaded via JSON payload (base64 string or remote image URL)
    if (req.body && (req.body.image || req.body.url || req.body.dataUri)) {
      const imgPayload = req.body.image || req.body.url || req.body.dataUri;

      const result = await cloudinary.uploader.upload(imgPayload, {
        folder: 'luxury_stays_hotels',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'No file or image data provided for upload.',
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload to Cloudinary failed.',
    });
  }
};
