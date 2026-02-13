# PowerShell script to pull the recommended Ollama model for this project
# Usage: ./ollama-pull-model.ps1

$Model = "llama3"

Write-Host "Pulling Ollama model: $Model ..."
ollama pull $Model
Write-Host "Done."
