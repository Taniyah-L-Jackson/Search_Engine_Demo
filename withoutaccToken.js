//Gathering User Data
//--Main element to append info from data
const displayInfo = document.getElementById('showData');

//--To display total records
var total = document.getElementById('totalSearchResults');
var totalCount = 0;

//Pagination

//--Storing Data
var dataStorage = [];

//--Starting Page Number
var currentPg = 1;

//--Max Number of Records Allowed on One Page
var recordsAllowedOnPage = 5;

//--Buttons to switch pages
var prevBtn = document.getElementById('prev');
var nextBtn = document.getElementById('next');

//---Btns are hidden untill paginate function is called

//--Shows how many pages are needed to hold info
var totalPagesNeeded = 0;

//--Displays how many pages hold data
var pageNumber = document.getElementById('pageNums');


//Fetching data function
async function displayUsers() {

    //clears already displayed info
    clearDisplay();

    //resets and clears old data
    totalCount = 0;
    total.innerText = '';
    currentPg = 1;
    dataStorage = [];
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    pageNumber.innerText = "";

    // get info from server
    let userName = document.getElementById('user').value;

    const response = await fetch(`https://api.github.com/search/users?q=${userName}`, 
        {
            "method" : "GET",
            "headers" : headers
        }
    );

    // render info received from url to site using json
    const data = await response.json();

    //get total amount of related info and display to screen
    totalCount = data.items.length;

    //failSafe (Just in Case) 
    if (totalCount == 0) {
        displayInfo.innerText = 'No Results Found';
    }else {

        // display total count of records found
        total.innerText = "Found: " + totalCount;

        //after data is retrived and stored, call paginate function
        dataStorage.push(data.items);
        paginate(currentPg);

    };

}

//Displaying Data using Pagination function
function paginate(currentPg) {

    //cleared, resetted, and updated on each function call
    pageNumber.innerText = '';
    displayInfo.innerHTML = '';
    totalPagesNeeded = 0;
   
    // get total page count
    // --divide total elements called by records allowed on one page
    totalPagesNeeded  = Math.ceil(totalCount / recordsAllowedOnPage);

    //display buttons
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';

    // set total number of elements to appear on each page
    //use current pg to determine where 'i' will start displaying data from
    for (var i = (currentPg - 1) * recordsAllowedOnPage; i < (currentPg * recordsAllowedOnPage) && i < totalCount; i++) {
            
        // Create elements to append to main element
        const image = document.createElement('img');
        const a = document.createElement('a');
        const hr = document.createElement('hr');

        // add stored data and classes to created elements
        image.classList.add('dataImage')
        a.classList.add('dataA')

        //--user's url
        a.href = dataStorage[0][i].html_url;
        a.innerText = dataStorage[0][i].login;

        //--user's avatar 
        image.src = dataStorage[0][i].avatar_url;
        image.style.height = '60px';
        image.style.width = '60px';

        // display info to screen
        displayInfo.appendChild(image);
        displayInfo.appendChild(a);
        displayInfo.appendChild(hr);
        displayInfo.appendChild(document.createElement("br"));

    }

    // Page counter
    pageNumber.innerText = "Page " + currentPg + " out of " + totalPagesNeeded;

}

//clear display on reload or new search
function clearDisplay() {
    if (displayInfo.innerText != '') {
        displayInfo.innerText = '';
    }
};

//Btns that switch loaded data
function prevPage()
{
    //decrease page count and make sure current page isnt out of range
    currentPg--;

    if (currentPg < 1) {
        currentPg = 1;
    }
    
    //call paginate function
    paginate(currentPg);
}

function nextPage()
{
    //increase page count and make sure current page isnt out of range

    currentPg++;
    
    if (currentPg > totalPagesNeeded) {
        currentPg = totalPagesNeeded;
    }

    //call paginate function
    paginate(currentPg);
}

//References
//https://www.youtube.com/watch?v=5QlE6o-iYcE
//https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
//https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript
//https://jsfiddle.net/Lzp0dw83/1/
