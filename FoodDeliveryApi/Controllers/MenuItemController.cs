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
                Category = dto.Category, 
                DietaryPreference = dto.DietaryPreference,
                RestaurantId = dto.RestaurantId
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(menuItem);
        }

        [HttpPut("{itemId}")]
        [Authorize(Roles ="Vendor")]
        public async Task<IActionResult> UpdateMenuItem(Guid itemId, UpdateMenuItemDto dto)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    
            if(vendorId == null)
            {
                return Unauthorized("You must be logged in to update a menu item.");
            }

            var menuItem = await _context.MenuItems.Include(m => m.Restaurant).FirstOrDefaultAsync(m => m.Id == itemId);

            if(menuItem == null)
            {
                return NotFound("Menu item not found.");
            }

            if (menuItem.Restaurant!.OwnerId != vendorId)
            {
                return Forbid("You don't own this restaurant, so you can't update its menu items."); 
            }

            menuItem.Name = dto.Name;
            menuItem.Description = dto.Description;
            menuItem.Price = dto.Price;
            menuItem.Category = dto.Category;
            menuItem.DietaryPreference = dto.DietaryPreference;

            await _context.SaveChangesAsync();
            return Ok(menuItem);
        }

        [HttpDelete("{itemId}")]
        [Authorize(Roles ="Vendor")]
        public async Task<IActionResult> DeleteMenuItem(Guid itemId)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(vendorId == null)
            {
                return Unauthorized("You must be logged in to delete a menu item.");
            }

            var menuItem = await _context.MenuItems.Include(m => m.Restaurant).FirstOrDefaultAsync(m => m.Id == itemId);

            if(menuItem == null)
            {
                return NotFound("Menu item not found.");
            }

            if(menuItem.Restaurant!.OwnerId != vendorId)
            {
                return Forbid("You don't own this restaurant, so you can't delete its menu items."); 
            }

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return Ok("Menu item deleted successfully.");
        }

        [HttpPatch("{id}/toggle-availability")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> ToggleAvailability(Guid id)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(vendorId == null)
            {
                return Unauthorized("You must be logged in to toggle menu item availability.");
            }
            var menuItem = await _context.MenuItems.Include(m=> m.Restaurant).FirstOrDefaultAsync(m => m.Id == id);
            if(menuItem == null)
            {
                return NotFound("Menu item not found.");
            }
            if(menuItem.Restaurant!.OwnerId != vendorId)
            {
                return Forbid();
            }
            menuItem.IsAvailable = !menuItem.IsAvailable;
            await _context.SaveChangesAsync();
            return Ok(new 
            { 
                message = menuItem.IsAvailable ? "Item is now Available" : "Item is not available anymore",
                isAvailable = menuItem.IsAvailable,
                itemId = menuItem.Id
            });
        }
    }
}