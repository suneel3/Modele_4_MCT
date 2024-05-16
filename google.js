
let resultContainer = document.querySelector(".result-container")
let btn = document.querySelector("#send")
let inputBox = document.querySelector(".search-box input")
let googleBtn = document.querySelector("#google");
let showResult = false;
let loader = document.querySelector(".loader")
let micIcon = document.querySelector("#mic")
let API_Key = "AIzaSyCH0zbNTYrwbBg2JFZVwCKTqpTA8RgFMxc";
let CX_Id = "053664ba4ac1a4447";

async function fetchGoogleData(query){
    if(query === ""){
        alert("please enter some prompt");
        resultContainer.innerHTML = ""
        resultContainer.style.boxShadow = "none";
        return;
    }
    if(!showResult) {
        document.querySelector(".cards").style.display = "none"
     }

       loader.style.display = "flex";
       document.querySelector("#wiki").classList.remove("selectedBtn");
       document.querySelector("#google").classList.add("selectedBtn");
       document.querySelector("#gemini").classList.remove("selectedBtn");
       document.querySelector("#images").classList.remove("selectedBtn");

       let response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_Key}&cx=${CX_Id}&q=${query}`);
       let result = await response.json();

       loader.style.display = "none";

       googleBtn.addEventListener("click",()=>{
        document.querySelector("#wiki").classList.remove("selectedBtn");
        document.querySelector("#google").classList.add("selectedBtn");
        document.querySelector("#gemini").classList.remove("selectedBtn");
        document.querySelector("#images").classList.remove("selectedBtn");
        resultContainer.innerHTML = "";
        displayData(result.items)
       })

       resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";

      // console.log(result.items)
       resultContainer.innerHTML = ""
       displayData(result.items)

}

function displayData(result){
    if(inputBox.value === ""){
        return;
    }
    let googleHeading = document.createElement("h3");
    googleHeading.classList.add("head")
    googleHeading.innerHTML = `Google search result for : ${inputBox.value}`
    resultContainer.append(googleHeading);

    result.forEach((data)=>{
        let googleResultDiv = document.createElement("div");
        googleResultDiv.classList.add("google-search-container")
    
        let headerDiv = document.createElement("div");
        headerDiv.classList.add("header-div")
    
        let imgIconDiv = document.createElement("div");
        imgIconDiv.classList.add("imgIcon-div");
        
    
        let iconImg = document.createElement("img");
        // iconImg.src = data.pagemap.metatags[0]["og:image"];
        const thumbnailImg = data.pagemap?.cse_thumbnail != undefined ? data.pagemap?.cse_thumbnail[0].src : '/assets/logo.png';
        iconImg.src = thumbnailImg;
    
        let titleDiv = document.createElement("div");
        titleDiv.classList.add("title-div","title-div-dark");
    
        let title = document.createElement("h4");
        let showTitle = data.displayLink.split(".");
        
        if(showTitle.length > 2){
            title.innerHTML = showTitle[1];
        }else{
            title.innerHTML = showTitle[0];
        }
        let websiteLink  =document.createElement("a");
        websiteLink.href = data.link;
        websiteLink.setAttribute("target","_blank");
        websiteLink.innerText = data.link
    
        let descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("description-div","description-div-dark")
    
        let anchorHeading = document.createElement("a");
        anchorHeading.href = data.link;
        anchorHeading.setAttribute("target","_blank");
    
        let heading = document.createElement("h2");
        heading.innerHTML = data.htmlTitle;
        let descriptionPara = document.createElement("p");
        descriptionPara.innerHTML = data.htmlSnippet;

        let divide = document.createElement("hr");
    
        anchorHeading.append(heading);
    
        imgIconDiv.append(iconImg);
        titleDiv.append(title,websiteLink);
    
        headerDiv.append(imgIconDiv,titleDiv);
        descriptionDiv.append(anchorHeading,descriptionPara);
    
        googleResultDiv.append(headerDiv,descriptionDiv);
    
        resultContainer.append(googleResultDiv,divide)
    })
    

}

let isRecognizing = false;

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';

micIcon.addEventListener("click",()=>{
    if (!isRecognizing) {
        recognition.start(); // Start recognition
       micIcon.textContent = 'Stop Voice Recognition';
       micIcon.style.backgroundColor = "#f7d2c7"
        isRecognizing = true;
    } else {
        recognition.stop(); // Stop recognition
      micIcon.textContent = 'Start Voice Recognition';
      micIcon.style.backgroundColor = ""
        isRecognizing = false;
    }
})
recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    inputBox.value += result;
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

recognition.onend = () => {
    // Handle the end of recognition if needed
};


btn.addEventListener("click",()=>{
    fetchGoogleData(inputBox.value)
})