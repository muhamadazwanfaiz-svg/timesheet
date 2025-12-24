from PIL import Image
import numpy as np

def make_transparent(image_path, output_path):
    print(f"Processing {image_path}...")
    img = Image.open(image_path).convert("RGBA")
    
    # 1. Crop Logic
    # The sheet likely has 5 logos. "Bottom Left" implies the bottom half, left side.
    # We'll take the bottom 45% (to avoid overlap) and the left 45% (to isolate it).
    width, height = img.size
    
    # Coordinates: (left, top, right, bottom)
    # Bottom row starts roughly at 50% height. Left item is 0-50% width.
    # Adding some margins to avoid cutting edges or including neighbors.
    # Let's try to be generous first, then trim whitespace.
    
    crop_area = (
        int(width * 0.05),      # Left margin
        int(height * 0.55),     # Top (start of bottom row)
        int(width * 0.45),      # Right (end of first item on bottom row)
        int(height * 0.95)      # Bottom margin
    )
    
    print(f"Cropping area: {crop_area} from size {img.size}")
    logo = img.crop(crop_area)
    
    # 2. Transparency Logic
    # Convert Image to Numpy Array
    data = np.array(logo)
    
    # Define "White" threshold (sometimes generation isn't pure 255,255,255)
    threshold = 240
    
    # Find all pixels that are "white-ish"
    # shape is (H, W, 4)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Create mask: True where pixel is white
    mask = (r > threshold) & (g > threshold) & (b > threshold)
    
    # Set Alpha to 0 where mask is True
    data[mask] = [255, 255, 255, 0] # Keep RGB white but make alpha 0 (or just 0,0,0,0)
    
    # Create new image from modified data
    new_logo = Image.fromarray(data)
    
    # 3. Trim Whitespce (Auto-crop to content)
    bbox = new_logo.getbbox()
    if bbox:
        new_logo = new_logo.crop(bbox)
        print(f"Trimmed to bbox: {bbox}")
    
    # Save
    print(f"Saving to {output_path}")
    new_logo.save(output_path, "PNG")

if __name__ == "__main__":
    source = "/Users/azwanfaiz/.gemini/antigravity/brain/b1022fbf-09ef-4aad-972f-5ce316e7f5c7/seo_laoshi_young_female_teacher_1766540333783.png"
    dest = "/Users/azwanfaiz/Desktop/Timesheet/public/logo.png"
    make_transparent(source, dest)
