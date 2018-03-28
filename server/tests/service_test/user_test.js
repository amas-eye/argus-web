var assert = require('assert')
var user = require('../../services/users')
var dbconnect = require('../../db_connect')
var user_model = require('../../models/user')


// describe("user function test",function(){
    
//     it('test_get_user_data',function(){
//         //登陆后用户获取自己信息的接口测试
//         user.get_user_data('root').then((result)=>{
//             assert.equal(result.username, "root", "success")
//         },(err)=>{
//             assert.equal(err, '361')
//         })
//     })
    
// })

// describe("test_save_user_data", function(){
//     it('test_save_user_data_not_change_password_success', function(){
//        var p_test_obj = {
//            "name":"test_obj",
//            "mail":"test_obj@useease.com",
//            "cell_phone":"555-789456",
//            "wechat_id":"123456",
//            "group_name":"group22333",
//            "old_password":"",
//            "new_password":""
//            }
//        var username = "argustttttt"
//        user.save_user_data(username, p_test_obj).then((result)=>{
//           assert.equal(result, '301')
//        },(err)=>{
//           assert.equal(err,'360')
//        })
//      }),

//     it('test_save_user_change_password_success',function(){
//        var p_test_obj = {
//            "name":"test_obj",
//            "mail":"test_obj@useease.com",
//            "cell_phone":"555-789456",
//            "wechat_id":"123456",
//            "group_name":"group22333",
//            "old_password":"123456",  //每次进行测试的时候需要更换密码来进行测试
//            "new_password":"888888"
//            }
//        var username = "argustttttt"
//        user.save_user_data(username,p_test_obj).then((result)=>{
//            assert.equal(result,'301')
//        }, (err)=>{
//            assert.equal(err, '360')
//        })
//     }),
    
//     it('test_save_user_change_password_fail_origin_password_error',function(){
//        var p_test_obj = {
//            "name":"test_obj",
//            "mail":"test_obj@useease.com",
//            "cell_phone":"555-789456",
//            "wechat_id":"123456",
//            "group_name":"group22333",
//            "old_password":"8888888",   // 需要填入一个随机的密码来进行错误测试
//            "new_password":"123456"
//            }
//        var username = "argustttttt"
//        user.save_user_data(username,p_test_obj).then((resutl)=>{
//           assert.equal(resutl, '353')
//        },(err)=>{
//           assert.equal(err,'301')
//        })
//     }),


//     it('test_save_user_change_password_fail_change_password_without_old_password',function(){
//        var p_test_obj = {
//            "name":"test_obj",
//            "mail":"test_obj@useease.com",
//            "cell_phone":"555-789456",
//            "wechat_id":"123456",
//            "group_name":"group22333",
//            "old_password":"",   // 需要填入一个随机的密码来进行错误测试
//            "new_password":"8898989"
//            }
//        var username = "argustttttt"
//        user.save_user_data(username,p_test_obj).then((result)=>{
//           assert.equal(result, '355')
//        },(err)=>{
//           assert.equal(err,'300')
//        })
//     })

// })

//此行以上的全部是已经测试成功的测试代码

// describe("show_user_test", function(){
//     //进行搜索条件为空的查询
//      it('test_no_search_condition', function(){
//          var page = 1;
//          var item_number = 10;
//          var com = ""
//          var group = ""
//          user.show_user(page, item_number, com, group).then((result)=>{
//               console.log(result)
//               console.log(result.length)
//              var test_result = true
//              var range = 0
//              for(range =0; range<result.length; range++){
//                   console.log("count++")
//                   console.log(u)
//                  var u = result[range]
//                   if(u.username != undefined & u.mail !=undefined 
//                      &  u.name != undefined & u.create_time != undefined 
//                      & u.update_time != undefined){
//                       var a = true
//                   }  else {
//                       var a = false
//                   }
//                   if( a != true){
//                       test_result = false
//                       break
//                   }    
//              }
//              assert.equal(true, a,"item passed")
//          },(err)=>{
//              assert.equal('360', err)
//          })
//      }),

