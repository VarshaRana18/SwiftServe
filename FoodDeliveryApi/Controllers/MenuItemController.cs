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
    public class MenuItemController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MenuItemController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/menuitem/{restaurantId} (Public - Customers need to see the menu!)
        [HttpGet("{restaurantId}")]
        public async Task<IActionResult> GetMenuForRestaurant(Guid restaurantId)
        {
            var menu = await _context.MenuItems.Where(m=>m.RestaurantId == restaurantId).ToListAsync();
            return Ok(menu);
        }

        // POST: api/menuitem (Protected - only the Restaurant Owner can add items)
        [HttpPost]
        [Authorize(Roles ="Vendor")]
        public async Task<IActionResult> CreateMenuItem(CreateMenuItemDto dto)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            // 1. Find the restaurant in the database
            var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);

            if (restaurant == null) 
                return NotFound("Restaurant not found.");

            // 2. SECURITY CHECK: Does this Vendor actually own this restaurant?
            if (restaurant.OwnerId != vendorId) 
                return Forbid(); // Returns a 403 Forbidden

            var menuItem = new MenuItem{
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                RestaurantId = dto.RestaurantId
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(menuItem);
        }
    }
}