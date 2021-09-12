if (document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

function ready(){
    const deactivate = document.getElementById('deactivate');

    deactivate.addEventListener('click', async ()=>{

        let ask = window.confirm("If you deactivate nobody will be able to view your account, you can activate your account by logging in again");

        if (ask){

            try{
                const data = await fetch('/deactivate', {
                    method: 'PUT',
                });
    
                const result = await data.json();
    
                if(result.err){
                    console.log(err);
                }else{
                    location.assign('/logout');
                }
                
            }catch(err){
                console.log(err.message);
            }
            
        }
    });

    const deleteuser = document.getElementById('delete');

    deleteuser.addEventListener('click', async ()=>{

        let ask = window.confirm("If you delete all your information will be lost, you will have to make a new account to use this product");

        if (ask){

            try{
                const data = await fetch('/deleteuser', {
                    method: 'DELETE',
                });
    
                const result = await data.json();
    
                if(result.err){
                    console.log(err);
                }else{
                    location.assign('/logout');
                }
                
            }catch(err){
                console.log(err.message);
            }
            
        }
    });


}