import { getApi } from "./api/api.js";

let currentPage = 0;

function mapBoss(boss){
    return {
        id: boss.id,
        name: boss.name,
        image: boss.image,
        description: boss.description,
        location: boss.location,
        drops: boss.drops,
        hp: boss.healthPoints
    };
}

async function getBosses(page = '0'){
    const response = await getApi('bosses',page);
    return response;
}

// async function getBossByName(name) {
//     const response = await getApi('bosses',`?name=${name}`);
//     return response.data.map(mapBoss);
// }

async function genCard() {
    const fetchTemplate = await fetch('../../components/cardTemplate.html')
    if (!fetchTemplate.ok){
        console.log('Couldn\'t load card template');
    }
    const html = await fetchTemplate.text();

    const parser = new DOMParser();
    const docTemplate = parser.parseFromString(html, 'text/html');

    const cardTemplate = docTemplate.querySelector('.card_boss');

    const response = await getBosses(currentPage);

    const bosses = response.data;

    console.log(bosses);

    for(let boss of bosses){
        const card = cardTemplate.cloneNode(true);
        
        card.querySelector('.boss_name').textContent = boss.name;
        if (boss.image != null){
            card.querySelector('.boss_picture').src = boss.image;
        }else{
            card.querySelector('.boss_picture').remove();
            const p = document.createElement('p');
            p.textContent = 'No image avaliable';
            card.querySelector('.figure').appendChild(p);
        }

        document.querySelector('.bosses_container').appendChild(card);
    }
}



//Função main para executar o que for necessário
async function bossesMain() {
    await genCard();
}

bossesMain();