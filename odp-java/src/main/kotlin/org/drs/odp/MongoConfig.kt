package org.drs.odp

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@Configuration
@EnableMongoRepositories(basePackages = ["org.drs.odp.repos"])
internal class MongoConfig : AbstractMongoClientConfiguration() {
    override fun getDatabaseName(): String {
        return "odp"
    }

    override fun mongoClient(): MongoClient {
        return MongoClients.create("mongodb://localhost")
    }

    override fun getMappingBasePackages(): Collection<String> {
        return listOf("org.drs.odp")
    }
}