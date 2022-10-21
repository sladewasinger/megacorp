"use strict";
exports.__esModule = true;
exports.Property = void 0;
var Property = /** @class */ (function () {
    function Property(name, color, cost, rents, mortgageValue, houseCost, hotelCost) {
        this.name = name;
        this.color = color;
        this.cost = cost;
        this.rents = rents;
        this.mortgageValue = mortgageValue;
        this.houseCost = houseCost;
        this.hotelCost = hotelCost;
        this.type = 'property';
        this.owner = null;
        this.houses = 0;
        this.hotel = 0;
        this.gameState = null;
    }
    Property.prototype.transition = function (transitionName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        throw new Error("Method not implemented.");
    };
    Property.prototype.onEnter = function (gameState) {
        console.log('Property');
        this.gameState = gameState;
    };
    Property.prototype.onExit = function () {
        console.log('Property exit');
    };
    Object.defineProperty(Property.prototype, "rent", {
        get: function () {
            if (this.owner === null) {
                return 0;
            }
            var index = this.houses;
            if (this.hotel) {
                index++;
            }
            return this.rents[0];
        },
        enumerable: false,
        configurable: true
    });
    Property.prototype.buyProperty = function () {
        if (!this.gameState) {
            throw new Error('Game state not set');
        }
        console.log('buyProperty');
        this.owner = this.gameState.currentPlayer;
        this.gameState.currentPlayer.money -= this.rent;
        if (this.gameState.doubleDiceRoll) {
            return 'TurnStart';
        }
        return 'TurnEnd';
    };
    Property.prototype.auctionProperty = function () {
        if (!this.gameState) {
            throw new Error('Game state not set');
        }
        console.log('auctionProperty');
        if (this.gameState.doubleDiceRoll) {
            return 'TurnStart';
        }
        return 'TurnEnd';
    };
    return Property;
}());
exports.Property = Property;
