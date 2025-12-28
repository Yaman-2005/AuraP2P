import onnx
import os
import re
from onnx.external_data_helper import convert_model_to_external_data

def nuclear_prune():
    onnx_file = "server.onnx"
    data_file = "server.onnx.data"
    print("Start")
    model = onnx.load(onnx_file, load_external_data=True)
    initializers = model.graph.initializer
    optimized_initializers = []
    print("Filtering")
    for init in initializers:
        match = re.search(r'layers\.(\d+)\.', init.name)
        if match:
            layer_num = int(match.group(1))
            if layer_num >= 16:
                optimized_initializers.append(init)
        else:
            optimized_initializers.append(init)
    del model.graph.initializer[:]
    model.graph.initializer.extend(optimized_initializers)
    if os.path.exists(data_file):
        os.remove(data_file)
    convert_model_to_external_data(
        model,
        all_tensors_to_one_file=True,
        location=data_file,
        size_threshold=0
    )
    onnx.save_model(model, onnx_file)
    print(f"COMPLETE")
nuclear_prune()