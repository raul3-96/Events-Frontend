import { get, post, destroy, put, patch } from './helpers/ApiRequestsHelper'

function getByUser (id) {
  return get(`invitationsId/${id}`)
}

function getGuest (id) {
  return get(`invitations/${id}/guests`)
}

function deleteGuest(id){
  return destroy(`invitations/guests/${id}`)
}

function postGuest(id, data){
  return post(`invitations/${id}/guests`, data)
}

function updateGuest(id,data){
  return put(`invitations/guests/${id}`, data)
}

function confirmInvitation(id){
  return patch(`invitations/${id}/confirm`)
}

function deniedInvitation(id){
  return patch(`invitations/${id}/denied`)
}

export { getByUser, getGuest, deleteGuest, postGuest, updateGuest, confirmInvitation, deniedInvitation}
