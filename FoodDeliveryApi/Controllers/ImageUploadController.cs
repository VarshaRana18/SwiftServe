using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Vendor")]
    public class ImageUploadController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        public ImageUploadController(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // 1. Validate file extension
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(ext))
                return BadRequest("Only .jpg, .jpeg, .png, and .webp are allowed.");

            // 2. Open a stream to the file
            using var stream = file.OpenReadStream();

            // 3. Define upload parameters
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "SwiftServe", // Puts all images in a neat folder on Cloudinary
                Transformation = new Transformation().Width(800).Height(800).Crop("limit") // Auto-compresses giant files!
            };

            // 4. Send to Cloudinary
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            // 5. Handle errors
            if (uploadResult.Error != null)
            {
                return StatusCode(500, uploadResult.Error.Message);
            }

            // 6. Return the secure HTTPS URL provided by Cloudinary
            return Ok(new { imageUrl = uploadResult.SecureUrl.ToString() });
        }
    }
}