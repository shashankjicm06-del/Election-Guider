<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>ElectionGuide AI</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: Arial;
        }

        /* Fade animation */
        .fade-in {
            animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Typing dots */
        .typing span {
            animation: blink 1.4s infinite;
        }

        .typing span:nth-child(2) {
            animation-delay: .2s;
        }

        .typing span:nth-child(3) {
            animation-delay: .4s;
        }

        @keyframes blink {

            0%,
            80%,
            100% {
                opacity: 0;
            }

            40% {
                opacity: 1;
            }
        }

        /* Button hover */
        .btn:hover {
            transform: scale(1.05);
            transition: 0.2s;
        }

        #chatBox {
            scroll-behavior: smooth;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-blue-100 to-gray-200 min-h-screen">

    <div class="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-4 fade-in">

        <h1 class="text-3xl font-bold text-center mb-4 text-blue-600">
            🗳️ ElectionGuide AI
        </h1>

        <div id="chatBox" class="h-96 overflow-y-auto border p-3 mb-3 rounded-lg bg-gray-50"></div>

        <div class="flex gap-2">
            <input id="userInput"
                class="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ask about elections..." />
            <button onclick="sendMessage()" class="bg-blue-500 text-white px-4 rounded-lg btn">
                Send
            </button>
        </div>

        <div class="mt-4 flex gap-2 flex-wrap">
            <button onclick="quickAsk('Explain election process')" class="bg-gray-200 px-3 py-1 rounded-lg btn">Election
                Process</button>

            <button onclick="quickAsk('How to vote in India')" class="bg-gray-200 px-3 py-1 rounded-lg btn">How to
                Vote</button>

            <button onclick="quickAsk('What is voter eligibility')"
                class="bg-gray-200 px-3 py-1 rounded-lg btn">Eligibility</button>

            <button onclick="quickAsk('Explain election timeline')"
                class="bg-gray-200 px-3 py-1 rounded-lg btn">Timeline</button>
        </div>

    </div>

    <script>
        const chatBox = document.getElementById("chatBox");

        // 🧠 Smart fake AI responses
        function getResponse(message) {
            message = message.toLowerCase();

            if (message.includes("process")) {
                return `Election Process:
1. Voter Registration
2. Candidate Nomination
3. Campaigning
4. Voting Day
5. Vote Counting
6. Result Declaration`;
            }

            if (message.includes("vote")) {
                return `How to Vote:
1. Check your eligibility (18+ citizen)
2. Register as a voter
3. Get your Voter ID
4. Visit polling booth
5. Cast your vote using EVM`;
            }

            if (message.includes("eligibility")) {
                return `Voter Eligibility:
- Must be 18 years or older
- Must be a citizen
- Should be registered in electoral roll`;
            }

            if (message.includes("timeline")) {
                return `Election Timeline:
- Announcement
- Nomination filing
- Campaign period
- Voting day
- Counting day
- Results`;
            }

            return `Elections are democratic processes where people choose their leaders by voting.

You can ask about:
• Election process
• Voting steps
• Eligibility
• Timeline`;
        }

        // ✨ Add message
        function addMessage(message, sender) {
            const div = document.createElement("div");
            div.className = sender === "user"
                ? "text-right mb-2 fade-in"
                : "text-left mb-2 fade-in";

            div.innerHTML = `
    <span class="inline-block px-3 py-2 rounded-lg 
    ${sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}">
      ${message.replace(/\n/g, "<br>")}
    </span>
  `;

            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // ✨ Typing effect
        function typeEffect(text) {
            let i = 0;

            const div = document.createElement("div");
            div.className = "text-left mb-2 fade-in";

            const span = document.createElement("span");
            span.className = "inline-block px-3 py-2 rounded-lg bg-gray-300";

            div.appendChild(span);
            chatBox.appendChild(div);

            function typing() {
                if (i < text.length) {
                    span.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
                    i++;
                    setTimeout(typing, 15);
                }
            }

            typing();
        }

        // 🚀 Send message
        function sendMessage() {
            const input = document.getElementById("userInput");
            const message = input.value.trim();

            if (!message) return;

            addMessage(message, "user");
            input.value = "";

            // Loading animation
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "text-left mb-2 fade-in";
            loadingDiv.innerHTML = `
    <span class="inline-block px-3 py-2 rounded-lg bg-gray-300 typing">
      <span>.</span><span>.</span><span>.</span>
    </span>
  `;
            chatBox.appendChild(loadingDiv);

            setTimeout(() => {
                chatBox.removeChild(loadingDiv);

                const reply = getResponse(message);
                typeEffect(reply);

            }, 800);
        }

        // Quick buttons
        function quickAsk(text) {
            document.getElementById("userInput").value = text;
            sendMessage();
        }
    </script>

</body>

</html>
