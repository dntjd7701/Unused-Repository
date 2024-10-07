import VanillaWrapper from "@/components/VanillaWrapper";


const initiator = (wrapper: HTMLDivElement) => {
    let state = false;

    const pElem = document.createElement("p");
    pElem.textContent = 'off';

    const btnElem = document.createElement("button");
    btnElem.textContent = 'toggle';
    btnElem.addEventListener('click', (e) => {
        state = !state;
        pElem.textContent = state ? 'on' : 'off'
    })

    const divElem = document.createElement('div');
    divElem.textContent = 'vanilla wrapper test'
    divElem.append(btnElem, pElem);
    wrapper.insertAdjacentElement('beforeend', divElem);
}


const VanillaAccordian = () => <VanillaWrapper initiator={initiator} />

export default VanillaAccordian;
