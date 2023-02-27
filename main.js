const API=`http://localhost:8000/contacts`

const list=document.querySelector(`tbody`)

const form=document.querySelector('form')
const inpName=document.querySelector('#name')
const inpEmail=document.querySelector('#email')
const inpPhone=document.querySelector('#phone')

const modal=document.querySelector(".modal")
const modalName=document.querySelector("#modal-name")
const modalEmail=document.querySelector("#modal-email")
const modalPhone=document.querySelector("#modal-phone")
const modalSave=document.querySelector(".modal-save")
const modalClose=document.querySelector('.close')

getContacts()
async function getContacts(){
    const res=await fetch(API)
    const data=await res.json()
    render(data)
}

async function addContact(contact){
    await fetch(API, {
        method:'POST',
        body:JSON.stringify(contact),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    getContacts();
}

async function getOneContact(id){
    const res=await fetch(`${API}/${id}`)
    const data=await res.json()
    return data;
}


async function editContact(id, editedContact){

    await fetch(`${API}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedContact),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    getContacts()
}

async function deleteContact(id){
    await fetch(`${API}/${id}`,{
        method: 'DELETE'
    })
    getContacts()
}

function render(arr){
    list.innerHTML=''
    arr.forEach(item=>{
        list.innerHTML+=`<tbody>
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.phone}</td>
          <td>
            <button class="delete-btn" id='${item.id}'>Delete</button>
            <button class='edit-btn' id='${item.id}'>Edit</button>
          </td>
        </tr>
      </tbody>`
    })
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if(!inpName.value.trim() || !inpEmail.value.trim() || !inpPhone.value.trim()){
        alert("Fill all the fields!")
        return;
    }

    const contact={
        name: inpName.value,
        email: inpEmail.value,
        phone: inpPhone.value
    }

    addContact(contact)

    inpName.value=''
    inpEmail.value=''
    inpPhone.value=''

})

let id=null;

document.addEventListener(`click`, async(e)=>{

    if(e.target.classList.contains('edit-btn')){
        modal.style.visibility='visible'        
        id=e.target.id;
        const contact=await getOneContact(e.target.id);

        modalName.value=contact.name
        modalEmail.value=contact.email
        modalPhone.value=contact.phone
    }
})

modalClose.addEventListener('click', (e)=>{
    
    modal.style.visibility='hidden'
})

modalSave.addEventListener('click', (e)=>{
    e.preventDefault()
    if(!modalName.value.trim() || !modalEmail.value.trim() || !modalPhone.value.trim()){
        alert("Fill all the fields!")
        return;
    }
    const editedContact={
        name: modalName.value,
        email: modalEmail.value,
        phone: modalPhone.value
    }
    
    editContact(id, editedContact)
    modal.style.visibility='hidden'
})

document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete-btn')){
        deleteContact(e.target.id)
    }
})