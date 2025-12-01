using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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

        // Generate JWT token
        string token = GenerateToken(user);

        // Return user info and real JWT token
        return Ok(new
        {
            message = "Login successful",
            token = token,
            user = new
            {
                id = user.Id,
                username = user.Username
            }
        });
    }

    private string GenerateToken(User user)
    {
        // Read JWT key from environment variable
        var jwtKey = Environment.GetEnvironmentVariable("FINTRACK_JWT_KEY");
        
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT Key not found in environment variables. Please set FINTRACK_JWT_KEY.");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(30), // 30 days validity for university grading period
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}