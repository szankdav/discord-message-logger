"use strict";

const tableForDatasDiv = document.getElementById("tableForDatas");
const allMessagesButton = document.getElementById("allMessages");
const lettersButton = document.getElementById("letters");

function generateTable(data) {
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  tr.classList.add("table-primary");
  const tbody = document.createElement("tbody");
  const headersForMessages = ["Id", "Author", "Content", "Created"];
  const headersForLetters = ["Id", "Author", "Letter", "Count"];

  if ("content" in data[0]) {
    for (const header of headersForMessages) {
      tableForDatasDiv.id = "messagesTable";
      const th = document.createElement("th");
      th.append(header);
      tr.append(th);
    }
  } else {
    for (const header of headersForLetters) {
      tableForDatasDiv.id = "lettersTable";
      const th = document.createElement("th");
      th.append(header);
      tr.append(th);
    }
  }

  for (const rowDatas of data) {
    tbody.append(generateRow(rowDatas));
  }

  thead.append(tr);
  table.append(thead);
  table.append(tbody);

  return table;
}

function generateRow(datas) {
  const tr = document.createElement("tr");
  const values = Object.values(datas);
  for (const data of values) {
    const td = document.createElement("td");
    td.append(document.createTextNode(data));
    tr.append(td);
  }
  return tr;
}

async function fetchMessages() {
  try {
    const response = await fetch("/api/messages");
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const messages = await response.json();
    if (messages.length > 0) {
      tableForDatasDiv.innerHTML = "";
      tableForDatasDiv.append(generateTable(messages));
    } else {
      tableForDatasDiv.append(
        document.createTextNode("There is nothing to show right now.")
      );
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

async function fetchLetters() {
  try {
    const response = await fetch("/api/letters");
    if (!response.ok) {
      throw new Error("Failed to fetch letters");
    }
    const letters = await response.json();
    if (letters.length > 0) {
      tableForDatasDiv.innerHTML = "";
      tableForDatasDiv.append(generateTable(letters));
    } else {
      tableForDatasDiv.append(
        document.createTextNode("There is nothing to show right now.")
      );
    }
  } catch (error) {
    console.error("Error fetching letters:", error);
  }
}

allMessagesButton.addEventListener("click", () => {
  fetchMessages();
});
lettersButton.addEventListener("click", () => {
  fetchLetters();
});

setInterval(() => {
  if (tableForDatasDiv.innerHTML != "") {
    if (tableForDatasDiv.id == "messagesTable") {
      fetchMessages();
    } else {
      fetchLetters();
    }
  }
}, 5000);
