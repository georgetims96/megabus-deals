    
    /*
    DATA
    - Out Journeys
    - Return Journeys
    - UI elements to update
    */
function JourneyBooker(config) {
    // variables that will hold selected journey ids
  this.selectedOutJourneyID = null;
  this.selectedReturnJourneyID = null;

    // Contains original, unfiltered data returned by API call
  this.originalOutJourneys = config.outJourneys;
  this.originalReturnJourneys = config.returnJourneys;
  // Will be updated whenever we call filter function
  this.filteredOutJourneys = config.outJourneys;
  this.filteredReturnJourneys = config.returnJourneys;
    
  // FIXME ID probably won't be necessary. Can find another naming convention
  this.outJourneyListID = config.outJourneyListID;
  this.outJourneyList = document.getElementById(config.outJourneyListID);
    
  // FIXME ID probably won't be necessary. Can find another naming convention
  this.returnJourneyListID = config.returnJourneyListID;
  this.returnJourneyList = document.getElementById(config.returnJourneyListID);
    
  this.outJourneyPanelID = config.outJourneyPanelID;
  this.outJourneyPanel = document.getElementById(config.outJourneyPanelID);
  this.outJourneyButton = document.getElementById(config.outJourneyButtonID);
    
  this.returnJourneyPanelID = config.returnJourneyPanelID;
  this.returnJourneyPanel = document.getElementById(config.returnJourneyPanelID);
  this.returnJourneyButton = document.getElementById(config.returnJourneyButtonID);
    
  this.selectedOutJourneyText = document.getElementById(config.selectedOutJourneyTextID);
  this.selectedReturnJourneyText = document.getElementById(config.selectedReturnJourneyTextID);

  // Add purchase button
  this.purchaseButton = document.getElementById(config.purchaseButtonID);

  // Add event listeners purely for symmetry/easy removal
  this.outJourneyListEvent = function(){};
  this.outJourneyList.addEventListener('click', this.outJourneyListEvent);

  this.returnJourneyListEvent = function(){};
  this.returnJourneyList.addEventListener('click', this.returnJourneyListEvent);

  this.returnJourneyButtonEvent = function(){};
  this.returnJourneyButton.addEventListener('click', this.returnJourneyButtonEvent);

  this.outJourneyButtonEvent = function(){};
  this.outJourneyButton.addEventListener('click', this.outJourneyButtonEvent);

  // Don't need this to be symmetric as it's not dynamically generated
  this.purchaseButton.addEventListener('click', this.buyMegabusTickets.bind(this));

  // Filter out relevant journeys
  this.filterOnlyWithinWeek();

  // Populate journey lists
  this.populateJourneyLists();
}

/**
 * Create a span element representing the passed journeyId
 */
JourneyBooker.prototype.constructJourneyButton = function(journeyId, timeStampStr, outOrReturn) {
  let listId;
  if (outOrReturn === "out") {
    listId = "outJourneyList";
  } else {
    listId = "returnJourneyList";
  }
  // Construct relevant span object
  let curJourneySpan = document.createElement("span");
  curJourneySpan.id = `${listId}&${journeyId}`;
  curJourneySpan.appendChild(document.createTextNode(`${timeStampStr}`));
  // And return it
  return curJourneySpan;
}

/**
 * Create a li element representing a date
 */
JourneyBooker.prototype.constructDateLi = function(dateStr, outOrReturn) {
  let listId;
  if (outOrReturn === "out") {
    listId = "out";
  } else {
    listId = "return";
  }
  // Create empty li element
  let newLi = document.createElement("li");
  newLi.id = `${listId}?${dateStr}`;
  // First create the text node to indicate the date
  newLi.appendChild(document.createTextNode(`${dateStr}: `));
  // Return constructed li
  return newLi;
};

/**
 * Populates the out journey list based on the current filtered out journeys
 */
