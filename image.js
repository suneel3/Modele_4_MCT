let page = 1;
let imageGallery = document.createElement("div");
imageGallery.classList.add("image-gallery")

let imageBtn = document.querySelector("#images")

const key = "qjGFtcZvVQ-bzgoKY3cbJYJibLj1-dQjSf1q8cpUf-4"
// const api_key = `https://api.unsplash.com/search/photos?page${page}&query=${userInput}&client_id=${key}`;

async function fetchData(search){
    if(search === ""){
        document.querySelector(".cards").style.display = "flex"
        resultContainer.style.boxShadow = "none";
        resultContainer.innerHTML = ""
        return;
    }

    if(!showResult) {
        document.querySelector(".cards").style.display = "none"
    }
   const response  = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${search}&client_id=${key}`);
   const data = await response.json();

   let urlArray = data.results.slice(0,9);

   imageBtn.addEventListener("click",()=>{
    document.querySelector("#wiki").classList.remove("selectedBtn");
    document.querySelector("#google").classList.remove("selectedBtn");
    document.querySelector("#gemini").classList.remove("selectedBtn");
    document.querySelector("#images").classList.add("selectedBtn");

    resultContainer.innerHTML = "";
    imageGallery.innerHTML = ""
    if(inputBox.value === ""){
        return;
    }
    resultContainer.append(imageGallery)

    urlArray.forEach((img,idx)=>{
        displayImage(img.urls.regular);
    })
})
   

}
function displayImage(url){
   
    // const imageGallery = document.createElement("div");
    // imageGallery.classList.add("image-gallery")
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper")
 
    const img = document.createElement("img");
    img.src = url;
 
    const overlay = document.createElement("div");
    overlay.classList.add("overlay")
 
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("button-group")
 

    const anchorLink = document.createElement("a");
    anchorLink.href = url;
    anchorLink.setAttribute("target","_blank");
    const downloadImg = document.createElement("span");
    downloadImg.innerText = "download"
    downloadImg.classList.add("material-symbols-outlined","download-link");
     downloadImg.addEventListener("click",(event)=>{
        imageDownload(event)
     });

     anchorLink.append(downloadImg)
 
 
    overlay.append(buttonGroup,anchorLink);
    imageWrapper.append(img,overlay);
    imageGallery.append(imageWrapper);
    // resultContainer.append(imageWrapper);
 
 }

 function imageDownload(event) {

    event.target.click()
    
   
 }
btn.addEventListener("click",()=>{
    fetchData(inputBox.value)
})