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

        // GET: api/order/customer
        [HttpGet("customer")]
        [Authorize(Roles="Customer")]
        public async Task<IActionResult> GetCustomerOrders()
        {
            var customerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.MenuItem).Include(o => o.Restaurant).Where(o => o.CustomerId == customerId).OrderByDescending(o => o.CreatedAt).ToListAsync();

            return Ok(orders);
        }

        // GET: api/order/vendor
        [HttpGet("vendor")]
        [Authorize(Roles="Vendor")]
        public async Task<IActionResult> GetVendorOrders()
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.MenuItem).Include(o => o.Customer).Where(o=>o.Restaurant!.OwnerId == vendorId ).OrderByDescending(o => o.CreatedAt)
        .ToListAsync();

            return Ok(orders);
        }

        // PUT: api/order/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles="Vendor")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, UpdateOrderStatusDto dto)
        {
            var vendorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // 1. Fetch the order and include the Restaurant to verify ownership
            var order = await _context.Orders.Include(o => o.Restaurant).FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound("Order not found.");

            // 2. SECURITY CHECK: Does this Vendor own the restaurant fulfilling this order?
            if(order.Restaurant!.OwnerId != vendorId) return Forbid();
            
            // 3. Update the data
            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Order status updated successfully", 
                orderId = order.Id, 
                newStatus = order.Status.ToString()
            });
        }
    }
}