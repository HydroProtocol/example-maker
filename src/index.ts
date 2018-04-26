import { BigNumber } from "bignumber.js"
import { SimpleMaker } from "./lib/SimpleMaker"

const marketId = process.argv[2]
const privateKey = process.argv[3]
const interval = Number(process.argv[4])
const amount = new BigNumber(process.argv[5])
const maker = new SimpleMaker(marketId, privateKey)
maker.run(interval, amount)