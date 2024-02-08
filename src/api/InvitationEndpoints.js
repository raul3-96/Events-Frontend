import { get, post, destroy, put, patch } from './helpers/ApiRequestsHelper'

function getInvitationAll () {
  return get(`invitations`)
}
function putUser (data) {
  return put(`invitations`, data)
}

function postInvitation(data){
  return post(`invitations`, data)
}

function getByUser (id) {
  return get(`invitationsId/${id}`)
}

function getGuest (id) {
  return get(`invitations/${id}/guests`)
}

function getInvitation (id) {
  return get(`invitations/${id}`)
}

function deleteInvitation (id) {
  return destroy(`invitations/${id}`)
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

export { getInvitationAll, putUser, postInvitation, getByUser, getGuest, deleteInvitation, getInvitation, deleteGuest, postGuest, updateGuest, confirmInvitation, deniedInvitation}
