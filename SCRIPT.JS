document.getElementById("searchBtn").addEventListener("click", getProfile)

document.getElementById("darkBtn").addEventListener("click", function(){

document.body.classList.toggle("dark-mode")

})

document.getElementById("repoSearch").addEventListener("keyup", filterRepos)

async function getProfile(){

let username=document.getElementById("username").value

let profileResponse=await fetch(`https://api.github.com/users/${username}`)

let profile=await profileResponse.json()

if(profile.message==="Not Found"){

alert("User Not Found")
return

}

displayProfile(profile)

let repoResponse=await fetch(`https://api.github.com/users/${username}/repos`)

let repos=await repoResponse.json()

displayRepos(repos)

showLanguages(repos)

calculateScore(profile,repos)

document.getElementById("contributionGraph").src=
`https://ghchart.rshah.org/${username}`

}

function displayProfile(profile){

document.getElementById("profile").innerHTML=

`

<div class="profile-card">

<img src="${profile.avatar_url}">

<h2>${profile.name || profile.login}</h2>

<p>${profile.bio || ""}</p>

<p>Followers : ${profile.followers}</p>

<p>Following : ${profile.following}</p>

<p>Public Repos : ${profile.public_repos}</p>

<a href="${profile.html_url}" target="_blank">View GitHub Profile</a>

</div>

`

}

function displayRepos(repos){

repos.sort((a,b)=>b.stargazers_count-a.stargazers_count)

let html=""

repos.forEach(repo=>{

let date=new Date(repo.created_at).toLocaleDateString()

html+=

`

<div class="repo">

<h3>${repo.name}</h3>

<p>⭐ Stars : ${repo.stargazers_count}</p>

<p>📅 Created : ${date}</p>

<a href="${repo.html_url}" target="_blank">View Repository</a>

</div>

`

})

document.getElementById("repos").innerHTML=html

}

function showLanguages(repos){

let languages={}

repos.forEach(repo=>{

if(repo.language){

if(!languages[repo.language]){

languages[repo.language]=1

}else{

languages[repo.language]++

}

}

})

let labels=Object.keys(languages)

let data=Object.values(languages)

let ctx=document.getElementById("chart")

new Chart(ctx,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:data

}]

}

})

}

function calculateScore(profile,repos){

let repoScore=profile.public_repos*0.3

let followerScore=profile.followers*0.4

let starScore=0

repos.forEach(repo=>{

starScore+=repo.stargazers_count

})

starScore=starScore*0.3

let total=repoScore+followerScore+starScore

let finalScore=(total/100).toFixed(2)

document.getElementById("score").innerHTML=

`<h3>${finalScore} / 10</h3>`

}

function filterRepos(){

let input=document.getElementById("repoSearch").value.toLowerCase()

let repos=document.getElementsByClassName("repo")

for(let i=0;i<repos.length;i++){

let title=repos[i].getElementsByTagName("h3")[0].innerText.toLowerCase()

if(title.includes(input)){

repos[i].style.display="block"

}else{

repos[i].style.display="none"

}

}

}