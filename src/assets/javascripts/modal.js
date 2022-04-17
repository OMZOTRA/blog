
const body = document.querySelector('body');
let calc;
let modal;

const createCalc = () =>  {
    calc = document.createElement('div');
    calc.classList.add('calc');
    calc.addEventListener('click', ()=>{
        calc.remove(modal);
    })

}

const createModal = question => {
    modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML= `
    <p>${question}</p>`;
    const cancel = document.createElement('button');
    cancel.innerText="Annuler";
    cancel.classList.add('btn','btn-secondary');
    const confirm = document.createElement('button');
    confirm.innerText = 'Confirm';
    confirm.classList.add('btn','btn-primary');
    modal.append(cancel,confirm);

}

export function openModal(question){
    createCalc();
    createModal(question);
    calc.append(modal);
    body.append(calc);
}