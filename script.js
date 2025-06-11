// Neural Network Chat - JavaScript Implementation

// Configuration
const CONFIG = {
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    API_KEY: "AIzaSyC4vPY7_qfh2LPOYSq1IhuRFTlO_ypVfOE",
    TYPING_SPEED: 50,
    LOG_DELAY: 300
};

// Neural Modules Configuration
const NEURAL_MODULES = [
    {
        name: "IA_Linguagem",
        id: "linguagem",
        messages: [
            "Analisando estrutura linguística...",
            "Processando semântica da mensagem...",
            "Identificando contexto conversacional...",
            "Extraindo intenções do usuário...",
            "Validando sintaxe e gramática..."
        ]
    },
    {
        name: "IA_Lógica",
        id: "logica",
        messages: [
            "Executando análise lógica...",
            "Processando padrões de raciocínio...",
            "Aplicando regras de inferência...",
            "Validando consistência lógica...",
            "Construindo cadeia de pensamento..."
        ]
    },
    {
        name: "IA_Memória",
        id: "memoria",
        messages: [
            "Acessando banco de memória...",
            "Recuperando contexto histórico...",
            "Indexando nova informação...",
            "Correlacionando dados anteriores...",
            "Atualizando base de conhecimento..."
        ]
    },
    {
        name: "IA_Contexto",
        id: "contexto",
        messages: [
            "Mapeando contexto situacional...",
            "Analisando relevância temporal...",
            "Identificando subtextos...",
            "Processando contexto emocional...",
            "Integrando informações contextuais..."
        ]
    },
    {
        name: "IA_Processamento",
        id: "processamento",
        messages: [
            "Iniciando processamento neural...",
            "Otimizando recursos computacionais...",
            "Executando algoritmos de decisão...",
            "Sintetizando resposta final...",
            "Calibrando output para usuário..."
        ]
    }
];

// Global State
let chatHistory = [];
let isProcessing = false;
let logsPaused = false;
let conversationContext = [];

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const logsContainer = document.getElementById('logsContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const clearLogsBtn = document.getElementById('clearLogs');
const pauseLogsBtn = document.getElementById('pauseLogs');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startSystemLogs();
});

function initializeApp() {
    addSystemMessage('🤖 IA Central inicializada e pronta para interação');
    updateModuleStatus('all', 'ready');
    
    // Add initial neural activity logs
    setTimeout(() => {
        addLogEntry('SISTEMA', 'Sincronizando módulos neurais...', 'info');
    }, 1000);
    
    setTimeout(() => {
        addLogEntry('SISTEMA', 'Rede neural estável e operacional', 'success');
    }, 2000);
}

function setupEventListeners() {
    // Chat input events
    chatInput.addEventListener('keydown', handleChatInput);
    sendButton.addEventListener('click', sendMessage);
    
    // Logs controls
    clearLogsBtn.addEventListener('click', clearLogs);
    pauseLogsBtn.addEventListener('click', toggleLogsPause);
    
    // Auto-resize chat input
    chatInput.addEventListener('input', (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    });
}

function handleChatInput(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isProcessing) return;
    
    // Clear input and disable button
    chatInput.value = '';
    chatInput.style.height = 'auto';
    setProcessingState(true);
    
    // Add user message to chat
    addUserMessage(message);
    
    // Add to conversation context
    conversationContext.push({
        role: 'user',
        content: message
    });
    
    try {
        // Start neural processing simulation
        await simulateNeuralProcessing(message);
        
        // Get AI response from Gemini
        const aiResponse = await getGeminiResponse(message);
        
        // Add AI response to chat
        await addAIMessage(aiResponse);
        
        // Add to conversation context
        conversationContext.push({
            role: 'assistant',
            content: aiResponse
        });
        
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        addSystemMessage('❌ Erro na comunicação com a rede neural. Tente novamente.');
        addLogEntry('SISTEMA', `Erro: ${error.message}`, 'error');
    } finally {
        setProcessingState(false);
    }
}

async function getGeminiResponse(userMessage) {
    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `Você é uma IA avançada fazendo parte de uma rede neural complexa. Responda de forma inteligente, útil e envolvente. Mensagem do usuário: ${userMessage}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };
    
    const response = await fetch(`${CONFIG.API_URL}?key=${CONFIG.API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Resposta inválida da API Gemini');
    }
}

async function simulateNeuralProcessing(message) {
    showLoadingOverlay(true);
    
    // Simulate neural modules processing in sequence
    for (let i = 0; i < NEURAL_MODULES.length; i++) {
        const module = NEURAL_MODULES[i];
        
        // Set module as processing
        updateModuleStatus(module.id, 'processing');
        
        // Random processing message
        const randomMessage = module.messages[Math.floor(Math.random() * module.messages.length)];
        addLogEntry(module.name, randomMessage, 'info');
        
        // Wait for processing
        await delay(CONFIG.LOG_DELAY + Math.random() * 200);
        
        // Set module as ready
        updateModuleStatus(module.id, 'ready');
    }
    
    // Final processing log
    addLogEntry('IA_Processamento', 'Resposta gerada com sucesso', 'success');
    
    showLoadingOverlay(false);
}

