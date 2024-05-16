const p = document.querySelectorAll(".sidebar p");
let flag = false;
let hamIcon = document.querySelector(".menu");
let inputBox = document.querySelector(".search-box input")
let btn = document.querySelector("#send")
let resultContainer = document.querySelector(".result-container")

let geminiBtn = document.querySelector("#gemini")
let newChat  = document.querySelector(".new-chat");

let recentItem = document.querySelector(".recent-container")

var storePrompt = [];


let toggle = false;
 let showResult = false;

const md = window.markdownit();

const API_Key = "AIzaSyCR8m1tLb5UKQNeiSQgYbNZ_h2XuJNA9sw";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(API_Key);

async function run(prompt) {
    if(prompt === ""){
        document.querySelector(".cards").style.display = "flex"
        resultContainer.innerHTML = ""
        return;
    }

    if(!showResult) {
        document.querySelector(".cards").style.display = "none"
     }
  //  loader.style.display = "flex";

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    if(!storePrompt.includes(prompt) && !storePrompt.includes(undefined)){
        storePrompt.push(prompt)
    }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  //console.log(response.status)

//   if (!response.ok) {
//     alert("try after some time gemini server is failed!! ");
//     return;
//  }
  const text = response.text();
  //console.log(md.render(text));
  // loader.style.display = "none";

   geminiBtn.addEventListener("click",()=>{
    document.querySelector("#wiki").classList.remove("selectedBtn");
    document.querySelector("#google").classList.remove("selectedBtn");
    document.querySelector("#gemini").classList.add("selectedBtn");
    document.querySelector("#images").classList.remove("selectedBtn");
    // resultContainer.innerHTML = "";
    displayData(text)
   }) 
    // displayData(text)
    displayRecentPrompt()


}

function displayData(text){
  
    resultContainer.innerHTML = "";
    if(inputBox.value === ""){
        return;
    }
      
     let result = document.createElement("div");
     result.classList.add("result");

     let resultTitle = document.createElement("div");
      resultTitle.classList.add("result-title");
      
      let profileIcon = document.createElement("img");
      profileIcon.src="assets/user_icon.png";
      let promptHeading = document.createElement("p");
      promptHeading.innerText = inputBox.value;

      let speakerIcon = document.createElement("span");
      speakerIcon.classList.add("material-symbols-outlined","speaker");
      speakerIcon.innerText = "volume_up"
  

        // loader.style.display = "flex";
      let resultData = document.createElement("div");
      resultData.classList.add("result-data")


      let geminiIcon = document.createElement("img")
      geminiIcon.src="assets/gemini_icon.png";
      let dataDiv = document.createElement("div");
      dataDiv.classList.add("data-div")
      dataDiv.innerHTML = md.render(text);
     
      speakerIcon.addEventListener("click",(event)=>{
        speakText(event)
      })

      let codeTag  = dataDiv.querySelectorAll("code")

      for(let i=0;i<codeTag.length;i++){
         let code = codeTag[i];
         Prism.highlightElement(code)
      }


      resultTitle.append(profileIcon,promptHeading,speakerIcon);
      resultData.append(geminiIcon,dataDiv);

      
      result.append(resultTitle,resultData);

      resultContainer.append(result)
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      resultContainer.addEventListener("click", function() {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
       });
       

    //    console.log(document.getElementsByTagName("pre")[0].parentElement)
         
    //    preTag.classList.add("code-snippets")
    //    Prism.highlightElement(document.querySelector('.code-snippets'));
    //    Prism.highlightElement(document.querySelector('.language-javascript'));
 

        // loader.style.display = "none";

    //   console.log(storePrompt)

}

function saveToLocalStorage(){
    localStorage.setItem("prompt",storePrompt.length > 5 ? JSON.stringify(storePrompt.slice(storePrompt.length-5,storePrompt.length)): JSON.stringify(storePrompt))
}
function loadFromLocalStorage(){
    if(localStorage.getItem("prompt")){
        let localData = JSON.parse(localStorage.getItem("prompt"));
        storePrompt = [...localData]
        // console.log(storePrompt)
        displayRecentPrompt();
    }

}

function displayRecentPrompt(){
    recentItem.innerHTML = ""
    for(let i=0;i<storePrompt.length;i++){
        let recentDiv = document.createElement("div")
        recentDiv.classList.add("recent-entry");
        recentDiv.setAttribute("id",i);

        recentDiv.addEventListener("click",(event)=>{
            displayRecentHistoryData(event);
        })
    
        let icon = document.createElement("span");
        icon.classList.add("material-symbols-outlined");
        icon.innerText = "mode_comment"
    
        let p = document.createElement("p");
        
        // console.log(storePrompt[i].length);
        // console.log(storePrompt[i].substring(0,15));
        
        p.innerText = storePrompt[i].length > 15 ? storePrompt[i].substring(0,15) + "...": storePrompt[i]  

        recentDiv.append(icon,p)

        recentItem.append(recentDiv)
    }

}
function displayRecentHistoryData(event){

    let idx = event.target.parentElement.getAttribute("id");

    inputBox.value = storePrompt[idx];

    // run(storePrompt[idx])
}


function toggleIcon(){
    if(toggle === false){
        for(let i=0;i<p.length;i++){
           p[i].style.display = "none"
        }
        toggle=true;
     }else{
        for(let i=0;i<p.length;i++){
            p[i].style.display = ""
         }
         toggle=false;
     }
}

window.addEventListener("load",()=>{
    // saveToLocalStorage()
     loadFromLocalStorage()
    // localStorage.removeItem("prompt")
})
hamIcon.addEventListener("click",()=>{
    toggleIcon()
})

btn.addEventListener("click",()=>{
    run(inputBox.value);
    saveToLocalStorage()
})
newChat.addEventListener("click",()=>{
   window.location.reload()
   loadFromLocalStorage()
})




  
function speakText(event){
  
    let speech  = new SpeechSynthesisUtterance();
    let content = event.target.parentElement.nextElementSibling.children[1].innerText
    // console.log(event.target.parentElement.nextElementSibling.children[1].innerText)
    
     speech.text = content;
   //  window.speechSynthesis.speak(speech)
    //  console.log(speech.text)
    
    if(flag === false){
        window.speechSynthesis.speak(speech)
      event.target.style.backgroundColor  = "#ece9e9";
       flag=true;
    }else{
        window.speechSynthesis.pause(speech)
         event.target.style.backgroundColor  = "#ffffff";
        flag=false;
    }
   
}