using System.Security.Claims;
using FoodDeliveryApi.Data;
using FoodDeliveryApi.DTOs;
using FoodDeliveryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryApi.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OrderController(AppDbContext context)
        {
            _context = context;
        }  

        // POST: api/order (Only Customers can place orders)
        [HttpPost]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            var customerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (customerId == null) return Unauthorized();

            // 1. Verify the restaurant exists
            var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
            if (restaurant == null) return NotFound("Restaurant not found.");

            var order = new Order
            {
                CustomerId = customerId,
                RestaurantId = dto.RestaurantId,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                TotalAmount = 0 
            };

            // 3. Process each item securely
            foreach (var itemDto in dto.Items)
            {
                var menuItem = await _context.MenuItems.FindAsync(itemDto.MenuItemId);
                if (menuItem == null || menuItem.RestaurantId != dto.RestaurantId)
                {
                    return BadRequest($"Invalid menu item: {itemDto.MenuItemId}");
                }

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = menuItem.Price 
                };

                order.TotalAmount += (orderItem.UnitPrice * orderItem.Quantity);
                order.OrderItems.Add(orderItem);
            }

            // 4. Save to database
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }    
    }
}