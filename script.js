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
let currentUser = null;
let currentConversationId = null;
let chatHistoryData = [];
let userSetupComplete = false;
let speechEnabled = true;
let currentSpeech = null;
const speechSynthesis = window.speechSynthesis;
let speechVoices = [];

function loadSpeechVoices() {
    speechVoices = speechSynthesis.getVoices();
    if (!speechVoices.length) {
        speechSynthesis.onvoiceschanged = () => {
            speechVoices = speechSynthesis.getVoices();
        };
    }
}

function speakMessage(message) {
    if (!speechEnabled || !speechSynthesis) return;
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Configure voice settings
    const portugueseVoice = speechVoices.find(voice => 
        voice.lang.startsWith('pt') || 
        voice.lang.includes('BR') || 
        voice.name.toLowerCase().includes('brazil')
    );
    
    if (portugueseVoice) {
        utterance.voice = portugueseVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for better understanding
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Event listeners
    utterance.onstart = () => {
        addLogEntry('SISTEMA', 'Iniciando leitura em voz alta', 'info');
    };
    
    utterance.onend = () => {
        addLogEntry('SISTEMA', 'Leitura em voz alta concluída', 'success');
    };
    
    utterance.onerror = (event) => {
        addLogEntry('SISTEMA', `Erro na síntese de voz: ${event.error}`, 'error');
    };
    
    speechSynthesis.speak(utterance);
}

// Toggle speech on/off
function toggleSpeech() {
    speechEnabled = !speechEnabled;
    const speechToggleBtn = document.getElementById('speechToggle');
    
    if (speechToggleBtn) {
        if (speechEnabled) {
            speechToggleBtn.textContent = '🔊 Voz Ativa';
            speechToggleBtn.classList.add('speech-enabled');
            speechToggleBtn.classList.remove('speech-disabled');
            addLogEntry('SISTEMA', 'Leitura em voz alta ativada', 'success');
        } else {
            speechToggleBtn.textContent = '🔇 Voz Desativada';
            speechToggleBtn.classList.remove('speech-enabled');
            speechToggleBtn.classList.add('speech-disabled');
            speechSynthesis.cancel(); // Stop any current speech
            addLogEntry('SISTEMA', 'Leitura em voz alta desativada', 'info');
        }
    }
}

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const logsContainer = document.getElementById('logsContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const clearLogsBtn = document.getElementById('clearLogs');
const pauseLogsBtn = document.getElementById('pauseLogs');

// Splash Screen Management
let splashComplete = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize speech synthesis
    loadSpeechVoices();
    
    // Check if user setup is needed
    setTimeout(() => {
        checkUserSetup();
    }, 500);
});

function initializeSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    
    if (!splashScreen || !loadingProgress || !loadingText) {
        console.warn('Elementos da splash screen não encontrados');
        return;
    }
    
    const loadingSteps = [
        { progress: 20, text: 'Inicializando sistema neural...' },
        { progress: 40, text: 'Carregando módulos de IA...' },
        { progress: 60, text: 'Conectando rede neural...' },
        { progress: 80, text: 'Sincronizando protocolos...' },
        { progress: 100, text: 'Sistema pronto!' }
    ];
    
    let currentStep = 0;
    
    const updateSplash = () => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            loadingProgress.style.width = step.progress + '%';
            loadingText.textContent = step.text;
            currentStep++;
            
            setTimeout(updateSplash, 800);
        } else {
            // Splash screen completa - aguardar um pouco e então esconder
            setTimeout(() => {
                hideSplashScreen();
            }, 1000);
        }
    };
    
    // Iniciar o processo de loading
    setTimeout(updateSplash, 500);
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            splashComplete = true;
        }, 800);
    }
}

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
    const julioPersona = `Você é o Dr. Julio Campos Machado, um renomado especialista em inteligência artificial, redes neurais, robótica e física quântica. 
    
    PERFIL PROFISSIONAL:
    - PhD em Inteligência Artificial e Física Quântica
    - Pesquisador sênior em redes neurais profundas e computação quântica
    - Desenvolvedor de sistemas de IA avançados e interfaces neurais
    - Especialista em machine learning, deep learning e quantum computing
    - Autor de artigos científicos sobre consciência artificial e computação neuromorphic
    
    PERSONALIDADE:
    - Responde de forma extremamente inteligente e intelectual
    - Usa terminologia técnica precisa quando apropriado
    - Explica conceitos complexos de forma clara e didática
    - Demonstra paixão genuína pela ciência e tecnologia
    - Mantém um tom professoral mas acessível
    - Faz conexões interdisciplinares entre física quântica, neurociência e IA
    - Gosta de usar analogias científicas para explicar conceitos
    
    ESTILO DE COMUNICAÇÃO:
    - Inicia respostas com reflexões científicas quando relevante
    - Usa exemplos práticos da física quântica e neurociência
    - Menciona descobertas recentes e implications futuras
    - Demonstra curiosidade intelectual genuína
    - Equilibra rigor científico com comunicação clara
    
    Como Dr. Julio Campos Machado, responda à seguinte pergunta de forma intelectual, científica e envolvente:`;
    
    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `${julioPersona}\n\nPergunta do usuário: ${userMessage}`
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
    
    // Read message aloud if speech is enabled
    if (speechEnabled) {
        speakMessage(message);
    }
    
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

