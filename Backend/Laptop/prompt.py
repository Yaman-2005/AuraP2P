import sys
import zmq
import numpy as np
from transformers import AutoTokenizer

# ---------------- CONFIG ----------------
SERVER_IP = "192.168.0.111"
PORT = 5555
MAX_TOKENS = 64
# ----------------------------------------

def main():
    if len(sys.argv) < 2:
        print("ERROR: No prompt provided", flush=True)
        sys.exit(1)

    user_prompt = sys.argv[1]

    tokenizer = AutoTokenizer.from_pretrained(
        "microsoft/Phi-3-mini-4k-instruct"
    )
    print((f"Loaded tokenizer with vocab size {tokenizer.vocab_size}"))
    # ZeroMQ setup
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect(f"tcp://{SERVER_IP}:{PORT}")

    # Build prompt
    prompt = f"<|user|>\n{user_prompt}<|end|>\n<|assistant|>\n"
    tokens = tokenizer(prompt, return_tensors="np")["input_ids"].astype(np.int64)

    prev_text = tokenizer.decode(
        tokens[0],
        skip_special_tokens=True,
        clean_up_tokenization_spaces=True
    )

    # Generation loop
    for _ in range(MAX_TOKENS):
        socket.send_pyobj({"input_ids": tokens})
        logits = socket.recv_pyobj()  # [1, seq, vocab]

        next_id = int(np.argmax(logits[0, -1]))

        if next_id == tokenizer.eos_token_id:
            break

        tokens = np.concatenate(
            [tokens, [[next_id]]],
            axis=1
        )

        new_text = tokenizer.decode(
            tokens[0],
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True
        )

        delta = new_text[len(prev_text):]
        if delta:
            print(delta, end="", flush=True)

        prev_text = new_text

if __name__ == "__main__":
    main()
