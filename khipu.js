var https = require('https'),
url = require('url'),
crypto = require('crypto')
KHIPU_API_HOST = 'khipu.com',
KHIPU_API_PREFIX = '/api/2.0/',
KHIPU_API_BANKS = 'banks',
KHIPU_API_PAYMENTS = 'payments',
KHIPU_API_RECEIVERS = 'receivers';

function Khipu(options){
	if (!(this instanceof Khipu)) {
    throw new Error("You must use the new keyword when constructing an instance of Khipu.");
  }

  if (typeof options !== "object") {
		throw new Error("You must provide an Object as argument");
  }

	if(options.secret === undefined){
		throw new Error("You must provide a secret");
	}
	else this.secret = options.secret;
	if(options.receiverId === undefined){
		throw new Error("You must provide a receiverId");
	}
	else this.receiverId = options.receiverId;
	if(options.debug === undefined){this.debug = false;}
	else this.debug = options.debug;

  this.accessToken = options.accessToken;
  this.logger = options.logger || console;
}

Khipu.prototype.banksGet = function(successCB, errorCB){
	makeCall(KHIPU_API_BANKS,
	'GET',
	null,
	this.receiverId,
	this.secret,
	successCB,
	errorCB);
}

Khipu.prototype.paymentsGet = function(notification_token, successCB, errorCB){
	makeCall(KHIPU_API_PAYMENTS,
		'GET',
		{notification_token:notification_token},
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

Khipu.prototype.paymentsPost = function(params, successCB, errorCB){
	makeCall(KHIPU_API_PAYMENTS,
		'POST',
		params,
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

Khipu.prototype.paymentsIdGet = function(paymentId, successCB, errorCB){
	makeCall(KHIPU_API_PAYMENTS+'/'+paymentId,
		'GET',
		null,
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

Khipu.prototype.paymentsIdDelete = function(paymentId, successCB, errorCB){
	makeCall(KHIPU_API_PAYMENTS+'/'+paymentId,
		'DELETE',
		null,
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

Khipu.prototype.paymentsIdRefundsPost = function(paymentId, successCB, errorCB){
	makeCall(KHIPU_API_PAYMENTS+'/'+paymentId,
		'POST',
		null,
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

Khipu.prototype.receiversPost = function(params, successCB, errorCB){
	makeCall(KHIPU_API_RECEIVERS,
		'POST',
		params,
		this.receiverId,
		this.secret,
		successCB,
		errorCB);
}

function makeCall(service_name, method, params, receiverId, secret, successCB, errorCB){
	hash = makeAuthorization(method, makeURL(service_name), params, secret);
	req = https.request(
		{
			hostname: KHIPU_API_HOST,
			port: 443,
			path: KHIPU_API_PREFIX + service_name,
			method: method,
			headers: {Authorization: receiverId +':'+ hash, 'Content-type':'application/x-www-form-urlencoded'}
		},
			function(res){
				res.on('error', function(e){
					handleError(e, errorCB, logger);
				});
				var chunks = [];
				res.on('data', function(d){
					chunks.push(d);
				});
				res.on('end', function(){
					successCB({
						statusCode: res.statusCode,
            headers: res.headers,
            data: JSON.parse(chunks.join())
					});
				});
			}
	);
	if (params && typeof params === 'object' && method !== 'GET') {
    req.write(httpQuery(params));
  }
	req.on('error', function(e) {
		handleError(e, cb, logger);
	});
	req.end();
}

function handleError(err, cb, logger) {
  logger.error(err);
  if (cb) {
    cb(err);
  } else {
    throw err;
  }
}

function makeAuthorization(method, url, params, secret){
	var toSign = customEncodeURIComponent(method);
	toSign += '&'+customEncodeURIComponent(url);
	var query = params===null?'':('&'+httpQuery(params));
	toSign +=  query;

	var hmac = crypto.createHmac('sha256', secret);


console.log(toSign);

	hmac.update(toSign);
	res = hmac.digest('hex');
	console.log('\n');
	console.log(res);
	return res;
}

function httpQuery(params){
	query = '';
	if(params===null) return null;
	sortedParamKeys = Object.keys(params).sort();
	for(var i=0;i<sortedParamKeys.length;i++){
		query += '&' +  customEncodeURIComponent(sortedParamKeys[i]) + '=' + customEncodeURIComponent(params[sortedParamKeys[i]]);
	}
	return query.substring(1);
}

function customEncodeURIComponent(text){
	return encodeURIComponent(text)
	.replace(/\(/g, "%28")
	.replace(/\)/g, "%29")
	.replace(/\'/g, "%27")
	.replace(/\!/g, "%21")
	.replace(/\*/g, "%2A")
	;
}

function makeURL(path){
	return 'https://'+KHIPU_API_HOST+KHIPU_API_PREFIX+path;
}

module.exports = Khipu;
