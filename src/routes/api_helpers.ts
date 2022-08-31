import axios from 'axios';



export async function getValidDestinations(originName: string) {
  const originId : number = getCityId(originName);
  const response = await axios.get(`https://us.megabus.com/journey-planner/api/destination-cities?originCityId=${originId}`);
  return response.data;
}
/*

Ultimately, this will contain API routes. For now they're helpers for the "search" route
*/
// Given a route between an origin and destination, returns an array of dates on which there are journeys
export async function getValidDates(originName: string, destinationName: string, day: string) : Promise<any[]> {
  // Given cities names as strings, convert to Megabus IDs for API call
  const originId : number = getCityId(originName);
  const destinationId : number = getCityId(destinationName);

  // Pull all valid dates from Megabus API
  const response = await axios.get(`https://us.megabus.com/journey-planner/api/journeys/travel-dates?destinationCityId=${destinationId}&originCityId=${originId}`);
  // Only return dates on passed date
  const dayVal : number = DATE_MAP.get(day);

  // tslint:disable-next-line:no-console
  console.log(`Day: ${dayVal}`);

  return response.data.availableDates.filter((date : string) => {
    const formattedDate : Date = new Date(date);
    return formattedDate.getDay() === dayVal;
  });
}

// Gets city ID given city's name
function getCityId(cityName: string) : number {
  let cityId : number = -1;
  // Loop through cities, looking for one with passed name
  ORIGIN_CITIES.cities.forEach((city) => {
    if (city.name === cityName) {
      // If we find it, return the ID
      cityId = city.id;
    }
  });
  // If we get here, we haven't found it
  return cityId;
}

// Given a route and date, return all journeys
export async function getJourneyOnDate(date: string, originId: number, destinationId: number) : Promise<any[]> {
  const response = await axios.get(`https://us.megabus.com/journey-planner/api/journeys?days=1&concessionCount=0&departureDate=${date}&destinationId=${destinationId}&inboundDepartureDate=${date}&inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&originId=${originId}&otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0`);
  return response.data.journeys;
}

export async function getJourneysOnDates(dates: string[], originName: string, destinationName: string, belowPrice: number = 1.00) : Promise<any[]> {
  // Given cities names as strings, convert to Megabus IDs for API call
  const originId : number = getCityId(originName);
  const destinationId : number = getCityId(destinationName);

  const journeys: any[] = [];

  for (const date of dates) {
    let curJourneys = await getJourneyOnDate(date, originId, destinationId);
    // We only want journeys below desired upper price (default = $1.00)
    curJourneys = curJourneys.filter(journey => {
      return journey.price <= belowPrice;
    });
    journeys.push(...curJourneys);
  }
  return journeys;
}


