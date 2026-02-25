// Script to scrape African dishes from travel-challenges.com
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeAfricanDishes() {
  try {
    console.log('Starting scrape of African dishes...');
    
    // Fetch the webpage content
    const url = 'https://www.travel-challenges.com/en-us/blogs/news/traditional-african-dishes';
    const response = await axios.get(url);
    
    // Load the HTML content into cheerio
    const $ = cheerio.load(response.data);
    
    // Array to store our dish data
    const dishes = [];
    
    // Find all the dish articles/sections
    const dishSections = $('h2').filter(function() {
      // Find headings that likely represent dish names
      return $(this).text().trim().length > 0 && 
             !$(this).text().includes('African') && 
             !$(this).text().includes('Conclusion');
    });
    
    console.log(`Found ${dishSections.length} potential dish sections`);
    
    // Process each dish section
    dishSections.each((index, element) => {
      const dishName = $(element).text().trim();
      console.log(`Processing: ${dishName}`);
      
      // Find the paragraph(s) after the heading for description
      let description = '';
      let paragraphs = $(element).nextUntil('h2', 'p');
      paragraphs.each((i, para) => {
        description += $(para).text().trim() + ' ';
      });
      
      // Look for image near this section
      let imageUrl = '';
      const nearbyImg = $(element).nextAll('img').first();
      if (nearbyImg.length > 0) {
        imageUrl = nearbyImg.attr('src') || nearbyImg.attr('data-src') || '';
        // If it's a relative URL, make it absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = new URL(imageUrl, url).href;
        }
      }
      
      // Look for the country/region information
      let country = '';
      paragraphs.each((i, para) => {
        const text = $(para).text();
        if (text.includes('from') || text.includes('origin') || text.includes('popular in') || 
            text.includes('national dish') || text.includes('traditional')) {
          // Try to extract country names
          const africanCountries = [
            'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde',
            'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Djibouti', 
            'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia',
            'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia',
            'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco',
            'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe',
            'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan',
            'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe', 'West Africa',
            'East Africa', 'North Africa', 'Southern Africa', 'Central Africa'
          ];
          
          africanCountries.forEach(c => {
            if (text.includes(c)) {
              country = c;
            }
          });
        }
      });
      
      // If we have at least a name and description, add to our collection
      if (dishName && description) {
        dishes.push({
          name: dishName,
          description: description.trim(),
          country: country || 'Africa',
          imageUrl: imageUrl
        });
      }
    });
    
    console.log(`Successfully scraped ${dishes.length} dishes`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'scraped-african-dishes.json');
    fs.writeFileSync(outputPath, JSON.stringify(dishes, null, 2));
    
    console.log(`Data saved to ${outputPath}`);
    return dishes;
  } catch (error) {
    console.error('Error scraping African dishes:', error);
    throw error;
  }
}

// Execute the scraping function
scrapeAfricanDishes()
  .then(dishes => {
    console.log('Scraping completed successfully');
    console.log(`Total dishes scraped: ${dishes.length}`);
  })
  .catch(error => {
    console.error('Scraping failed:', error.message);
  });