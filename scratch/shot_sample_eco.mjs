import { spawn } from "child_process";
import fs from "fs";

async function main() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9224;

  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1280,1100",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const pages = await listRes.json();
    const wsUrl = pages[0]?.webSocketDebuggerUrl;

    if (!wsUrl) throw new Error("No webSocketDebuggerUrl found");

    const ws = new WebSocket(wsUrl);
    let id = 1;

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener("message", handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise((resolve) => ws.addEventListener("open", resolve));

    await send("Page.enable");
    await send("Page.navigate", {
      url: "http://localhost:3222/plc-based-low-liquor-ratio-sample-eco-soft-flow-dyeing-machine",
    });

    await new Promise((r) => setTimeout(r, 2500));

    const { data } = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    fs.writeFileSync("d:/Anjani-frontend/test_sample_eco.png", Buffer.from(data, "base64"));
    console.log("Screenshot successfully saved to test_sample_eco.png");

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
