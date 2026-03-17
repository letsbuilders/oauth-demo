import "./style.css";
import {
  getPayload,
  getUserEmail,
  handleAuthCallback,
  login,
  logout,
  refresh,
} from "./auth";

const appEl = document.querySelector<HTMLDivElement>("#app")!;

function renderApp(username: string | null) {
  appEl.innerHTML = `
    <div class="card">
      <h1>OAuth Demo SPA</h1>
      <p>
        ${
    username ? `Signed in as <strong>${username}</strong>` : "Not signed in"
  }
      </p>
      <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
        <button id="login-btn" type="button"${username ? " disabled" : ""}>
          Login
        </button>
        <button id="logout-btn" type="button"${username ? "" : " disabled"}>
          Logout
        </button>
        <button id="refresh-btn" type="button"${username ? "" : " disabled"}>
          Refresh token
        </button>
      </div>
      <pre id="user-json" style="margin-top: 1.5rem; text-align: left; white-space: pre-wrap;"></pre>
    </div>
  `;
}

async function bootstrap() {
  if (window.location.pathname === "/auth-callback") {
    await handleAuthCallback();
    return;
  }

  const payload = await getPayload();

  renderApp(await getUserEmail());

  const loginBtn = document.querySelector<HTMLButtonElement>("#login-btn");
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logout-btn");
  const userJsonEl = document.querySelector<HTMLPreElement>("#user-json");
  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");

  if (payload && userJsonEl) {
    userJsonEl.textContent = JSON.stringify(payload, null, 2);
  }

  loginBtn?.addEventListener("click", () => {
    login();
  });

  logoutBtn?.addEventListener("click", () => {
    logout();
  });
  refreshBtn?.addEventListener("click", () => {
    refresh().then(async (user) => {
      console.log("u",user);
      if (user && userJsonEl) {
        userJsonEl.textContent = JSON.stringify(user, null, 2);
      }
    });
  });
}

bootstrap();
