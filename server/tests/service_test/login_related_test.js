
var assert = require('assert')
var login = require('../../services/login')

describe('login_related', function(){
    describe('login', function(){
        it('test_login_fail_password',function(){
            login.login('root', '123456').then((result)=>{
                done()
            },(err)=>{
                assert.equal(err, '250')
            })
        }),

        it('test_login_success',function(){
            login.login('root', '56b9ef33ce377d936414017220e55d1beb915c5697af91fc4f112546234338619c100b781955dd6287f732e8eef60b84ba6278de7cbc45f343d8031a43b3f22d').then((result)=>{
                assert.equal(result, '200', "login success")
            },(err)=>{
                assert.equal(Error,err)
                done()
            })
        })

        it('test_login_fail_user_invalid',function(){
            login.login('ri','56b9ef33ce377d936414017220e55d1beb915c5697af91fc4f112546234338619c100b781955dd6287f732e8eef60b84ba6278de7cbc45f343d8031a43b3f22d').then((result)=>{
                done()
            },(err)=>{
                assert.equal(err, '251')
            })
        })

    })
        
})