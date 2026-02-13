namespace YourSpace.ApiService.DTOs;

/// <summary>
/// Request DTO pentru generare cod HTML/CSS cu AI
/// </summary>
public class GenerateCodeRequest
{
    /// <summary>
    /// Prompt-ul utilizatorului (ex: "create a pink retro profile with sparkles")
    /// </summary>
    public required string Prompt { get; set; }

    /// <summary>
    /// Tipul de cod de generat: "html", "css", sau "both"
    /// </summary>
    public string Type { get; set; } = "both";
}

/// <summary>
/// Response DTO pentru cod generat de AI
/// </summary>
public class GenerateCodeResponse
{
    public string Html { get; set; } = string.Empty;
    public string Css { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
