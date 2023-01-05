const {sqlData} = require('../../utils/pg');
const jwt = require('jsonwebtoken');
const validate = require('../../utils/validate');

const setToken = payload => jwt.sign(payload, 'MUSAFFO_SKY', {
    expiresIn:"1h"
})

class userController{
    async create (req, res) {
        try{
            const { error, value } = validate.postUserValidation.validate({...req.body}); 

            
            if(error || !value.name  || !value.parol || !value.pic){
                res.status(403).json({status:403, success: false, message:`Qiymatlaringiz bizga mos xolda emas`});
                return
            }

            
            const foundUser = await sqlData('select * from db_users where name = $1 or parol = $2', value.name, value.parol);
            if(foundUser.length>0){
                res.status(403).json({status:403, success: false, message:`name yoki parol avvaldan mavjud`});
                return;
            }
            
        const regUser =   await sqlData('insert into db_users(name,  parol, pic) values($1, $2, $3) returning *', value.name,value.parol, value.pic);
        
        res.status(200).json({status:200, success:true, token: setToken({id:regUser[0].id, role:regUser[0].role}),  message: 'muvaffaqiyatli ro`yhatdan o`tdingiz!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async login (req, res) {
        try{
            const { error, value } = validate.loginValidation.validate({...req.body}); 
            if(error){
                res.status(401).json({status: 401, success: false, message:`Name yoki parol juda qisqa`});
                return
            }
            const foundUser = await sqlData('select * from db_users where name = $1 and parol = $2', value.name, value.parol);

            if(foundUser.length == 0){
                res.status(401).json({status: 401, success: false, message:`Name yoki parol no'tog'ri kiritildi`});
                return
            }
            res.status(200).json({status:200, success:true,  token: setToken({id:foundUser[0].id}), message: 'muvaffaqiyatli profilga kirildi' })
        }
        catch(e){
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async edit (req, res) {
        try{
            const {id } = req.params;
            const oldData = await sqlData(`select * from db_users where id = $1`, id-0);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'foydalanuvchi topilmadi'});
                return
            }
            
            const { error, value } = validate.postUserValidation.validate({...req.body});
            if (error) {
                res.status(404).json({status:404, success: false, message: 'Ma`lumotlar xato to`ldirildi'});
                return
            }

           const editedUser =  await sqlData('update db_users set name = $1, parol = $2, pic = $3 where id = $4 returning *', value.name || oldData[0].name, value.parol || oldData[0].parol, value.pic || oldData[0].pic, id-0 );
            res.status(200).json({status:200, success:true, data: editedUser[0], message: 'ma`lumotlar yangilandi!' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async remove (req, res) {
        try{
            const foundUser = await sqlData('select * from db_users where id = $1', req.params.id);
            if(foundUser.length==0){
                res.status(404).json({status:404, success: false, message:`Foydalanuvchi topilmadi`});
                return;
            }
            
          await sqlData('delete from db_users where id = $1', req.params.id);
        
        res.status(200).json({status:200, success:true, message: 'User muvaffaqiyatli o`chirildi' })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async get (req, res) {
        try{
            const oldData = await sqlData(`select * from db_users where id != $1`,req.user.id);
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

    async getById (req, res) {
        try{
            const oldData = await sqlData(`select * from db_users where id = $1`, req.params.id);

            if (oldData.length ==0) {
                res.status(404).json({status:404, success: false, message: 'foydalanuvchi topilmadi'});
                return
            }
        
            res.status(200).json({status:200, success: true, data: oldData })
        }
        catch{
            res.status(500).json({status:500, message: 'invalid request'})
        }
    }

}

module.exports = new userController;
