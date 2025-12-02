using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinTrack.API.Data;
using FinTrack.API.Models;
using System.Text.RegularExpressions;

namespace FinTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly AppDbContext _context;

    public SeedController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("generate-demo-data")]
    public async Task<IActionResult> GenerateDemoData()
    {
        // 1) Determine next unique test username (TestUserN) and password (testN)
        const string prefix = "TestUser";
        var existingUsernames = await _context.Users
            .Where(u => u.Username.StartsWith(prefix))
            .Select(u => u.Username)
            .ToListAsync();

        int maxIndex = 0;
        foreach (var name in existingUsernames)
        {
            var match = Regex.Match(name, @"^TestUser(\d+)$");
            if (match.Success && int.TryParse(match.Groups[1].Value, out var n))
            {
                if (n > maxIndex) maxIndex = n;
            }
        }

        var newIndex = maxIndex + 1;
        var newUsername = $"{prefix}{newIndex}";
        var plainPassword = $"test{newIndex}";
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);

        var user = new User
        {
            Username = newUsername,
            PasswordHash = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(); // Ensure Id generated for FK

        // 2) Generate 50 random transactions
        var rand = new Random();
        var now = DateTime.Now;
        var startDate = now.AddMonths(-3);
        var totalDays = (now - startDate).Days;

        string[] incomeCategories = { "Salary", "Freelance" };
        string[] expenseCategories = { "Food", "Transport", "Entertainment", "Rent" };
        string[] expenseDescriptions = { "Groceries", "Bus ticket", "Netflix", "Utilities", "Phone bill", "Coffee", "Restaurant" };

        var newTransactions = new List<Transaction>(capacity: 50);

        for (int i = 0; i < 50; i++)
        {
            bool isIncome = rand.NextDouble() < 0.30; // 30% chance Income

            // Random date within the last 3 months
            var date = startDate
                .AddDays(rand.Next(totalDays + 1))
                .AddHours(rand.Next(0, 24))
                .AddMinutes(rand.Next(0, 60))
                .AddSeconds(rand.Next(0, 60));

            string category;
            string description;
            decimal amount;

            if (isIncome)
            {
                category = incomeCategories[rand.Next(incomeCategories.Length)];
                description = "Monthly income";
                // 200,000 - 500,000
                amount = Math.Round((decimal)(200_000 + rand.NextDouble() * (500_000 - 200_000)), 2);
            }
            else
            {
                category = expenseCategories[rand.Next(expenseCategories.Length)];
                description = expenseDescriptions[rand.Next(expenseDescriptions.Length)];
                // 1,000 - 20,000
                amount = Math.Round((decimal)(1_000 + rand.NextDouble() * (20_000 - 1_000)), 2);
            }

            newTransactions.Add(new Transaction
            {
                UserId = user.Id,
                Amount = amount,
                Date = date,
                Category = category,
                Description = description,
                Type = isIncome ? "Income" : "Expense"
            });
        }

        // 3) Save
        _context.Transactions.AddRange(newTransactions);
        await _context.SaveChangesAsync();

        // 4) Return the newly created credentials for convenience
        return Ok(new { message = $"Created user: {newUsername} with password: {plainPassword}" });
    }
}
