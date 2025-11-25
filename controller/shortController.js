const express = require('express');
const Short = require('../Schema/shortsSchema');

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const { name, tags, videoLink } = req.body;
    let videoUrl = '';
    if (videoLink && typeof videoLink === 'string' && videoLink.trim() !== '') {
      const link = videoLink.trim();
      if (!/^https?:\/\//i.test(link)) {
        return res.status(400).json({ error: 'Invalid video URL. Must start with http:// or https://'});
      }
      videoUrl = link;
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