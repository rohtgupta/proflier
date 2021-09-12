if (document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

function ready(){
    addbtn();
    deleteinfo();
}

function addbtn(){
    const btn = document.getElementsByClassName("add-btn");

    for (let i = 0; i < btn.length; i++){
        let element = btn[i].getElementsByTagName("input")[0];
        let b = btn[i].getElementsByClassName("add-project")[0];

        element.addEventListener('click', (e)=>{
            console.log(element
                );
            b.style.display = "block";
            if (element.classList.contains('qual')){
                addqual();
            }else{
                addexp();
            } 
        });
    }
    
    const closebtn = document.getElementsByClassName("close-btn");

    for (let i = 0; i < closebtn.length; i++){
        let element = closebtn[i].parentElement;

        closebtn[i].addEventListener('click', ()=>{
            element.style.display = "none";
        })
    }
}

function addqual(){
    const form = document.getElementsByClassName("qual-form")[0];
    
    form.addEventListener('submit', async (e)=>{
        e.preventDefault()

        form.button.disabled = true;
        const inst = form.inst.value;
        const uni = form.uni.value;
        const deg = form.deg.value;
        const grade = form.grade.value;
        
        try{
            const res = await fetch('/qual', {
                method: 'POST',
                body: JSON.stringify({inst, uni, deg, grade}),
                headers: {'Content-type': 'application/json'}
            })

            const data = await res.json();
            console.log(data);
            if (data.message == "Added")
                location.assign('/account');
            else
                form.button.disabled = false;
        }
        catch(err){
            console.log(err);
        }
    });
}

function deleteinfo(){
    const trashlist = document.getElementsByClassName('fa-trash');

    for (let i = 0; i < trashlist.length; i++){
        const element = trashlist[i];
        const dat = element.dataset.doc.split(":");
    
        element.addEventListener('click', async (e)=>{
            let endpoint = ``;
            if (dat[1]==="qual"){
                endpoint = `/qual/${dat[0]}`;
            }else{
                endpoint = `/exp/${dat[0]}`;
            }
            
            try{
                const result = await fetch(endpoint, {
                    method: 'DELETE',
                })
            
                const data = await result.json();
            
                if (data.redirect.length > 0){
                    location.assign(data.redirect);
                }else{
                    console.log(data.err);
                    location.assign('/account');
                }
            }
            catch(err){
                console.log(err);
            }
        })
    }
}

function addexp(){
    const form = document.getElementsByClassName("exp-form")[0];
    
    form.addEventListener('submit', async (e)=>{
        e.preventDefault()

        form.button.disabled = true;
        const organisation = form.organisation.value;
        const role = form.role.value;
        const span = form.span.value;
        const description = form.description.value;
        
        try{
            const res = await fetch('/exp', {
                method: 'POST',
                body: JSON.stringify({organisation, role, span, description}),
                headers: {'Content-type': 'application/json'}
            })

            const data = await res.json();
            console.log(data);
            if (data.message == "Added")
                location.assign('/account');
            else
                form.button.disabled = false;
        }
        catch(err){
            console.log(err);
        }
    });
}
