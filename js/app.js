var App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Router.map(function () {
    this.route('credits', {path: '/thanks'});
    this.resource('products', function () {
        this.resource('product', {path: '/:product_id'});                 //dynamic routing
        this.route('onsale');                                              //will be accessing it from inside product page..Kinda new page!!
        this.route('deals');
    });
    this.resource('contacts', function () {
        this.resource('contact', {path: '/:contact_id'});
    });
});

App.IndexController = Ember.ArrayController.extend({
    productsCount: Ember.computed.alias('length'),                     //update the number of products on home page
    logo: 'images/logo-small.png',
    time: function () {
        return (new Date()).toDateString();
    }.property(),
    onSale: function () {
        return this.filterBy('isOnSale').slice(0, 3);
    }.property('@each.isOnSale')
});

App.ContactsIndexController = Ember.Controller.extend({
    contactName: 'Charanjit Singh',
    avatar: 'images/avatar.png',
    open: function () {
        return ((new Date()).getDay() === 0) ? "Closed" : "Open";
    }.property()
});

App.ProductsController = Ember.ArrayController.extend({
    sortProperties: ['title']                                           //to sort the available products
});

App.ContactsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    contactsCount: Ember.computed.alias('length')
});

App.ReviewsController=Ember.ArrayController.extend({
    sortProperties:['reviewedAt'],
    sortAscending:false
});



App.ProductsRoute = Ember.Route.extend({
    model: function () {
        return this.store.findAll('product');
    }
});

App.ContactsRoute = Ember.Route.extend({
    model: function () {
        return this.store.findAll('contact');
    }
});

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return this.store.findAll('product');                           //Index controller will compute length only when this model returns the value
    }
});

App.ProductsIndexRoute = Ember.Route.extend({
    model: function () {
        return this.store.findAll('product');
    }
});

App.ProductsOnsaleRoute = Ember.Route.extend({                                      //since it is the nested route
    model: function () {
        return this.modelFor('products').filterBy('isOnSale');                      //boolean valsue isOnsale
    }
});
App.ProductsDealsRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('products').filter(function (product) {
            return product.get('price') < 500;
        });
    }
});

App.ProductDetailsComponent=Ember.Component.extend({
    reviewsCount: Ember.computed.alias('product.reviews.length'),
    hasReviews:function () {
        return this.get('reviewsCount')>0;
    }.property('reviewsCount')
});




App.ApplicationAdapter = DS.FixtureAdapter.extend();                //to load records from the memory,also allow us to hard code the data in fixtures for getting started
// App.ApplicationAdapter=DS.RESTAdaptor.extend();                //to communicate with HTTP server using JSON


App.Product = DS.Model.extend({
    title: DS.attr('string'),
    price: DS.attr('number'),
    description: DS.attr('string'),
    isOnSale: DS.attr('boolean'),
    image: DS.attr('string'),
    reviews: DS.hasMany('review', {async: true}),                      //async allows lazy loading
    artisan: DS.belongsTo('contact', {async: true})
});

App.Product.FIXTURES = [
    {
        id: 1,                                                            //should have a unique id
        title: 'Apple',
        price: 99,
        description: 'An apple a day,keeps the doctor away...',
        isOnSale: true,
        image: 'images/products/apple.png',
        reviews: [100, 101],                                              //both side mapping required,bec we r using fixtures

        artisan: 200
    },
    {
        id: 2,
        title: 'Banana',
        price: 249,
        description: 'Minions Love banana. It contains lot of Potassium. We should eat banana daily ',
        isOnSale: false,
        image: 'images/products/banana.png',
        reviews: [],
        artisan: 201
    },
    {
        id: 3,
        title: 'Dates',
        price: 499,
        description: 'Dates are good for health. We should never eat dates. ',
        isOnSale: true,
        reviews: [103],
        image: 'images/products/dates.png',
        artisan: 201
    },
    {
        id: 4,
        title: 'Pineapple',
        price: 999,
        description: 'Juicy pineapple with distinct features. YOu gonna love this pineapple. See the cost. More than gold/diamond',
        isOnSale: false,
        reviews: [104],
        image: 'images/products/pineapple.png',
        artisan: 200
    },
    {
        id: 5,
        title: 'Pomegranate',
        price: 499,
        description: 'Pomegranate is red. Red is bad. Bad is red. It will increase your HB level .',
        isOnSale: true,
        reviews: [],
        image: 'images/products/pomegranate.png',
        artisan: 201
    },
    {
        id: 6,
        title: 'Litchi',
        price: 999,
        description: 'Fresh and sweet',
        isOnSale: true,
        reviews: [102],
        image: 'images/products/litchi.png',
        artisan: 200
    },
    {
        id: 7,
        title: 'Grapes',
        price: 99,
        description: 'Fresh and sweet',
        isOnSale: true,
        reviews: [],
        image: 'images/products/grapes.png',
        artisan: 201
    }
];

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    about: DS.attr('string'),
    avatar: DS.attr('string'),
    products: DS.hasMany('product', {async: true})
});

App.Contact.FIXTURES = [
    {
        id: 200,
        name: 'Charanjit Singh',
        about: 'Although I know nothing about myself still I am writing this crap',
        avatar: 'images/contacts/charan.png',
        products: [1, 4, 6]           //two way binding is necessary
    },
    {
        id: 201,
        name: 'Rahul Sharma',
        about: 'The unknown and big golibajj.Have many gfs but all got married recently!! ',
        avatar: 'images/contacts/rahul.png',
        products: [2, 3, 5, 7]          //two way binding is necessary
    }
];

App.Review = DS.Model.extend({
    text: DS.attr('string'),
    reviewedAt: DS.attr('date'),
    product: DS.belongsTo('product')
});

App.Review.FIXTURES = [
    {
        id: 100,
        text: "It was so delicious and juicy!",
        reviewedAt:'28/06/2016'
    },
    {
        id: 101,
        text: "Fresh and awesome!!",
        reviewedAt:'29/06/2016'
    },
    {
        id: 102,
        text: "Amazing product!!",
        reviewedAt:'30/06/2016'
    },
    {
        id: 103,
        text: "Fresh & pure!!",
        reviewedAt:'01/07/2016'
    },
    {
        id: 104,
        text: "Delicious ,sweet & good!!",
        reviewedAt:'01/06/2016'
    }
];