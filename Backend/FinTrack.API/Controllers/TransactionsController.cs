using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinTrack.API.Data;
using FinTrack.API.DTOs;
using FinTrack.API.Models;

namespace FinTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TransactionDto dto)
    {
        var transaction = new Transaction
        {
            UserId = dto.UserId,
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            Category = dto.Category,
            Type = dto.Type
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByUserId), new { userId = transaction.UserId }, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TransactionDto dto)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
        {
            return NotFound(new { message = "Transaction not found" });
        }

        transaction.UserId = dto.UserId;
        transaction.Amount = dto.Amount;
        transaction.Date = dto.Date;
        transaction.Description = dto.Description;
        transaction.Category = dto.Category;
        transaction.Type = dto.Type;

        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
        {
            return NotFound(new { message = "Transaction not found" });
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Transaction deleted successfully" });
    }
}