function addUserMessage(message) {
    const timestamp = getCurrentTimestamp();
    const messageElement = createMessageElement('USUÁRIO', message, timestamp, 'user-message');
    chatMessages.appendChild(messageElement);
    scrollToBottom(chatMessages);
    
    addLogEntry('USUÁRIO', `Nova mensagem recebida: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`, 'info');
}

async function addAIMessage(message) {
    const timestamp = getCurrentTimestamp();
    const messageElement = createMessageElement('IA CENTRAL', '', timestamp, 'ai-message');
    const contentDiv = messageElement.querySelector('.message-content');
    
    chatMessages.appendChild(messageElement);
    scrollToBottom(chatMessages);
    
    // Type the message with animation
    await typeMessage(contentDiv, message);
    
    addLogEntry('IA_CENTRAL', 'Resposta enviada para o usuário', 'success');
}

function addSystemMessage(message) {
    const timestamp = getCurrentTimestamp();
    const messageElement = createMessageElement('SISTEMA', message, timestamp, 'system-message');
    chatMessages.appendChild(messageElement);
    scrollToBottom(chatMessages);
}

function createMessageElement(author, content, timestamp, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${author}</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-content">${content}</div>
    `;
    
    return messageDiv;
}

async function typeMessage(element, text) {
    element.classList.add('typing-effect');
    
    for (let i = 0; i < text.length; i++) {
        element.textContent = text.substring(0, i + 1);
        await delay(CONFIG.TYPING_SPEED);
    }
    
    element.classList.remove('typing-effect');
}

function addLogEntry(module, message, type = 'info') {
    if (logsPaused) return;
    
    const timestamp = getCurrentTimestamp(true);
    const logDiv = document.createElement('div');
    logDiv.className = `log-entry ${type}`;
    
    logDiv.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <span class="log-module">${module}</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContainer.appendChild(logDiv);
    scrollToBottom(logsContainer);
    
    // Limit log entries to prevent memory issues
    const logEntries = logsContainer.children;
    if (logEntries.length > 100) {
        logsContainer.removeChild(logEntries[0]);
    }
}

function updateModuleStatus(moduleId, status) {
    if (moduleId === 'all') {
        NEURAL_MODULES.forEach(module => {
            updateSingleModuleStatus(module.id, status);
        });
    } else {
        updateSingleModuleStatus(moduleId, status);
    }
}

function updateSingleModuleStatus(moduleId, status) {
    const moduleElement = document.querySelector(`[data-module="${moduleId}"]`);
    if (moduleElement) {
        moduleElement.classList.remove('processing');
        if (status === 'processing') {
            moduleElement.classList.add('processing');
        }
    }
}

function setProcessingState(processing) {
    isProcessing = processing;
    sendButton.disabled = processing;
    chatInput.disabled = processing;
    
    const statusText = document.querySelector('.chat-status span:last-child');
    if (statusText) {
        statusText.textContent = processing ? 'Processando...' : 'Pronto para comunicação';
    }
}

function showLoadingOverlay(show) {
    loadingOverlay.classList.toggle('active', show);
}

function clearLogs() {
    logsContainer.innerHTML = '';
    addLogEntry('SISTEMA', 'Logs limpos pelo usuário', 'info');
}

function toggleLogsPause() {
    logsPaused = !logsPaused;
    pauseLogsBtn.textContent = logsPaused ? 'Retomar' : 'Pausar';
    
    if (!logsPaused) {
        addLogEntry('SISTEMA', 'Logs retomados', 'info');
    }
}

function startSystemLogs() {
    // Periodic system activity logs
    setInterval(() => {
        if (!logsPaused && !isProcessing) {
            const activities = [
                'Monitorando atividade da rede...',
                'Sincronizando módulos neurais...',
                'Verificando integridade do sistema...',
                'Otimizando performance...',
                'Atualizando índices de memória...'
            ];
            
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addLogEntry('SISTEMA', randomActivity, 'info');
        }
    }, 15000); // Every 15 seconds
}

function getCurrentTimestamp(short = false) {
    const now = new Date();
    if (short) {
        return now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    return now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Erro global:', e.error);
    addLogEntry('SISTEMA', `Erro detectado: ${e.error.message}`, 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
    addLogEntry('SISTEMA', `Erro assíncrono: ${e.reason}`, 'error');
});

// Export for debugging (optional)
window.NeuralChat = {
    CONFIG,
    NEURAL_MODULES,
    chatHistory,
    conversationContext,
    addLogEntry,
    updateModuleStatus,
    simulateNeuralProcessing
};

