# Simple Maker Demo

This demo is a simple "maker" that utilizes the Hydro API to automatically place orders. It uses a naive
strategy of placing bid orders whenever the price increases, and placing ask orders whenever the price
decreases. It will check the price manually based on the interval passed in, and if the price has changed
it will delete the previous order and create a new order based on the strategy.

<aside class="warning">
Running this demo with a real private key will actually place the orders in the production market. Please
review the code and make sure that is your intention, or it could lead to unexpected losses.
</aside>

To run the maker, use the following command:

`ts-node src/index.ts [marketId] [privateKey] [interval/ms] [amount]`