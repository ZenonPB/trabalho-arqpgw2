const API_URL = "https://eldenring.fanapis.com/api/"

const CACHE_DURATION = 3600000;

//Faz o fetch na API
export async function getApi(endpoint,page,options = null){
    //Padrão do nome dos caches
    const cacheKey = `eldenringapi_${endpoint}_page_${page}`;

    //Tenta buscar as informações no cache
    const cachedData = localStorage.getItem(cacheKey);

    //Checa se existe dados no cache, caso existão verifica se eles são válidos, se os dados são existem e são válidos eles são retornados. Caso os dados não sejam válidos os remove da lista de cache
    if (cachedData){
        const parsedCache = JSON.parse(cachedData);

        if(parsedCache != null && Date.now() < parsedCache.expiration){
            return await parsedCache.data;
        }else if(parsedCache == null){
            localStorage.removeItem(cacheKey);
        }
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