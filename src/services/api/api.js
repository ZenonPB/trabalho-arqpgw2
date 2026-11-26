const API_URL = "https://eldenring.fanapis.com/api/"

const CACHE_DURATION = 3600000;

export async function getApi(endpoint,page,options = null){
    //Padrão do nome dos caches
    const cacheKey = `eldenringapi_${endpoint}_page_${page}`;

    //Tenta buscar as informações no cache
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData){
        const parsedCache = JSON.parse(cachedData);

        if(parsedCache != null && Date.now() < parsedCache.expiration){
            return await parsedCache.data;
        }
        localStorage.removeItem(cacheKey);
    }

    let response;

    //Caso não encontre no cache faz um fetch na API
    if(options == null){
        response = await fetch(`${API_URL}${endpoint}?limit=20&page=${page}`)
    } else{
        response = await fetch(`${API_URL}${endpoint}?limit=20&page=${page}&${options}`)
    }

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    const cacheData = {
        data: data,
        expiration: Date.now() + CACHE_DURATION
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    return data;
}