// FIXME move types to a separate file
type City = {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

type CityData = {
  cities: City[]
}

// FIXME move to config file?
export const ORIGIN_CITIES : CityData = {
    "cities": [
        {
            "id": 542,
            "name": "Abbotsford, WI",
            "latitude": 44.946358,
            "longitude": -90.31597
        },
        {
            "id": 89,
            "name": "Albany, NY",
            "latitude": 42.65144,
            "longitude": -73.75525
        },
        {
            "id": 534,
            "name": "Alfred, NY",
            "latitude": 42.25424,
            "longitude": -77.79055
        },
        {
            "id": 524,
            "name": "Altavista, VA",
            "latitude": 37.11181,
            "longitude": -79.285576
        },
        {
            "id": 526,
            "name": "Amherst, VA",
            "latitude": 37.58514,
            "longitude": -79.051414
        },
        {
            "id": 555,
            "name": "Appleton, WI",
            "latitude": 44.261932,
            "longitude": -88.41538
        },
        {
            "id": 485,
            "name": "Arlington, VA",
            "latitude": 38.898106,
            "longitude": -77.18146
        },
        {
            "id": 289,
            "name": "Atlanta, GA",
            "latitude": 33.74831,
            "longitude": -84.39111
        },
        {
            "id": 320,
            "name": "Austin, TX",
            "latitude": 30.2676,
            "longitude": -97.74298
        },
        {
            "id": 143,
            "name": "Baltimore, MD",
            "latitude": 39.37831,
            "longitude": -76.46223
        },
        {
            "id": 552,
            "name": "Baraboo, WI",
            "latitude": 43.471096,
            "longitude": -89.74429
        },
        {
            "id": 319,
            "name": "Baton Rouge, LA",
            "latitude": 30.44334,
            "longitude": -91.18699
        },
        {
            "id": 559,
            "name": "Beaver Dam, WI",
            "latitude": 43.457767,
            "longitude": -88.837326
        },
        {
            "id": 93,
            "name": "Binghamton, NY",
            "latitude": 42.09868,
            "longitude": -75.91127
        },
        {
            "id": 292,
            "name": "Birmingham, AL",
            "latitude": 33.52029,
            "longitude": -86.8115
        },
        {
            "id": 479,
            "name": "Blacksburg, VA",
            "latitude": 37.22997,
            "longitude": -80.41837
        },
        {
            "id": 545,
            "name": "Bonduel, WI",
            "latitude": 44.74027,
            "longitude": -88.444824
        },
        {
            "id": 94,
            "name": "Boston, MA",
            "latitude": 42.35863,
            "longitude": -71.0567
        },
        {
            "id": 583,
            "name": "Bristol, VA",
            "latitude": 36.595142,
            "longitude": -82.188736
        },
        {
            "id": 273,
            "name": "Buffalo Airport, NY",
            "latitude": 42.93106,
            "longitude": -78.73763
        },
        {
            "id": 95,
            "name": "Buffalo, NY",
            "latitude": 42.88544,
            "longitude": -78.87846
        },
        {
            "id": 96,
            "name": "Burlington, VT",
            "latitude": 44.47592,
            "longitude": -73.21323
        },
        {
            "id": 99,
            "name": "Charlotte, NC",
            "latitude": 35.2225,
            "longitude": -80.83754
        },
        {
            "id": 512,
            "name": "Charlottesville, VA",
            "latitude": 38.0318,
            "longitude": -78.492546
        },
        {
            "id": 540,
            "name": "Chippewa Falls, WI",
            "latitude": 44.936905,
            "longitude": -91.39294
        },
        {
            "id": 101,
            "name": "Christiansburg, VA",
            "latitude": 37.13014,
            "longitude": -80.40841
        },
        {
            "id": 454,
            "name": "Columbia, SC",
            "latitude": 34.011723,
            "longitude": -81.06262
        },
        {
            "id": 566,
            "name": "Columbus, WI",
            "latitude": 43.338047,
            "longitude": -89.01539
        },
        {
            "id": 573,
            "name": "Corning, NY",
            "latitude": 42.142853,
            "longitude": -77.05469
        },
        {
            "id": 584,
            "name": "Cortland, NY",
            "latitude": 42.60118,
            "longitude": -76.18048
        },
        {
            "id": 527,
            "name": "Culpeper, VA",
            "latitude": 38.47296,
            "longitude": -77.996254
        },
        {
            "id": 317,
            "name": "Dallas, TX",
            "latitude": 32.795975,
            "longitude": -97.02723
        },
        {
            "id": 521,
            "name": "Danville, VA",
            "latitude": 36.58597,
            "longitude": -79.39502
        },
        {
            "id": 478,
            "name": "Daytona Beach, FL",
            "latitude": 29.218554,
            "longitude": -81.09627
        },
        {
            "id": 484,
            "name": "Dulles Washington Airport (IAD), VA",
            "latitude": 38.955585,
            "longitude": -77.44841
        },
        {
            "id": 131,
            "name": "Durham, NC",
            "latitude": 35.985588,
            "longitude": -78.896645
        },
        {
            "id": 498,
            "name": "East Troy, WI",
            "latitude": 42.8061,
            "longitude": -88.3698
        },
        {
            "id": 539,
            "name": "Eau Claire, WI",
            "latitude": 44.811348,
            "longitude": -91.4985
        },
        {
            "id": 572,
            "name": "Elmira, NY",
            "latitude": 42.089798,
            "longitude": -76.80773
        },
        {
            "id": 523,
            "name": "Farmville, VA",
            "latitude": 37.302097,
            "longitude": -78.39194
        },
        {
            "id": 455,
            "name": "Fayetteville, NC",
            "latitude": 35.063725,
            "longitude": -78.89557
        },
        {
            "id": 557,
            "name": "Fond du Lac, WI",
            "latitude": 43.773045,
            "longitude": -88.44705
        },
        {
            "id": 462,
            "name": "Fort Lauderdale / Hollywood, FL",
            "latitude": 26.067268,
            "longitude": -80.17479
        },
        {
            "id": 483,
            "name": "Front Royal, VA",
            "latitude": 38.91753,
            "longitude": -78.19352
        },
        {
            "id": 529,
            "name": "Gainesville, VA",
            "latitude": 38.79567,
            "longitude": -77.613884
        },
        {
            "id": 546,
            "name": "Green Bay, WI",
            "latitude": 44.513317,
            "longitude": -88.0133
        },
        {
            "id": 536,
            "name": "Hamilton, NY",
            "latitude": 42.827015,
            "longitude": -75.544624
        },
        {
            "id": 111,
            "name": "Harrisburg, PA",
            "latitude": 40.25993,
            "longitude": -76.88234
        },
        {
            "id": 482,
            "name": "Harrisonburg, VA",
            "latitude": 38.45163,
            "longitude": -78.8697
        },
        {
            "id": 318,
            "name": "Houston, TX",
            "latitude": 29.747784,
            "longitude": -95.36257
        },
        {
            "id": 511,
            "name": "Ithaca, NY",
            "latitude": 42.42064,
            "longitude": -76.509384
        },
        {
            "id": 295,
            "name": "Jacksonville, FL",
            "latitude": 30.33138,
            "longitude": -81.6558
        },
        {
            "id": 489,
            "name": "Janesville, WI",
            "latitude": 42.677162,
            "longitude": -88.99351
        },
        {
            "id": 551,
            "name": "Johnson Creek, WI",
            "latitude": 43.076115,
            "longitude": -88.77427
        },
        {
            "id": 554,
            "name": "La Crosse, WI",
            "latitude": 43.813774,
            "longitude": -91.2519
        },
        {
            "id": 480,
            "name": "Lexington, VA",
            "latitude": 37.775757,
            "longitude": -79.43276
        },
        {
            "id": 324,
            "name": "Little Rock, AR",
            "latitude": 34.74865,
            "longitude": -92.27449
        },
        {
            "id": 525,
            "name": "Lynchburg, VA",
            "latitude": 37.413754,
            "longitude": -79.14225
        },
        {
            "id": 119,
            "name": "Madison, WI",
            "latitude": 43.07295,
            "longitude": -89.38669
        },
        {
            "id": 538,
            "name": "Manitowoc, WI",
            "latitude": 44.088608,
            "longitude": -87.657585
        },
        {
            "id": 520,
            "name": "Martinsville, VA",
            "latitude": 36.691525,
            "longitude": -79.872536
        },
        {
            "id": 120,
            "name": "Memphis, TN",
            "latitude": 35.14976,
            "longitude": -90.04925
        },
        {
            "id": 586,
            "name": "Menomonie, WI",
            "latitude": 44.87552,
            "longitude": -91.91934
        },
        {
            "id": 450,
            "name": "Miami, FL",
            "latitude": 25.750383,
            "longitude": -80.23041
        },
        {
            "id": 499,
            "name": "Milton, WI",
            "latitude": 42.803146,
            "longitude": -88.97193
        },
        {
            "id": 121,
            "name": "Milwaukee, WI",
            "latitude": 43.04181,
            "longitude": -87.90684
        },
        {
            "id": 144,
            "name": "Minneapolis, MN",
            "latitude": 44.97903,
            "longitude": -93.26493
        },
        {
            "id": 294,
            "name": "Mobile, AL",
            "latitude": 30.68639,
            "longitude": -88.05324
        },
        {
            "id": 293,
            "name": "Montgomery, AL",
            "latitude": 32.38012,
            "longitude": -86.30063
        },
        {
            "id": 463,
            "name": "Montpelier, VT",
            "latitude": 44.261177,
            "longitude": -72.57671
        },
        {
            "id": 535,
            "name": "Morrisville, NY",
            "latitude": 42.898678,
            "longitude": -75.64018
        },
        {
            "id": 497,
            "name": "Muskego, WI",
            "latitude": 42.90221,
            "longitude": -88.1517
        },
        {
            "id": 456,
            "name": "New Bedford, MA",
            "latitude": 41.63902,
            "longitude": -70.934326
        },
        {
            "id": 303,
            "name": "New Orleans, LA",
            "latitude": 29.95369,
            "longitude": -90.07771
        },
        {
            "id": 123,
            "name": "New York, NY",
            "latitude": 40.74447,
            "longitude": -73.995445
        },
        {
            "id": 587,
            "name": "Newport News, VA",
            "latitude": 37.082024,
            "longitude": -76.458664
        },
        {
            "id": 476,
            "name": "Norfolk, VA",
            "latitude": 36.83703,
            "longitude": -76.28082
        },
        {
            "id": 574,
            "name": "Norwich, NY",
            "latitude": 42.531185,
            "longitude": -75.52351
        },
        {
            "id": 297,
            "name": "Orlando, FL",
            "latitude": 28.53823,
            "longitude": -81.37739
        },
        {
            "id": 556,
            "name": "Oshkosh, WI",
            "latitude": 44.024708,
            "longitude": -88.54261
        },
        {
            "id": 127,
            "name": "Philadelphia, PA",
            "latitude": 39.95228,
            "longitude": -75.16245
        },
        {
            "id": 128,
            "name": "Pittsburgh, PA",
            "latitude": 40.44501,
            "longitude": -79.99714
        },
        {
            "id": 568,
            "name": "Portage, WI",
            "latitude": 43.53915,
            "longitude": -89.46262
        },
        {
            "id": 129,
            "name": "Portland, ME",
            "latitude": 43.659706,
            "longitude": -70.25883
        },
        {
            "id": 581,
            "name": "Radford, VA",
            "latitude": 37.131794,
            "longitude": -80.57645
        },
        {
            "id": 132,
            "name": "Richmond, VA",
            "latitude": 37.5407,
            "longitude": -77.43365
        },
        {
            "id": 133,
            "name": "Ridgewood, NJ",
            "latitude": 40.98151,
            "longitude": -74.11261
        },
        {
            "id": 134,
            "name": "Rochester, NY",
            "latitude": 43.1555,
            "longitude": -77.61603
        },
        {
            "id": 580,
            "name": "Salem, VA",
            "latitude": 37.29347,
            "longitude": -80.05476
        },
        {
            "id": 321,
            "name": "San Antonio, TX",
            "latitude": 29.42428,
            "longitude": -98.4947
        },
        {
            "id": 135,
            "name": "Secaucus, NJ",
            "latitude": 40.78828,
            "longitude": -74.05496
        },
        {
            "id": 537,
            "name": "Sheboygan, WI",
            "latitude": 43.750828,
            "longitude": -87.71453
        },
        {
            "id": 522,
            "name": "South Boston, VA",
            "latitude": 36.69875,
            "longitude": -78.9014
        },
        {
            "id": 553,
            "name": "Sparta, WI",
            "latitude": 43.944134,
            "longitude": -90.81291
        },
        {
            "id": 430,
            "name": "St. Paul, MN",
            "latitude": 44.953136,
            "longitude": -93.19153
        },
        {
            "id": 541,
            "name": "Stanley, WI",
            "latitude": 44.959965,
            "longitude": -90.93709
        },
        {
            "id": 137,
            "name": "State College, PA",
            "latitude": 40.79373,
            "longitude": -77.8607
        },
        {
            "id": 481,
            "name": "Staunton, VA",
            "latitude": 38.138535,
            "longitude": -79.04684
        },
        {
            "id": 560,
            "name": "Stevens Point, WI",
            "latitude": 44.52358,
            "longitude": -89.57456
        },
        {
            "id": 585,
            "name": "Stewart International Airport (SWF) - New York",
            "latitude": 41.502922,
            "longitude": -74.10072
        },
        {
            "id": 139,
            "name": "Syracuse, NY",
            "latitude": 43.04999,
            "longitude": -76.14739
        },
        {
            "id": 145,
            "name": "Toronto, ON",
            "latitude": 43.64856,
            "longitude": -79.38532
        },
        {
            "id": 475,
            "name": "Virginia Beach, VA",
            "latitude": 36.752365,
            "longitude": -76.05045
        },
        {
            "id": 528,
            "name": "Warrenton, VA",
            "latitude": 38.71345,
            "longitude": -77.79527
        },
        {
            "id": 142,
            "name": "Washington, DC",
            "latitude": 38.89037,
            "longitude": -77.03196
        },
        {
            "id": 558,
            "name": "Waupun, WI",
            "latitude": 43.633324,
            "longitude": -88.72955
        },
        {
            "id": 543,
            "name": "Wausau, WI",
            "latitude": 44.959137,
            "longitude": -89.63012
        },
        {
            "id": 567,
            "name": "Westfield, WI",
            "latitude": 43.883595,
            "longitude": -89.49344
        },
        {
            "id": 490,
            "name": "Whitewater, WI",
            "latitude": 42.84309,
            "longitude": -88.74191
        },
        {
            "id": 544,
            "name": "Wittenberg, WI",
            "latitude": 44.827194,
            "longitude": -89.169556
        },
        {
            "id": 582,
            "name": "Wytheville, VA",
            "latitude": 36.948452,
            "longitude": -81.08481
        }
    ]
};

const DATE_MAP : Map<string, number> = new Map<string, number> ([
    ["Monday", 0],
    ["Tuesday", 1],
    ["Wednesday", 2],
    ["Thursday", 3],
    ["Friday", 4],
    ["Saturday", 5],
    ["Sunday", 6]
  ]);
