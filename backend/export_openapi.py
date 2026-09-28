import yaml
import sys
from pathlib import Path

# Add the current directory to sys.path so we can import the FastAPI app
sys.path.append(str(Path(__file__).resolve().parent))

from main import app

def export_swagger():
    """Extracts the OpenAPI JSON from FastAPI and saves it as a YAML file."""
    print("Generating OpenAPI Specification...")
    
    # FastAPI automatically generates the OpenAPI schema based on our Pydantic models
    openapi_schema = app.openapi()
    
    output_path = Path(__file__).resolve().parent.parent / "swagger.yaml"
    
    with open(output_path, "w") as f:
        yaml.dump(openapi_schema, f, sort_keys=False, allow_unicode=True)
        
    print(f"✅ Successfully exported OpenAPI spec to {output_path}")

if __name__ == "__main__":
    export_swagger()
