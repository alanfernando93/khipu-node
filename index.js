var https = require('https'),
url = require('url'),
crypto = require('crypto')
KHIPU_API_HOST = 'khipu.com',
KHIPU_API_PREFIX = 'api/2.0';

function Khipu(options){
	if (!(this instanceof Khipu)) {
    throw new Error("You must use the new keyword when constructing an instance of Khipu.");
  }

  if (typeof options === "object") {
    options = { accessToken: options };
  }

	if(options.secret === undefined){}
	else this.secret = options.secret;
	if(options.receiverId === undefined){}
	else this.receiverId = options.receiverId;
	if(options.debug === undefined){this.debug = false;}
	else this.debug = options.debug;

  this.accessToken = options.accessToken;
  this.logger = options.logger || console;
}

Khipu.prototype.banks = function(successCB, errorCB){
	hash = makeAuthorization('GET', );
	headers['Authorization'] = this.receiverId + hash;
	req = https.request(
		{
			hostname: KHIPU_API_HOST,
			port: 443,
			path: KHIPU_API_PREFIX + "/banks",
			headers: headers,
			function(res){
				res.on('error', function(e){
					handleError(e, errorCB, logger);
				});
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
		}
	);
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
	var toSign = encodeURIComponent(method);
	toSign += '&'+encodeURIComponent(url);
	sortedParamKeys = Object.keys(params).sort();
	for(var i=0;i<sortedParamKeys.length;i++){
		toSign += '&' +  encodeURIComponent(sortedParamKeys[i]) + '=' + encodeURIComponent(params[sortedParamKeys[i]]);
	}
	var hmac = crypto.createHmac('sha256', secret);
	hmac.update(toSign);
	res = hmac.digest('hex');
	return res;
}

module.exports = Khipu;
