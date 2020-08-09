package org.drs.odp

import org.drs.odp.models.Category
import org.drs.odp.models.OfferQuery
import org.drs.odp.repos.CategoryRepo
import org.drs.odp.repos.OfferRepo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class Controller {

    @Autowired
    lateinit var offerRepo: OfferRepo
    @Autowired
    lateinit var categoryRepo: CategoryRepo

    @GetMapping("offers")
    fun getOffers(@RequestParam query: OfferQuery): List<Category> {
        return offerRepo.findAll()
    }

    @PostMapping("orders")
    fun placeOrder() {

    }

    @GetMapping("orders")
    fun getOrderDetails() {

    }

    @GetMapping("aggregation/permission")
    fun getAggregationPermission() {

    }

    @PostMapping("aggregation/failures")
    fun postAggregationFailure() {

    }

    @GetMapping("categories")
    fun getCategory() {

    }
}
