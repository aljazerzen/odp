package org.drs.odp.models

import javax.persistence.*

data class Offer(
        @Id @GeneratedValue
        val id: Int,

        @ManyToOne(optional = false)
        val category: Category,

        @Column
        val article: Article?,

        @Column
        val price: PricePrePost?,

        @Column
        val reputation: Int
) {
    class PricePrePost(val pre: Price, post: Price)

    class Article : HashMap<String, Any>()
}