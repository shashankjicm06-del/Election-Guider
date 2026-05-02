import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, query, where, orderBy, onSnapshot } from './firebaseConfig.js';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');

const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatContainer = document.getElementById('chatContainer');
const welcomeView = document.getElementById('welcomeView');
const historyList = document.getElementById('historyList');

const quickActions = document.querySelectorAll('.quick-action');
const quizBtn = document.getElementById('quizBtn');
const quizModal = document.getElementById('quizModal');
const closeQuizBtn = document.getElementById('closeQuizBtn');

// State
let currentUser = null;
let unsubscribeHistory = null;

// Auth Logic
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Error:", error);
        alert("Failed to login. Check console for details or ensure Firebase config is correct.");
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
        userName.textContent = user.displayName;
        loadChatHistory();
    } else {
        currentUser = null;
        loginBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
        historyList.innerHTML = '<li class="text-gray-400 text-xs italic px-2">Login to view history</li>';
        if (unsubscribeHistory) unsubscribeHistory();
    }
});

// Chat History Logic
function loadChatHistory() {
    if (!currentUser) return;
    
    const q = query(
        collection(db, "chats"), 
        where("userId", "==", currentUser.uid),
        orderBy("timestamp", "desc")
    );

    unsubscribeHistory = onSnapshot(q, (snapshot) => {
        historyList.innerHTML = '';
        if (snapshot.empty) {
            historyList.innerHTML = '<li class="text-gray-400 text-xs italic px-2">No previous questions</li>';
            return;
        }

        let count = 0;
        snapshot.forEach((doc) => {
            if (count >= 10) return; // Show only last 10
            const data = doc.data();
            const li = document.createElement('li');
            li.className = 'truncate cursor-pointer hover:text-brand-600 transition-colors px-2 py-1 rounded hover:bg-brand-50';
            li.textContent = data.question;
            li.title = data.question;
            li.addEventListener('click', () => {
                chatInput.value = data.question;
                handleSend();
            });
            historyList.appendChild(li);
            count++;
        });
    });
}

// Chat UI Logic
function addMessage(text, isUser = false) {
    if (welcomeView && !welcomeView.classList.contains('hidden')) {
        welcomeView.classList.add('hidden');
    }

    const wrapper = document.createElement('div');
    wrapper.className = `flex w-full ${isUser ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
        isUser 
        ? 'bg-brand-600 text-white rounded-br-sm' 
        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm bot-message-content'
    }`;
    
    if (isUser) {
        bubble.textContent = text;
    } else {
        // Simple markdown parsing for the bot response
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>');
        bubble.innerHTML = formattedText;
    }

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    scrollToBottom();
}

