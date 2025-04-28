const api = "http:144.39.166.24:8080/completion";

const systemPrompt = "You are a helpful assistant. Your name is Jimmy. You will speak in a friendly, casual and concise manner. You will only output the answer to the user's prompt.";

const predictedTokens = 64;

async function makeAPICall(options) {
    const result = await fetch(api, options);
    return result.json();
}

async function textCompletion(user_prompt) {
    options = {
        method: "POST",
        body: JSON.stringify({
            prompt: `${systemPrompt}\n Answer the following prompt: ${user_prompt}`,
            n_predict: predictedTokens,
        }),
        model: "gemma3"
    };

    const result = await makeAPICall(options);
    return result;
}

// textCompletion("How many people are in the world?")
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });

const chatContainer = document.getElementById("chat-container");
const spinner = document.getElementById("lds-spinner");

const input = document.getElementById("user-field");
const button = document.getElementById("submit-prompt");

let ready = true;

function submitPrompt() {
    if (!ready) return;
    ready = false;
    const prompt = input.value;
    input.value = "";
    spinner.style.visibility = "visible";

    makePromptCard(prompt);

    textCompletion(prompt)
        .then(response =>
            makeResponseCard(response.content)
        )
        .catch((error) => {
            makeResponseCard("Sorry, I couldn't process your request. I am likely processing another user's request. Please try again soon.");
        });
}

button.addEventListener("click", submitPrompt);
spinner.style.visibility = "hidden";

function makePromptCard(prompt) {
    const card = document.createElement("div");
    card.className = "user-message";
    card.innerHTML = prompt;
    chatContainer.appendChild(card);
}

function makeResponseCard(response) {
    const card = document.createElement("div");
    card.className = "jimmy-message";
    card.innerHTML = response;
    spinner.style.visibility = "hidden";
    ready = true;
    chatContainer.appendChild(card);
}
