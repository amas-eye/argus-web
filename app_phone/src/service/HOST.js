// export const HOST = '/wifi'; //url公共前缀(代理)
// export const HOST = 'http://10.17.35.45:8080/wifi'; //url公共前缀(内网)
//export const HOST = 'http://14.29.5.101:8080/wifi'; //url公共前缀(外网)
// export const HOST = 'http://183.3.139.134:8383' http://183.3.139.134:8383 //外部服务器

let HOST = '/wifi';
if (process.env.NODE_ENV === 'production') {
	HOST = '';
}

export {
	HOST
}