function showTypingIndicator() {
    if (welcomeView && !welcomeView.classList.contains('hidden')) {
        welcomeView.classList.add('hidden');
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'typingIndicator';
    wrapper.className = 'flex w-full justify-start';
    
    wrapper.innerHTML = `
        <div class="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center h-12">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(wrapper);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Sending Messages
async function handleSend() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Reset input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show user message
    addMessage(message, true);
    
    // Save to Firestore if logged in
    if (currentUser) {
        try {
            await addDoc(collection(db, "chats"), {
                userId: currentUser.uid,
                question: message,
                timestamp: new Date()
            });
        } catch (e) {
            console.error("Error saving chat:", e);
        }
    }

    showTypingIndicator();

    try {
        // Send request to our own backend server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: message 
            })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (!response.ok) {
            throw new Error(data.error || 'API Error');
        }

        addMessage(data.reply);
    } catch (error) {
        removeTypingIndicator();
        addMessage(`⚠️ Error: Could not connect to the AI. Please ensure the backend server is running and the API key is configured. Error: ${error.message}`);
        console.error(error);
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if(this.value === '') this.style.height = 'auto';
});

// Quick Actions
quickActions.forEach(btn => {
    btn.addEventListener('click', () => {
        chatInput.value = btn.textContent.trim();
        handleSend();
    });
});

// Flashcard Logic
const flashcardBtn = document.getElementById('flashcardBtn');
const flashcardModal = document.getElementById('flashcardModal');
const closeFlashcardBtn = document.getElementById('closeFlashcardBtn');
const flashcardContainer = document.getElementById('flashcardContainer');
const fcTerm = document.getElementById('fcTerm');
const fcDefinition = document.getElementById('fcDefinition');
const fcPrev = document.getElementById('fcPrev');
const fcNext = document.getElementById('fcNext');
const fcCounter = document.getElementById('fcCounter');

const flashcards = [
    { term: "EVM", definition: "Electronic Voting Machine. Used in Indian elections to securely cast and record votes electronically." },
    { term: "VVPAT", definition: "Voter Verifiable Paper Audit Trail. Provides feedback to voters using a slip of paper to verify their vote was cast correctly." },
    { term: "MCC", definition: "Model Code of Conduct. Guidelines issued by the Election Commission of India to regulate political parties and candidates prior to elections." },
    { term: "Hung Assembly", definition: "A situation where no single political party or pre-poll alliance secures an absolute majority of seats in the legislature." },
    { term: "Coalition Govt", definition: "A cabinet of a parliamentary government in which multiple political parties cooperate to form a majority and govern." }
];

let currentCardIndex = 0;
let isFlipped = false;

function updateFlashcard() {
    // Reset flip state without animation if needed
    if (isFlipped) {
        flashcardContainer.classList.remove('flipped');
        isFlipped = false;
        // Wait for flip back before changing text
        setTimeout(() => {
            fcTerm.textContent = flashcards[currentCardIndex].term;
            fcDefinition.textContent = flashcards[currentCardIndex].definition;
            fcCounter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
        }, 300);
    } else {
        fcTerm.textContent = flashcards[currentCardIndex].term;
        fcDefinition.textContent = flashcards[currentCardIndex].definition;
        fcCounter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
    }
}

flashcardBtn.addEventListener('click', () => {
    currentCardIndex = 0;
    updateFlashcard();
    flashcardModal.classList.remove('hidden');
    // Trigger slide-up entrance animation
    const panel = document.getElementById('flashcardPanel');
    panel.classList.remove('flashcard-modal-exit');
    panel.classList.add('flashcard-modal-enter');
});

closeFlashcardBtn.addEventListener('click', () => {
    const panel = document.getElementById('flashcardPanel');
    panel.classList.remove('flashcard-modal-enter');
    panel.classList.add('flashcard-modal-exit');
    setTimeout(() => {
        flashcardModal.classList.add('hidden');
        panel.classList.remove('flashcard-modal-exit');
    }, 260);
});

flashcardContainer.addEventListener('click', () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
        flashcardContainer.classList.add('flipped');
    } else {
        flashcardContainer.classList.remove('flipped');
    }
});

fcNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateFlashcard();
    syncPreview();
});

fcPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateFlashcard();
    syncPreview();
});

// Hover Preview sync
function syncPreview() {
    const card = flashcards[currentCardIndex];
    const previewTerm = document.getElementById('fcPreviewTerm');
    const previewDef  = document.getElementById('fcPreviewDef');
    const previewCtr  = document.getElementById('fcPreviewCounter');
    if (previewTerm) previewTerm.textContent = card.term;
    if (previewDef)  previewDef.textContent  = card.definition;
    if (previewCtr)  previewCtr.textContent  = `${currentCardIndex + 1} / ${flashcards.length}`;
}
syncPreview(); // init on load

const fcPreviewNext = document.getElementById('fcPreviewNext');
const fcPreviewPrev = document.getElementById('fcPreviewPrev');

if (fcPreviewNext) fcPreviewNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateFlashcard();
    syncPreview();
});

if (fcPreviewPrev) fcPreviewPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateFlashcard();
    syncPreview();
});

// Chart Logic
const openChartBtn = document.getElementById('openChartBtn');
const chartModal = document.getElementById('chartModal');
const closeChartBtn = document.getElementById('closeChartBtn');
let electionChartInstance = null;

openChartBtn.addEventListener('click', () => {
    chartModal.classList.remove('hidden');
    setTimeout(() => {
        chartModal.classList.add('modal-show');
        initChart();
    }, 10);
});

closeChartBtn.addEventListener('click', () => {
    chartModal.classList.remove('modal-show');
    setTimeout(() => {
        chartModal.classList.add('hidden');
        if (electionChartInstance) {
            electionChartInstance.destroy();
        }
    }, 300);
});

function initChart() {
    const ctx = document.getElementById('electionChart').getContext('2d');
    
    if (electionChartInstance) {
        electionChartInstance.destroy();
    }

    electionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Notification to Nomination', 'Scrutiny & Withdrawal', 'Campaign Period', 'Polling to Counting', 'Govt Formation'],
            datasets: [{
                label: 'Estimated Duration (Days)',
                data: [7, 4, 14, 5, 10], // Approximate days for a standard Indian election phase
                backgroundColor: [
                    'rgba(249, 115, 22, 0.7)', // Saffron
                    'rgba(107, 114, 128, 0.7)', // Gray
                    'rgba(37, 99, 235, 0.7)',  // Blue
                    'rgba(34, 197, 94, 0.7)',  // Green
                    'rgba(30, 58, 138, 0.7)'   // Navy
                ],
                borderColor: [
                    'rgba(249, 115, 22, 1)',
                    'rgba(107, 114, 128, 1)',
                    'rgba(37, 99, 235, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(30, 58, 138, 1)'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' Days';
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const phase = [
                        "Notification", 
                        "Nominations", 
                        "Scrutiny", 
                        "Campaigning", 
                        "Polling & Results"
                    ][index];
                    
                    const details = [
                        "**Notification:** The ECI officially triggers the election process, setting the dates for all subsequent steps.",
                        "**Nominations:** Candidates file their papers (Form 26) with the Returning Officer to contest the election.",
                        "**Scrutiny:** ECI officials carefully verify nomination papers to ensure candidates are eligible and documents are valid.",
                        "**Campaigning:** Candidates reach out to the public, hold rallies, and share their vision for the constituency.",
                        "**Polling & Results:** The final stage where millions of citizens vote, followed by counting and result declaration."
                    ][index];

                    const detailsDiv = document.getElementById('chartDetails');
                    detailsDiv.innerHTML = `<p class="text-indigo-800 font-bold mb-1">${phase}</p><p class="text-indigo-600 text-sm leading-snug">${details.split('**')[2]}</p>`;
                    detailsDiv.classList.add('bg-indigo-100');
                }
            }
        }
    });
}