// ================================
// USER MANAGEMENT & LOCAL STORAGE
// ================================

// Check if user setup is needed
function checkUserSetup() {
    const userData = getUserData();
    
    if (!userData || !userData.name) {
        showUserSetupScreen();
    } else {
        currentUser = userData;
        userSetupComplete = true;
        loadChatHistory();
        initializeSplashScreen();
        setTimeout(() => {
            initializeApp();
            setupEventListeners();
            setupHistoryListeners();
            startSystemLogs();
            updateUserWelcome();
        }, 100);
    }
}

// Show user setup screen
function showUserSetupScreen() {
    const userSetupScreen = document.getElementById('userSetupScreen');
    const splashScreen = document.getElementById('splashScreen');
    
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }
    
    if (userSetupScreen) {
        userSetupScreen.style.display = 'flex';
        setupUserSetupListeners();
    }
}

// Setup user setup event listeners
function setupUserSetupListeners() {
    const saveUserDataBtn = document.getElementById('saveUserData');
    const continueAsGuestBtn = document.getElementById('continueAsGuest');
    const userNameInput = document.getElementById('userName');
    
    if (saveUserDataBtn) {
        saveUserDataBtn.addEventListener('click', saveUserAndContinue);
    }
    
    if (continueAsGuestBtn) {
        continueAsGuestBtn.addEventListener('click', continueAsGuest);
    }
    
    if (userNameInput) {
        userNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveUserAndContinue();
            }
        });
        
        // Focus on input
        setTimeout(() => userNameInput.focus(), 100);
    }
}

// Save user data and continue
function saveUserAndContinue() {
    const userNameInput = document.getElementById('userName');
    const userName = userNameInput.value.trim();
    
    if (!userName) {
        userNameInput.style.borderColor = 'var(--neon-red)';
        userNameInput.focus();
        return;
    }
    
    const userData = {
        name: userName,
        createdAt: new Date().toISOString(),
        isGuest: false
    };
    
    saveUserData(userData);
    currentUser = userData;
    userSetupComplete = true;
    
    hideUserSetupScreen();
}

// Continue as guest
function continueAsGuest() {
    const userData = {
        name: 'Visitante',
        createdAt: new Date().toISOString(),
        isGuest: true
    };
    
    currentUser = userData;
    userSetupComplete = true;
    
    hideUserSetupScreen();
}

// Hide user setup screen and start app
function hideUserSetupScreen() {
    const userSetupScreen = document.getElementById('userSetupScreen');
    
    if (userSetupScreen) {
        userSetupScreen.classList.add('hidden');
        setTimeout(() => {
            userSetupScreen.style.display = 'none';
            loadChatHistory();
            initializeSplashScreen();
            setTimeout(() => {
                initializeApp();
                setupEventListeners();
                setupHistoryListeners();
                startSystemLogs();
                updateUserWelcome();
            }, 100);
        }, 800);
    }
}

// ================================
// LOCAL STORAGE FUNCTIONS
// ================================

