App = Ember.Application.create({
  LOG_TRANSITIONS:true
});


App.Router.map(function() {
    this.route('puc');                                      //page under construction
    this.route('about');
    this.resource('products');                              //router
    this.resource('product',{ path:'/products/:title'});    //dynamic routing

    this.resource('nestedProducts',function () {
        this.resource('nestedProduct',{path:'/:title'});
    });

    this.resource('newProducts',function () {
        this.resource('newProduct',{path:'/:id'});
    });
});

App.AboutController=Ember.Controller.extend({            //controller
    productCount:6,
    dta:function(){
        return "The About  is rendered from controller"
    }.property(),
    pr_logo:'/images/logo.png',
    time:function () {
        return(new Date().toDateString())
    }.property()
});

App.NestedProductsController=Ember.ArrayController.extend({         //to sort the available products
   sortProperties:['title']
});

App.ProductsRoute=Ember.Route.extend({          //route  //don't get confused b/w router and route
    model:function(){
        return App.PRODUCTS;                    //rendering model into template
    }

});

App.ProductRoute=Ember.Route.extend({
    model:function(params){
        return  App.PRODUCTS.findBy('title',params.title);
    }
});

App.NestedProductsRoute=Ember.Route.extend({
    model:function(){
        return App.PRODUCTS;                    //rendering model into template
    }
});

App.NestedProductRoute=Ember.Route.extend({
    model:function(params){
        return  App.PRODUCTS.findBy('title',params.title);
    }
});

App.NewProductsRoute=Ember.Route.extend({
    model:function(){

        return this.store.findAll('newProduct');

    }
});

App.NewProductRoute=Ember.Route.extend({
    model:function(params){
        return  this.store.find('newProduct',params.id);
    }
});



App.PRODUCTS=[
    {
        title:'Apple',
        price:99,
        description:'An Apple a day keeps a doc away ..',
        isOnSale:true,
        image:'images/apple.png'
    },
    {
        title:'Dates',
        price:10,
        description:'Date date date date',
        isOnSale:true,
        image:'images/dates.png'

    },
    {
        title:'Banana',
        price:10,
        description:'Minions love bananas..',
        isOnSale:false,
        image:'images/banana.png'

    }
];

App.ApplicationAdapter=DS.FixtureAdapter;             //to load records from the memory,also allow us to hard code the data in fixtures for getting started
// App.ApplicationAdapter=DS.RESTAdaptor.extend();                //to communicate with HTTP server using JSON


App.NewProduct=DS.Model.extend({
    title:DS.attr('string'),
    price:DS.attr('number'),
    description:DS.attr('string'),
    isOnSale:DS.attr('boolean'),
    image:DS.attr('string'),
    reviews:DS.hasMany('review',{async:true})               //async allows lazy loading
});



//fixture model below
App.NewProduct.FIXTURES=[
    {
        id:1,                                      //should have a unique id
        title:'Apple',
        price:99,
        description:'An Apple a day keeps a doc away ..',
        isOnSale:true,
        image:'images/apple.png',
        reviews:[100,101]                           //both side mapping required,bec we r using fixtures
    },
    {
        id:2,
        title:'Banana',
        price:10,
        description:'Minions love bananas..',
        isOnSale:false,
        image:'images/banana.png',
        reviews:[]

    },
    {
        id:3,
        title:'Dates',
        price:10,
        description:'Date date date date',
        isOnSale:true,
        image:'images/dates.png',
        reviews:[]

    }
];

App.Review= DS.Model.extend({
    text:DS.attr('string'),
    reviewedAt:DS.attr('date'),
    newProduct: DS.belongsTo('newProduct')
});

App.Review.FIXTURES=[
    {
        id:100,
        newProduct:1,
        text:"It is really very fresh and delicious"
    },
    {
        id:101,
        newProduct:1,
        text:"Not too much sweet. Overall happy!!"
    }
];





