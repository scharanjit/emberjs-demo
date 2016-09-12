App = Ember.Application.create({
  LOG_TRANSITIONS:true
});

App.Router.map(function() {
    this.route('about');
    this.resource('products');                              //router
    this.resource('product',{ path:'/products/:title'});    //dynamic routing


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

App.PRODUCTS=[
    {
        title:'Apple',
        price:99,
        description:'An Apple a day keeps a doc away ..',
        isOnSale:true,
        image:'images/apple.png'
    },
    {
        title:'Banana',
        price:10,
        description:'Minions love bananas..',
        isOnSale:false,
        image:'images/banana.png'

    }
];