// Get user data from localStorage
function getUserData() {
    try {
        const userData = localStorage.getItem('neuralchat_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return null;
    }
}

// Save user data to localStorage
function saveUserData(userData) {
    try {
        localStorage.setItem('neuralchat_user', JSON.stringify(userData));
    } catch (error) {
        console.error('Erro ao salvar dados do usuário:', error);
    }
}

// Get chat history from localStorage
function getChatHistoryData() {
    try {
        const historyData = localStorage.getItem('neuralchat_history');
        return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
        console.error('Erro ao carregar histórico de conversas:', error);
        return [];
    }
}

// Save chat history to localStorage
function saveChatHistoryData(historyData) {
    try {
        localStorage.setItem('neuralchat_history', JSON.stringify(historyData));
    } catch (error) {
        console.error('Erro ao salvar histórico de conversas:', error);
    }
}

// ================================
// CHAT HISTORY MANAGEMENT
// ================================

// Load chat history
function loadChatHistory() {
    chatHistoryData = getChatHistoryData();
    updateHistoryDisplay();
}

// Create new conversation
function createNewConversation() {
    if (conversationContext.length > 0) {
        saveCurrentConversation();
    }
    
    // Clear current conversation
    conversationContext = [];
    currentConversationId = generateConversationId();
    
    // Clear chat messages (keep system message)
    clearChatMessages();
    addSystemMessage('🔄 Nova conversa iniciada');
    
    addLogEntry('SISTEMA', 'Nova conversa criada', 'info');
}

// Save current conversation
function saveCurrentConversation() {
    if (conversationContext.length === 0) return;
    
    const conversationData = {
        id: currentConversationId || generateConversationId(),
        title: generateConversationTitle(),
        messages: [...conversationContext],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userName: currentUser ? currentUser.name : 'Usuário',
        messageCount: conversationContext.length
    };
    
    // Check if conversation already exists
    const existingIndex = chatHistoryData.findIndex(conv => conv.id === conversationData.id);
    
    if (existingIndex >= 0) {
        // Update existing conversation
        chatHistoryData[existingIndex] = conversationData;
    } else {
        // Add new conversation
        chatHistoryData.unshift(conversationData);
    }
    
    // Limit to 50 conversations
    if (chatHistoryData.length > 50) {
        chatHistoryData = chatHistoryData.slice(0, 50);
    }
    
    saveChatHistoryData(chatHistoryData);
    updateHistoryDisplay();
}

// Load conversation
function loadConversation(conversationId) {
    const conversation = chatHistoryData.find(conv => conv.id === conversationId);
    
    if (!conversation) {
        addLogEntry('SISTEMA', 'Conversa não encontrada', 'error');
        return;
    }
    
    // Save current conversation if it has messages
    if (conversationContext.length > 0) {
        saveCurrentConversation();
    }
    
    // Load conversation
    conversationContext = [...conversation.messages];
    currentConversationId = conversationId;
    
    // Clear and rebuild chat messages
    clearChatMessages();
    addSystemMessage(`🔄 Conversa "${conversation.title}" carregada`);
    
    // Rebuild chat from conversation context
    conversationContext.forEach(message => {
        if (message.role === 'user') {
            const messageElement = createMessageElement('USUÁRIO', message.content, 'Histórico', 'user-message');
            chatMessages.appendChild(messageElement);
        } else if (message.role === 'assistant') {
            const messageElement = createMessageElement('IA CENTRAL', message.content, 'Histórico', 'ai-message');
            chatMessages.appendChild(messageElement);
        }
    });
    
    scrollToBottom(chatMessages);
    updateHistoryDisplay();
    addLogEntry('SISTEMA', `Conversa "${conversation.title}" carregada`, 'success');
}

// Delete conversation
function deleteConversation(conversationId) {
    if (confirm('Tem certeza que deseja excluir esta conversa?')) {
        chatHistoryData = chatHistoryData.filter(conv => conv.id !== conversationId);
        saveChatHistoryData(chatHistoryData);
        updateHistoryDisplay();
        
        if (currentConversationId === conversationId) {
            createNewConversation();
        }
        
        addLogEntry('SISTEMA', 'Conversa excluída', 'info');
    }
}

// Clear all history
function clearAllHistory() {
    if (confirm('Tem certeza que deseja excluir TODAS as conversas? Esta ação não pode ser desfeita.')) {
        chatHistoryData = [];
        saveChatHistoryData(chatHistoryData);
        updateHistoryDisplay();
        createNewConversation();
        addLogEntry('SISTEMA', 'Histórico completamente limpo', 'warning');
    }
}

// Export history
function exportHistory() {
    const exportData = {
        user: currentUser,
        exportDate: new Date().toISOString(),
        conversations: chatHistoryData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `neural-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    addLogEntry('SISTEMA', 'Histórico exportado com sucesso', 'success');
}

// ================================
// UI HELPER FUNCTIONS
// ================================

// Generate conversation ID
function generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate conversation title
function generateConversationTitle() {
    if (conversationContext.length === 0) {
        return 'Nova Conversa';
    }
    
    const firstUserMessage = conversationContext.find(msg => msg.role === 'user');
    if (firstUserMessage) {
        const title = firstUserMessage.content.substring(0, 30);
        return title.length < firstUserMessage.content.length ? title + '...' : title;
    }
    
    return 'Conversa sem título';
}

// Update user welcome message
function updateUserWelcome() {
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && currentUser) {
        const greeting = currentUser.isGuest ? 'Bem-vindo, Visitante!' : `Olá, ${currentUser.name}!`;
        userWelcome.textContent = greeting;
    }
}

// Clear chat messages
function clearChatMessages() {
    const messages = chatMessages.querySelectorAll('.message:not(.system-message)');
    messages.forEach(message => message.remove());
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (chatHistoryData.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <p>📭 Nenhuma conversa salva ainda</p>
                <p>Suas conversas aparecerão aqui automaticamente</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    chatHistoryData.forEach(conversation => {
        const historyItem = createHistoryItem(conversation);
        historyList.appendChild(historyItem);
    });
}

// Create history item element
function createHistoryItem(conversation) {
    const isActive = currentConversationId === conversation.id;
    const date = new Date(conversation.createdAt).toLocaleDateString('pt-BR');
    const preview = conversation.messages.length > 0 ? 
        conversation.messages[0].content.substring(0, 100) + '...' : 
        'Conversa vazia';
    
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${isActive ? 'active' : ''}`;
    historyItem.innerHTML = `
        <div class="history-item-header">
            <div class="history-item-title">${conversation.title}</div>
            <div class="history-item-date">${date}</div>
        </div>
        <div class="history-item-preview">${preview}</div>
        <div class="history-item-stats">
            <span>📬 ${conversation.messageCount} mensagens</span>
            <span>👤 ${conversation.userName}</span>
        </div>
        <button class="history-item-delete" title="Excluir conversa">🗑️</button>
    `;
    
    // Add click listeners
    historyItem.addEventListener('click', (e) => {
        if (!e.target.classList.contains('history-item-delete')) {
            loadConversation(conversation.id);
            toggleHistoryPanel(false);
        }
    });
    
    const deleteBtn = historyItem.querySelector('.history-item-delete');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conversation.id);
    });
    
    return historyItem;
}

