// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "後端環境變數中缺少 GEMINI_API_KEY，請至 Vercel 後台設定。" });
    }

    try {
        // 使用目前最穩定的 v1beta 版本與 2.5 Flash Lite 模型
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;
        
        // 🚀 強力約束：強制限制金錢單位為新台幣（NT$），並符合台灣通路價格
        const systemInstruction = "你是一位專業的台灣電腦組裝顧問。請一律使用『繁體中文（台灣習慣用語）』回答。重點要求：所有硬體零件的價格與總預算，必須且只能使用『新台幣（格式為 NT$ 或 元）』作為唯一的貨幣單位。請根據台灣主流通路（如原價屋、欣亞等）的實際市場行情來估算各項零件價格，絕對不要直接拿美金匯率硬轉。請用清晰的清單或表格呈現配單與各零件的新台幣價格。";

        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [{ 
                    parts: [{ text: prompt }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(response.status).json({ error: data.error });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
