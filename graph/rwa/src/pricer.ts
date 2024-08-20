import { Bytes } from "@graphprotocol/graph-ts"
import {
  PriceAdded as PriceAddedEvent,
  PriceUpdated as PriceUpdatedEvent,
} from "../generated/Pricer/Pricer"
import {
  PriceAdded,
  PriceUpdated,
  LatestPriceUpdated,
  PriceIdIndex,
} from "../generated/schema"

export function handlePriceAdded(event: PriceAddedEvent): void {
  let entity = new PriceAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.priceId = event.params.priceId
  entity.price = event.params.price
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = "New Price ID"

  entity.save()

  let latestPriceEntityId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let latesPriceEntity = new LatestPriceUpdated(latestPriceEntityId)
  latesPriceEntity.priceId = event.params.priceId
  latesPriceEntity.newPrice = event.params.price

  latesPriceEntity.blockNumber = event.block.number
  latesPriceEntity.blockTimestamp = event.block.timestamp
  latesPriceEntity.transactionHash = event.transaction.hash
  latesPriceEntity.status = "New Price ID"

  latesPriceEntity.save()

  let priceIdHex = event.params.priceId.toHex()
  let priceIdIndex = new PriceIdIndex(priceIdHex)
  priceIdIndex.latestPriceId = latestPriceEntityId

  priceIdIndex.save()
}

export function handlePriceUpdated(event: PriceUpdatedEvent): void {
  let entityId=event.transaction.hash.concatI32(event.logIndex.toI32())
  let entity = new PriceUpdated(
    entityId
  )
  entity.priceId = event.params.priceId
  entity.oldPrice = event.params.oldPrice
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let entityPriceAdded = new PriceAdded(
    entityId
  )
  entityPriceAdded.priceId = event.params.priceId
  entityPriceAdded.price = event.params.newPrice
  entityPriceAdded.timestamp = event.block.timestamp
  
  entityPriceAdded.blockNumber = event.block.number
  entityPriceAdded.blockTimestamp = event.block.timestamp
  entityPriceAdded.transactionHash = event.transaction.hash
  entityPriceAdded.status = "Updated Price ID"

  entityPriceAdded.save()

  let priceId = event.params.priceId.toHex();

  let priceIdIndex = PriceIdIndex.load(priceId)
  if (priceIdIndex == null) {
    priceIdIndex = new PriceIdIndex(priceId)
    priceIdIndex.latestPriceId = Bytes.empty()
  }

  let existingLatestPriceEntity = LatestPriceUpdated.load(priceIdIndex.latestPriceId)

  if (existingLatestPriceEntity != null) {
    existingLatestPriceEntity.newPrice = event.params.newPrice

    existingLatestPriceEntity.blockNumber = event.block.number
    existingLatestPriceEntity.blockTimestamp = event.block.timestamp
    existingLatestPriceEntity.transactionHash = event.transaction.hash
    existingLatestPriceEntity.status = "Updated Price ID"

    existingLatestPriceEntity.save()
  }else{
    let latestPriceUpdated = new LatestPriceUpdated(
      entityId
    )
    latestPriceUpdated.priceId = event.params.priceId
    latestPriceUpdated.newPrice = event.params.newPrice
    
    latestPriceUpdated.blockNumber = event.block.number
    latestPriceUpdated.blockTimestamp = event.block.timestamp
    latestPriceUpdated.transactionHash = event.transaction.hash
    latestPriceUpdated.status = "New Price ID"
  
    latestPriceUpdated.save()

    priceIdIndex.latestPriceId = entityId
    priceIdIndex.save()
  }


}
