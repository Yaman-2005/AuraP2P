import onnx
from onnx import helper
import os
from onnx.external_data_helper import convert_model_to_external_data

def full_circuit_laptop_surgery():
    print("📋 Loading source model...")
    model = onnx.load("model.onnx", load_external_data=False)
    graph = model.graph

    # The gate where we cut (Input to Layer 16)
    gate_node_name = "/model/layers.16/input_layernorm/output_0"
    
    # 1. Identify nodes for Layers 0-15
    laptop_nodes = []
    for node in graph.node:
        laptop_nodes.append(node)
        if gate_node_name in node.output:
            break

    print(f"✂️ Sliced {len(laptop_nodes)} nodes. Identifying all required wires...")

    # 2. Automatically find EVERY required input
    internal_outputs = {out for node in laptop_nodes for out in node.output}
    missing_inputs = set()
    for node in laptop_nodes:
        for inp in node.input:
            if inp not in internal_outputs and inp != "":
                missing_inputs.add(inp)

    # 3. Clone weights (Initializers)
    full_model_with_data = onnx.load("model.onnx", load_external_data=True)
    laptop_initializers = [init for init in full_model_with_data.graph.initializer if init.name in missing_inputs]
    
    weight_names = {init.name for init in laptop_initializers}
    required_graph_inputs = [name for name in missing_inputs if name not in weight_names]

    # 4. Create Graph Inputs
    new_input_protos = []
    for name in required_graph_inputs:
        # Pull original type/shape info from the main model
        orig_info = next((i for i in list(graph.input) + list(graph.value_info) if i.name == name), None)
        if orig_info:
            new_info = helper.make_tensor_value_info(name, orig_info.type.tensor_type.elem_type, None)
            new_info.CopyFrom(orig_info)
            new_input_protos.append(new_info)

    # 5. Define Shard Output (The gate)
    new_output = helper.make_tensor_value_info(gate_node_name, onnx.TensorProto.FLOAT, [1, 'seq', 3072])

    # 6. Build Graph (Opset 21 / IR 8)
    new_graph = helper.make_graph(
        nodes=laptop_nodes,
        name="AuraP2P_Laptop_Shard",
        inputs=new_input_protos,
        outputs=[new_output],
        initializer=laptop_initializers
    )

    new_model = helper.make_model(new_graph, producer_name="AuraP2P")
    new_model.ir_version = 8 
    del new_model.opset_import[:]
    opset = new_model.opset_import.add()
    opset.domain, opset.version = "", 21 
    
    # Re-add custom domains (for SimplifiedLayerNormalization)
    for imp in model.opset_import:
        if imp.domain != "":
            new_model.opset_import.append(imp)

    # 7. Save
    print("💾 Saving laptop.onnx...")
    if os.path.exists("laptop.onnx"): os.remove("laptop.onnx")
    onnx.save_model(new_model, "laptop.onnx")
    print(f"✅ DONE! Laptop shard is now 'Full Circuit' (Opset {opset.version}).")

if __name__ == "__main__":
    full_circuit_laptop_surgery()