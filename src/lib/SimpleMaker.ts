import { HydroClient, OrderbookLevel, Side, Order } from "@hydro-protocol/sdk"
import { BigNumber } from "bignumber.js"

export class SimpleMaker {
  private client: HydroClient
  private marketId: string

  private orderId?: string
  private lastPrice: BigNumber = new BigNumber("0")

  constructor(marketId: string, privateKey: string) {
    this.client = HydroClient.withPrivateKey(privateKey)
    this.marketId = marketId
  }

  public async run(interval: number, amount: BigNumber) {
    // Get market data and format our amount with the appropriate number of decimals
    const market = await this.client.getMarket(this.marketId)
    const amountStr = amount.toFixed(market.amountDecimals)

    while(true) {
      // Get ticker data to get the last successful trade price
      let ticker = await this.client.getTicker(this.marketId)

      if (!this.lastPrice.eq(ticker.price)) {
        console.log("New ticker price found")
        console.log("Old price: " + this.lastPrice.toFixed())
        console.log("New price: " + ticker.price.toFixed())

        // First cancel any order we previously made
        if (this.orderId) {
          await this.client.cancelOrder(this.orderId)
        }

        // Get current ask/bid prices with a level 1 orderbook query
        let orderbook = await this.client.getOrderbook(this.marketId, OrderbookLevel.ONE)

        // Get the order price and side depending on our strategy
        let orderPrice: BigNumber, side: Side
        if (ticker.price.lt(this.lastPrice)) {
          orderPrice = orderbook.asks[0].price
          side = Side.SELL
        } else {
          orderPrice = orderbook.bids[0].price
          side = Side.SELL
        }
        let orderPriceStr = new BigNumber(orderPrice.toFixed(market.priceDecimals)).toPrecision(market.pricePrecision)

        // Create the new order
        let order = await this.client.createOrder(this.marketId, side, orderPriceStr, amountStr)
        console.log("New order placed:")
        console.log(order)

        // Update our state
        this.orderId = order.id
        this.lastPrice = ticker.price
      }

      // Sleep until our next check
      await this.sleep(interval)
    }
  }

  private async sleep(interval: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), interval)
    })
  }
}