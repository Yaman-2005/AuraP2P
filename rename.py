import onnx

# 1. Load the model blueprint
model = onnx.load("model.onnx", load_external_data=False)

# 2. Loop through every piece of "intelligence" (initializer) 
# and tell it to look in 'model.onnx.data' instead of the old long name
for initializer in model.graph.initializer:
    for entry in initializer.external_data:
        if entry.key == "location":
            entry.value = "model.onnx.data"

# 3. Save the fixed blueprint
onnx.save(model, "model.onnx")
print("Fixed metadata! Now try running your shard.py script again.")