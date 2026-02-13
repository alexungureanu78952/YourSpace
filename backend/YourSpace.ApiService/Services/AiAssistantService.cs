using OpenAI;
using OpenAI.Chat;
using YourSpace.ApiService.DTOs;
using Ganss.Xss;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Serviciu pentru generarea de cod HTML/CSS folosind OpenAI API
/// Pattern: Folosește OpenAI pentru a crea cod personalizat pe baza prompt-urilor utilizatorilor
/// </summary>
public class AiAssistantService : IAiAssistantService
{
    private readonly string _apiKey;
    private readonly OpenAIClient? _client;
    private readonly ChatClient? _chatClient;

    public AiAssistantService(string apiKey)
    {
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "your-openai-api-key-here")
        {
            throw new InvalidOperationException("OpenAI API key is not configured. Please add your API key in appsettings.json");
        }

        _apiKey = apiKey;

        try
        {
            // Create OpenAI client (standard OpenAI, not Azure)
            _client = new OpenAIClient(_apiKey);
            _chatClient = _client.GetChatClient("gpt-4o-mini");
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to initialize OpenAI client: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Generează cod HTML/CSS folosind OpenAI pe baza unui prompt
    /// </summary>
    public async Task<GenerateCodeResponse> GenerateProfileCodeAsync(string prompt, string type = "both")
    {
        Console.WriteLine($"[AiAssistant] GenerateProfileCodeAsync called with prompt: '{prompt}', type: '{type}'");

        if (string.IsNullOrWhiteSpace(prompt))
        {
            Console.WriteLine("[AiAssistant] ERROR: Prompt is empty");
            throw new ArgumentException("Prompt cannot be empty", nameof(prompt));
        }

        if (_chatClient == null)
        {
            Console.WriteLine("[AiAssistant] ERROR: OpenAI client is not initialized");
            throw new InvalidOperationException("OpenAI client is not initialized");
        }

        var systemPrompt = BuildSystemPrompt(type);
        var userPrompt = $"Create {type} code for: {prompt}";

        Console.WriteLine($"[AiAssistant] System prompt length: {systemPrompt.Length} chars");
        Console.WriteLine($"[AiAssistant] User prompt: {userPrompt}");

        try
        {
            Console.WriteLine("[AiAssistant] Creating message list...");
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userPrompt)
            };

            Console.WriteLine("[AiAssistant] Calling OpenAI API...");
            var response = await _chatClient.CompleteChatAsync(messages);
            Console.WriteLine($"[AiAssistant] OpenAI API call successful. Response content count: {response.Value.Content.Count}");

            var content = response.Value.Content[0].Text;
            Console.WriteLine($"[AiAssistant] Response content length: {content.Length} chars");
            Console.WriteLine($"[AiAssistant] Response preview: {content.Substring(0, Math.Min(200, content.Length))}...");

            var result = ParseAndSanitizeResponse(content, type);
            Console.WriteLine($"[AiAssistant] Parsed result - HTML length: {result.Html.Length}, CSS length: {result.Css.Length}");

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AiAssistant] EXCEPTION: {ex.GetType().Name}");
            Console.WriteLine($"[AiAssistant] ERROR Message: {ex.Message}");
            Console.WriteLine($"[AiAssistant] Stack trace: {ex.StackTrace}");

            if (ex.InnerException != null)
            {
                Console.WriteLine($"[AiAssistant] Inner exception: {ex.InnerException.Message}");
            }