JourneyBooker.prototype.populateOutJourneyList = function() {
  this.outJourneyList.innerHTML = "";

  // Remove any existing event listeners
  this.outJourneyList.removeEventListener('click', this.outJourneyListEvent);
  this.outJourneyButton.removeEventListener('click', this.outJourneyButtonEvent);
    
  // Add all filtered journeys to relevant lists in the DOM
  this.filteredOutJourneys.forEach(journey => {
    // Get date strings
    let [curJourneyDateStr, timeStampStr] = this.getDateStrings(journey.departureDateTime);
        
    // Check if we already have relevant li entry
    let relLi = document.getElementById(`out?${curJourneyDateStr}`);
    // If we do
    if (relLi) {
      // Check if we've already included journey ID
      let relSpan = document.getElementById(`outJourneyList&${journey.journeyId}`);
      // If we haven't
      if (!relSpan) {
        // First add comma formatting
        relLi.appendChild(document.createTextNode(", "));
        // Construct relevant span object
        let curJourneySpan = this.constructJourneyButton(journey.journeyId, timeStampStr, "out");
        // And append it to the correct list
        relLi.appendChild(curJourneySpan);
      }
    } else {
      // In this case, we need to construct the list element as well
      let relLi = this.constructDateLi(curJourneyDateStr, "out");
      // Second, construct span as above for specific journey
      let curJourneySpan = this.constructJourneyButton(journey.journeyId, timeStampStr, "out");
      // Add span to newly constructed li element
      relLi.appendChild(curJourneySpan);
      // Add li element to out journey list
      this.outJourneyList.appendChild(relLi);
    }
        
  });

  let self = this;

  this.outJourneyListEvent = function(e) {
    let targetID = e.target.id;
    let parsedID = targetID.split("&");
    // FIXME got to be a better way
    if (parsedID.length > 1) {
      self.selectOutJourney(parsedID[1]);
    }
  };

  this.outJourneyList.addEventListener('click', this.outJourneyListEvent);

  this.outJourneyButtonEvent = function(e) {
    self.clearOutJourney();
  };

  // FIXME correct place to set this up?
  this.outJourneyButton.addEventListener('click', this.outJourneyButtonEvent);
}

/**
 * Populates return journey list based on current filtered return journeys
 */
JourneyBooker.prototype.populateReturnJourneyList = function() {
  this.returnJourneyList.innerHTML = "";

  // Make sure to remove any existing event listeners
  this.returnJourneyList.removeEventListener('click', this.returnJourneyListEvent);
  this.returnJourneyButton.removeEventListener('click', this.returnJourneyButtonEvent);

  // Add all filtered journeys to relevant lists in the DOM
  this.filteredReturnJourneys.forEach(journey => {
    // Get date strings
    let [curJourneyDateStr, timeStampStr] = this.getDateStrings(journey.departureDateTime);
        
    // Check if we already have relevant li entry
    let relLi = document.getElementById(`return?${curJourneyDateStr}`);
    // If we do
    if (relLi) {
      // Check if we've already included journey ID
      let relSpan = document.getElementById(`returnJourneyList&${journey.journeyId}`);
      // If we haven't
      if (!relSpan) {
        // First add comma formatting
        relLi.appendChild(document.createTextNode(", "));
        // Construct relevant span object
        let curJourneySpan = this.constructJourneyButton(journey.journeyId, timeStampStr, "return");
        // And append it to the correct list
        relLi.appendChild(curJourneySpan);
      }
    } else {
      // In this case, we need to construct the list element as well
      let relLi = this.constructDateLi(curJourneyDateStr, "return");
      // Second, construct span as above for specific journey
      let curJourneySpan = this.constructJourneyButton(journey.journeyId, timeStampStr, "return");
      // Add span to newly constructed li element
      relLi.appendChild(curJourneySpan);
      // Add li element to out journey list
      this.returnJourneyList.appendChild(relLi);
    }
        
  });
    
  let self = this;

  this.returnJourneyListEvent = function(e) {
    let targetID = e.target.id;
    let parsedID = targetID.split("&");
    // FIXME got to be a better way
    if (parsedID.length > 1) {
      // FIXME why doesn't this. work
      self.selectReturnJourney(parsedID[1]);
    }
  }
  
  this.returnJourneyList.addEventListener('click', this.returnJourneyListEvent);


  this.returnJourneyButtonEvent = function(e) {
    self.clearReturnJourney();
  };

  this.returnJourneyButton.addEventListener('click', this.returnJourneyButtonEvent);

}

JourneyBooker.prototype.populateJourneyLists = function() {
  this.populateOutJourneyList();
  this.populateReturnJourneyList();
};

JourneyBooker.prototype.selectOutJourney = function(journeyID) {
  // Update selected journey id
  this.selectedOutJourneyID = journeyID;
    
  // First remove any existing journey/text
  // Then update selected out journey text
  this.selectedOutJourneyText.innerHTML = "";
  this.selectedOutJourneyText.appendChild(document.createTextNode(`(${this.getPrettyDateStrings(this.getJourney(journeyID).departureDateTime)})`));

  // Populate return journey list based on selection
  this.filterReturnJourneys(journeyID);
  this.populateReturnJourneyList();

  // Undisable out journey button so we can cancel out journey choice
  this.outJourneyButton.disabled = false;
  // Hide the out journey panel
  this.outJourneyPanel.classList.remove("show");
  // Ensure the arrow is pointing in the right direction
  this.outJourneyButton.classList.add("collapsed");

  // Show the return journey panel
  this.returnJourneyPanel.classList.add("show");
  // Ensure the arrow is pointing in the right direction
  this.returnJourneyButton.classList.remove("collapsed");
    

};

