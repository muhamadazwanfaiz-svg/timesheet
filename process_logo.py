from PIL import Image, ImageDraw
import numpy as np

def make_transparent(image_path, output_path):
    print(f"Processing {image_path}...")
    img = Image.open(image_path).convert("RGBA")
    
    # 1. Crop Logic (Same as before)
    width, height = img.size
    crop_area = (
        int(width * 0.05),      # Left margin
        int(height * 0.55),     # Top (start of bottom row)
        int(width * 0.45),      # Right (end of first item on bottom row)
        int(height * 0.95)      # Bottom margin
    )
    
    print(f"Cropping area: {crop_area} from size {img.size}")
    logo = img.crop(crop_area)
    
    # 2. Flood Fill Transparency
    # We want to remove the background starting from the top-left corner.
    # We'll use ImageDraw.floodfill to mark the background, then turn it transparent.
    
    # Create a mask image (L mode) initialized to black (0)
    # We will flood fill the background with white (255)
    # Then use this mask to set alpha.
    
    # To do this robustly with PIL, we can do a flood fill on a temporary copy.
    # Convert to RGB to ignore existing alpha for calculation
    temp_img = logo.convert("RGB")
    
    # Seed point: Top-Left corner (0,0) is definitely background
    seed = (0, 0)
    
    # Tolerance for "white-ish" background
    threshold = 30 
    
    # Custom Flood Fill Algorithm using Numpy (PIL's ImageDraw.floodfill is simple but limited)
    # Actually, let's use a simpler approach:
    # 1. Create a mask from "white-ish" pixels
    # 2. Keep only the largest connected component of "non-white" pixels? 
    # Or just mask away the "white" connected to the border.
    
    data = np.array(logo)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Condition: Pixel is "White-ish" (> 220)
    is_white = (r > 220) & (g > 220) & (b > 220)
    
    # We want to make "is_white" transparent. 
    # IMPROVED: Just purely set highly white pixels to transparent.
    # The previous threshold of 240 might have been too strict (missed 239).
    # Let's lower it to 220 to catch more "off-white" artifacts.
    # And apply a soft feather? No, let's stick to binary transparency for SVG-like feel.
    
    data[is_white] = [255, 255, 255, 0]
    
    # Create new image
    new_logo = Image.fromarray(data)
    
    # 3. Trim Whitespace
    bbox = new_logo.getbbox()
    if bbox:
        # Add a small padding if needed, or tight crop
        new_logo = new_logo.crop(bbox)
        print(f"Trimmed to bbox: {bbox}")
    
    # Save
    print(f"Saving to {output_path}")
    new_logo.save(output_path, "PNG")

if __name__ == "__main__":
    source = "/Users/azwanfaiz/.gemini/antigravity/brain/b1022fbf-09ef-4aad-972f-5ce316e7f5c7/seo_laoshi_young_female_teacher_1766540333783.png"
    dest = "/Users/azwanfaiz/Desktop/Timesheet/public/logo.png"
    make_transparent(source, dest)