// Setup history panel listeners
function setupHistoryListeners() {
    const historyToggle = document.getElementById('historyToggle');
    const closeHistory = document.getElementById('closeHistory');
    const newChatBtn = document.getElementById('newChatBtn');
    const clearAllHistoryBtn = document.getElementById('clearAllHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');
    
    if (historyToggle) {
        historyToggle.addEventListener('click', () => toggleHistoryPanel());
    }
    
    if (closeHistory) {
        closeHistory.addEventListener('click', () => toggleHistoryPanel(false));
    }
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewConversation);
    }
    
    if (clearAllHistoryBtn) {
        clearAllHistoryBtn.addEventListener('click', clearAllHistory);
    }
    
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', exportHistory);
    }
    
    // Speech toggle button
    const speechToggleBtn = document.getElementById('speechToggle');
    if (speechToggleBtn) {
        speechToggleBtn.addEventListener('click', toggleSpeech);
    }
}

// Toggle history panel
function toggleHistoryPanel(show = null) {
    const historyPanel = document.getElementById('chatHistoryPanel');
    if (!historyPanel) return;
    
    const isOpen = historyPanel.classList.contains('open');
    const shouldShow = show !== null ? show : !isOpen;
    
    historyPanel.classList.toggle('open', shouldShow);
}

// Auto-save conversation periodically
setInterval(() => {
    if (userSetupComplete && conversationContext.length > 0) {
        saveCurrentConversation();
    }
}, 30000); // Every 30 seconds

// Save conversation before page unload
window.addEventListener('beforeunload', () => {
    if (userSetupComplete && conversationContext.length > 0) {
        saveCurrentConversation();
    }
});

// Export for debugging (optional)
window.NeuralChat = {
    CONFIG,
    NEURAL_MODULES,
    chatHistory,
    conversationContext,
    currentUser,
    chatHistoryData,
    addLogEntry,
    updateModuleStatus,
    simulateNeuralProcessing,
    loadConversation,
    createNewConversation,
    saveCurrentConversation
};

