using FoodDeliveryApi.Data;
using FoodDeliveryApi.DTOs;
using FoodDeliveryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FoodDeliveryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")] 
    public class AddressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/address
        [HttpGet]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var addresses = await _context.Addresses
                .Where(a => a.AppUserId == userId)
                .ToListAsync();

            return Ok(addresses);
        }

        // POST: api/address
        [HttpPost]
        public async Task<IActionResult> AddAddress(CreateAddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();


            var address = new Address
            {
                AppUserId = userId,
                Label = dto.Label,
                FullAddress = dto.FullAddress,
                PinCode = dto.PinCode
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(address);
        }

        // DELETE: api/address/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var address = await _context.Addresses.FindAsync(id);
            
            if (address == null) return BadRequest("Invalid delivery address or address does not belong to you.");

            // Does this user actually own this address?
            if (address.AppUserId != userId) return Forbid();

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Address deleted successfully" });
        }
    }
}