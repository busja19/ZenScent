module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalQty = cart.totalQty || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add=function(item, id){
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {
              item: item, 
              Qty: 0, 
              price: 0
            };
        }
        
        cartItem.quantity++;
        cartItem.price = cartItem.item.price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.price;
    };
    
     this.reduceByOne=function(id){
        this.items[id].qty--
        this.items[id].price-=this.items[id].item.price
        this.totalQty--
        this.totalPrice-=this.items[id].item.price

        if(this.items[id].qty <=0){
          delete this.items[id]
        }
    }
  
    this.remove = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};


