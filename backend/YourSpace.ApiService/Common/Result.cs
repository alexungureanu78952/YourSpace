namespace YourSpace.ApiService.Common;

/// <summary>
/// Result pattern for handling success/failure scenarios without exceptions
/// </summary>
public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public T? Value { get; private set; }
    public string Error { get; private set; } = string.Empty;

    private Result(bool isSuccess, T? value, string error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    /// <summary>
    /// Creates a successful result
    /// </summary>
    public static Result<T> Success(T value) => new Result<T>(true, value, string.Empty);

    /// <summary>
    /// Creates a failed result
    /// </summary>
    public static Result<T> Failure(string error) => new Result<T>(false, default, error);
}

/// <summary>
/// Result pattern without value for operations that don't return data
/// </summary>
public class Result
{
    public bool IsSuccess { get; private set; }
    public string Error { get; private set; } = string.Empty;

    private Result(bool isSuccess, string error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    /// <summary>
    /// Creates a successful result
    /// </summary>
    public static Result Success() => new Result(true, string.Empty);

    /// <summary>
    /// Creates a failed result
    /// </summary>
    public static Result Failure(string error) => new Result(false, error);
}
