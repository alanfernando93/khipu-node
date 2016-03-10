=Khipu for nodejs

NodeJS of Khipu's API. Detailed description of each endpoint can be found at https://khipu.com/page/api

Usage example:
```
var Khipu = require('khipu');
var receiverId = ''; //Complete with your receiverId
var secret = ''; //Complete with your secret

var khipuclient = new Khipu({secret:secret, receiverId:receiverId });
khipuclient.banksGet(function(res){
        console.log(res);
			},
			function(error){
        console.log(error);
			});
```

=Methods available

* banksGet(successBlock,errorBlock)
* paymentsGet(notification_token, successBlock,errorBlock)
* paymentsPost(params, successBlock,errorBlock). _params_ is an object with the attributes defined in https://khipu.com/page/api-referencia#paymentsPost
* paymentsIdGet(paymentId, successBlock,errorBlock)
* paymentsIdDelete(paymentId, successBlock,errorBlock)
* paymentsIdRefundsPost(paymentId, successBlock,errorBlock)
* receiversPost(params, successBlock,errorBlock). _params_ is an object with the attributes defined in https://khipu.com/page/api-referencia#receiversPost