//     //进行单条件搜索,只有用户,用户存在的情况下， 可以通过
//      it('test_only_user_search', function(){
//          var page = 1;
//          var item_number = 10;
//          var com = "argus"  
//          var group = ""
//          user.show_user(page, item_number, com, group).then((result)=>{
//              var test_result = true
//              var range = 0
//              var reg = new RegExp(com)
//              for(range =0; range<result.length; range++){
//                   console.log("count++")
//                   console.log(u)
//                  var u = result[range]
//                   if(u.username != undefined & u.mail !=undefined 
//                      &  u.name != undefined & u.create_time != undefined 
//                      & u.update_time != undefined & 
//                      reg.test(u.username)){
//                       var a = true
//                   }  else {
//                       var a = false
//                   }
//                   if( a != true){
//                       test_result = false
//                       break
//                   }    
//              }
//              assert.equal(true, a)
//          },(err)=>{
//              assert.equal('360', err)
//          })
//      }),
    

//     //进行单条件搜索,只有组,组存在的情况下
//      it('test_only_group_search', function(){
//          var page = 1;
//          var item_number = 10;
//          var com = ""
//          var group = "admin"
//          user.show_user(page, item_number, com, group).then((result)=>{
//              user.show_user(page, item_number, com, group).then((result)=>{
//                   var test_result = true
//                   var range = 0
//                   var reg = new RegExp(com)
//                   for(range =0; range<result.length; range++){
//                        console.log("count++")
//                        console.log(u)
//                       var u = result[range]
//                        if(u.username != undefined & u.mail !=undefined 
//                           &  u.name != undefined & u.create_time != undefined 
//                           & u.update_time != undefined & 
//                           reg.test(u.username)){
//                            var a = true
//                        }  else {
//                            var a = false
//                        }
//                        if( a != true){
//                            test_result = false
//                            break
//                        }    
//                   }
//                   assert.equal(true, a)
//                 },(err)=>{
//                     assert.equal('360', err)
//                 })
//         })
//      }),

//     //进行组合条件即用户正则以及组名的搜索
//      it('test_group&user_search', function(){
//          var page = 1;
//              var item_number = 10;
//              var com = "argus"
//              var group = "admin"
//              user.show_user(page, item_number, com, group).then((result)=>{
//                   var test_result = true
//                   var range = 0
//                   var reg = new RegExp(com)
//                    var reg2 = new RegExp(group)
//                   for(range =0; range<result.length; range++){
//                       var u = result[range]
//                        if(u.username != undefined & u.mail !=undefined 
//                           &  u.name != undefined & u.create_time != undefined 
//                           & u.update_time != undefined & 
//                           reg.test(u.username)){
//                            var a = true
//                        }  else {
//                            var a = false
//                        }
//                        if( a != true){
//                            test_result = false
//                            break
//                        }    
//                   }
//                   assert.equal(true, a)
//                 },(err)=>{
//                     assert.equal('360', err)
//                 })
//      }),

//     //进行没有该用户的搜索
//     it('test_user_did\'t_exist_search', function(){
//         var page = 1;
//         var item_number = 10;
//         var com = "kop"
//         var group = ""
//         user.show_user(page, item_number, com, group).then((result)=>{
//             var test_result = true
//             var range = 0
//             var reg = new RegExp(com)
//             for(range =0; range<result.length; range++){
//                 var u = result[range]
//                 var a = true
//                 if (result == []){
//                     a = false
//                 }
//                 if( a != true){
//                     test_result = false
//                     break
//                 }    
//             }
//             console.log(test_result)
//             assert.equal(true, test_result)
//             },(err)=>{
//                  assert.equal('360', err)
//             })
//     })


// })


// describe("show_user_pages_test", function(){
    //进行搜索条件为空的查询,显示用户数量的接口
    // it('test_no_search_condition', function(){
    //      var item_number = 10;
    //      var com = ""
    //      var group = ""
    //      user.show_all_pages(com, group, item_number).then((result)=>{
    //          var test_result = true
    //          var range = 0
    //          user_model.find().then((item)=>{
    //             var item_length = item.length
    //             var compare_page = parseInt(parseInt(item_length) / item_number) + 1
    //             assert.equal(parseInt(result), compare_page)
    //          },(err)=>{
    //             res.send(err)
    //          })
    //      },(err)=>{
    //          assert.equal('360', err)
    //      })
    // }),

    //进行单条件搜索,只有用户,用户存在的情况下， 可以通过
