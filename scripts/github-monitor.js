const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const STATE_FILE = path.join(__dirname, ".github-monitor-state.json");
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const REALERT_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes
const MAX_ALERTS_PER_TICK = 4; // Pagination to prevent overwhelming the agent

let state = {
  reportedRuns: {}, // Map of runId to last alerted timestamp
  reportedComments: {}, // Map of commentId to last alerted timestamp
};

// Load previous state
if (fs.existsSync(STATE_FILE)) {
  try {
    const loadedState = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    if (Array.isArray(loadedState.reportedRuns)) {
      loadedState.reportedRuns.forEach(id => state.reportedRuns[id] = Date.now());
      loadedState.reportedComments.forEach(id => state.reportedComments[id] = Date.now());
    } else {
      state = loadedState;
    }
  } catch (e) {
    // ignore
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function checkGitHub() {
  try {
    const now = Date.now();
    let alertsThisTick = 0;

    // 1. Check for failed workflow runs
    const runsOutput = execSync(
      "gh run list --limit 15 --json databaseId,status,conclusion,name,url,headBranch",
      { encoding: "utf8" }
    );
    const runs = JSON.parse(runsOutput);

    const latestRuns = {};
    for (const run of runs) {
      if (!latestRuns[run.name]) {
        latestRuns[run.name] = run;
      }
    }

    for (const workflowName in latestRuns) {
      if (alertsThisTick >= MAX_ALERTS_PER_TICK) break;

      const run = latestRuns[workflowName];
      if (run.status === "completed" && run.conclusion === "failure") {
        const lastAlerted = state.reportedRuns[run.databaseId] || 0;
        
        if (now - lastAlerted > REALERT_INTERVAL_MS) {
          console.log(
            `\n🚨 HIGH PRIORITY ALERT: Workflow Failed! 🚨\nWorkflow: ${run.name}\nBranch: ${run.headBranch}\nURL: ${run.url}\nAgent: Please fetch the logs for this run, identify the issue, and apply a fix.`
          );
          state.reportedRuns[run.databaseId] = now;
          saveState();
          alertsThisTick++;
        }
      }
    }

    // 2. Check for recent PR comments or requested changes
    const prsOutput = execSync(
      "gh pr list --state open --json number,title,url",
      { encoding: "utf8" }
    );
    const prs = JSON.parse(prsOutput);

    for (const pr of prs) {
      if (alertsThisTick >= MAX_ALERTS_PER_TICK) break;

      const prDetailsOutput = execSync(
        `gh pr view ${pr.number} --json reviews,comments`,
        { encoding: "utf8" }
      );
      const prDetails = JSON.parse(prDetailsOutput);

      const allFeedback = [
        ...(prDetails.reviews || []),
        ...(prDetails.comments || []),
      ];

      for (const feedback of allFeedback) {
        if (alertsThisTick >= MAX_ALERTS_PER_TICK) break;

        if (
          feedback.state === "CHANGES_REQUESTED" ||
          feedback.author?.login === "github-actions" ||
          feedback.author?.login === "gemini-cli"
        ) {
          const feedbackId = feedback.id || feedback.url;
          if (feedbackId) {
            const lastAlerted = state.reportedComments[feedbackId] || 0;
            if (now - lastAlerted > REALERT_INTERVAL_MS) {
              console.log(
                `\n💬 HIGH PRIORITY ALERT: PR Feedback Received! 💬\nPR: #${pr.number} - ${pr.title}\nURL: ${pr.url}\nComment: ${feedback.body}\nAgent: Please review this feedback and implement the requested changes.`
              );
              state.reportedComments[feedbackId] = now;
              saveState();
              alertsThisTick++;
            }
          }
        }
      }
    }
  } catch (error) {
    // Stay silent on errors so we don't spam the agent.
  }
}

// Run once and exit
checkGitHub();
