const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS চালু করা হলো যাতে যেকোনো ওয়েবসাইট থেকে আপনার এই API ব্যবহার করা যায়
app.use(cors());
app.use(express.json());

// হোম বা রুট রাউট
app.get('/', (req, res) => {
    res.json({ 
        status: true, 
        message: "Welcome to TikTok & Instagram Downloader API!",
        developed_by: "Gemini AI Partner"
    });
});

// ১. টিকটক ডাউনলোডার রাউট (TikTok Downloader Route)
app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ success: false, error: "অনুগ্রহ করে একটি সঠিক টিকটক লিংক দিন।" });
    }

    try {
        // একটি অত্যন্ত শক্তিশালী এবং স্ট্যাবল ফ্রি API ব্যবহার করা হয়েছে যা ওয়াটারমার্ক ছাড়া ভিডিও দেয়
        const response = await axios.post('https://www.tikwm.com/api/', null, {
            params: { url: videoUrl }
        });

        const result = response.data;

        if (result.code === 0) {
            return res.json({
                success: true,
                platform: "TikTok",
                title: result.data.title,
                cover: "https://www.tikwm.com" + result.data.cover,
                video_no_watermark: "https://www.tikwm.com" + result.data.play,
                music: "https://www.tikwm.com" + result.data.music
            });
        } else {
            return res.status(400).json({ success: false, error: "ভিডিওটি খুঁজে পাওয়া যায়নি বা এটি প্রাইভেট।" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
    }
});

// ২. ইনস্টাগ্রাম ডাউনলোডার রাউট (Instagram Downloader Route)
app.get('/api/instagram', async (req, res) => {
    const instaUrl = req.query.url;

    if (!instaUrl) {
        return res.status(400).json({ success: false, error: "অনুগ্রহ করে একটি সঠিক ইনস্টাগ্রাম লিংক দিন।" });
    }

    try {
        // ইনস্টাগ্রাম রিলস/ভিডিও ডাউনলোডের জন্য একটি কার্যকর পাবলিক সার্ভিস ব্যবহার করা হয়েছে
        const response = await axios.get(`https://api.itzpire.site/download/instagram?url=${encodeURIComponent(instaUrl)}`);
        const result = response.data;

        if (result.status === 'success' && result.data && result.data.length > 0) {
            return res.json({
                success: true,
                platform: "Instagram",
                media_type: result.data[0].type || "video",
                download_url: result.data[0].url // ওয়াটারমার্ক ছাড়া মেইন ভিডিও/ছবি লিংক
            });
        } else {
            return res.status(400).json({ success: false, error: "ইনস্টাগ্রাম মিডিয়া ডাউনলোড করতে ব্যর্থ। লিংকটি পাবলিক কিনা চেক করুন।" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: "ইনস্টাগ্রাম সার্ভার সাড়া দিচ্ছে না।" });
    }
});

// সার্ভার পোর্ট সেটআপ (Render এটি অটোমেটিক হ্যান্ডেল করবে)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
