import zmq
import numpy as np
import onnxruntime as ort

print("🧠 AuraP2P Peer Server ONLINE")

sess = ort.InferenceSession(
    "model.onnx",
    providers=["CPUExecutionProvider"]
)

inputs_meta = sess.get_inputs()
input_names = [i.name for i in inputs_meta]

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://0.0.0.0:5555")

while True:
    payload = socket.recv_pyobj()
    input_ids = payload["input_ids"]

    batch, seq_len = input_ids.shape

    ort_inputs = {}

    for meta in inputs_meta:
        name = meta.name

        # ---- Main inputs ----
        if name == "input_ids":
            ort_inputs[name] = input_ids.astype(np.int64)

        elif name == "attention_mask":
            ort_inputs[name] = np.ones((batch, seq_len), dtype=np.int64)

        # ---- KV cache (DUMMY, correct shape) ----
        elif "past_key_values" in name:
            ort_inputs[name] = np.zeros(
                (1, 32, 0, 96), dtype=np.float32
            )

        # ---- Safety fallback ----
        else:
            ort_inputs[name] = np.zeros(
                [1 if d is None else d for d in meta.shape],
                dtype=np.float32
            )

    outputs = sess.run(None, ort_inputs)
    logits = outputs[0]

    socket.send_pyobj(logits)