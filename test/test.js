var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var Khipu = require('../');

var badReceiverId = '11111';
var badSecret = 'lkjdflkjdsf';

var goodReceiverId = '';
var goodSecret = '';
var khipuclient = new Khipu({secret:goodSecret, receiverId:goodReceiverId });

var assert = require('assert');


describe('Khipu', function() {
	this.timeout(0);
	should.exist(khipuclient);
  describe('banks', function () {
    it('should return with not errors', function (done) {
			khipuclient.banksGet(function(res){
				should.exist(res);
				expect(res).to.be.a('Object');
				done();
			},
			function(error){
				should.exist(error);
				done();
			});
    });

		it('should fail on bad tokens', function(done){
			var khipuclient = new Khipu({secret:badSecret, receiverId:badReceiverId });
			khipuclient.banksGet(function(res){
				should.exist(res);
				expect(res.statusCode).to.equal(403);
				done();
			},
			function(error){
				should.exist(error);
				done();
			});
		});
  });
});
