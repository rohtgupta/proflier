if (document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

function ready(){
    addbtn();
    saveproject();
    editProject()
    deleteproject();
}

function addbtn(){
    const btn = document.getElementsByClassName("add-btn")[0].getElementsByTagName("input")[0];
    const block = document.getElementsByClassName("add-project")[0];
    const form = document.getElementsByClassName("project-form")[0];
    btn.addEventListener('click', ()=>{
        form.dataset.update = false;
        form.dataset.id = null;
        
        block.style.display = "block";
    });

    const closebtn = block.getElementsByTagName("h2")[0];

    closebtn.addEventListener('click', ()=>{
        form.dataset.update = false;
        form.dataset.id = null;
        
        block.style.display = "none";
    })
}

function saveproject(){
    const form = document.getElementsByClassName("project-form")[0];
    
    form.addEventListener('submit', async (e)=>{
        e.preventDefault()

        form.button.disabled = true;
        const title = form.title.value;
        const description = form.description.value;
        const team = form.team.value;
        const address = form.address.value;
        
        try{
            // console.log(form.dataset.update, "in tyr");
            if(form.dataset.update == "false"){
                console.log("inpost");
                const res = await fetch('/projects', {
                    method: 'POST',
                    body: JSON.stringify({title, description, team, address}),
                    headers: {'Content-type': 'application/json'}
                })
    
                const data = await res.json();
                console.log(data);
                if (data.message == "Added")
                    location.assign('/projects');
                else
                    form.button.disabled = false;
            }else{
                const endpoint = `updateproject/${form.dataset.id}`;
                const res = await fetch(endpoint, {
                    method: 'PUT',
                    body: JSON.stringify({title, description, team, address}),
                    headers: {'Content-type': 'application/json'}
                })

                const data = await res.json();

                if(data.redirect){
                    location.assign(data.redirect);
                }else{
                    console.log(err);
                    form.button.disabled = false;
                }
                
            }
        }
        catch(err){
            console.log(err);
        }
    });
}

function deleteproject(){
    const project_list = document.getElementsByClassName('fa-trash');

    for (let i = 0; i < project_list.length; i++){
        const element = project_list[i];
    
        element.addEventListener('click', async (e)=>{
            const endpoint = `/project/${element.dataset.doc}`;

            try{
                const result = await fetch(endpoint, {
                    method: 'DELETE',
                })
            
                const data = await result.json();
            
                if (data.redirect.length > 0){
                    location.assign(data.redirect);
                }else{
                    console.log(data.err);
                    location.assign('/projects');
                }
            }
            catch(err){
                console.log(err);
            }
        })
    }
}

function editProject(){
    const project_list = document.getElementsByClassName('fa-pencil');
    const form = document.getElementsByClassName('update-form')[0];

    for (let i = 0; i < project_list.length; i++){
        const element = project_list[i];
    
        element.addEventListener('click', async (e)=>{
            const formdata = element.dataset.doc.split(':');
            form.title.value = formdata[1];
            form.address.value = formdata[2];
            form.team.value = formdata[3];
            form.description.value = formdata[4];

            form.dataset.update = true;
            form.dataset.id = formdata[0];

            form.parentElement.style.display = 'block';

            console.log(form, form.dataset.update);
        })
    }
}
