using System.Security.Claims;
using FoodDeliveryApi.Data;
using FoodDeliveryApi.DTOs;
using FoodDeliveryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RestaurantController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/restaurant (Public - anyone can view restaurants)
        [HttpGet]
        public async Task<IActionResult> GetAllRestaurants()
        {
            var restaurants = await _context.Restaurants.Include(r => r.MenuItems).ToListAsync();
            return Ok(restaurants);
        }

        // POST: api/restaurant (Protected - only Vendors can create)
        [HttpPost]
        [Authorize(Roles ="Vendor")]
        public async Task<IActionResult> CreateRestaurant(CreateRestaurantDto dto)
        {
            // Extract the Vendor's UserID directly from their JWT Token
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(vendorId == null) return Unauthorized();

            var restaurant = new Restaurant
            {
                OwnerId = vendorId,
                Name = dto.Name,
                Address = dto.Address,
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllRestaurants), new { id = restaurant.Id }, restaurant);
        }

    }
}