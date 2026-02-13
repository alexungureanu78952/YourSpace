# Ollama AI Assistant Setup

This project uses [Ollama](https://ollama.com/) for local, free, privacy-friendly AI code generation.

## 1. Install Ollama
- Download and install from https://ollama.com/download
- Start Ollama (it runs as a background service on port 11434)

## 2. Pull the required model
- Recommended: Llama 3 (best for code and general tasks)
- In terminal, run:

```sh
ollama pull llama3
```

You can use other models (e.g., `mistral`, `codellama`, etc.) by editing the model name in `OllamaAiAssistantService.cs`.

## 3. Run the backend
- Start the backend as usual:

```sh
cd backend/YourSpace.ApiService
 dotnet run --urls "http://localhost:5000"
```

## 4. Usage
- The AI Assistant now works locally, with no API key or cloud dependency.
- If you want to change the model, edit the constructor in `OllamaAiAssistantService.cs`.

## 5. Troubleshooting
- If you get connection errors, make sure Ollama is running (`ollama serve` or check the tray icon).
- For advanced usage, see https://ollama.com/library

---

**Do NOT commit model files to git!**
Add this to your `.gitignore`:
```
ollama/models/
```

