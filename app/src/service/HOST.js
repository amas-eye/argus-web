         //export const HOST = 'http://localhost:6002' // 本地代理请求路径
        // export const HOST = 'http://localhost:8080' // 公司服务器
        //export const HOST = '/mylocal' //前端代理服务器


         let HOST = '/mylocal';
         if (process.env.NODE_ENV === 'production') {
           HOST = 'http://127.0.0.1:8080';
         }

         export {
           HOST
         }
