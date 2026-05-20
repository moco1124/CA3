document.getElementById('send-btn').addEventListener('click', askAIAssistant);

async function askAIAssistant() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();

    if (!userText) return;

    appendMessage("user", `<strong>你:</strong> ${userText}`);
    inputField.value = "";
    const loadingMessage = appendMessage("ai", "<strong>AI 助手:</strong> 思考中...");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userText })
        });

        const data = await response.json();
        
        // --- 關鍵偵錯：這會幫你確認後端到底回傳了什麼 ---
        console.log("後端回傳的資料結構:", data); 

        // --- 安全檢查機制 ---
        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            updateMessage(loadingMessage, `<strong>AI 助手:</strong><br>${aiResponse.replace(/\n/g, '<br>')}`);
        } else {
            // 如果後端回傳錯誤訊息
            console.error("API 回傳內容異常:", data);
            updateMessage(loadingMessage, `<strong>AI 助手:</strong> 發生錯誤，請檢查 Console 訊息。後端回應: ${JSON.stringify(data)}`);
        }

    } catch (error) {
        console.error("Fetch 錯誤:", error);
        updateMessage(loadingMessage, "<strong>AI 助手:</strong> 系統無法連線，請檢查網路。");
    }
}

function appendMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

function updateMessage(messageElement, text) {
    messageElement.innerHTML = text;
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}
