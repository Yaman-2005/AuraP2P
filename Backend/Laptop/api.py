import subprocess
import uuid
import asyncio
import json
import socket
from typing import List, Optional
import sys
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------- CONFIG ----------------
PROMPT_WORKER = "prompt.py"
DEFAULT_SERVER_IP = "192.168.0.111"
API_PORT = 8000
# ---------------------------------------

app = FastAPI(title="AuraP2P Node API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATE ----------------

NODE_ID = str(uuid.uuid4())[:8]
ONLINE = False
CONNECTED_SERVER: Optional[str] = None

PEERS = [
    {
        "id": "peer-1",
        "name": "Home Server",
        "ip": DEFAULT_SERVER_IP,
        "status": "online",
        "layers": {"start": 1, "end": 32},
        "hardware": {
            "type": "server",
            "cpu": "Intel i5-7400",
            "accelerator": "CPU",
            "ram": 16,
            "vram": 0,
        },
        "throughput": 6.5,
        "latency": 12,
    }
]

# ---------------- MODELS ----------------

class GoOnlineResponse(BaseModel):
    node_id: str
    status: str


class ConnectRequest(BaseModel):
    ip: str


class StatusResponse(BaseModel):
    node_id: str
    online: bool
    connected_server: Optional[str]
    peers: List[dict]


class ChatRequest(BaseModel):
    prompt: str


# ---------------- HELPERS ----------------

def is_ip_reachable(ip: str, port: int = 5555) -> bool:
    try:
        with socket.create_connection((ip, port), timeout=2):
            return True
    except Exception:
        return False


# ---------------- API ENDPOINTS ----------------

@app.post("/go-online", response_model=GoOnlineResponse)
def go_online():
    global ONLINE
    ONLINE = True
    return {
        "node_id": NODE_ID,
        "status": "online",
    }


@app.post("/connect-to-swarm")
def connect_to_swarm(req: ConnectRequest):
    global CONNECTED_SERVER

    if not is_ip_reachable(req.ip):
        return {"success": False, "error": "Peer not reachable"}

    CONNECTED_SERVER = req.ip
    return {
        "success": True,
        "connected_to": req.ip,
    }


@app.get("/status", response_model=StatusResponse)
def status():
    return {
        "node_id": NODE_ID,
        "online": ONLINE,
        "connected_server": CONNECTED_SERVER,
        "peers": PEERS,
    }


# ---------------- CHAT (STREAMING) ----------------

@app.websocket("/chat")
async def chat_ws(ws: WebSocket):
    await ws.accept()
    print("🔌 WS connected")

    try:
        data = await ws.receive_json()
        prompt = data.get("prompt")

        if not prompt:
            await ws.send_text("[ERROR] No prompt provided")
            return

        if not CONNECTED_SERVER:
            await ws.send_text("[ERROR] Not connected to swarm")
            return

        print(f"📥 Prompt received: {prompt}")
        print("🚀 Spawning prompt worker")

        process = await asyncio.create_subprocess_exec(
            sys.executable,
            "-u",
            PROMPT_WORKER,
            prompt,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        while True:
            chunk = await process.stdout.read(1)
            if not chunk:
                break

            try:
                await ws.send_text(chunk.decode("utf-8"))
            except WebSocketDisconnect:
                print("❌ Client disconnected during streaming")
                process.kill()
                return

        await process.wait()
        print("✅ Worker finished")

        await ws.send_text("__DONE__")

    except WebSocketDisconnect:
        print("❌ Client disconnected before completion")

    except Exception as e:
        print("❌ ERROR:", e)
        try:
            await ws.send_text(f"[ERROR] {e}")
        except:
            pass

    # ✅ DO NOTHING ELSE
    # FastAPI closes WS automatically



# ---------------- ENTRY ----------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=API_PORT,
        reload=False,
    )
