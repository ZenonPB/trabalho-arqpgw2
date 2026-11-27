import { getApi } from "./api/api.js";

let currentPage = 0;
let counter = 0;

//Dá um fetch em todos os bosses
async function getBosses(page = '0'){
    const response = await getApi('bosses',page);
    return response;
}

async function getBossByName(name) {
    const response = await getApi('bosses',`?name=${encodeURI(name)}`)
    return response;
}

function openBossModal(){
    const modal = document.querySelector('.dialog');
    modal.showModal();
}

function closeBossModal() {
    const modal = document.querySelector('.dialog');
    modal.close();
}

function placeInfoDialog(boss){
    const diagDivChildren = document.querySelector('.details').children;

    diagDivChildren[0].textContent = boss.name;

    if (boss.image != null && document.querySelector('.picture_dialog').src != ''){
        document.querySelector('.picture_dialog').style.display = "block";
        document.querySelector('.picture_dialog').src = boss.image;
    } else{
        document.querySelector('.picture_dialog').style.display = "none";
        const p = document.createElement('p');
        p.textContent = 'No image avaliable :(';
        p.className = 'no_image';
        document.querySelector('.figure_dialog').appendChild(p);
    }
    
    diagDivChildren[2].textContent = boss.description;
    diagDivChildren[3].textContent = boss.location;

    const ul = diagDivChildren[4];

    for(let drop of boss.drops){    
        let li = document.createElement('li');
        li.textContent = drop;
        ul.appendChild(li);
    }

    diagDivChildren[5].textContent = boss.healthPoints;
}

function clearInfoDialog(){
    const diagDivChildren = document.querySelector('.details').children;

    diagDivChildren[0].textContent = ''
    
    if (document.querySelector('.no_image') != null){
        const p = document.querySelector('.no_image');
        p.remove();
    }

    diagDivChildren[2].textContent = '';
    diagDivChildren[3].textContent = '';

    const ul = diagDivChildren[4];

    while(ul.firstChild){
        ul.removeChild(ul.firstChild);
    }

    diagDivChildren[5].textContent = '';
}

//Gera o card com informações dos chefes
async function genCard() {
    const fetchTemplate = await fetch('../../components/cardTemplate.html')
    if (!fetchTemplate.ok){
        console.log('Couldn\'t load card template');
    }
    const html = await fetchTemplate.text();

    const parser = new DOMParser();
    const docTemplate = parser.parseFromString(html, 'text/html');

    const cardTemplate = docTemplate.querySelector('.card');

    const response = await getBosses(currentPage);

    const bosses = response.data;

    for(let boss of bosses){
        const card = cardTemplate.cloneNode(true);

        card.id = counter;
        counter++;
        
        card.querySelector('.name').textContent = boss.name;
        if (boss.image != null){
            card.querySelector('.picture').src = boss.image;
        }else{
            card.querySelector('.picture').remove();
            const p = document.createElement('p');
            p.textContent = 'No image avaliable :(';
            card.querySelector('.figure').appendChild(p);
        }
        
        card.querySelector('.see_more_btn').addEventListener('click',() =>{
            openBossModal();
            placeInfoDialog(boss);
        });

        document.querySelector('.bosses_container').appendChild(card);
    }
}

//Função main para executar o que for necessário
async function bossesMain() {
    await genCard();
    document.querySelector('.close_dialog').addEventListener('click', () => {
        closeBossModal();
        clearInfoDialog();
    });
}

bossesMain();