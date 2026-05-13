async function askAIAssistant() {
    const inputField = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('send-btn');
    const userText = inputField.value.trim();

    if (!userText) return;

    // 1. 顯示使用者訊息
    appendMessage("user", `<strong>你:</strong> ${userText}`);
    inputField.value = "";
    sendBtn.disabled = true;

    // 2. 顯示思考中
    const loadingId = appendMessage("ai", "<strong>AI 助手:</strong> 正在規劃中...");

    try {
        // 3. 呼叫你自己的後端路徑
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: `你是一位電腦專家，請根據需求推薦配單並解釋理由：${userText}` })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // 4. 更新畫面
        updateMessage(loadingId, `<strong>AI 助手:</strong><br>${aiResponse.replace(/\n/g, '<br>')}`);

    } catch (error) {
        updateMessage(loadingId, "<strong>AI 助手:</strong> 服務暫時無法連線，請稍後再試。");
    } finally {
        sendBtn.disabled = false;
    }
}

// 輔助函式 (appendMessage, updateMessage) 保持原樣即可