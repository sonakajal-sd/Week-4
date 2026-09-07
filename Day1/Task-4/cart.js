const CartModule = (function () {

    // Private data
    const items = [];


    // Add item
    function addItem(item) {
        items.push({
            ...item,
            quantity: item.quantity || 1
        });
    }


    // Remove item
    function removeItem(name) {
        const index = items.findIndex(function (item) {
            return item.name === name;
        });

        if (index !== -1) {
            items.splice(index, 1);
        }
    }


    // Update quantity
    function updateQuantity(name, quantity) {
        const item = items.find(function (item) {
            return item.name === name;
        });

        if (item) {
            item.quantity = quantity;
        }
    }


    // Get items
    function getItems() {
        return items.map(function (item) {
            return { ...item };
        });
    }


    // Get total
    function getTotal() {
        return items.reduce(function (total, item) {
            return total + (item.price * item.quantity);
        }, 0);
    }


    // Clear cart
    function clear() {
        items.length = 0;
    }


    // Public methods
    return {
        addItem: addItem,
        removeItem: removeItem,
        updateQuantity: updateQuantity,
        getItems: getItems,
        getTotal: getTotal,
        clear: clear
    };

})();


// ===============================
// Testing
// ===============================

CartModule.addItem({
    name: "Burger",
    price: 200
});

CartModule.addItem({
    name: "Momos",
    price: 150,
    quantity: 2
});

console.log("Items:");
console.log(CartModule.getItems());

console.log("Total:");
console.log(CartModule.getTotal());


// Update quantity
CartModule.updateQuantity("Burger", 3);

console.log("After update:");
console.log(CartModule.getItems());


// Remove item
CartModule.removeItem("Momos");

console.log("After remove:");
console.log(CartModule.getItems());


// Clear cart
CartModule.clear();

console.log("After clear:");
console.log(CartModule.getItems());


// Private items cannot be accessed directly
console.log(CartModule.items);