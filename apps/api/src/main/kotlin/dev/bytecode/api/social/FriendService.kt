package dev.bytecode.api.social

import dev.bytecode.api.user.UserEntity
import dev.bytecode.api.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class FriendService(
    private val friendRepo: FriendRepository,
    private val userRepo: UserRepository,
) {

    @Transactional
    fun sendRequest(requester: UserEntity, handle: String): FriendRequestResult {
        val addressee = userRepo.findByEmail(handle)
            ?: return FriendRequestResult.UserNotFound

        if (addressee.id == requester.id) return FriendRequestResult.CannotAddSelf

        val existing = friendRepo.findByRequesterIdAndAddresseeId(requester.id, addressee.id)
            ?: friendRepo.findByRequesterIdAndAddresseeId(addressee.id, requester.id)

        if (existing != null) return when (existing.status) {
            "accepted" -> FriendRequestResult.AlreadyFriends
            "pending" -> FriendRequestResult.RequestAlreadySent
            else -> FriendRequestResult.RequestAlreadySent
        }

        friendRepo.save(FriendEntity(requesterId = requester.id, addresseeId = addressee.id))
        return FriendRequestResult.Sent
    }

    @Transactional
    fun acceptRequest(addressee: UserEntity, requesterId: UUID): FriendRequestResult {
        val edge = friendRepo.findByRequesterIdAndAddresseeId(requesterId, addressee.id)
            ?: return FriendRequestResult.UserNotFound
        if (edge.status != "pending") return FriendRequestResult.RequestAlreadySent
        edge.status = "accepted"
        friendRepo.save(edge)
        return FriendRequestResult.Accepted
    }

    @Transactional
    fun removeFriend(user: UserEntity, otherId: UUID): Boolean {
        val edge = friendRepo.findByRequesterIdAndAddresseeId(user.id, otherId)
            ?: friendRepo.findByRequesterIdAndAddresseeId(otherId, user.id)
            ?: return false
        friendRepo.delete(edge)
        return true
    }

    fun listFriends(user: UserEntity): List<FriendDto> {
        val edges = friendRepo.findAcceptedFriends(user.id)
        val partnerIds = edges.map { if (it.requesterId == user.id) it.addresseeId else it.requesterId }
        val partners = userRepo.findAllById(partnerIds).associateBy { it.id }
        return edges.map { edge ->
            val partnerId = if (edge.requesterId == user.id) edge.addresseeId else edge.requesterId
            val partner = partners[partnerId]
            FriendDto(
                userId = partnerId.toString(),
                displayName = partner?.name ?: "Anonymous",
                email = partner?.email,
                avatarUrl = partner?.avatarUrl,
                since = edge.createdAt.toString(),
            )
        }
    }

    fun listPendingIncoming(user: UserEntity): List<PendingRequestDto> {
        val edges = friendRepo.findPendingIncoming(user.id)
        val requesterIds = edges.map { it.requesterId }
        val requesters = userRepo.findAllById(requesterIds).associateBy { it.id }
        return edges.map { edge ->
            val r = requesters[edge.requesterId]
            PendingRequestDto(
                edgeId = edge.id.toString(),
                userId = edge.requesterId.toString(),
                displayName = r?.name ?: "Anonymous",
                email = r?.email,
                avatarUrl = r?.avatarUrl,
                requestedAt = edge.createdAt.toString(),
            )
        }
    }

    fun listPendingOutgoing(user: UserEntity): List<PendingRequestDto> {
        val edges = friendRepo.findPendingOutgoing(user.id)
        val addresseeIds = edges.map { it.addresseeId }
        val addressees = userRepo.findAllById(addresseeIds).associateBy { it.id }
        return edges.map { edge ->
            val a = addressees[edge.addresseeId]
            PendingRequestDto(
                edgeId = edge.id.toString(),
                userId = edge.addresseeId.toString(),
                displayName = a?.name ?: "Anonymous",
                email = a?.email,
                avatarUrl = a?.avatarUrl,
                requestedAt = edge.createdAt.toString(),
            )
        }
    }
}

enum class FriendRequestResult {
    Sent, Accepted, UserNotFound, AlreadyFriends, RequestAlreadySent, CannotAddSelf
}

data class FriendDto(
    val userId: String,
    val displayName: String,
    val email: String?,
    val avatarUrl: String?,
    val since: String,
)

data class PendingRequestDto(
    val edgeId: String,
    val userId: String,
    val displayName: String,
    val email: String?,
    val avatarUrl: String?,
    val requestedAt: String,
)
