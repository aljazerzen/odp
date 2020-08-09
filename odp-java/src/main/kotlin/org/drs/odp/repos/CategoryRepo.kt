package org.drs.odp.repos

import org.drs.odp.models.Category
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.repository.Repository

interface CategoryRepo : MongoRepository<Category, String> {

    fun findOne(id: String): Category

    fun save(customer: Category): Category

}