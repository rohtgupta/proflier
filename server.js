const express = require('express');
const mongoose = require('mongoose')
const  app = express();
const User = require('./models/usermodels');
const Project = require('./models/projectmodel');
const Info = require('./models/infomodel');
const Exp = require('./models/expmodel');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {currentUser } = require('./middleware/authmiddleware');
const { render } = require('ejs');
const dotenv = require('dotenv');


dotenv.config({path: 'config.env'});
//connect to mongodb
const dburi = process.env.MONGO_URI ;
const maxAge = 24*60*60;
const handlerrors = (err)=>{
    
    let errors = {_email: '', _username:'', _password: ''};

    if (err.message == "Incorrect username or email!"){
        errors._username = err.message;
        return errors;
    }

    if (err.message == "Incorrect password!"){
        errors._password = err.message;
        return errors;
    }

    if (err.code === 11000){
        if(err.message.includes('email'))
        {
            errors['_email'] = 'email already exist.';
        }else{
            errors['_username'] = 'username already exist.';
        }
    }
    else if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors['_'+properties.path] = properties.message;
        });
    }
    
    return errors;
}

const createToken = (id)=>{
    return jwt.sign({id}, 'beta@master', {expiresIn: maxAge} );
}
app.set('view engine', 'ejs');

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result)=>{console.log("connected");app.listen(process.env.PORT);})
    .catch((err)=>{console.log(err.message)});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
//app.use(express.urlencoded());
app.use(cookieParser());

app.use('*', currentUser);
app.get('/', async (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else
        res.redirect('/projects');
});
 
app.get('/index', (req, res)=>{
    res.redirect('/');
})

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true});
        res.status(200).json({user: user._id, active: user.active});
    }
    catch(err){
        const errors = handlerrors(err);
        res.status(400).json({errors});
    }
});

app.put('/activateuser', async (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const {_id, name, dob, email, username, password} = res.locals.user;

        User.findByIdAndUpdate(_id, {name, dob, email, username, password, active: true})
            .then(result =>{
                res.status(200).json(result);
            })
            .catch(err=>{
                res.status(400).json({err: err.message});
            })
    }
});

app.put('/deactivate', async (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const {_id, name, dob, email, username, password} = res.locals.user;

        User.findByIdAndUpdate(_id, {name, dob, email, username, password, active: false})
            .then(result =>{
                res.status(200).json(result);
            })
            .catch(err=>{
                res.status(400).json({err: err.message});
            })
    }
});

app.get('/logout', (req, res)=>{
    if (res.locals.user === null)
        res.render('index');
    else{
        res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/');
    }
    
});

app.post('/signup', async (req, res)=>{
    const {name, dob, email, username, password} = req.body;

    try{
        const user = await User.create({name, dob, email, username, password});
        res.status(201).json({_user: user._id});
    }
    catch(err){
        const errors = handlerrors(err);
        res.status(400).json({errors});
    }
    
});

app.get('/settings', async (req, res)=>{
    
    if (res.locals.user === null)
        res.render('index');
    else{
        res.render('settings');
    }
})

app.get('/projects', async (req, res)=>{
    
    if (res.locals.user === null)
        res.render('index');
    else{
        let result = await Project.find({userid: res.locals.user._id});
        res.render('projects', {projects: result});
    }
})

app.post('/projects', async (req, res)=>{
    if (res.locals.user === null)
        res.render('index');
    else{
        const {title, description, team, address} = req.body;

        try{
            const project = await Project.create({userid: res.locals.user._id, title, description, team, address});
            const message = "Added";
            res.status(200).json({message});
        }
        catch(err){
            const errors = err.message;
            res.status(400).json({errors});
        }
    }
})

app.get('/account', async (req, res)=>{
    if (res.locals.user === null)
        res.render('index');
    else{
        let user1 = {id: res.locals.user._id, name: res.locals.user.name, email:res.locals.user.email, dob: res.locals.user.dob.toString()};
        let info = await Info.find({userid: res.locals.user._id});
        let exp = await Exp.find({userid: res.locals.user._id});
        
        res.render('account', {user: user1, info, exp});
    }
})

app.delete('/project/:id', (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const id = req.params.id;
      
        Project.findByIdAndDelete(id)
            .then(result => {
                res.json({redirect: '/projects'});
            })
            .catch(err => {
                res.status(400).json({err:err.message})
            });
    }
    
})

app.put('/updateproject/:id', async (req, res)=>{
    if (res.locals.user === null){
        res.render('index');
    }
    else{
        
        Project.findByIdAndUpdate(req.params.id, req.body)
            .then(result => {
                res.json({redirect:'/projects'});
            })
            .catch(err=>{
                res.status(400).json({err: err.message});
            })
    }
})

app.post('/qual', async (req, res)=>{
    if (res.locals.user === null){
        res.render('index');
    }else{

        const {inst, uni, deg, grade} = req.body;

        try{

            const obj = await Info.create({userid: res.locals.user, instituteName: inst, university:uni, degName:deg, grade: parseFloat(grade)});
            const message = "Added";

            res.status(200).json({message});

        }catch(err){
            const errors = err.message;
            res.status(400).json({errors});
        }
    }
});

app.delete('/qual/:id', (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const id = req.params.id;
      
        Info.findByIdAndDelete(id)
            .then(result => {
                res.json({redirect: '/account'});
            })
            .catch(err => {
                res.status(400).json({err:err.message})
            });
    }
    
});

app.post('/exp', async (req, res)=>{
    if (res.locals.user === null){
        res.render('index');
    }else{

        const {organisation, role, span, description} = req.body;

        try{

            const obj = await Exp.create({userid: res.locals.user, organisation, role, span: parseInt(span), description});
            const message = "Added";

            res.status(200).json({message});

        }catch(err){
            const errors = err.message;
            res.status(400).json({errors});
        }
    }
});

app.delete('/exp/:id', (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const id = req.params.id;
      
        Exp.findByIdAndDelete(id)
            .then(result => {
                res.json({redirect: '/account'});
            })
            .catch(err => {
                res.status(400).json({err:err.message})
            });
    }
    
});

app.get('/external/:id', async (req, res)=>{
    const id = req.params.id;
    
    try{
        const result = await User.findById(id);

        if(!result.active){
            throw(new Error("User does not exist!"));
        }
        let user = {id: result._id, name: result.name, email:result.email, dob: result.dob.toString()};
        const projects = await Project.find({userid:id});
        const info = await Info.find({userid:id});
        const exp = await Exp.find({userid:id});
        res.render('external',{user, projects, info, exp});
    }catch(err){
        res.send(err.message);
    }
    
});

app.delete('/deleteuser',async (req, res)=>{

    if (res.locals.user === null)
        res.render('index');
    else{
        const id = res.locals.user._id;

        try{
            let _ = await Project.deleteMany({userid: id});
            _ = await Exp.deleteMany({userid: id});
            _ = await Info.deleteMany({userid: id});

            let result = await User.findByIdAndDelete(id);

            res.status(200).json(result);
                
        }catch(err){
            res.status(400).json({result:{err: err.message}});
        }
    }
    
});

app.get('/searchuser', async (req, res)=>{
    if (res.locals.user === null)
        res.render('index');
    else{
        const searchName = req.query.name;
        
        User.find({name: {$regex: searchName, $options: '$i'}})
            .then(result=>{
                // res.status(200).json(result);
                res.render('search', {result, searchName});
            })
            .catch(err=>{
                res.status(400).json({err:err.message});
            });
    }
});


app.use((req, res)=>{
    res.status(404).send('Error 404!');
});


