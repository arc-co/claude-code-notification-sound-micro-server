# Sound Notification System

A minimal web-based notification system that allows Docker containers to trigger sound alerts on your local machine. Perfect for getting notified when Claude Code finishes tasks in YOLO mode!

## Why This is Useful

When running Claude Code in **YOLO mode** (autonomous agent mode) inside a VS Code dev container, you can:
- Start a complex task and switch to other work
- Keep the notification page open in a browser tab on your host machine
- Get an instant sound notification when Claude finishes
- No need to constantly check back on the container

This is especially handy because:
- Dev containers run isolated from your host machine's notification system
- Long-running AI tasks can take minutes to complete
- You can stay productive on other tasks while Claude works
- The sound alert brings your attention back when needed

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set your BEARER_TOKEN
   ```

3. **Start the server:**
   ```bash
   BEARER_TOKEN=your-secret-token PORT=3000 npm start
   ```

4. **Open the frontend:**
   - Navigate to `http://localhost:3000` in your browser
   - Keep this tab open to receive notifications

## Usage

### With Claude Code (Recommended Setup)

**1. Start the notification server on your host machine:**

```bash
# Set a strong bearer token
BEARER_TOKEN=my-secret-token-123 PORT=3000 npm start
```

**2. Open the frontend in your browser:**
```
http://localhost:3000
```
Keep this tab open - it will play a sound when Claude Code finishes tasks.

**3. Configure Claude Code hooks in your dev container:**

Create or edit `.claude/settings.local.json` in your project:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST http://localhost:3000/notify -H 'Authorization: Bearer my-secret-token-123'"
          }
        ]
      }
    ]
  }
}
```

**4. Use Claude Code in YOLO mode:**
- Start a task with Claude Code agent
- Switch to other work while Claude runs autonomously
- Hear a notification sound when the task completes
- Return to check the results

**Important Notes:**
- The `Stop` hook triggers when Claude Code finishes or stops a task
- If running in a dev container, use `http://host.docker.internal:3000/notify` instead of `localhost`
- Make sure the bearer token in your hook matches your server's `BEARER_TOKEN`

### From Docker Container

Make a POST request to trigger a sound notification:

```bash
curl -X POST http://host.docker.internal:3000/notify \
  -H "Authorization: Bearer your-secret-token"
```

### Test Locally

```bash
curl -X POST http://localhost:3000/notify \
  -H "Authorization: Bearer your-secret-token"
```

## Configuration

Environment variables:
- `BEARER_TOKEN` (required) - Authentication token for API requests
- `PORT` (optional, default: 3000) - Server port

## API Endpoints

- `GET /` - Frontend interface
- `POST /notify` - Trigger notification (requires Bearer token)
- `GET /events` - SSE endpoint for frontend clients
- `GET /health` - Health check endpoint

## Security

**⚠️ This is NOT a production-grade server**

This is a minimal notification microservice with basic bearer token authentication. It's designed for simplicity and convenience during development.

**Security Features:**
- ✅ Bearer token authentication on `/notify` endpoint
- ✅ Can be deployed locally or on cloud with private URLs
- ❌ No rate limiting
- ❌ No HTTPS enforcement
- ❌ No advanced security features

**Deployment Options:**

1. **Local Development (Most Common)**
   - Run on `localhost` for dev containers
   - Minimal security concerns as it's not network-exposed

2. **Cloud Deployment with Private URL**
   - Deploy to cloud platforms (Railway, Render, Fly.io, etc.)
   - Use a private/obscure URL that's not publicly discoverable
   - The bearer token adds a layer of protection

**Best Practices:**

- ✅ Use a strong random token (`openssl rand -hex 32`)
- ✅ Keep your bearer token secret - never commit `.env` to git
- ✅ Verify `.claude/settings.local.json` is in your `.gitignore`
- ✅ Use different tokens for different projects/deployments
- ✅ If deploying to cloud, use a non-obvious URL
- ✅ Rotate tokens periodically
- ⚠️ Understand this is basic security suitable for a low-risk notification system

**Risk Assessment:**
- The worst-case scenario is someone triggering unwanted sound notifications
- No sensitive data is transmitted or stored
- The bearer token prevents casual unauthorized access
- For a simple notification service, this security level is reasonable

