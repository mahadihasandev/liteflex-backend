const multer = require('multer');
const path = require('path');
const express = require('express');
const Short = require('../Schema/shortsSchema');

const storage = multer.diskStorage({
  destination: ( cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: ( file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const videoTypes = /video\/(mp4|mpeg|quicktime|x-msvideo|webm)/;
    if (videoTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: { fileSize: 500 * 1024 * 1024 }
});

const router = express.Router();

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { name, tags, videoLink } = req.body;
    let videoUrl = '';
    if (videoLink && typeof videoLink === 'string' && videoLink.trim() !== '') {
      const link = videoLink.trim();
      if (!/^https?:\/\//i.test(link)) {
        return res.status(400).json({ error: 'Invalid video URL. Must start with http:// or https://'});
      }
      videoUrl = link;
    } else if (req.file) {
      videoUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: 'No video file or link provided' });
    }

    const parsedTags = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];

    let thumbnail = '';
    const providedLink = (videoLink && videoLink.trim() !== '');
    const linkForThumb = providedLink ? videoLink.trim() : '';
    if (linkForThumb) {
      const ytMatch = linkForThumb.match(/(?:youtube(?:-nocookie)?\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
      if (ytMatch && ytMatch[1]) {
        thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }

    const newShort = new Short({
      id: Date.now(),
      name: name || 'Untitled',
      videoUrl: videoUrl,
      tags: parsedTags,
      thumbnail: thumbnail
    });

    await newShort.save();
    res.json({ success: true, data: newShort });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/shorts', async (req, res) => {
  try {
    const shorts = await Short.find();
    res.json(shorts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const short = await Short.findById(req.params.id);
    if (!short) return res.status(404).json({ error: 'Video not found' });
    res.json(short);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;