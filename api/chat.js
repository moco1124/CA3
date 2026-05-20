// api/chat.js
export default async function handler(req, res) {
    // 限制只能用 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // 安全檢查：確保 Vercel 有抓到你的 API Key
    if (!API_KEY) {
        return res.status(500).json({ error: "後端環境變數中缺少 GEMINI_API_KEY，請至 Vercel 後台設定。" });
    }

    try {
        // 🚀 關鍵修正點：網址改為 v1beta，模型名稱改為 gemini-2.5-flash-lite
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: prompt }] 
                }]
            })
        });

        const data = await response.json();
        
        // 如果 Google 伺服器回傳錯誤（例如 Key 填錯），直接把錯誤拋給前端 Console 方便排查
        if (data.error) {
            return res.status(response.status).json({ 
                error: data.error,
                hint: "請確認 Vercel 後台的 API Key 是否與 Google AI Studio 的完全一致。" 
            });
        }

        // 成功拿到資料，回傳給前端 script.js
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
