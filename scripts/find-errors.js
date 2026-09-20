const fs = require("fs");
const content = fs.readFileSync("super-linter-push.log", "utf8");
const clean = content.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
const lines = clean.split("\n");
const errors = lines.filter((l) => l.toLowerCase().includes("error"));
errors.slice(-50).forEach((e) => console.log(e));
