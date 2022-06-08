## Megabus Deals

# To Do
1. ~~Convert purely template loading to template loading + AJAX request~~
2. ~~Customize accordion to only have one open at a time and automatically open return once an out-journey has been selected~~
3. ~~Filter out non-valid journeys (i.e those journeys that are more than a week after the selected out date)~~
4. Create a "validCities" endpoint that filters out invalid destination cities for a given source city
5. ~~Implement a caching system~~
6. Add hidden "Evil" method
7. Add option to expand search if there are no $1 dollar deals
8. ~~Move caching system into middleware file~~
9. Cache out and return journeys separately, which will result in fewer API calls
10. In addition to caching in memory, save results to database for data analytics (i.e. predicting ticket prices based on source, destination, days to trip, day of week etc.) 

# Known Issues
- Some non-$1-dollar deals are appearing
- Duplicate deals appear (i.e. New York to Philadelphia/return journey(?))
- ~~Date is in UK format~~
- ~~Don't have a "No Results Found" view~~

# What I've Learned
- This is my first TypeScript-only project. I learned how to set up tsconfig and tslint files to my desired specification. I also learned how to use Express in TypeScript.
- I learned how to implement a basic caching system to reduce external API calls
- I learned how to write my own middleware (i.e. implementing the caching system)
