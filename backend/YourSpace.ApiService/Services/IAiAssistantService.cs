using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interface pentru serviciul AI care generează cod HTML/CSS pe baza prompt-urilor utilizatorilor
/// </summary>
public interface IAiAssistantService
{
    /// <summary>
    /// Generează cod HTML/CSS folosind AI pe baza unui prompt
    /// </summary>
    /// <param name="prompt">Descrierea utilizatorului (ex: "create a dark gothic profile")</param>
    /// <param name="type">Tipul de cod: "html", "css", sau "both"</param>
    /// <returns>Cod HTML și/sau CSS generat</returns>
    Task<GenerateCodeResponse> GenerateProfileCodeAsync(string prompt, string type = "both");
}
