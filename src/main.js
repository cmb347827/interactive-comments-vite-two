
'use strict'; 
import { formatDistance, subDays } from "date-fns"; 

$(window).resize(function(){
	location.reload();
});

const elementsData={
	jsonData: '',
	newJsonData:'',
	messagesHTML:[],
	currentUser:'',
	tempIds:[],
	nested: false,
	displayMessages: document.querySelector('.js-comments'),
}

//the next two functions are for fetching the data
function getJson() {
    return fetch('https://raw.githubusercontent.com/cmb347827/interactive-comments-section/refs/heads/main/data.json')
		.then(response => response.json())
		.then(response => response)
		.catch(err => {
		console.error(err);
     });  
}
async function getData(){
	elementsData.jsonData= await(getJson());
	//make a copy of the returned json data js object, so that users can add to the comments, update, delete comments and both are preserved.
    elementsData.newJsonData = elementsData.jsonData;   
	//console.log('json', elementsData.newJsonData);  json object.
	displayMessages();
}


function saveToStorage(key){
    //whenever the messages are updated , will be saved in local storage.
    localStorage.setItem(key,JSON.stringify(elementsData.newJsonData));//to json string
}
/*function loadFromStorage(){
	elementsData.messagesHTML = JSON.parse(localStorage.getItem('messages1358szaq1tritujfdcx2'));  //to js object
}*/
function loadFromStorage(key){
	let tryget = localStorage.getItem(key);
	
    if(tryget){
        // return JSON.parse(tryget);
		elementsData.newJsonData = JSON.parse(tryget);
		
		//getData();
		displayMessages();
    }else{ 
		//load default.
        /// return elementsData.jsonData;  
		getData();
    }
}


//next three functions are for generating/displaying the html
function getGeneratedHTML(insert,which){
    let addMargin = (elementsData.nested)?'addMargin':'';
	

	const scoreHTML= `<div class='display-flex flex-column mx-3'>
	                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
	                    <span>${insert.score}</span>
	                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                      </div>`;

	if(which ==='comment'){
		return `<div class='align-items-center temp-bg-lightpink ${addMargin}'>
					    <!--all outer comments without replies-->
						<div class='display-flex flex-column' id='${insert.id}'>
							<div class='display-flex justify-content-space-between'>
								<div class='display-flex'>
									${scoreHTML}
									<img class='ms-3' src='${insert.user.image.png}' alt='' width='64' height='64'> 
									<span class='ms-3 me-1'>${insert.user.username}</span>
									<span>${insert.createdAt}</span>
								</div>
								<div  class='display-flex' >
									<svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
									<button type='button' class='js-reply'>Reply</button>
								</div>
							</div>
							<p class='' >${insert.content}</p>
						</div>
						<div class='hidden reply temp-bg-lightblue'>
								<form class='display-flex js-display-reply' method='post' action='#'>
									<img src='${elementsData.currentUser.image.png}' alt='' width='64' height='64'> 
									<textarea class='w-100' ></textarea>
									<button type='button' class='js-submit-reply'>Reply</button>
								</form>
								<div class='display-flex justify-content-flex-end'>
								   <button type='button' class='js-cancel-reply'>Cancel</button>
								</div>
				         </div>
	            </div>`;
	}
	if(which==='reply'){

				return `<div  class='display-flex temp-bg-lightgray ${addMargin}'>
								
								<div class=''>
									<div class='display-flex justify-content-space-between'>
										<div class='display-flex'>
										    ${scoreHTML}
											<img class='ms-3' src='${insert.user.image.png}' alt='' width='64' height='64'> 
											<span class='ms-3 me-1'>${insert.user.username}</span>
											<span>${insert.createdAt}</span>
										</div>
										<div class='display-flex'>
											<div class='display-flex'>
												<svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
												<button type='button' class='js-delete'>Delete</button>
											</div>
											<div class='d-flex'>
												<svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
												<button type='button' class='js-edit'>Edit</button>
											</div>
										</div>
									</div>
									<form class='display-flex flex-column' method='post' action='#'>
										<div class=''>
											<label for='user-text' class='visually-hidden'>Current user's comment to a reply</label>
											<textarea name=''  rows="6" class='currentuser-old-reply smaller-width move-right '>${insert.content}</textarea>
										</div>
										<div class='display-flex justify-content-flex-end'>
											<button type='button' class='js-update hidden'>Update</button>
											<button type='button' class='js-edit-cancel hidden'>Cancel</button>
										</div>
									</form>
								</div>
						</div>`;
	}
	if(which==='send'){
		return `<form class='display-flex w-100 temp-bg-lightgreen' method='post' action='#'>
			<img src='${insert.image.png}' alt='' width='64' height='64'> 
			<textarea class='currentuser-new-message w-100'></textarea>
			<button type='button' class='js-add-reply'>Send</button>
        </form>`;
	}
}
function createParentEl(){
	const el =document.createElement('article');
	el.setAttribute('id',uuidv4());  //needed?
	return el;
}
function displayMessages(){
		elementsData.currentUser= elementsData.newJsonData.currentUser; 
		
		
		elementsData.newJsonData.comments.forEach((comment,index)=>{
                    elementsData.nested=false;
					const commentchild = getGeneratedHTML(comment,'comment');
					const el = createParentEl();
					el.innerHTML =  commentchild;
                    elementsData.messagesHTML += el.outerHTML;
				    
				    
					
                    if(comment.replies.length>0){
						elementsData.nested=true;
						comment.replies.map(reply=>{
							if(elementsData.currentUser.username !== reply.user.username){
								//replies from other users to comments
								const replyChild = getGeneratedHTML(reply,'comment');
								const replyEl = createParentEl();
							
								replyEl.innerHTML= replyChild;
								elementsData.messagesHTML += replyEl.outerHTML;
							}else{
								//currentUser's reply
								const userChild = getGeneratedHTML(reply,'reply');
								const userEl = createParentEl();
								
								userEl.innerHTML = userChild;
								elementsData.messagesHTML += userEl.outerHTML; 
							}
						});
					}
					
					if(index===(elementsData.newJsonData.comments.length-1)) {
						//currentUsers new comment at bottom
						elementsData.nested=false;
					    const sendChild =getGeneratedHTML(elementsData.currentUser,'send');
						const sendEl = createParentEl();
						sendEl.innerHTML = sendChild;
						elementsData.messagesHTML += sendEl.outerHTML;
					} 
					
		});
	    
		elementsData.displayMessages.innerHTML = elementsData.messagesHTML;
		//console.log(elementsData.displayMessages.innerHTML);
		saveToStorage('messages1358szaq1tritujfdcx2');
		addButtonsEvents();
}