JourneyBooker.prototype.clearOutJourney = function() {
  // If we're clearing out journey, we should also clear return journey
  // selection if necessary as well
  if (this.selectedReturnJourneyID) {
    // FIXME should this be correct
    this.populateJourneyLists();
    // Remove existing journey text
    this.selectedReturnJourneyText.innerHTML = "";
    // remove selected return journey
    this.selectedReturnJourneyID;
    // Disable return journey button
    this.returnJourneyButton.disabled = true;
    // FIXME will we add it multiple times???
    this.purchaseButton.classList.add("d-none");
  }
  // Set selected out journey ID to null
  this.selectedOutJourneyID = null;
  // Remove remove any existing journey/text
  // FIXME Definitely a better way of doing this
  this.selectedOutJourneyText.innerHTML = "";
    
  // Hide the return journey panel
  this.returnJourneyPanel.classList.remove("show");
  // Ensure arrow is pointing in right direction
  this.returnJourneyButton.classList.add("collapsed");

  // Redisable out journey button
  this.outJourneyButton.disabled = true;
    
  // Show the out journey panel
  this.outJourneyPanel.classList.add("show");
  // Ensure the arrow is pointing in the right direction
  this.outJourneyButton.classList.remove("collapsed");
}

JourneyBooker.prototype.selectReturnJourney = function(journeyID) {
  // Update selected return journey ID
  this.selectedReturnJourneyID = journeyID;

  // Remove existing text and update with new choice
  // FIXME lot of room to optimize
  this.selectedReturnJourneyText.innerHTML = "";
  this.selectedReturnJourneyText.appendChild(document.createTextNode(`(${this.getPrettyDateStrings(this.getJourney(journeyID).departureDateTime)})`));

  // Hide the return journey panel
  this.returnJourneyPanel.classList.remove("show");
  // Ensure arrow is pointing in right direction
  this.returnJourneyButton.classList.add("collapsed");

  // Undisable the return journey button
  this.returnJourneyButton.disabled = false;

  // Show purchase button
  this.purchaseButton.classList.remove("d-none");
};

JourneyBooker.prototype.clearReturnJourney = function() {
  // FIXME check if we can optimize this
  this.populateJourneyLists();
    
  // Wipe out selected return journey
  this.selectedReturnJourneyID = null;

  // Remove existing text
  this.selectedReturnJourneyText.innerHTML = "";
    
  // Disable return journey button again
  this.returnJourneyButton.disabled = true;

  // Show return journey panel
  this.returnJourneyPanel.classList.add("show");
    
  // Make sure arrow is pointing in right direction
  this.returnJourneyButton.classList.remove("collapsed");

  // Hide purchase button
  // FIXME will we add it multiple times???
  this.purchaseButton.classList.add("d-none");

}

/**
 * Getter for journey JSON object based on journey ID
 */
JourneyBooker.prototype.getJourney = function(journeyId) {
  let foundJourney = null;
  this.originalOutJourneys.forEach(journey => {
    // FIXME check typing here
    if (journey.journeyId === journeyId) {
      foundJourney = journey;
      return journey;
    }
  });
  this.originalReturnJourneys.forEach(journey => {
  // FIXME check typing here
    if (journey.journeyId === journeyId) {
      foundJourney = journey;
      return journey;
    }
  });
  return foundJourney;
}

/**
 * Returns array of time strings in [date_string, time_of_day_string] format
 */ 
JourneyBooker.prototype.getDateStrings = function(dateToProcess) {
  // First create relevant date object
  let dateObj = new Date(dateToProcess);
    
  // Format day correctly
  const rawDay = dateObj.getDate();
  // Pad day with leading 0 if necessary
  const day = rawDay >= 10 ? rawDay : "0" + rawDay;

  // Format month correctly
  const rawMonth = dateObj.getMonth();
  // Pad month with leading zero if necessary
  const month = rawMonth >= 10 ? rawMonth : "0" + rawMonth;

  // Format year correctly
  const rawYear = dateObj.getFullYear();
  // Remove first two characters
  const year = rawYear % 100;

  // Format hour correctly
  const rawHour = dateObj.getHours();
  // Pad hour with leading zero if necessary
  const hour = rawHour >= 10 ? rawHour : "0" + rawHour;

  // Format minutes correctly
  const rawMinutes = dateObj.getMinutes();
  const minutes = rawMinutes;

  // Construct date string
  let dateStr = `${day}-${month}-${year}`;
  // Construct time string
  let timeStampStr = `${hour}:${minutes}`;

  // Return the two constructed strings as an array
  return [dateStr, timeStampStr];
}

