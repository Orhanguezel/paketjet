import os
from PIL import Image

def crop_and_resize(img_path):
    img = Image.open(img_path).convert('RGBA')
    bbox = img.getbbox()
    if bbox:
        # Crop to the actual icon content
        cropped = img.crop(bbox)
        # Resize to exactly 512x512
        resized = cropped.resize((512, 512), Image.Resampling.LANCZOS)
        resized.save(img_path, 'PNG')
        print(f"Cropped and resized {img_path} to 512x512 (original bbox: {bbox})")
    else:
        print(f"Skipped {img_path} (no content found)")

if __name__ == '__main__':
    icon_dir = 'backend/uploads/icons/'
    for f in os.listdir(icon_dir):
        if f.endswith('.png'):
            path = os.path.join(icon_dir, f)
            crop_and_resize(path)
