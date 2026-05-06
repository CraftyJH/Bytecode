package dev.bytecode.api.social

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface FriendRepository : JpaRepository<FriendEntity, UUID> {

    fun findByRequesterIdAndAddresseeId(requesterId: UUID, addresseeId: UUID): FriendEntity?

    @Query("""
        SELECT f FROM FriendEntity f
        WHERE f.status = 'accepted'
          AND (f.requesterId = :userId OR f.addresseeId = :userId)
    """)
    fun findAcceptedFriends(userId: UUID): List<FriendEntity>

    @Query("""
        SELECT f FROM FriendEntity f
        WHERE f.addresseeId = :userId AND f.status = 'pending'
    """)
    fun findPendingIncoming(userId: UUID): List<FriendEntity>

    @Query("""
        SELECT f FROM FriendEntity f
        WHERE f.requesterId = :userId AND f.status = 'pending'
    """)
    fun findPendingOutgoing(userId: UUID): List<FriendEntity>

    fun existsByRequesterIdAndAddresseeIdAndStatus(
        requesterId: UUID,
        addresseeId: UUID,
        status: String,
    ): Boolean

    @Query("""
        SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM FriendEntity f
        WHERE f.status = 'accepted'
          AND ((f.requesterId = :a AND f.addresseeId = :b)
            OR (f.requesterId = :b AND f.addresseeId = :a))
    """)
    fun areFriends(a: UUID, b: UUID): Boolean
}
