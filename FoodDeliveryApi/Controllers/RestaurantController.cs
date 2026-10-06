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

         [HttpGet("my-restaurants")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> GetMyRestaurants()
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var restaurants = await _context.Restaurants.Where(r=> r.OwnerId == vendorId).Include(r=> r.MenuItems).ToListAsync();
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
                FullAddress = dto.FullAddress,
                ContactNumber = dto.ContactNumber,
                City = dto.City,
                PinCode = dto.PinCode
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllRestaurants), new { id = restaurant.Id }, restaurant);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> UpdateRestaurant(Guid id, UpdateRestaurantDto dto)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null) return NotFound();

            if (restaurant.OwnerId != vendorId) return Forbid();

            restaurant.Name = dto.Name;
            restaurant.Description = dto.Description;
            restaurant.FullAddress = dto.FullAddress;
            restaurant.City = dto.City;
            restaurant.PinCode = dto.PinCode;
            restaurant.ContactNumber = dto.ContactNumber;

            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();

            return Ok(restaurant);
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> ToggleRestaurantOpenStatus(Guid id)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null) return NotFound();

            if (restaurant.OwnerId != vendorId) return Forbid();

            restaurant.isOpen = !restaurant.isOpen;

            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();

            return Ok(new { restaurant.Id, restaurant.isOpen });
        }
    }
}