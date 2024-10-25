import { Emotes } from "./Emotes.js";
import { parseTwitchIRCMessage } from "./Irc.js";

const allEmotes = new Map();

Emotes.getChannelEmotes("94753024").then((emotes) => {
	for (const service in emotes) {
		for (const emote in emotes[service]) {
			allEmotes.set(emote, emotes[service][emote]);
		}
	}
});
Emotes.getGlobalEmotes().then((emotes) => {
	for (const service in emotes) {
		for (const emote in emotes[service]) {
			allEmotes.set(emote, emotes[service][emote]);
		}
	}
});

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv/");

socket.addEventListener("open", () => {
	console.log("Connected to chat WebSocket");
	socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
	socket.send("PASS SCHMOOPIIE");
	socket.send("NICK justinfan12034");
	socket.send("USER justinfan12034 8 * :justinfan12034");
	socket.send(`JOIN ${location.hash}`);
});

socket.addEventListener("message", (event) => {
	const data = event.data;
	const msg = parseTwitchIRCMessage(data);
	console.log(msg);
	addMessage(msg.tags["display-name"], msg.trailing, msg);
});

socket.addEventListener("close", () => {
	console.log("Disconnected from chat WebSocket");
});

function addMessage(username, message, msg) {
	if (!username) return;

	const messageDiv = document.createElement("div");
	messageDiv.classList.add("chat-message");

	const emoteMessage = message.split(" ").map((str) => {
		if (allEmotes.has(str)) {
			const emote = allEmotes.get(str);
			return `<img src="${emote.url_x2}" />`;
		}
		return str;
	});

	messageDiv.innerHTML = `<span class="username" style="--color:${msg.tags["color"]};">${username}</span>: <span class="message">${emoteMessage.join(" ")}</span>`;

	chat.appendChild(messageDiv);
	if (chat.children.length > 100) {
		chat.removeChild(chat.firstChild);
	}
	chat.lastChild.scrollIntoView();
}
