const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const STATE_FILE = path.join(__dirname, ".github-monitor-state.json");
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let state = {
  reportedRuns: [],
  reportedComments: [],
};

// Load previous state
if (fs.existsSync(STATE_FILE)) {
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch (e) {
    // ignore
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function checkGitHub() {
  try {
    // 1. Check for failed workflow runs
    // We only fetch the last 5 runs to be efficient
    const runsOutput = execSync(
      "gh run list --limit 5 --json databaseId,status,conclusion,name,url,headBranch",
      { encoding: "utf8" },
    );
    const runs = JSON.parse(runsOutput);

    for (const run of runs) {
      if (run.status === "completed" && run.conclusion === "failure") {
        if (!state.reportedRuns.includes(run.databaseId)) {
          console.log(
            `\n🚨 HIGH PRIORITY ALERT: Workflow Failed! 🚨\nWorkflow: ${run.name}\nBranch: ${run.headBranch}\nURL: ${run.url}\nAgent: Please fetch the logs for this run, identify the issue, and apply a fix.`,
          );
          state.reportedRuns.push(run.databaseId);
          saveState();
        }
      }
    }

    // 2. Check for recent PR comments or requested changes
    const prsOutput = execSync(
      "gh pr list --state open --json number,title,url",
      { encoding: "utf8" },
    );
    const prs = JSON.parse(prsOutput);

    for (const pr of prs) {
      const prDetailsOutput = execSync(
        `gh pr view ${pr.number} --json reviews,comments`,
        { encoding: "utf8" },
      );
      const prDetails = JSON.parse(prDetailsOutput);

      const allFeedback = [
        ...(prDetails.reviews || []),
        ...(prDetails.comments || []),
      ];

      for (const feedback of allFeedback) {
        // Simple heuristic: if it's a review requesting changes, or a recent comment from a bot/reviewer
        if (
          feedback.state === "CHANGES_REQUESTED" ||
          feedback.author?.login === "github-actions" ||
          feedback.author?.login === "gemini-cli"
        ) {
          const feedbackId = feedback.id || feedback.url;
          if (feedbackId && !state.reportedComments.includes(feedbackId)) {
            console.log(
              `\n💬 HIGH PRIORITY ALERT: PR Feedback Received! 💬\nPR: #${pr.number} - ${pr.title}\nURL: ${pr.url}\nComment: ${feedback.body}\nAgent: Please review this feedback and implement the requested changes.`,
            );
            state.reportedComments.push(feedbackId);
            saveState();
          }
        }
      }
    }
  } catch (error) {
    // Stay silent on errors (e.g. network issues) so we don't spam the agent.
    // If auth is broken, it will fail silently here until fixed.
  }
}

// Start polling
setInterval(checkGitHub, POLL_INTERVAL_MS);
// Run once immediately
checkGitHub();
