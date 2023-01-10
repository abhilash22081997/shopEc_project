const admins=require('../../models/adminModel')
const bcrypt = require('bcrypt')


let message=''

module.exports={
    loginGet: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin/home')
            // res.redirect('/admin/home')
        }else{
            res.render('admin/adminLogin', { message ,admin:false,user:false})
            message = ''
        }
       
    },
    loginPost: async (req, res) => {
        const adminDetails = req.body
            const admin = await admins.findOne({email:adminDetails.email})
            console.log(admin)
            if (admin) {
                let status = await bcrypt.compare(adminDetails.password,admin.password)
                console.log(status)

                if (status) {  
                    req.session.admin = adminDetails.email
                    res.redirect('/admin/home')
                    // res.redirect('/admin/home')
                }
                else {
                    console.log('password incorrect');
                    message = 'invalid username or password'
                    res.redirect('/admin')
                }
            } else {
                console.log('invalid username');
                message = 'invalid username or password'
                res.redirect('/admin')
            }
       
    },
    adminHome: async(req,res)=>{
        if(req.session.admin){
            res.render('admin/adminHome',{admin:true,user:false})
        }else{
            res.redirect('/admin')
        }
    }

}
