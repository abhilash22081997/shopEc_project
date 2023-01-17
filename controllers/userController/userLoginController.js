const users = require('../../models/userModel');
const bcrypt = require('bcrypt')
let emailExistMessage = ''
module.exports={
    getSignupPage:(req,res)=>{
        res.render('user/userSignup',{emailExistMessage,user:true,admin:false,userLogged:false});
        emailExistMessage = ''
    },
postSignupPage:async(req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password,10)
    let userExist = await users.findOne({email:req.body.email})
    if(!userExist){
        await users.create(req.body).then((response)=>{
            res.redirect('/login')
        }).catch((err)=>console.log(err.message))
    }else{
        emailExistMessage = 'email already exist'
        res.redirect('/signup')
    }
},
getLoginPage:(req,res)=>{
    if(req.session.userId){
        res.redirect('/')
    }
    res.render('user/userLogin',{user:true,admin:false,userLogged:false});
},
postLoginPage:async (req, res) => {
    let userDetails = req.body
    try {
        const user = await users.findOne({ email: userDetails.email })
        if (user) {
            let status = await bcrypt.compare(userDetails.password, user.password)
            if (status) {
                        req.session.userId = user._id
                        res.redirect('/')
            }
            else {
                console.log('password incorrect');
                logMsg = 'invalid username or password'
                res.redirect('/login')
            }
        } else {
            logMsg = 'invalid username or password'
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
},

}