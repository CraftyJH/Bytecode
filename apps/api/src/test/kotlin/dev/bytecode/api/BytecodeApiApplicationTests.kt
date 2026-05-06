package dev.bytecode.api

import dev.bytecode.api.challenge.ChallengeBootstrap
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(
    properties = [
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.flyway.enabled=false",
        "spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:9999/auth/v1/keys",
    ]
)
class BytecodeApiApplicationTests {

    @MockBean
    lateinit var jwtDecoder: JwtDecoder

    @MockBean
    lateinit var challengeBootstrap: ChallengeBootstrap

    @Test
    fun contextLoads() {
        // Verifies the Spring application context starts without errors
    }
}
