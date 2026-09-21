import { spawn } from "child_process";
import { SignJWT } from "jose";
import fs from "fs";

async function main() {
  const SECRET_KEY = new TextEncoder().encode("anjani_super_secret_jwt_key_2026_textile");
  const token = await new SignJWT({
    id: "user-admin-1",
    name: "Anjani Admin",
    email: "admin@anjaniindustries.com",
    role: "Super Admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9223;

  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1280,1000",
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

    await send("Network.enable");
    await send("Page.enable");

    // Set cookie
    await send("Network.setCookie", {
      name: "admin_token",
      value: token,
      domain: "localhost",
      path: "/",
    });

    // Navigate to product edit page
    await send("Page.navigate", {
      url: "http://localhost:3222/admin/products/prod-1",
    });

    // Wait for page and Quill to mount
    await new Promise((r) => setTimeout(r, 3000));

    const { data } = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    fs.writeFileSync("d:/Anjani-frontend/test_admin_editor_shot.png", Buffer.from(data, "base64"));
    console.log("Screenshot saved to test_admin_editor_shot.png");

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
