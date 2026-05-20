// 綁定按鈕點擊事件
document.getElementById('send-btn').addEventListener('click', askAIAssistant);

async function askAIAssistant() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();

    if (!userText) return;

    // 1. 顯示使用者訊息
    appendMessage("user", `<strong>你:</strong> ${userText}`);
    inputField.value = "";
    
    // 2. 顯示 AI 思考中
    const loadingMessage = appendMessage("ai", "<strong>AI 助手:</strong> 思考中...");

    try {
        // 3. 呼叫你的 Vercel 後端 API
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userText })
        });

        const data = await response.json();
        
        // 解析 AI 回應
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // 4. 更新畫面顯示 AI 的結果
        updateMessage(loadingMessage, `<strong>AI 助手:</strong><br>${aiResponse.replace(/\n/g, '<br>')}`);

    } catch (error) {
        console.error("錯誤:", error);
        updateMessage(loadingMessage, "<strong>AI 助手:</strong> 抱歉，系統發生錯誤，請稍後再試。");
    }
}

// --- 輔助工具函數 (就是因為少了這兩個才報錯的) ---
function appendMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`; // 使用 CSS 控制樣式
    messageDiv.innerHTML = text;
    chatMessages.appendChild(messageDiv);
    
    // 自動捲動到最底
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function updateMessage(messageElement, text) {
    messageElement.innerHTML = text;
    // 更新後再次捲動
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}
