const p = document.querySelectorAll(".sidebar p");
let recentItem = document.querySelector(".recent-container")
let hamIcon = document.querySelector(".menu");
let inputBox = document.querySelector(".search-box input")
let btn = document.querySelector("#send")
let mainContainer = document.querySelector(".main-container")
let loader = document.querySelector(".loader")
let speakerIcon = document.querySelector(".speaker")
let newChat  = document.querySelector(".new-chat");

let userName = document.querySelector(".greet p span");
let toggle = false;
let showResult = false;

let storePrompt = [];
let name = "Suneel"

const md = window.markdownit();
const result = md.render('# markdown-it rulezz!');
console.log(result)

const API_Key = "AIzaSyCR8m1tLb5UKQNeiSQgYbNZ_h2XuJNA9sw";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_Key);

async function run(prompt) {
    if(!showResult) {
        document.querySelector(".cards").style.display = "none"
     }
     loader.style.display = "flex";
  // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    prompt = inputBox.value;
    if(!storePrompt.includes(prompt)){
        storePrompt.push(prompt)
    }


  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(md.render(text));
   loader.style.display = "none";

  displayData(text)
  displayRecentPrompt()
  saveToLocalStorage()

}

function displayData(text){

    //  let resultContainer = document.createElement("div");
    //  resultContainer.classList.add("result");
    //  resultContainer.innerHTML = md.render(text);
    //  mainContainer.append(resultContainer)
    //  inputBox.value = ""
      
     let resultContainer = document.createElement("div");
     resultContainer.classList.add("result");

     let resultTitle = document.createElement("div");
      resultTitle.classList.add("result-title");
      
      let profileIcon = document.createElement("img");
      profileIcon.src="assets/user_icon.png";
      let promptHeading = document.createElement("p");
      promptHeading.innerText = inputBox.value;

      let speakerIcon = document.createElement("span");
      speakerIcon.classList.add("material-symbols-outlined","speaker");
      speakerIcon.innerText = "volume_up"
  


        loader.style.display = "flex";
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

      

      resultContainer.append(resultTitle,resultData);


      mainContainer.append(resultContainer)
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      resultContainer.addEventListener("click", function() {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
       });
       

       console.log(document.getElementsByTagName("pre")[0].parentElement)
         
       preTag.classList.add("code-snippets")
       Prism.highlightElement(document.querySelector('.code-snippets'));
       Prism.highlightElement(document.querySelector('.language-javascript'));
 

        loader.style.display = "none";

      inputBox.value = ""
      console.log(storePrompt)

}

function displayRecentPrompt(){
    recentItem.innerHTML = ""
    for(let i=0;i<storePrompt.length;i++){
        let recentDiv = document.createElement("div")
        recentDiv.classList.add("recent-entry");
        recentDiv.addEventListener("click",(event)=>{
            displayRecentHistoryData(event);
        })
    
        let icon = document.createElement("span");
        icon.classList.add("material-symbols-outlined");
        icon.innerText = "mode_comment"
    
        let p = document.createElement("p");
        
        console.log(storePrompt[i].length);
        console.log(storePrompt[i].substring(0,15));
        
        p.innerText = storePrompt[i].length > 15 ? storePrompt[i].substring(0,15) + "...": storePrompt[i]  

        recentDiv.append(icon,p)

        recentItem.append(recentDiv)
    }

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

function saveToLocalStorage(){
    localStorage.setItem("username",name);
    localStorage.setItem("prompt",storePrompt.length > 5 ? JSON.stringify(storePrompt.slice(storePrompt.length-5,storePrompt.length)): JSON.stringify(storePrompt))
}
function loadFromLocalStorage(){
    if(localStorage.getItem("prompt")){
        let localData = JSON.parse(localStorage.getItem("prompt"));
        storePrompt = [...localData]
        console.log(storePrompt)
        displayRecentPrompt();
    }
    if(localStorage.getItem("username")){
        userName.innerText = "Hello," + localStorage.getItem("username");
    }
}

function displayRecentHistoryData(event){
    let ele = event.target.parentElement.children[1];
    inputBox.value = ele.innerText;
    run(inputBox.value)
}

window.addEventListener("load",()=>{
     saveToLocalStorage()
    loadFromLocalStorage()
})
hamIcon.addEventListener("click",()=>{
    toggleIcon()
})

btn.addEventListener("click",()=>{
    run(inputBox.value);
})
newChat.addEventListener("click",()=>{
   window.location.reload()
})

let flag = false;
  
function speakText(event){
  
    let speech  = new SpeechSynthesisUtterance();
    let content = event.target.parentElement.nextElementSibling.children[1].innerText
    console.log(event.target.parentElement.nextElementSibling.children[1].innerText)
    
     speech.text = content;
    window.speechSynthesis.speak(speech)
     console.log(speech.text)
    
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