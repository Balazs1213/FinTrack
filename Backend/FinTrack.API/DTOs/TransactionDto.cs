namespace FinTrack.API.DTOs;

public class TransactionDto
{
    public int? Id { get; set; }
    public required int UserId { get; set; }
    public required decimal Amount { get; set; }
    public required DateTime Date { get; set; }
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}