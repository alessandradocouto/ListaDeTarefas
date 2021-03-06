'use strict';

const $content = document.querySelector('.content');
const $contentDate = document.querySelector('.content-date');
const $hourMin = document.querySelector('.hourMin');
const $dayMonth = document.querySelector('.dayMonth');
const $menuTarefa = document.querySelector('.menu');
const $inputText = document.querySelector('#f-search');
const $btnSearch = document.querySelector('#btn-search');
const $btnClearTarefa = document.querySelector('#btn-clear');
const localItem = JSON.parse(localStorage.getItem('tarefa')) || [];
// Vamos transformar em um jeito JSON, OBJECTHTMLOBJECT


// relogio
function criarDataRelogio(){
    const nowDate = new Date();

    const dayName = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const monName = {0:"Janeiro", 1:"Fevereiro", 2:"Março", 3:"Abril", 4:"Maio", 5:"Junho", 6:"Julho", 7:"Agosto", 8:"Setembro", 9:"Outubro", 10:"Novembro", 11:"Dezembro"};
    
    // acrescentando zero à esquerda quando
    // os horas e minutos foram menores que 10
    function addZero(n){
        return n < 10 ? '0' + n : n;
    }

    $hourMin.textContent = addZero(nowDate.getHours()) + ':' + addZero(nowDate.getMinutes());

    $dayMonth.textContent = dayName[nowDate.getDay()] + ', ' + nowDate.getDate() + ' de ' + monName[nowDate.getMonth()] + ' de ' + nowDate.getFullYear();
}


function excluirInput() {
    $inputText.value = '';
}

//cria o botão de remover cada item da lista
function btnAfterLi () {
    const removeBtn = document.createElement('button');
    removeBtn.setAttribute('type', 'button');
    removeBtn.classList.add('btn-lixeira');
    const textBtn = document.createTextNode('remover');
    removeBtn.appendChild(textBtn);
    return removeBtn;
}

// criar cada item da lista
function criarLi(item) {
    const newLi = document.createElement('li');
    const textNewli = document.createTextNode(item);
    newLi.setAttribute('class', 'menu-li');
    newLi.appendChild(textNewli);
    // bullet anexado antes do texto
    return newLi;
}

function addTarefa() {
    if ($inputText.value !== '') {

        const liTarefa = document.createElement('LI');
        const newSpan = document.createElement('SPAN');
        const textLiTarefa = document.createTextNode($inputText.value);
        liTarefa.setAttribute('class', 'menu-li');
        liTarefa.appendChild(textLiTarefa);
        // bullet anexado antes do texto
        liTarefa.insertBefore(newSpan, textLiTarefa);
        //btn anexado depois de li
        liTarefa.append(btnAfterLi());
        // encher array
        $menuTarefa.appendChild(liTarefa);
        // armazenar no localStorage
        localItem.push({tarefa: $inputText.value, id: false});
        salvarLocal();
        excluirInput();
        $inputText.focus();
    }
}

function atualizarLocal(item){
    // item = button
    let booleanItem = true;
    localItem.forEach((element) => {
        
        if(item.firstChild.nextSibling.nodeValue === element['tarefa']){
            if(item.firstChild.classList.contains('feito')){
                element['id'] = booleanItem;
            }
            else{
                element['id'] = !booleanItem;
            }
        };
    });
}

function personalizarItem(item) {
    // add ou remover a class feito
    // primeiro filho da li terá class
    item.firstChild.classList.toggle('feito');
}

function delItem(item) {
    //li tem parent($menuTarefa) que vai remover;
    item.parentNode.remove();
}

function salvarLocal() {
    const atualStorage = localStorage.setItem('tarefa', JSON.stringify(localItem));
    return atualStorage;
}

function removerLocal(item) {
    
    localItem.forEach((element, index) => {
        if(item.previousSibling.data === element['tarefa']){
            localItem.splice(index,1);
            delItem(item);
        };
    });
}

function apagarTarefa() {
    localStorage.clear(); // apagar o local Storage
    localItem.splice(0); // apagar o array todo
    excluirInput();
    $menuTarefa.textContent = '';
    // apagar o texto da ul 
}

// quando apertar o enter(13) no teclado, add Tarefa
$content.addEventListener('keypress', (event) => {
    if (event.keyCode === 13)
        addTarefa();
});


$content.addEventListener('click', (event) => {
    const clickedItem = event.target;

    if (clickedItem.id === 'btn-search' || clickedItem.id === 'f-search')
        addTarefa();

    if (clickedItem.tagName === 'LI'){
        personalizarItem(clickedItem);
        atualizarLocal(clickedItem);
        salvarLocal();
    }

    if (clickedItem.className === 'btn-lixeira'){
        removerLocal(clickedItem);
        salvarLocal();
    }

    if (clickedItem.id === 'btn-clear'){
        apagarTarefa();
        //console.log('this',this); 
            // window
        //console.log('e.target',event.target); 
            // ultimo elemento que recebeu o evento
        //console.log('e.currentTarget',event.currentTarget);
            // elemento que recebeu o evento de fato
    }

});


// criando li, bullet e button com os dados salvos
// no localStorage
localItem.forEach((element) => {
    
    const liLocal = document.createElement('LI');
    const newBullet = document.createElement('SPAN');
    const textLiLocal = document.createTextNode(element['tarefa']);
    // bullet anexado antes do texto
    if(element['id'] === true){
        newBullet.setAttribute('class', 'feito');
    }
    liLocal.appendChild(textLiLocal);
    liLocal.insertBefore(newBullet, textLiLocal);
    liLocal.setAttribute('class', 'menu-li');
    //btn anexado depois de li
    liLocal.append(btnAfterLi());
    $menuTarefa.appendChild(liLocal);        
});

// chama criaDataRelogio e atualiza o relogio
setInterval(function(){ criarDataRelogio();  }, 1000);