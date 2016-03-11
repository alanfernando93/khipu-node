# Khipu for nodejs

NodeJS of Khipu's API. Detailed description of each endpoint can be found at https://khipu.com/page/api

__IMPORTANT: This library has not been fully tested yet.__



# Usage

## Retrieve a list of banks

```node
var Khipu = require('khipu');
var receiverId = ''; //Complete with your receiverId
var secret = ''; //Complete with your secret

var khipuclient = new Khipu({secret:secret, receiverId:receiverId });
khipuclient.banksGet(function(res){
  var banks = res.data.banks;
  for(var i=0; i<banks.length; i++){
    console.log(banks[i]);
  }
},
function(error){
  console.log(error);
});
```

## Create a payment request
```node
var khipuclient = new Khipu({secret:secret, receiverId:receiverId });
khipuclient.paymentsPost(
{
  subject:'Test Payment',
  currency:'CLP',
  amount:2000,
  transaction_id:12345,
  custom: 'Custom information',
  body: 'This is a test payment'
},
function(res){
  console.log(res.data);
},
function(error){
  console.log(error);
});
```

# Methods available

* banksGet(successBlock,errorBlock)
* paymentsGet(notification_token, successBlock,errorBlock)
* paymentsPost(params, successBlock,errorBlock). _params_ is an object with the attributes defined in https://khipu.com/page/api-referencia#paymentsPost
* paymentsIdGet(paymentId, successBlock,errorBlock)
* paymentsIdDelete(paymentId, successBlock,errorBlock)
* paymentsIdRefundsPost(paymentId, successBlock,errorBlock)
* receiversPost(params, successBlock,errorBlock). _params_ is an object with the attributes defined in https://khipu.com/page/api-referencia#receiversPost
