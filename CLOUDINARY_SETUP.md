# Cloudinary Setup Guide for Harshit's Portfolio

This is a simplified guide to set up Cloudinary for image uploading in your portfolio.

## 1. Verify Environment Variables

Make sure your `.env.local` file contains these Cloudinary variables:

```
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can find these values in your Cloudinary dashboard under Settings > Access Keys.

## 2. Create a Single Upload Preset

1. Log in to your [Cloudinary Console](https://console.cloudinary.com/)
2. Go to Settings > Upload
3. Scroll down to "Upload presets" and click "Add upload preset"
4. Create this preset:

### Portfolio Uploads Preset
- Name: `portfolio_uploads`
- Signing Mode: `Unsigned`
- Folder: Leave blank (we handle folders in the code)
- Allowed formats: `jpg, png, webp, svg, gif`
- Max file size: `10MB`

## 3. Enable CORS

Configure CORS to allow uploads from your domains:

1. Go to Settings > Security
2. In the CORS section, add these origins:
   - `http://localhost:2043`
   - `http://localhost:3000`
   - Your production domain (e.g., `https://harshitport.vercel.app`)

## 4. Test Your Setup

After completing these steps, try uploading an image through your admin panel. The application will now use Cloudinary instead of Firebase Storage for image management.

## Troubleshooting

If uploads still fail, check these common issues:

1. Verify your cloud name, API key, and upload preset name are correct
2. Make sure the upload preset is set to "Unsigned"
3. Check browser console for detailed error messages
4. Ensure CORS is properly configured for your development URL
