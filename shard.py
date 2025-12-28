import onnx
import os
from onnx.utils import extract_model
from onnx.external_data_helper import convert_model_to_external_data

def force_save_shard(model_path, output_name, data_name, input_names, output_names):
    # 1. Load the shard that extract_model just created
    # We load it without data first to prune it
    proto = onnx.load(model_path, load_external_data=False)
    
    # 2. Clean up unused weights (Initializers)
    used_inputs = {node_input for node in proto.graph.node for node_input in node.input}
    new_initializers = [init for init in proto.graph.initializer if init.name in used_inputs]
    del proto.graph.initializer[:]
    proto.graph.initializer.extend(new_initializers)
    
    # 3. FORCE external data conversion
    convert_model_to_external_data(
        proto,
        all_tensors_to_one_file=True,
        location=data_name,
        size_threshold=0 
    )
    
    # 4. Save the final version
    onnx.save_model(proto, output_name)
    print(f"✅ Created {output_name} (~250KB) and {data_name} (~1.3GB)")

# --- EXECUTION ---
input_path = "model.onnx"
cut_node = "/model/layers.16/input_layernorm/output_0"

print("Snipping Laptop Shard...")
# We pass the PATH (string), not the model object
extract_model(input_path, "laptop_raw.onnx", ["input_ids"], [cut_node], check_model=False)
force_save_shard("laptop_raw.onnx", "laptop.onnx", "laptop.onnx.data", ["input_ids"], [cut_node])

print("\nSnipping Server Shard...")
extract_model(input_path, "server_raw.onnx", [cut_node], ["logits"], check_model=False)

# Rename server input to avoid the 'Duplicate' error
server_proto = onnx.load("server_raw.onnx", load_external_data=False)
for input_tensor in server_proto.graph.input:
    if input_tensor.name == cut_node:
        input_tensor.name = cut_node + "_input"

for node in server_proto.graph.node:
    for i, name in enumerate(node.input):
        if name == cut_node:
            node.input[i] = cut_node + "_input"

# Save the modified server proto temporarily to process it
onnx.save_model(server_proto, "server_tmp.onnx")
force_save_shard("server_tmp.onnx", "server.onnx", "server.onnx.data", [cut_node + "_input"], ["logits"])

# Cleanup raw temp files
for f in ["laptop_raw.onnx", "server_raw.onnx", "server_tmp.onnx"]:
    if os.path.exists(f): os.remove(f)

print("\n🚀 DONE! Check your folder for the 4 files.")