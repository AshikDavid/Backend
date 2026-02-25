const fetchGitHubActivity = async (username) => {
    const response = await fetch(
        `https://api.github.com/users/${username}/events`,
        {
            headers: {
                "User-Agent": "node.js"
            }
        }
    )
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json()
}

const dispalyActivity = (e)=>{
    if(e.length==0){
        console.log("No recent activity available")
        return
    }
    //console.log(e)
    const mapData = new Map;
    e.forEach(element => {
        cd
        
    });
    console.log((mapData))
}

const username = process.argv[2]
if (!username) {
    console.log("Enter a valid username")
    process.exit(1)
}
fetchGitHubActivity(username)
    .then((e)=>{
        dispalyActivity(e)
    })
    .catch((err)=>{
        console.log(err)
        process.exit(1)
    })
