using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinTrack.API.Data;
using FinTrack.API.DTOs;
using FinTrack.API.Models;
using BCrypt.Net;

namespace FinTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        // Hash the password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        // Create new user
        var user = new User
        {
            Username = userDto.Username,
            PasswordHash = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDto userDto)
    {
        // Find user by username
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // Verify password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // Return user info without password hash and a fake token
        return Ok(new
        {
            message = "Login successful",
            token = "fake-jwt-token",
            user = new
            {
                id = user.Id,
                username = user.Username
            }
        });
    }
}
