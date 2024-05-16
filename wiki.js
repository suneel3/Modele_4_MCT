
let wikiBtn = document.querySelector("#wiki")
async function fetchWikipediaResults(query) {
    if(query === ""){
        document.querySelector(".cards").style.display = "flex"
        resultContainer.style.boxShadow = "none";
        resultContainer.innerHTML = ""
        return;
    }

    if(!showResult) {
        document.querySelector(".cards").style.display = "none"
    }
    const apiEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    //console.log(data.query.search);
 
    resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
     
    let resultData = data.query.search.map((result)=>{
        return result}
    );

    wikiBtn.addEventListener("click",()=>{
        document.querySelector("#wiki").classList.add("selectedBtn");
        document.querySelector("#google").classList.remove("selectedBtn");
        document.querySelector("#gemini").classList.remove("selectedBtn");
        document.querySelector("#images").classList.remove("selectedBtn");
        resultContainer.innerHTML = ""

        displayWikiData(resultData)
    })
}
    

  function createWikipediaCard(title, link, timestamp, snippet) {
 
    let result = document.createElement("div");
    result.classList.add("result" , "result-dark");

    let titleHeading = document.createElement("div");
    titleHeading.classList.add("title","title-dark");

    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.setAttribute("target","_blank");
    anchor.innerHTML = title;

    let dateAndTimeDiv = document.createElement("div");
    dateAndTimeDiv.classList.add("dataAndTime","dataAndTime-dark")
    dateAndTimeDiv.innerHTML = timestamp


    let description = document.createElement("div");
    description.classList.add("description","description-dark")
    description.innerHTML = snippet;

    let hrTag = document.createElement("hr");

    titleHeading.append(anchor);
    result.append(titleHeading,dateAndTimeDiv,description,hrTag);
    resultContainer.append(result)

  }


function displayWikiData(resultData){
    if(inputBox.value === ""){
        return;
    }
    let wikiHeading = document.createElement("h3");
    wikiHeading.classList.add("head")
    wikiHeading.innerHTML = `Wikipedia search result for : ${inputBox.value}`
    resultContainer.append(wikiHeading);

    resultData.forEach((result) => {
        //  title: result.title,
        //   link: `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`,
        //   snippet: result.snippet
        createWikipediaCard(
  
          result.title,
          `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`,
          result.timestamp.slice(0, 10),
          result.snippet
        );
    });

}

btn.addEventListener("click",()=>{
    fetchWikipediaResults(inputBox.value)
 })