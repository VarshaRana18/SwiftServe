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
        [Authorize(Roles = "Driver")]
        public class DriverController : ControllerBase
        {
        private readonly AppDbContext _context;

        public DriverController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/driver/available    
        // // Shows orders that are ready but haven't been picked up yet//
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableOrders()
        {
            var orders = await _context.Orders.Include(o=>o.Restaurant).Where(o=>o.DriverId == null && o.Status==OrderStatus.Ready).OrderBy(o => o.CreatedAt).ToListAsync();
            return Ok(orders);
        }

        // PUT: api/driver/{id}/claim
        //// Allows a driver to assign themselves to an order
        [HttpPut("{id}/claim")]
        public async Task<IActionResult> ClaimOrder(Guid id)
        {
            var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders.FindAsync(id);

            if(order == null) return NotFound("Order not found.");

            // Prevent claiming if another driver beat them to it, or if it's not ready
            if(order.DriverId != null) return BadRequest("Order is already claimed by another driver.");
            if (order.Status != OrderStatus.Ready) return BadRequest("Order is not ready for pickup.");

            order.DriverId = driverId;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order successfully claimed!", orderId = order.Id });
        }

        // PUT: api/driver/{id}/status
        // Allows the claimed driver to update status to PickedUp or Delivered
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateDeliveryStatus(Guid id , UpdateOrderStatusDto dto)
        {
            var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var order = await _context.Orders.FindAsync(id);
            if(order == null) return NotFound("Order not found");

            // SECURITY CHECK: Ensure this specific driver claimed this specific order
            if(order.DriverId != driverId) return Forbid();

            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Delivery status updated", orderId = order.Id, newStatus = order.Status.ToString() });
        }
    }
}