            return new GenerateCodeResponse
            {
                Html = "",
                Css = "",
                Message = $"Error generating code: {ex.Message}"
            };
        }
    }

    private string BuildSystemPrompt(string type)
    {
        var basePrompt = @"You are an expert HTML/CSS developer specializing in MySpace-style retro profile pages.
Generate clean, safe, and creative code based on user requests.

CRITICAL RULES:
1. NEVER include <script> tags or JavaScript
2. NEVER use inline event handlers (onclick, onerror, etc.)
3. NEVER use javascript: protocol in links
4. Only use safe HTML tags: div, span, p, h1-h6, img, a, ul, ol, li, table, tr, td, strong, em, br
5. Keep HTML under 50KB and CSS under 20KB
6. Use modern CSS for styling
7. Make designs responsive and visually appealing";

        return type switch
        {
            "html" => basePrompt + @"

OUTPUT FORMAT:
Return only the HTML code wrapped in ```html``` markers. Example:
```html
<div class=""profile-card"">
    <h1>Welcome!</h1>
    <p>Cool profile content here</p>
</div>
```",
            "css" => basePrompt + @"

OUTPUT FORMAT:
Return only the CSS code wrapped in ```css``` markers. Example:
```css
.profile-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 10px;
}
```",
            _ => basePrompt + @"

OUTPUT FORMAT:
Return HTML and CSS code in separate code blocks:
```html
<div class=""profile-card"">Content</div>
```
```css
.profile-card { background: pink; }
```"
        };
    }

    private GenerateCodeResponse ParseAndSanitizeResponse(string content, string type)
    {
        var response = new GenerateCodeResponse();

        // Extract HTML
        if (type == "html" || type == "both")
        {
            var htmlMatch = System.Text.RegularExpressions.Regex.Match(content, @"```html\s*\n(.*?)\n```", System.Text.RegularExpressions.RegexOptions.Singleline);
            if (htmlMatch.Success)
            {
                response.Html = SanitizeHtml(htmlMatch.Groups[1].Value.Trim());
            }
        }

        // Extract CSS
        if (type == "css" || type == "both")
        {
            var cssMatch = System.Text.RegularExpressions.Regex.Match(content, @"```css\s*\n(.*?)\n```", System.Text.RegularExpressions.RegexOptions.Singleline);
            if (cssMatch.Success)
            {
                response.Css = SanitizeCss(cssMatch.Groups[1].Value.Trim());
            }
        }

        response.Message = string.IsNullOrEmpty(response.Html) && string.IsNullOrEmpty(response.Css)
            ? "Could not extract code from AI response"
            : "Code generated successfully";

        return response;
    }

    private string SanitizeHtml(string html)
    {
        var sanitizer = new HtmlSanitizer();

        // Configure allowed tags (safe MySpace-style subset)
        sanitizer.AllowedTags.Clear();
        sanitizer.AllowedTags.Add("div");
        sanitizer.AllowedTags.Add("span");
        sanitizer.AllowedTags.Add("p");
        sanitizer.AllowedTags.Add("h1");
        sanitizer.AllowedTags.Add("h2");
        sanitizer.AllowedTags.Add("h3");
        sanitizer.AllowedTags.Add("h4");
        sanitizer.AllowedTags.Add("h5");
        sanitizer.AllowedTags.Add("h6");
        sanitizer.AllowedTags.Add("img");
        sanitizer.AllowedTags.Add("a");
        sanitizer.AllowedTags.Add("ul");
        sanitizer.AllowedTags.Add("ol");
        sanitizer.AllowedTags.Add("li");
        sanitizer.AllowedTags.Add("br");
        sanitizer.AllowedTags.Add("strong");
        sanitizer.AllowedTags.Add("em");
        sanitizer.AllowedTags.Add("table");
        sanitizer.AllowedTags.Add("tr");
        sanitizer.AllowedTags.Add("td");

        // Configure allowed CSS properties
        sanitizer.AllowedCssProperties.Add("background");
        sanitizer.AllowedCssProperties.Add("background-color");
        sanitizer.AllowedCssProperties.Add("color");
        sanitizer.AllowedCssProperties.Add("font-size");
        sanitizer.AllowedCssProperties.Add("font-family");
        sanitizer.AllowedCssProperties.Add("font-weight");
        sanitizer.AllowedCssProperties.Add("text-align");
        sanitizer.AllowedCssProperties.Add("padding");
        sanitizer.AllowedCssProperties.Add("margin");
        sanitizer.AllowedCssProperties.Add("border");
        sanitizer.AllowedCssProperties.Add("border-radius");
        sanitizer.AllowedCssProperties.Add("width");
        sanitizer.AllowedCssProperties.Add("height");
        sanitizer.AllowedCssProperties.Add("display");
        sanitizer.AllowedCssProperties.Add("position");
        sanitizer.AllowedCssProperties.Add("top");
        sanitizer.AllowedCssProperties.Add("left");
        sanitizer.AllowedCssProperties.Add("right");
        sanitizer.AllowedCssProperties.Add("bottom");

        return sanitizer.Sanitize(html);
    }

    private string SanitizeCss(string css)
    {
        // Remove dangerous CSS patterns
        css = System.Text.RegularExpressions.Regex.Replace(css, @"<script[^>]*>.*?</script>", "", System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        css = System.Text.RegularExpressions.Regex.Replace(css, @"javascript:", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        css = System.Text.RegularExpressions.Regex.Replace(css, @"expression\s*\(", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        css = System.Text.RegularExpressions.Regex.Replace(css, @"@import", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        css = System.Text.RegularExpressions.Regex.Replace(css, @"/\*.*?\*/", "", System.Text.RegularExpressions.RegexOptions.Singleline);

        return css.Trim();
    }
}
