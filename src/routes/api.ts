import axios from 'axios';

// Given a route between an origin and destination, returns an array of dates on which there are journeys
export async function getValidDates(originId: number, destinationId: number) : Promise<any[]> {
  const response = await axios.get(`https://us.megabus.com/journey-planner/api/journeys/travel-dates?destinationCityId=${destinationId}&originCityId=${originId}`);
  return response.data.availableDates;
}

// Given a route and date, return all journeys
export async function getJourneyOnDate(date: string, originId: number, destinationId: number) : Promise<object> {
  const response = await axios.get(`https://us.megabus.com/journey-planner/api/journeys?days=1&concessionCount=0&departureDate=${date}&destinationId=${destinationId}&inboundDepartureDate=${date}&inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&originId=${originId}&otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0`);
  return response.data.journey;
}

export async function getJourneysOnDates(dates: string[], originId: number, destinationId: number) : Promise<any[]> {
  // FIXME: proper typing
  const journeys: any[] = [];
  dates.forEach(date => {
    const curJourney = getJourneyOnDate(date, originId, destinationId);
    journeys.push(curJourney);
  });
  return journeys;
}
