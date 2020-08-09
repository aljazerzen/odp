package org.drs.odp.repos

import org.drs.odp.models.Category
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.repository.Repository

interface OfferRepo : MongoRepository<Category, String> {

}