//    it('test_search_user_only_condition', function(){
//         var item_number = 10;
//         var com = "argus"
//         var group = ""
//         user.show_all_pages(com, group, item_number).then((result)=>{
//             var test_result = true
//             var range = 0
//             query = {"username":eval('/'+com+'/i')}
//             user_model.find(query).then((item)=>{
//                var item_length = item.length
//                var compare_page = parseInt(parseInt(item_length) / item_number) + 1
//                assert.equal(parseInt(result), compare_page)
//             },(err)=>{
//                res.send(err)
//             })
//         },(err)=>{
//             assert.equal('360', err)
//         })
//    }),

    //进行单条件搜索,只有组,组存在的情况下
//    it('test_search_group_only_condition', function(){
//         var item_number = 10;
//         var com = ""
//         var group = "admin"
//         user.show_all_pages(com, group, item_number).then((result)=>{
//             var test_result = true
//             var range = 0
//             query = {"group_name":group}
//             user_model.find(query).then((item)=>{
//                var item_length = item.length
//                var compare_page = parseInt(parseInt(item_length) / item_number) + 1
//                assert.equal(parseInt(result), compare_page)
//             },(err)=>{
//                res.send(err)
//             })
//         },(err)=>{
//             assert.equal('360', err)
//         })
//    })

    //进行组合条件即用户正则以及组名的搜索
    // it('test_search_group_and_user_condition', function(){
    //      var item_number = 10;
    //      var com = "argus"
    //      var group = "admin"
    //      user.show_all_pages(com, group, item_number).then((result)=>{
    //          var test_result = true
    //          var range = 0
    //          query = {"group_name":group,"username":eval('/'+com+'/i')}
    //          user_model.find(query).then((item)=>{
    //             var item_length = item.length
    //             var compare_page = parseInt(parseInt(item_length) / item_number) + 1
    //             assert.equal(parseInt(result), compare_page)
    //          },(err)=>{
    //             res.send(err)
    //          })
    //      },(err)=>{
    //          assert.equal('360', err)
    //      })
    // }),

    //进行没有该用户的搜索
    // it('test_search_user_not_exist_condition', function(){
    //      var item_number = 10;
    //      var com = "kops"
    //      var group = ""
    //      user.show_all_pages(com, group, item_number).then((result)=>{
    //          var test_result = true
    //          var range = 0
    //          query = {"group_name":group,"username":eval('/'+com+'/i')}
    //          user_model.find(query).then((item)=>{
    //             var item_length = item.length
    //             var compare_page = parseInt(parseInt(item_length) / item_number) + 1
    //             assert.equal(parseInt(result), compare_page)
    //          },(err)=>{
    //             res.send(err)
    //          })
    //      },(err)=>{
    //          assert.equal('360', err)
    //      })
    // })

// })

// describe("test_get_user_info",function(){
//     it("get_user_info",function(){
//         var username = "argus456"
//         user.get_user_info(username).then((result)=>{
//             if(result.user != undefined & result.pri != undefined){
//                 var f = true
//             }
//             assert.equal(f,true)
//         })
//     })
// })

describe("test_get_group_privilieged",function(){
    it('test_get_group_privilieged', function(){
        //用于对存在的组进行测试
        var groupname = "admin"
        user.get_group_Privilieged(groupname).then((result)=>{
            result = result[0]
            if(result.group_privilieged != undefined & result.group_name != undefined
                & result.group_privilieged.dashboard != undefined &
                result.group_privilieged.caiji != undefined &
                result.group_privilieged.jk != undefined & 
                result.group_privilieged.chain != undefined &
                result.group_privilieged.alert != undefined
            ){
                var attribute_full = true
            }
            else{
                var attribute_full = false
            } 
            assert.equal(attribute_full, true)
        },(err)=>{
            assert.fail("not full attribute")
        })
    }),

    it('test_get_group_privilieged_group_not_exist',function(){
        var groupname = "kkk"
        user.get_group_Privilieged(groupname).then((result)=>{
            assert.equal(result,'952')
        },(err)=>{
            assert.fail("wront case")
        })
    })    

})



