const inputText = document.querySelector("#input")
const postInputText = document.querySelector("#postInput")

const NameList = document.querySelector("#list")
const postList = document.querySelector("#postList")

const UsersButton = document.querySelector("#searchUsers")
const PostsButton = document.querySelector("#searchPosts")

const UsersCointainer = document.querySelector("#userContainer")
const PostsCointainer = document.querySelector("#postContainer")

const userCount = document.querySelector("#userCount")
const postCount = document.querySelector("#postCount")


let users = []
let posts = []

init()

inputText.addEventListener(
  "input",
  debounce((event) => {
    const searchText = event.target.value.trim().toLowerCase();
    const filteredUsers = filterUsers(searchText);
    renderAll(filteredUsers, searchText);
  }, 500)
);

postInputText.addEventListener(
  "input",
  debounce((event) => {
    const searchText = event.target.value.trim().toLowerCase();
    const filteredPosts = filterPosts(searchText);
    renderPosts(filteredPosts, searchText);
  }, 500)
);



PostsButton.addEventListener("click",()=>{
    PostsCointainer.classList.replace("inactive","active")
    UsersCointainer.classList.replace("active","inactive")     
    postInputText.value = ""
    renderPosts(posts,"")
})

UsersButton.addEventListener("click",()=>{
    PostsCointainer.classList.replace("active","inactive")
    UsersCointainer.classList.replace("inactive","active") 
    postInputText.value = ""
    renderPosts(posts,"")
    inputText.value = ""
    renderAll(users,"")
})

function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  };
}


function renderAll(array, searchText = "") {
  NameList.innerHTML = "";
  userCount.textContent = array.length
  updateURL(searchText);
  array.forEach(user => renderResult(user, searchText));
}

function renderPosts(array, searchText = "") {
  postList.innerHTML = "";
  postCount.textContent = array.length
  updateURL(searchText);
  array.forEach(post => renderSinglePost(post, searchText));
}


function renderResult(user, searchText = "") {
    const li = document.createElement("li");
    
    if (searchText) {
        const regex = new RegExp(`(${searchText})`, "gi");
        li.innerHTML = user.name.replace(regex, "<mark>$1</mark>");
    } else {
        li.textContent = user.name;
    }
    
    NameList.appendChild(li);
}

function renderSinglePost(post, searchText = "") {
    const li = document.createElement("li");
    const tr = document.createElement("tr");
    const body= document.createElement("td");
    const title= document.createElement("td");
    const user= document.createElement("td");

    user.style.width = 100;
    title.style.width = 200;
    body.style.width = 600;
    
    
    if (searchText) {
        const regex = new RegExp(`(${searchText})`, "gi");
        body.innerHTML = post.body.replace(regex, "<mark>$1</mark>");
    } else {
        body.textContent = post.body;
    }
    
    title.textContent= post.title
    user.textContent= users.filter(user => user.id === post.userId).map(user => user.name)

    tr.appendChild(user)
    tr.appendChild(title)
    tr.appendChild(body)
    li.appendChild(tr);
    postList.appendChild(li);
}

function updateURL(searchText) {
  const params = new URLSearchParams(window.location.search);
  if (searchText) {
    params.set("search", searchText);
  } else {
    params.delete("search");
  }
  history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}


function filterUsers(text) {
  if (!text) return users

  return users.filter(user => user.name.toLowerCase().includes(text))
}

function filterPosts(text) {
  if (!text) return posts

  return posts.filter(post => post.body.toLowerCase().includes(text))
}


async function init() {
  users = await getUsers();
  posts = await getPosts();

  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search") || "";

  inputText.value = initialSearch;
  const filteredUsers = filterUsers(initialSearch.toLowerCase());
  renderAll(filteredUsers, initialSearch);
}


async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  return await res.json()
}

//posts
async function getPosts(){
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    return await res.json()
}