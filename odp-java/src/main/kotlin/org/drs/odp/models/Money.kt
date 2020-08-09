package org.drs.odp.models

import java.math.BigDecimal

class Money(
        val amount: BigDecimal,
        val currency: String
) : Comparable<Money> {

    override fun compareTo(other: Money): Int {
        if (currency != other.currency) return 0

        return if (amount < other.amount) 1 else -1
    }

}