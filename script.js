// Replace this after you deploy the backend.
const BACKEND_URL = "https://datewith.onrender.com/api/response";

let selectedDateType = "";
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

function nextPage(number){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page" + number).classList.add("active");
}

musicBtn.addEventListener("click",()=>{
  if(music.paused){music.play();musicBtn.innerHTML="⏸️ Music";}
  else{music.pause();musicBtn.innerHTML="🎵 Music";}
});

function answerYes(){
  sendResponse("YES");
  createConfetti();
  setTimeout(()=>nextPage(4),700);
}

const noBtn=document.getElementById("noBtn");
function moveNoButton(){
  const maxX=window.innerWidth-noBtn.offsetWidth-20;
  const maxY=window.innerHeight-noBtn.offsetHeight-20;
  noBtn.style.position="fixed";
  noBtn.style.left=Math.max(10,Math.random()*maxX)+"px";
  noBtn.style.top=Math.max(10,Math.random()*maxY)+"px";
}
noBtn.addEventListener("mouseenter",moveNoButton);
noBtn.addEventListener("touchstart",e=>{e.preventDefault();moveNoButton();});
noBtn.addEventListener("click",()=>{sendResponse("NO");moveNoButton();});

function chooseDate(type){
  selectedDateType=type;
  sendResponse("DATE_TYPE", {dateType:type});
  nextPage(5);
}

function finishDate(){
  const date=document.getElementById("dateInput").value;
  const time=document.getElementById("timeInput").value;
  if(!date||!time){alert("Choose a date and time first ❤️");return;}
  document.getElementById("selectedType").innerText=selectedDateType;
  document.getElementById("selectedDate").innerText=date;
  document.getElementById("selectedTime").innerText=time;
  sendResponse("DATE_CONFIRMED",{dateType:selectedDateType,date,time});
  createConfetti();
  nextPage(6);
}

function createHeart(){
  const heart=document.createElement("div");
  heart.className="heart";
  heart.innerText=["❤️","💕","💗","💖","💘","🌹"][Math.floor(Math.random()*6)];
  heart.style.left=Math.random()*100+"vw";
  heart.style.fontSize=(15+Math.random()*25)+"px";
  heart.style.animationDuration=(5+Math.random()*5)+"s";
  document.querySelector(".hearts").appendChild(heart);
  setTimeout(()=>heart.remove(),10000);
}
setInterval(createHeart,500);

function createConfetti(){
  for(let i=0;i<50;i++){
    const el=document.createElement("div");
    el.innerText=["❤️","💖","💕","✨"][Math.floor(Math.random()*4)];
    el.style.position="fixed";el.style.left=Math.random()*100+"vw";el.style.top=Math.random()*100+"vh";
    el.style.fontSize="25px";el.style.zIndex="9999";
    document.body.appendChild(el);
    el.animate([{transform:"scale(0) rotate(0deg)",opacity:1},{transform:"scale(1.5) rotate(360deg)",opacity:0}],{duration:1800,easing:"ease-out"});
    setTimeout(()=>el.remove(),1800);
  }
}

async function sendResponse(event, details={}){
  if(BACKEND_URL==="YOUR_BACKEND_URL_HERE"){
    console.log("Event:",event,details);
    return;
  }
  try{
    await fetch(BACKEND_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({event,details,time:new Date().toISOString()})
    });
  }catch(err){console.log("Tracking unavailable:",err);}
}

sendResponse("OPENED");
