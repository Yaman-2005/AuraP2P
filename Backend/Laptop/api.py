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
PROMPT_WORKER = "prompt.py"
DEFAULT_SERVER_IP = "192.168.0.111"
API_PORT = 8000
app = FastAPI(title="AuraP2P Node API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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

def is_ip_reachable(ip: str, port: int = 5555) -> bool:
    try:
        with socket.create_connection((ip, port), timeout=2):
            return True
    except Exception:
        return False
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
@app.websocket("/chat")
async def chat_ws(ws: WebSocket):
    await ws.accept()
    print("🔌 WS connected")
    try:
        while True:
            # 🔁 WAIT FOR NEXT PROMPT
            data = await ws.receive_json()
            prompt = data.get("prompt")

            if not prompt:
                await ws.send_text(json.dumps({
                    "type": "error",
                    "message": "No prompt provided"
                }))
                continue

            if not ONLINE or not CONNECTED_SERVER:
                await asyncio.sleep(2)  # demo delay
                await ws.send_text(json.dumps({
                    "type": "error",
                    "code": "OUT_OF_MEMORY",
                    "message": "Model cannot run locally. No swarm peers available."
                }))
                continue

            print(f"Prompt received: {prompt}")
            print("Spawning prompt worker")

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
                    print("Client disconnected during streaming")
                    process.kill()
                    return
            await process.wait()
            print("Worker finished")
            await ws.send_text("__DONE__")

    except WebSocketDisconnect:
        print("WS disconnected by client")

    except Exception as e:
        print("WS ERROR:", e)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=API_PORT,
        reload=False,
    )
