import os
from PIL import Image

def process_raw_icon(src_path, dest_path, threshold=45):
    img = Image.open(src_path).convert('RGBA')
    width, height = img.size
    data = img.load()
    
    # Target color is the corner pixel
    target = data[0, 0]
    print(f"Processing raw icon {src_path} -> {dest_path}")
    print(f"Target background color: {target}")
    
    visited = set()
    to_visit = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    def color_dist(c1, c2):
        return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5

    background_pixels = set()
    
    while to_visit:
        x, y = to_visit.pop()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        current_color = data[x, y]
        dist = color_dist(current_color, target)
        
        # If similar to target, or very dark (RGB < 25)
        is_dark = all(c < 25 for c in current_color[:3])
        
        if dist < threshold or is_dark:
            background_pixels.add((x, y))
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        to_visit.append((nx, ny))
                        
    # Apply transparency
    for x in range(width):
        for y in range(height):
            if (x, y) in background_pixels:
                data[x, y] = (0, 0, 0, 0)
                
    # Crop to bounding box of content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to bounding box: {bbox}")
        
    # Resize to 512x512
    img = img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Save
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path, 'PNG')
    print(f"Saved processed icon to {dest_path}")

if __name__ == '__main__':
    base_dir = '/home/orhan/.gemini/antigravity/brain/ee0ff5a6-5c87-40c7-9198-8aeea4993079/'
    jobs = [
        ('dashboard_1780153226571.png', 'backend/uploads/icons/dashboard.png'),
        ('tasima_kurallari_1780153176129.png', 'backend/uploads/icons/tasima-kurallari.png'),
        ('iletisimi_gor_1780153436272.png', 'backend/uploads/icons/iletisimi-gor.png')
    ]
    for src_name, dest_name in jobs:
        src = os.path.join(base_dir, src_name)
        if os.path.exists(src):
            process_raw_icon(src, dest_name)
        else:
            print(f"Source file not found: {src}")
