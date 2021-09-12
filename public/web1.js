if (document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

function ready(){
    fire_signup();
    login_chk();
}

function fire_signup(){
    let signup_btn = document.getElementsByClassName('signup')[0];
    let parent = document.getElementsByClassName('sign_up')[0];

    signup_btn.addEventListener('click', ()=>{
        parent.style.display = 'block';
        password_chk();
        conf_pass();
        form_chk();
    });


    let signup_close_btn = document.getElementsByClassName('close-btn')[0];
    let password = document.getElementsByClassName('password')[0];
    let conf_password = document.getElementsByClassName('confirm_password')[0];
    let p_tag = document.getElementsByTagName('p');

    signup_close_btn.addEventListener('click', ()=>{
        parent.style.display = 'none';
        password.style.borderBottomColor = 'black';
        conf_password.style.borderBottomColor='black';

        for (let i = 0; i < p_tag.length; i++)
        {
            p_tag[i].style.display = 'none';
        }
    })
}

function password_chk(){
    let password = document.getElementsByClassName('password')[0];

    password.addEventListener('change', ()=>{
        const pass_str = password.getElementsByTagName('input')[0].value;
        const alert_str = document.getElementById("password_alert");

        if (pass_str.length < 8 && pass_str.length >=1){
            alert_str.style.display = 'block';
            password.style.borderBottomColor = "red";
        }
        else if((pass_str.length == 0) || (pass_str.length >=8) ){
            alert_str.style.display = 'none';
            password.style.borderBottomColor = 'black';
        }

        disablebutton();
    });
}
function conf_pass(){
    let conf_password = document.getElementsByClassName('confirm_password')[0];
    let password = document.getElementsByClassName('password')[0];
    const alert_str = document.getElementById("conf_password_alert");

    conf_password.addEventListener('change', function(){
        const pass_str = password.getElementsByTagName('input')[0].value;
        const conf_str = conf_password.getElementsByTagName("input")[0].value;

        if (pass_str !== conf_str && conf_str.length >=1){
            alert_str.style.display = 'block';
            conf_password.style.borderBottomColor = "red";
        }else if((conf_str.length == 0) || (pass_str === conf_str)){
            alert_str.style.display = 'none';
            conf_password.style.borderBottomColor = 'black';
        }

        disablebutton();    
    })

    password.addEventListener('change', ()=>{
        const pass_str = password.getElementsByTagName('input')[0].value;
        const conf_str = conf_password.getElementsByTagName("input")[0].value;

        if (pass_str !== conf_str && conf_str.length >= 1){
            alert_str.style.display = 'block';
            conf_password.style.borderBottomColor = "red";
        }
        else if((conf_str.length == 0) || (pass_str === conf_str)){
            alert_str.style.display = 'none';
            conf_password.style.borderBottomColor = 'black';
        }

        disablebutton();
    });

}

function form_chk(){
    const form = document.getElementsByClassName('signup-box')[0];
    const err_msg = document.getElementsByClassName('alert')[0];
    const success_msg = document.getElementsByClassName('success')[0];

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        form.button.disabled = true;
        err_msg.textContent = '';
        success_msg.textContent= '';
        const name = (form.name.value).trim();
        const dob = form.dob.value + 'Z';
        const email = (form.email.value).trim();
        const username= (form.username.value).trim();
        const password = (form.password.value).trim();

        try{
            const res = await fetch('/signup', {
                method: 'POST',
                body: JSON.stringify({name, dob, email, username, password}),
                headers: {'Content-type': 'application/json'}
            })

            const data = await res.json();

            if(data.errors)
            {
                err_msg.textContent = data.errors._email + data.errors._username + data.errors._password;
                form.button.disabled = false;
            }

            if(data._user){
                success_msg.textContent = "User registered!";
                setTimeout(()=>{

                }, 1000);
                location.assign('/');
            }
        }
        catch(err){
            console.log(err);
        }
    });
}

function login_chk(){
    const form = document.getElementsByClassName('login-box')[0];
    const user_msg = document.getElementsByClassName('user-err')[0];
    const pass_msg = document.getElementsByClassName('pass-err')[0];

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();

        user_msg.textContent = '';
        pass_msg.textContent= '';

        form.button.disabled = true;
        const username= (form.username.value).trim();
        const password = form.password.value;
        
        try{
            const res = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {'Content-type': 'application/json'}
            })

            const data = await res.json();
            
            if(data.errors)
            {
                user_msg.textContent = data.errors._username; 
                pass_msg.textContent = data.errors._password;
                form.button.disabled = false;
            }

            if (!data.active){
                const patch = await fetch('/activateuser', {
                    method: 'PUT',
                });

                const result = await  patch.json();

                if (result.err){
                    throw(result.err);
                }
            }

            if(data.user){
                location.assign('/projects');
            }
        }
        catch(err){
            console.log(err);
        }
    });
}

function disablebutton(){
    let pass_err = document.getElementById('password_alert');
    let conf_err = document.getElementById('conf_password_alert');

    let btn = document.getElementsByClassName('signup-box')[0].getElementsByClassName('signup_btn')[0];
    let val = false;
    val |= (pass_err.style.display == 'block') || (conf_err.style.display == 'block');

    if (val)
        btn.disabled = true;
    else
        btn.disabled = false;
}