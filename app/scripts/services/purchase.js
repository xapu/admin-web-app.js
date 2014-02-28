'use strict';

angular.module('adminPanelApp')
	.factory('Purchase', function($http, $q, Book, ROUTES) {

		return {
			get: function(id) {
				var defer = $q.defer();
				if(!!id){
					$http({
						method: 'GET',
						url: ROUTES.ADMIN_USERS + '/' + id + ROUTES.PURCHASE_HISTORY,
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then(function(response){
							if(response.data.count > 0){
								Book.get(response.data.purchases.map(function(d){ return d.isbn; })).then(function(books){
									defer.resolve(response.data.purchases.map(function(d, i){
										return {
											date: d.date,
											isbn: d.isbn,
											title: books[i].title,
											price: d.payments.map(function(payment){
												return '£' + payment.money.amount;
											}).join(', ')
										};
									}));
								}, defer.reject);
							} else {
								// user didn't do any purchases
								defer.resolve([]);
							}
						}, defer.reject);
				} else {
					defer.reject('The purchase service requires the user id as an arg.');
				}
				return defer.promise;
			}
		};

	}
);