/**
 * Returns date formatted per Megabus url requirments
 */ 
 JourneyBooker.prototype.getURLDateStrings = function(dateToProcess) {
  // First create relevant date object
  let dateObj = new Date(dateToProcess);
    
  // Format day correctly
  const rawDay = dateObj.getDate();
  // Pad day with leading 0 if necessary
  const day = rawDay >= 10 ? rawDay : "0" + rawDay;

  // Format month correctly
  const rawMonth = dateObj.getMonth();
  // Pad month with leading zero if necessary
  const month = rawMonth >= 10 ? rawMonth : "0" + rawMonth;

  // Format year correctly
  const rawYear = dateObj.getFullYear();
  // Keep the same
  const year = rawYear;

  // Construct date string
  let dateStr = `${year}-${month}-${day}`;

  // Return the two constructed strings as an array
  return dateStr;
}

JourneyBooker.prototype.getPrettyDateStrings = function(dateToProcess) {
  // Maps day to relevant string
  const dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Maps month to relevant string
  const monthArr = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
  // Create date object
  const dateObj = new Date(dateToProcess);

  // Return the formatted string
  return `${dayArr[dateObj.getDay()]} ${dateObj.getDate()} ${monthArr[dateObj.getMonth()]}`;
}

/**
 * Filters out and return journeys such that there is a corresponding journey
 * within a week. There is a lot of room for optimization here.
 */
JourneyBooker.prototype.filterOnlyWithinWeek = function() {
  let filteredOut = [];
  let filteredReturn = [];

  // Sets to make sure we don't include same journey twice
  // N.B. this might make some checks in the rendering step redundant
  let seenOut = new Set();
  let seenReturn = new Set();
  // FIXME use forEach
  for (let outJourney of this.originalOutJourneys) {
    for (let returnJourney of this.originalReturnJourneys) {
      let dayDiff = this.getDayDifference(outJourney.departureDateTime, returnJourney.departureDateTime);
      if (dayDiff < 7 && dayDiff > 0) {
        // FIXME correct function?
        if (!seenOut.has(outJourney.journeyId)) {
          filteredOut.push(outJourney);
          seenOut.add(outJourney.journeyId);
        }
        if (!seenReturn.has(returnJourney.journeyId)) {
          filteredReturn.push(returnJourney);
          seenReturn.add(returnJourney.journeyId);
        }
      }
    }
  }
  this.filteredOutJourneys = filteredOut;
  this.filteredReturnJourneys = filteredReturn;
}

JourneyBooker.prototype.filterReturnJourneys = function(outJourneyId) {
  let filteredReturn = [];
  // Use getter here
  let selectedJourney = this.getJourney(outJourneyId);
  for (let returnJourney of this.originalReturnJourneys) {
    // FIXME optimize journey getter
    let dayDiff = this.getDayDifference(selectedJourney.departureDateTime, returnJourney.departureDateTime);
    if (dayDiff < 7 && dayDiff > 0) {
      filteredReturn.push(returnJourney);
    }
  }
  this.filteredReturnJourneys = filteredReturn;
}

/**
 * Helper that returns the number of days difference between two dates
 */
JourneyBooker.prototype.getDayDifference = function(date1, date2) {
  let date1Proc = new Date(date1);
  let date2Proc = new Date(date2);
  let difference = date2Proc.getTime() - date1Proc.getTime();

  let daysDifference = Math.ceil(difference / (1000 * 3600 * 24));
  return daysDifference;
}

JourneyBooker.prototype.buyMegabusTickets = function() {
  let selectedOutJourney = this.getJourney(this.selectedOutJourneyID);
  let selectedReturnJourney = this.getJourney(this.selectedReturnJourneyID);

  // TODO generate link to megabus deals

  // Get city ID's
  let sourceID = selectedOutJourney.origin.cityId;
  let destID = selectedReturnJourney.origin.cityId;

  // Get the relevant dates formatted as per the helper
  let outDate = this.getURLDateStrings(selectedOutJourney.departureDateTime);
  let returnDate = this.getURLDateStrings(selectedReturnJourney.departureDateTime);

  let outUrl = `https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&departureDate=${outDate}&destinationId=${destID}&inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&originId=${sourceID}&otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0`;
  let returnUrl = `https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&departureDate=${returnDate}&destinationId=${sourceID}&inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&originId=${destID}&otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0`;
  
  // Open the relevant pages
  window.open(outUrl);
  window.open(returnUrl);
}
