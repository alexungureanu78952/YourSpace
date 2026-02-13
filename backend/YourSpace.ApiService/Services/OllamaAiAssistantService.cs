using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services
{
    /// <summary>
    /// AI Assistant service using Ollama local API (http://localhost:11434).
    /// </summary>
    public class OllamaAiAssistantService : IAiAssistantService
    {
        private readonly HttpClient _httpClient;
        private readonly string _model;

        public OllamaAiAssistantService(HttpClient httpClient, string model = "smollm2")
        {
            _httpClient = httpClient;
            _model = model;
        }

        public async Task<GenerateCodeResponse> GenerateProfileCodeAsync(string prompt, string type = "both")
        {
            var request = new
            {
                model = _model,
                prompt = $"{prompt}\nGenerate only {type.ToUpper()} code for a user profile. Return only the code.",
                stream = false
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync("http://localhost:11434/api/generate", request);
                response.EnsureSuccessStatusCode();
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var content = doc.RootElement.GetProperty("response").GetString() ?? string.Empty;

                // Simple split: look for <style>...</style> for CSS, rest is HTML
                string html = content, css = string.Empty;
                int styleStart = content.IndexOf("<style>", StringComparison.OrdinalIgnoreCase);
                int styleEnd = content.IndexOf("</style>", StringComparison.OrdinalIgnoreCase);
                if (styleStart >= 0 && styleEnd > styleStart)
                {
                    css = content.Substring(styleStart + 7, styleEnd - styleStart - 7).Trim();
                    html = content.Remove(styleStart, (styleEnd + 8) - styleStart).Trim();
                }

                return new GenerateCodeResponse { Html = html, Css = css };
            }
            catch (TaskCanceledException ex)
            {
                throw new Exception("Ollama did not respond in time. Is the model loaded? Try running 'ollama pull llama3' and 'ollama run llama3' in a terminal.", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Could not connect to Ollama at http://localhost:11434. Is Ollama running? Try 'ollama serve' in a terminal.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Unexpected error from Ollama: {ex.Message}", ex);
            }
        }
    }
}
