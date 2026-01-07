import onnx
from onnx import helper
import os
from onnx.external_data_helper import convert_model_to_external_data

def total_context_surgery():
    print("📋 Loading source model...")
    model = onnx.load("model.onnx", load_external_data=False)
    graph = model.graph

    # Define the starting point
    gate_node = "/model/layers.16/input_layernorm/output_0"
    
    # 1. Identify nodes for Layers 16-31
    server_nodes = []
    found_start = False
    for node in graph.node:
        if any(inp == gate_node for inp in node.input):
            found_start = True
        if found_start:
            server_nodes.append(node)

    # 2. Identify ALL missing inputs
    # We find every input required by our nodes that ISN'T produced by our nodes
    internal_outputs = {out for node in server_nodes for out in node.output}
    missing_inputs = set()
    for node in server_nodes:
        for inp in node.input:
            if inp not in internal_outputs and inp != "":
                missing_inputs.add(inp)

    # 3. Clone weights (Initializers)
    full_model_with_data = onnx.load("model.onnx", load_external_data=True)
    server_initializers = [init for init in full_model_with_data.graph.initializer if init.name in missing_inputs]
    
    # Filter missing_inputs to remove what we just found in initializers
    weight_names = {init.name for init in server_initializers}
    required_graph_inputs = [name for name in missing_inputs if name not in weight_names]

    print(f"🔗 Wiring {len(required_graph_inputs)} external context inputs (including KV caches)...")

    # 4. Create Graph Inputs for everything else
    new_input_protos = []
    for name in required_graph_inputs:
        # Pull original type/shape info from the main graph
        orig_info = next((i for i in list(graph.input) + list(graph.value_info) if i.name == name), None)
        if orig_info:
            new_info = helper.make_tensor_value_info(name, orig_info.type.tensor_type.elem_type, None)
            new_info.CopyFrom(orig_info)
            new_input_protos.append(new_info)

    logits_info = next(o for o in graph.output if o.name == "logits")

    # 5. Build Graph with Opset 21 / IR 8
    new_graph = helper.make_graph(
        nodes=server_nodes,
        name="AuraP2P_Server_Shard",
        inputs=new_input_protos,
        outputs=[logits_info],
        initializer=server_initializers
    )

    new_model = helper.make_model(new_graph, producer_name="AuraP2P")
    new_model.ir_version = 8 
    del new_model.opset_import[:]
    opset = new_model.opset_import.add()
    opset.domain, opset.version = "", 21 
    
    # 6. Save
    for f in ["server.onnx", "server.onnx.data"]:
        if os.path.exists(f): os.remove(f)

    convert_model_to_external_data(new_model, all_tensors_to_one_file=True, location="server.onnx.data", size_threshold=0)
    onnx.save_model(new_model, "server.onnx")
    print(f"✅ DONE! Server shard is now 'State-Aware'.")

total_context_surgery()