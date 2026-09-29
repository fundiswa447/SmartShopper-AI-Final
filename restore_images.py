import re
from pathlib import Path

current_path = Path("src/data/mockData.ts")
backup_path = Path("../AIshopping-backup/src/data/mockData.ts")

current = current_path.read_text(encoding="utf-8")
backup = backup_path.read_text(encoding="utf-8")

# Original product title -> original image URL
original_products = {
    "Nike Air Force 1 '07 - White":
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",

    "Adidas Ultraboost Light Core Black":
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80",

    "Converse Chuck 70 Vintage Canvas High-Top":
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&q=80",

    "The North Face Insulated Puffer Jacket":
        "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",

    "K-Way Elements Men's Parka Jacket":
        "https://images.unsplash.com/photo-1539533018447-63fcce667823?w=600&q=80",

    "Urban Tech Lightweight Windbreaker":
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",

    "Albany Superior White Bread 700g":
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",

    "Full Cream Fresh Milk 2 Litre":
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",

    "Free Range Large Eggs (Dozen)":
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80",

    "Tastic Parboiled Rice 2kg Bag":
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",

    "Dr. Oetker Frozen Pizzas (Any 2)":
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",

    "Nescafé Classic Instant Coffee 200g":
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80",

    "Instant Noodles 5-Pack (Durban Curry)":
        "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&q=80",
}

restored = 0

for title, image_url in original_products.items():

    # Find the product block by its title
    title_pattern = re.escape(title)

    pattern = re.compile(
        r"(\{\s*id:\s*'[^']+'.*?title:\s*(?:'[^']*'|\""
        + title_pattern +
        r"\").*?)(\n\s*\},)",
        re.DOTALL
    )

    match = pattern.search(current)

    if not match:
        print(f"NOT FOUND: {title}")
        continue

    product_block = match.group(1)

    # Remove an existing imageUrl if there is one
    product_block = re.sub(
        r"\s*imageUrl:\s*['\"][^'\"]*['\"],?",
        "",
        product_block
    )

    # Add the original image URL
    product_block = (
        product_block.rstrip()
        + f"\n    imageUrl: '{image_url}',"
    )

    current = (
        current[:match.start(1)]
        + product_block
        + current[match.end(1):]
    )

    print(f"RESTORED: {title}")
    restored += 1

current_path.write_text(current, encoding="utf-8")

print()
print(f"Successfully restored {restored} product images.")