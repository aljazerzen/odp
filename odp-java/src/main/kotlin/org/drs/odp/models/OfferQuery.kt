package org.drs.odp.models

class OfferQuery {
    val category: String? = null

    val article: Map<String, Any>? = null

    val price: RangeCondition<Money>? = null

    val reputation: RangeCondition<Int>? = null

    class RangeCondition<T : Comparable<T>> {
        val min: T? = null
        val max: T? = null
    }

    class Payment {
        val pre: RangeCondition<Money>? = null
        val post: RangeCondition<Money>? = null
        val total: RangeCondition<Money>? = null
    }
}