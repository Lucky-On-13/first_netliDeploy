const send_com = document.getElementById("send-com");
const theComment = document.getElementById("theComment");
const ComMessage = document.getElementById("commentMessage");
const troll_number = document.getElementById("troll_number");
const dateTime = document.getElementById("dateTime");
const loader = document.getElementById("loader");

const API_KEY = "AIzaSyDZKxGV5sHh57Rb3n_eB6-FyhF33Y_ZqfI";

async function analyzeComment(comment) {
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

    const body = {
        comment: { text: comment },
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} }
    }; 

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data.attributeScores?.TOXICITY?.summaryScore?.value || 0; // Sécurité en cas d'erreur API
}


function replaceVowels(text) {
    return text.replace(/[aeiouAEIOU]/g, ' ');
}

async function filterComment(comment) {
    let words = comment.split(/\b/); // without punctuation
    let counter = 0;
    let containsOffensiveWord = false;

    for (let word of words) {
        let cleanWord = word.replace(/[^\w\s]/g, ''); // clean punctuation
        if (cleanWord) {
            let score = await analyzeComment(cleanWord);
            if (score >= 0.75) {
                counter++;
                containsOffensiveWord = true;
            }
        }
    }

    let filteredComment = containsOffensiveWord
        ? words.map(replaceVowels).join("")
        : comment;

    return { filteredComment, counter };
}

send_com.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const userComment = document.getElementById("user_comment").value.trim();

    if (!userComment) {
        // troll_number.style.fontSize = "1.7ch";
        troll_number.innerText = "⚠️Empty comments are not allowed.";
        return;
    }

    loader.style.display = "block";

    const { filteredComment, counter } = await filterComment(userComment);

    loader.style.display = "none";

    if (counter > 0) {
        troll_number.style.color = "red";
        troll_number.innerText = `${counter} bad word(s)`;
    } else {
        troll_number.style.color = "green";
        troll_number.innerText = "No bad words detected";
    }

    
    theComment.innerText = `" ${filteredComment} "`;
    dateTime.innerText = `🕒 ${new Date().toLocaleString()}`;
});