function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
	  (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
	);
}
function toggleReplyArea(event){
	//currentUser's new reply
	const parent = event.target.closest('article');
	const reply = parent.querySelector('.reply');
	reply.classList.toggle('hidden');
}
const updateDate=()=>{
	 /* let date = new Date();
	  const seconds = date;
	  let options = { month: "2-digit", day: "2-digit", year: "2-digit" };

	  // Convert to locale string and add a locale and the options
	 date = date.toLocaleString( "en-US", options );
	 return [date,seconds];*/


   //const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10));
   //const formattedDate2 = dateFns.format(today, 'yyyy-MM-dd');

}


function addButtonsEvents(){
	document.querySelectorAll('.js-submit-reply').forEach((btn,btnIndex)=>{
			btn.addEventListener('click',(event)=>{
				//The currentUser has clicked the reply button to submit a  reply
				const content = event.target.previousElementSibling.value;
				//const article = event.target.closest('[id]');
				const inReplyToThisComment= event.target.parentElement.parentElement.previousElementSibling;
				//const dateArr = getDate('now');
				//const [date,seconds]= [...dateArr];
				
			
				//Below code will replace current article in elementsData.newJsonData with this article (will include the reply)
                elementsData.newJsonData.comments.forEach((comment,index)=>{
					    
						if(comment.id === Number(inReplyToThisComment.id)){
								const date = updateDate();
								//this is the comment in elementsData.newJsonData that is the same being replied to.
								//create a new id for the new reply to the comment
								const newId = Number(inReplyToThisComment.id)+1;
								//the reply with the new id and content
								const newReplyToComment = {
										"id": `${newId}`,
										"content": `${content}`,
										"createdAt": `${date}`,
										"score": 2,
										"replyingTo": `${comment.user.username}`,
										"user": {
											"image": { 
											"png": "./images/avatars/image-juliusomo.png",
											"webp": "./images/avatars/image-juliusomo.webp"
											},
											"username": "juliusomo"
										}
								}
								//add the new reply to the comment's replies[]
								comment.replies.push(newReplyToComment);
						}
						if(comment.replies.length>0){
							//sort teh comment replies by date
							//(comment.replies).createdAt.sort((a, b) => a - b);
							console.log(comment.replies);
						}
				});
				saveToStorage('messages1358szaq1tritujfdcx2');
				elementsData.displayMessages.innerHTML='';
				elementsData.messagesHTML='';
				displayMessages();
			});
	});
	document.querySelectorAll('.js-reply').forEach((btn,index)=>{
			btn.addEventListener("click", (event)=>{
				//The currentUser has clicked the 'reply' button in a comment
				//get outer parent section id.
				//const parentId = event.target.closest('article').id;     
				toggleReplyArea(event); 
			});
	});
    document.querySelectorAll('.js-cancel-reply').forEach((btn,index)=>{
		btn.addEventListener('click',(event)=>{
			//The currentUser has clicked the cancel button to cancel adding a reply
			toggleReplyArea(event); 
		});
	});
    document.querySelectorAll('.currentuser-old-reply').forEach((textarea)=>{
         textarea.setAttribute('aria-disabled','true');
		 textarea.setAttribute('disabled','true');
	});
    document.querySelectorAll('.js-edit').forEach((btn,index)=>{
        const textarea = document.querySelectorAll('.currentuser-old-reply');
	
		btn.addEventListener("click", ()=>{
			//edit button is pressed
			textarea[index].toggleAttribute("disabled");
		    textarea[index].toggleAttribute('aria-disabled');
			
		});
	});
}

$(window).on('load',function(){
	//localStorage.clear();
	loadFromStorage('messages1358szaq1tritujfdcx2');
	//getData();
	//createElement 
 
	//elementsData.displayMessages = JSON.parse(localStorage.getItem('messages'));
	
});