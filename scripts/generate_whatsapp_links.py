import urllib.parse
import os

# --- CONFIGURATION ---
# Replace this with your actual wedding website URL once it's deployed
# For example: "https://your-domain.com"
WEBSITE_URL = "https://masoomahmad.github.io/nahid-weds-shafi/"

# --- GUEST LIST ---
# Add your guests here. 
# Phone number is optional. If provided, the link will directly open their chat.
# Note: Phone numbers should include the country code without the '+' sign (e.g., 91 for India)
GUESTS = [
    # {
    #     "name": "Janab XXXX Sahab",
    #     "city": "XXXXXXX",
    #     "phone": "91XXXXXXXXXX" # Replace with actual number
    # },
    {
        "name": "",
        "city": "",
        "phone": "" # Leave blank to generate a generic share link where you pick the contact later
    }
]

def generate_message(name, city):
    """Generates the personalized Urdu/Hindi message (Option 1 Polished Traditional)"""
    
    # If a name is provided, add the greeting header, otherwise keep it blank
    header = ""
    if name:
        header = f"To,\n{name}\n"
        if city:
            header += f"{city}\n"
        header += "\n" # Add some spacing before the greeting
        
    return f"""{header}اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ

Allah Subhanahu Wa Ta'ala ke fazl-o-karam se meri behen Nahid ka Nikah Shafi ke saath tay paya hai. Is khushi ke pur-musarrat mauqe par hum aapko aur aapke ahlesunnat/parivaar ko dil se dawat dete hain.

Meherbani farma kar zaroor tashreef layein aur naye jode ko apni neik duaon se nawazein. Saath mein digital card ki link share kar raha hoon. 

🌐 Hamari Digital Invitation link: {WEBSITE_URL}

JazakAllah Khairan,

Duaon ka talabgaar,
Masoom Ahmad"""

def main():
    print("=" * 60)
    print("✨ WHATSAPP WEDDING INVITE LINK GENERATOR ✨")
    print("=" * 60 + "\n")
    
    output_file = "whatsapp_invite_links.txt"
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("WhatsApp Wedding Invite Links\n")
        f.write("=============================\n\n")
        
        for idx, guest in enumerate(GUESTS, 1):
            name = guest.get("name", "Guest")
            city = guest.get("city", "")
            phone = guest.get("phone", "").strip()
            
            # 1. Generate the raw message string
            raw_message = generate_message(name, city)
            
            # 2. URL encode the message so it's safe for a web link
            encoded_message = urllib.parse.quote(raw_message)
            
            # 3. Create the WhatsApp link
            if phone:
                # Direct message to this specific number
                link = f"https://wa.me/{phone}?text={encoded_message}"
                link_type = f"Direct Link for Number {phone}"
            else:
                # Generic link where you pick the contact after clicking
                link = f"https://wa.me/?text={encoded_message}"
                link_type = "Share Link (Pick contact on WhatsApp)"
            
            # --- Output to Console ---
            print(f"[{idx}] Generating link for: {name} ({city})")
            print(f"    Type: {link_type}")
            print(f"    Link: {link}\n")
            
            # --- Output to File ---
            f.write(f"Guest {idx}: {name} ({city})\n")
            f.write(f"Link Type: {link_type}\n")
            f.write(f"Link:\n{link}\n\n")
            f.write("Message Preview:\n")
            f.write("-" * 40 + "\n")
            f.write(raw_message + "\n")
            f.write("-" * 40 + "\n\n")
            f.write("=" * 60 + "\n\n")

    print(f"✅ Success! All links and message previews have been saved to '{output_file}'")
    print(f"You can find it in the same folder as this script.")

if __name__ == "__main__":
    main()
