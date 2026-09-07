async function fetchJSON(url){
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Http error");
    }
    return response.json();
}

module.exports= fetchJSON;